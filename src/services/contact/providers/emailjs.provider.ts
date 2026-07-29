import type { ContactFormData, ContactProvider, ContactResponse } from '../contact.types';

/**
 * EmailJS via API REST — sem instalar o SDK.
 * As três chaves são públicas por design do serviço; ainda assim, restrinja
 * os domínios permitidos no painel do EmailJS.
 */
const PUBLIC_KEY = (import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY as string | undefined) ?? '';
const SERVICE_ID = (import.meta.env.PUBLIC_EMAILJS_SERVICE_ID as string | undefined) ?? '';
const TEMPLATE_ID = (import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID as string | undefined) ?? '';

const API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

export const emailjsProvider: ContactProvider = {
  id: 'emailjs',

  isConfigured() {
    return Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID);
  },

  async send(data: ContactFormData): Promise<ContactResponse> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          from_name: data.name,
          reply_to: data.email,
          company: data.company ?? '',
          project_type: data.projectType,
          budget: data.budget ?? '',
          message: data.message,
        },
      }),
    });

    return response.ok
      ? { ok: true, messageKey: 'form.success' }
      : { ok: false, messageKey: 'form.errors.generic' };
  },
};
