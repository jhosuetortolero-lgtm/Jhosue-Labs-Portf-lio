/** Liga o menu de idioma ao estado de i18n. */
import { qs, qsa, on } from '../utils/dom';
import { LANGUAGE_FLAG, LANGUAGE_LABEL, isLanguage, type Language } from '../types/i18n';
import { withBase } from '../utils/paths';
import { getLanguage, initLanguage, nextLanguage, setLanguage } from './i18nRuntime';

function updateButtons(language: Language): void {
  const current = qs<HTMLElement>('[data-language-current]');
  if (current) current.textContent = LANGUAGE_LABEL[language];

  const flag = qs<HTMLImageElement>('[data-language-flag]');
  if (flag) flag.src = withBase(`/images/flags/${LANGUAGE_FLAG[language]}.svg`);

  for (const option of qsa<HTMLButtonElement>('[data-language-option]')) {
    const value = option.dataset.languageOption;
    option.setAttribute('aria-checked', value === language ? 'true' : 'false');
  }
}

export function toggleLanguage(): Language {
  const next = nextLanguage();
  setLanguage(next);
  updateButtons(next);
  return next;
}

export function initLanguageToggle(): void {
  initLanguage();
  updateButtons(getLanguage());

  const button = qs<HTMLButtonElement>('[data-language-button]');
  const menu = qs<HTMLElement>('[data-language-menu]');
  if (!button || !menu) return;

  function closeMenu(focusButton = false): void {
    if (!button || !menu) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (focusButton) button.focus();
  }

  function openMenu(): void {
    if (!button || !menu) return;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    qs<HTMLButtonElement>('[data-language-option][aria-checked="true"]', menu)?.focus();
  }

  button.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  for (const option of qsa<HTMLButtonElement>('[data-language-option]', menu)) {
    option.addEventListener('click', () => {
      const value = option.dataset.languageOption;
      if (isLanguage(value)) {
        setLanguage(value);
        updateButtons(value);
      }
      closeMenu(true);
    });
  }

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  });

  on(document, 'click', (event) => {
    const target = event.target as Node | null;
    if (!menu.hidden && target && !menu.contains(target) && !button.contains(target)) {
      closeMenu();
    }
  });

  on(window, 'popstate', () => {
    initLanguage();
    updateButtons(getLanguage());
  });
}
