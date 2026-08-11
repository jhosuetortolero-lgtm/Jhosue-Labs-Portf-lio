export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  /** ISO do país escolhido no seletor de DDI, ex.: 'BR'. */
  country?: string;
  /** Número de WhatsApp como digitado, sem o DDI. */
  whatsapp?: string;
  projectType: string;
  budget?: string;
  message: string;
  consent: boolean;
  /** Campo honeypot: se vier preenchido, é robô. */
  website?: string;
  /**
   * Versão legível de `projectType` e `budget`, no idioma que o visitante
   * estava usando. Serve para o e-mail chegar com "Cibersegurança" em vez de
   * "security". Opcional: sem ela o provedor usa o valor bruto.
   */
  labels?: {
    projectType?: string;
    budget?: string;
  };
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
  whatsapp: 20,
  message: 2000,
} as const;

export const MESSAGE_MIN_LENGTH = 20;
export const NAME_MIN_LENGTH = 2;

/**
 * Faixa de dígitos aceita no número, já sem o DDI.
 * O padrão internacional (E.164) admite no máximo 15 dígitos contando o DDI.
 */
export const PHONE_MIN_DIGITS = 6;
export const PHONE_MAX_DIGITS = 14;
