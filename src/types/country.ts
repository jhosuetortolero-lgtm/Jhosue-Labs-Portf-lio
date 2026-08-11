import type { Localized } from './i18n';

/** País com código de discagem internacional (DDI). */
export interface Country {
  /** ISO 3166-1 alfa-2, ex.: 'BR'. */
  iso: string;
  /** Código de discagem sem o "+", ex.: '55'. */
  dial: string;
  /** Bandeira em emoji. */
  flag: string;
  /**
   * Exemplo de celular no formato local, sem o DDI (ex.: '11 96123 4567').
   * Vira a dica do campo de número. Vazio quando o país não tem exemplo.
   */
  example: string;
  name: Localized;
}
