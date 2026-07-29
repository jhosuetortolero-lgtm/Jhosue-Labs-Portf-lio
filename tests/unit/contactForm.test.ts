import { describe, expect, it } from 'vitest';
import {
  getProvider,
  isSpam,
  normalizeContactForm,
  sendContact,
  validateContactForm,
} from '../../src/services/contact/contact.service';
import { FIELD_LIMITS, type ContactFormData } from '../../src/services/contact/contact.types';
import { dictionaries } from '../../src/i18n';
import { LANGUAGES } from '../../src/types/i18n';

function form(overrides: Partial<ContactFormData> = {}): ContactFormData {
  return {
    name: 'Maria Souza',
    email: 'maria@empresa.com.br',
    company: 'Empresa X',
    projectType: 'saas',
    budget: 'from5to15k',
    message: 'Preciso de um sistema de gestão com integração de WhatsApp e cobranças.',
    consent: true,
    ...overrides,
  };
}

describe('validateContactForm', () => {
  it('aceita um formulário completo', () => {
    expect(validateContactForm(form())).toHaveLength(0);
  });

  it('exige nome com pelo menos 2 caracteres', () => {
    const errors = validateContactForm(form({ name: 'J' }));
    expect(errors.map((error) => error.field)).toContain('name');
  });

  it('exige e-mail válido', () => {
    const errors = validateContactForm(form({ email: 'nao-e-email' }));
    expect(errors.map((error) => error.field)).toContain('email');
  });

  it('exige tipo de projeto', () => {
    const errors = validateContactForm(form({ projectType: '' }));
    expect(errors.map((error) => error.field)).toContain('projectType');
  });

  it('exige mensagem com no mínimo 20 caracteres', () => {
    const errors = validateContactForm(form({ message: 'oi' }));
    expect(errors.map((error) => error.field)).toContain('message');
  });

  it('rejeita mensagem acima do limite', () => {
    const errors = validateContactForm(form({ message: 'a'.repeat(FIELD_LIMITS.message + 50) }));
    expect(errors.map((error) => error.messageKey)).toContain('form.errors.messageTooLong');
  });

  it('exige consentimento', () => {
    const errors = validateContactForm(form({ consent: false }));
    expect(errors.map((error) => error.field)).toContain('consent');
  });

  it('acumula vários erros de uma vez', () => {
    const errors = validateContactForm({
      name: '',
      email: '',
      projectType: '',
      message: '',
      consent: false,
    });
    expect(errors.length).toBe(5);
  });

  it('toda chave de erro existe nos três idiomas', () => {
    const errors = validateContactForm({
      name: '',
      email: '',
      projectType: '',
      message: '',
      consent: false,
    });
    for (const error of errors) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][error.messageKey]).toBeTruthy();
      }
    }
  });
});

describe('normalizeContactForm', () => {
  it('corta campos no limite e limpa espaços', () => {
    const normalized = normalizeContactForm(
      form({ name: `  ${'a'.repeat(200)}  `, message: 'b'.repeat(5000) }),
    );
    expect(normalized.name.length).toBe(FIELD_LIMITS.name);
    expect(normalized.message.length).toBe(FIELD_LIMITS.message);
  });

  it('remove o honeypot da carga enviada', () => {
    const normalized = normalizeContactForm(form({ website: 'http://spam.com' }));
    expect(normalized.website).toBeUndefined();
  });
});

describe('honeypot', () => {
  it('detecta preenchimento do campo escondido', () => {
    expect(isSpam(form({ website: 'http://spam.com' }))).toBe(true);
    expect(isSpam(form())).toBe(false);
    expect(isSpam(form({ website: '   ' }))).toBe(false);
  });

  it('não envia quando é robô, mas responde sucesso', async () => {
    const response = await sendContact(form({ website: 'spam' }));
    expect(response.ok).toBe(true);
    expect(response.messageKey).toBe('form.success');
  });
});

describe('provedor', () => {
  it('sem configuração cai no modo demonstração', () => {
    expect(getProvider().id).toBe('demo');
  });

  it('modo demonstração avisa que nada foi enviado', async () => {
    const response = await sendContact(form());
    expect(response.ok).toBe(true);
    expect(response.messageKey).toBe('form.demoNotice');
  });
});
