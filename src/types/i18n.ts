/** Idiomas suportados pelo portfólio. */
export const LANGUAGES = ['pt-BR', 'en-US', 'es'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'pt-BR';

/**
 * Texto com uma variação por idioma.
 * Usado em todo `src/data` para que o conteúdo tenha uma única fonte.
 */
export type Localized = Record<Language, string>;

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/** Códigos usados no atributo `lang` do HTML e no Open Graph. */
export const HTML_LANG: Record<Language, string> = {
  'pt-BR': 'pt-BR',
  'en-US': 'en-US',
  es: 'es-ES',
};

export const OG_LOCALE: Record<Language, string> = {
  'pt-BR': 'pt_BR',
  'en-US': 'en_US',
  es: 'es_ES',
};

/** Rótulo curto exibido no botão de idioma. */
export const LANGUAGE_LABEL: Record<Language, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  es: 'ES',
};

export const LANGUAGE_NAME: Record<Language, string> = {
  'pt-BR': 'Português',
  'en-US': 'English',
  es: 'Español',
};
