/**
 * Estado de idioma no navegador.
 *
 * Troca os textos sem recarregar a página, usando SEMPRE textContent
 * (nunca innerHTML) e os mesmos dicionários usados na renderização estática.
 */
import { dictionaries } from '../i18n';
import { DEFAULT_LANGUAGE, HTML_LANG, isLanguage, type Language } from '../types/i18n';
import { siteConfig } from '../config/site';
import { readStorage, writeStorage } from '../utils/storage';
import { qsa } from '../utils/dom';

export const LANGUAGE_EVENT = 'jhosue:languagechange';

let current: Language = DEFAULT_LANGUAGE;

export function getLanguage(): Language {
  return current;
}

export function translate(key: string): string {
  return dictionaries[current][key] ?? dictionaries[DEFAULT_LANGUAGE][key] ?? key;
}

/** Idioma salvo, ou o mais próximo do navegador, ou o padrão. */
export function detectLanguage(): Language {
  const saved = readStorage(siteConfig.storageKeys.language);
  if (isLanguage(saved)) return saved;

  const supported = siteConfig.supportedLanguages;
  for (const candidate of navigator.languages ?? [navigator.language]) {
    const exact = supported.find((language) => language.toLowerCase() === candidate.toLowerCase());
    if (exact) return exact;
    const base = candidate.split('-')[0]?.toLowerCase();
    const partial = supported.find((language) => language.split('-')[0]?.toLowerCase() === base);
    if (partial) return partial;
  }

  return DEFAULT_LANGUAGE;
}

/** Aplica as traduções em todo o documento (ou em um trecho). */
export function applyTranslations(root: ParentNode = document): void {
  for (const element of qsa<HTMLElement>('[data-i18n]', root)) {
    const key = element.dataset.i18n;
    if (!key) continue;
    element.textContent = translate(key);
  }

  for (const element of qsa<HTMLElement>('[data-i18n-attr]', root)) {
    const spec = element.dataset.i18nAttr;
    if (!spec) continue;
    // Trecho fixo colado depois da tradução (ex.: o nome do certificado).
    const append = element.dataset.i18nAppend ?? '';
    for (const pair of spec.split(';')) {
      const [attribute, key] = pair.split(':').map((part) => part.trim());
      if (!attribute || !key) continue;
      element.setAttribute(attribute, `${translate(key)}${append}`);
    }
  }
}

function updateDocumentMeta(language: Language): void {
  document.documentElement.lang = HTML_LANG[language];
  document.title = translate('meta.title');

  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = translate('meta.description');

  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = translate('meta.title');

  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = translate('meta.description');
}

export function setLanguage(language: Language, persist = true): void {
  if (!isLanguage(language)) return;
  current = language;

  if (persist) writeStorage(siteConfig.storageKeys.language, language);

  applyTranslations();
  updateDocumentMeta(language);

  document.dispatchEvent(
    new CustomEvent<{ language: Language }>(LANGUAGE_EVENT, { detail: { language } }),
  );
}

/** Próximo idioma da lista, em ciclo. */
export function nextLanguage(): Language {
  const supported = siteConfig.supportedLanguages;
  const index = supported.indexOf(current);
  return supported[(index + 1) % supported.length] ?? DEFAULT_LANGUAGE;
}

export function initLanguage(): void {
  const detected = detectLanguage();
  // Aplica sempre: garante que atributos traduzidos fiquem coerentes.
  setLanguage(detected, false);
  if (readStorage(siteConfig.storageKeys.language)) {
    writeStorage(siteConfig.storageKeys.language, detected);
  }
}
