import type { ContactFormData, ContactProvider, ContactResponse } from '../contact.types';
import { whatsappNumber } from '../contact.service';

const ENDPOINT = (import.meta.env.PUBLIC_FORMSPREE_ENDPOINT as string | undefined) ?? '';

export const formspreeProvider: ContactProvider = {
  id: 'formspree',

  isConfigured() {
    return ENDPOINT.startsWith('https://');
  },

  async send(data: ContactFormData): Promise<ContactResponse> {
    // Texto legível quando existir; o valor bruto é só reserva.
    const projectType = data.labels?.projectType || data.projectType;
    const budget = data.labels?.budget || data.budget || '';

    // Número completo com DDI e link pronto: dá para responder pelo WhatsApp
    // direto do e-mail, com um clique.
    const phone = whatsappNumber(data);

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        // `_subject` e `_replyto` são campos que o Formspree entende:
        // definem o assunto e para quem o "Responder" do e-mail aponta.
        _subject: `Novo contato pelo site — ${data.name} (${projectType})`,
        _replyto: data.email,
        name: data.name,
        email: data.email,
        company: data.company ?? '',
        whatsapp: phone ? `+${phone}` : '',
        whatsappLink: phone ? `https://wa.me/${phone}` : '',
        projectType,
        budget,
        message: data.message,
      }),
    });

    return response.ok
      ? { ok: true, messageKey: 'form.success' }
      : { ok: false, messageKey: 'form.errors.generic' };
  },
};
