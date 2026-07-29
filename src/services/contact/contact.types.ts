export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  consent: boolean;
  /** Campo honeypot: se vier preenchido, é robô. */
  website?: string;
}

export interface ContactResponse {
  ok: boolean;
  /** Chave de tradução da mensagem a exibir. */
  messageKey: 'form.success' | 'form.errors.generic' | 'form.demoNotice';
}

export interface ContactProvider {
  readonly id: string;
  /** false quando faltam variáveis de ambiente. */
  isConfigured(): boolean;
  send(data: ContactFormData): Promise<ContactResponse>;
}

/** Limites aplicados no cliente (o provedor pode aplicar os seus). */
export const FIELD_LIMITS = {
  name: 80,
  email: 254,
  company: 80,
  message: 2000,
} as const;

export const MESSAGE_MIN_LENGTH = 20;
export const NAME_MIN_LENGTH = 2;
