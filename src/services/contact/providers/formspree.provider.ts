import type { ContactFormData, ContactProvider, ContactResponse } from '../contact.types';

const ENDPOINT = (import.meta.env.PUBLIC_FORMSPREE_ENDPOINT as string | undefined) ?? '';

export const formspreeProvider: ContactProvider = {
  id: 'formspree',

  isConfigured() {
    return ENDPOINT.startsWith('https://');
  },

  async send(data: ContactFormData): Promise<ContactResponse> {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company ?? '',
        projectType: data.projectType,
        budget: data.budget ?? '',
        message: data.message,
      }),
    });

    return response.ok
      ? { ok: true, messageKey: 'form.success' }
      : { ok: false, messageKey: 'form.errors.generic' };
  },
};
