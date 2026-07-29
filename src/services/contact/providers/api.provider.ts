import type { ContactFormData, ContactProvider, ContactResponse } from '../contact.types';

/** Endpoint próprio (função serverless ou backend) que aceita POST JSON. */
const API_URL = (import.meta.env.PUBLIC_CONTACT_API_URL as string | undefined) ?? '';

export const apiProvider: ContactProvider = {
  id: 'api',

  isConfigured() {
    return API_URL.startsWith('https://') || API_URL.startsWith('/');
  },

  async send(data: ContactFormData): Promise<ContactResponse> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.ok
      ? { ok: true, messageKey: 'form.success' }
      : { ok: false, messageKey: 'form.errors.generic' };
  },
};
