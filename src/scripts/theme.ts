/**
 * Tema claro/escuro.
 * A aplicação inicial acontece em um script inline no <head> (ver BaseLayout)
 * para não haver flash. Aqui só cuidamos do botão e da persistência.
 */
import { siteConfig } from '../config/site';
import { writeStorage } from '../utils/storage';
import { qs, qsa } from '../utils/dom';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';
import type { ThemeName } from '../types/site';

export function getCurrentTheme(): ThemeName {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function updateToggleLabels(): void {
  const theme = getCurrentTheme();
  const labelKey = theme === 'dark' ? 'a11y.themeDark' : 'a11y.themeLight';
  for (const button of qsa<HTMLButtonElement>('[data-theme-toggle]')) {
    button.setAttribute('aria-label', translate(labelKey));
    button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
}

export function applyTheme(theme: ThemeName, persist = true): void {
  document.documentElement.dataset.theme = theme;

  const meta = qs<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === 'dark' ? siteConfig.seo.themeColorDark : siteConfig.seo.themeColorLight;
  }

  if (persist) writeStorage(siteConfig.storageKeys.theme, theme);
  updateToggleLabels();
}

export function toggleTheme(): ThemeName {
  const next: ThemeName = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme(): void {
  updateToggleLabels();

  for (const button of qsa<HTMLButtonElement>('[data-theme-toggle]')) {
    button.addEventListener('click', () => toggleTheme());
  }

  // Rótulos precisam acompanhar a troca de idioma.
  document.addEventListener(LANGUAGE_EVENT, updateToggleLabels);
}
