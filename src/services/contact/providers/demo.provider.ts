import type { ContactFormData, ContactProvider, ContactResponse } from '../contact.types';

/**
 * Provedor padrão: valida tudo e informa claramente que nada foi enviado.
 * Nunca registra dados pessoais no console.
 */
export const demoProvider: ContactProvider = {
  id: 'demo',

  isConfigured() {
    return true;
  },

  async send(_data: ContactFormData): Promise<ContactResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true, messageKey: 'form.demoNotice' };
  },
};
