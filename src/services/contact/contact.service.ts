import {
  FIELD_LIMITS,
  MESSAGE_MIN_LENGTH,
  NAME_MIN_LENGTH,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
  type ContactFormData,
  type ContactProvider,
  type ContactResponse,
} from './contact.types';
import { DEFAULT_COUNTRY, findCountry } from '../../data/countries';
import { demoProvider } from './providers/demo.provider';
import { formspreeProvider } from './providers/formspree.provider';
import { emailjsProvider } from './providers/emailjs.provider';
import { apiProvider } from './providers/api.provider';
import { isValidEmail, sanitizeSingleLine, sanitizeText } from '../../utils/sanitize';

const providers: Record<string, ContactProvider> = {
  demo: demoProvider,
  formspree: formspreeProvider,
  emailjs: emailjsProvider,
  api: apiProvider,
};

const configured = (import.meta.env.PUBLIC_CONTACT_PROVIDER as string | undefined) ?? 'demo';

/** Provedor ativo. Se o escolhido não estiver configurado, cai no demo. */
export function getProvider(): ContactProvider {
  const provider = providers[configured];
  if (provider && provider.isConfigured()) return provider;
  return demoProvider;
}

/** Só os dígitos: o visitante pode digitar (81) 9 9440-1675. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Número pronto para o WhatsApp: DDI do país escolhido + número digitado.
 * Devolve string vazia quando não há número.
 */
export function whatsappNumber(data: ContactFormData): string {
  const phone = onlyDigits(data.whatsapp ?? '');
  if (!phone) return '';
  const country = findCountry(data.country ?? DEFAULT_COUNTRY);
  return `${country?.dial ?? ''}${phone}`;
}

export type ContactFieldError = {
  field: keyof ContactFormData;
  messageKey: string;
};

/** Validação no cliente. Devolve a lista de erros na ordem dos campos. */
export function validateContactForm(data: ContactFormData): ContactFieldError[] {
  const errors: ContactFieldError[] = [];

  if (sanitizeSingleLine(data.name, FIELD_LIMITS.name).length < NAME_MIN_LENGTH) {
    errors.push({ field: 'name', messageKey: 'form.errors.name' });
  }

  if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', messageKey: 'form.errors.email' });
  }

  // WhatsApp é opcional: só é validado quando a pessoa digita algo.
  const phone = onlyDigits(data.whatsapp ?? '');
  if (phone.length > 0 && (phone.length < PHONE_MIN_DIGITS || phone.length > PHONE_MAX_DIGITS)) {
    errors.push({ field: 'whatsapp', messageKey: 'form.errors.whatsapp' });
  }

  if (!data.projectType) {
    errors.push({ field: 'projectType', messageKey: 'form.errors.projectType' });
  }

  const message = sanitizeText(data.message, FIELD_LIMITS.message + 1);
  if (message.length < MESSAGE_MIN_LENGTH) {
    errors.push({ field: 'message', messageKey: 'form.errors.message' });
  } else if (message.length > FIELD_LIMITS.message) {
    errors.push({ field: 'message', messageKey: 'form.errors.messageTooLong' });
  }

  if (!data.consent) {
    errors.push({ field: 'consent', messageKey: 'form.errors.consent' });
  }

  return errors;
}

/** Normaliza e corta os campos antes de enviar. */
export function normalizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: sanitizeSingleLine(data.name, FIELD_LIMITS.name),
    email: sanitizeSingleLine(data.email, FIELD_LIMITS.email),
    company: sanitizeSingleLine(data.company ?? '', FIELD_LIMITS.company),
    country: sanitizeSingleLine(data.country ?? DEFAULT_COUNTRY, 2),
    whatsapp: onlyDigits(data.whatsapp ?? '').slice(0, PHONE_MAX_DIGITS),
    projectType: sanitizeSingleLine(data.projectType, 40),
    budget: sanitizeSingleLine(data.budget ?? '', 40),
    message: sanitizeText(data.message, FIELD_LIMITS.message),
    consent: Boolean(data.consent),
    labels: {
      projectType: sanitizeSingleLine(data.labels?.projectType ?? '', 60),
      budget: sanitizeSingleLine(data.labels?.budget ?? '', 60),
    },
  };
}

/** true quando o honeypot foi preenchido — trata como robô. */
export function isSpam(data: ContactFormData): boolean {
  return Boolean(data.website && data.website.trim().length > 0);
}

export async function sendContact(data: ContactFormData): Promise<ContactResponse> {
  // Robô: responde sucesso sem enviar nada.
  if (isSpam(data)) return { ok: true, messageKey: 'form.success' };

  const provider = getProvider();
  try {
    return await provider.send(normalizeContactForm(data));
  } catch {
    // Nenhum dado pessoal é registrado.
    return { ok: false, messageKey: 'form.errors.generic' };
  }
}

export { FIELD_LIMITS, MESSAGE_MIN_LENGTH, NAME_MIN_LENGTH };
export type { ContactFormData, ContactResponse, ContactProvider };
