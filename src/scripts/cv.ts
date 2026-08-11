/**
 * Currículo por idioma.
 *
 * O link marcado com `data-cv-link` passa a apontar para o PDF do idioma
 * ativo (e o nome sugerido no download acompanha), sem recarregar a página.
 */
import { qsa } from '../utils/dom';
import { siteConfig } from '../config/site';
import { withBase } from '../utils/paths';
import { DEFAULT_LANGUAGE, type Language } from '../types/i18n';
import { LANGUAGE_EVENT, getLanguage } from './i18nRuntime';

/** Caminho do currículo no idioma pedido, já com o base do site. */
export function cvHref(language: Language = getLanguage()): string {
  const path = siteConfig.cvUrls[language] ?? siteConfig.cvUrl;
  return withBase(path);
}

/** Nome do arquivo sugerido ao salvar. */
const DOWNLOAD_NAME: Record<Language, string> = {
  'pt-BR': 'Curriculo-Jhosue-Tortolero-PT.pdf',
  'en-US': 'Resume-Jhosue-Tortolero-EN.pdf',
  es: 'Curriculum-Jhosue-Tortolero-ES.pdf',
};

function applyCvLinks(root: ParentNode = document): void {
  const language = getLanguage();
  for (const link of qsa<HTMLAnchorElement>('a[data-cv-link]', root)) {
    link.href = cvHref(language);
    link.setAttribute('download', DOWNLOAD_NAME[language] ?? DOWNLOAD_NAME[DEFAULT_LANGUAGE]);
  }
}

export function initCvLinks(): void {
  applyCvLinks();
  document.addEventListener(LANGUAGE_EVENT, () => applyCvLinks());
}
