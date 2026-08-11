/**
 * Seletor de país do formulário: abrir, buscar, navegar pelo teclado.
 *
 * O valor escolhido vai para um input escondido, então o resto do formulário
 * não precisa saber que a lista é customizada.
 */
import { qs, qsa, on } from '../utils/dom';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

/** "São Tomé" e "sao tome" precisam casar na busca. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function initCountrySelect(): void {
  const root = qs<HTMLElement>('[data-country]');
  if (!root) return;

  const trigger = qs<HTMLButtonElement>('[data-country-trigger]', root);
  const popup = qs<HTMLElement>('[data-country-popup]', root);
  const search = qs<HTMLInputElement>('[data-country-search]', root);
  const list = qs<HTMLElement>('[data-country-list]', root);
  const empty = qs<HTMLElement>('[data-country-empty]', root);
  const value = qs<HTMLInputElement>('[data-country-value]', root);
  const flag = qs<HTMLImageElement>('[data-country-flag]', root);
  const name = qs<HTMLElement>('[data-country-name]', root);
  const dial = qs<HTMLElement>('[data-country-dial]', root);

  if (!trigger || !popup || !search || !list || !value || !flag || !name || !dial) return;

  const options = qsa<HTMLElement>('[data-country-option]', list);
  let active = 0;

  function visible(): HTMLElement[] {
    return options.filter((option) => !option.hidden);
  }

  function setActive(index: number): void {
    const items = visible();
    if (items.length === 0) return;
    active = Math.max(0, Math.min(index, items.length - 1));

    for (const option of options) option.classList.remove('is-active');
    const current = items[active];
    if (!current) return;
    current.classList.add('is-active');
    search!.setAttribute('aria-activedescendant', current.id);
    current.scrollIntoView({ block: 'nearest' });
  }

  function filter(term: string): void {
    const query = normalize(term);
    const digits = query.replace(/\D/g, '');

    for (const option of options) {
      const iso = option.dataset.countryOption ?? '';
      const optionDial = option.dataset.dial ?? '';
      const label = normalize(option.textContent ?? '');
      const matches =
        query.length === 0 ||
        label.includes(query) ||
        normalize(iso).startsWith(query) ||
        (digits.length > 0 && optionDial.startsWith(digits));
      option.hidden = !matches;
    }

    if (empty) empty.hidden = visible().length > 0;
    setActive(0);
  }

  function open(): void {
    if (!popup!.hidden) return;
    popup!.hidden = false;
    root!.dataset.open = 'true';
    trigger!.setAttribute('aria-expanded', 'true');
    search!.value = '';
    filter('');
    // Começa no país já escolhido, não no topo da lista.
    const chosen = visible().findIndex((option) => option.dataset.countryOption === value!.value);
    setActive(chosen >= 0 ? chosen : 0);
    search!.focus();
  }

  function close(focusTrigger = false): void {
    if (popup!.hidden) return;
    popup!.hidden = true;
    delete root!.dataset.open;
    trigger!.setAttribute('aria-expanded', 'false');
    search!.removeAttribute('aria-activedescendant');
    if (focusTrigger) trigger!.focus();
  }

  function select(option: HTMLElement): void {
    const iso = option.dataset.countryOption;
    if (!iso) return;

    value!.value = iso;
    for (const item of options) {
      item.setAttribute('aria-selected', item === option ? 'true' : 'false');
    }

    const image = option.querySelector('img');
    if (image) flag!.src = image.src;

    // Guardar a chave em data-i18n faz o nome acompanhar a troca de idioma.
    const key = `country.${iso}`;
    name!.dataset.i18n = key;
    name!.textContent = translate(key);
    dial!.textContent = `+${option.dataset.dial ?? ''}`;

    // A dica do campo passa a mostrar o formato usado no país escolhido.
    const phone = qs<HTMLInputElement>('[name="whatsapp"]', root!.closest('form') ?? document);
    const example = option.dataset.example;
    if (phone && example) phone.placeholder = example;

    close(true);
  }

  /** Ordem alfabética do idioma ativo. */
  function sortOptions(): void {
    const items = [...options].sort((a, b) => {
      const nameA = a.querySelector('[data-i18n]')?.textContent ?? '';
      const nameB = b.querySelector('[data-i18n]')?.textContent ?? '';
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
    for (const item of items) list!.append(item);
  }

  trigger.addEventListener('click', () => (popup.hidden ? open() : close(true)));
  search.addEventListener('input', () => filter(search.value));

  search.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(active - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(visible().length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const current = visible()[active];
      if (current) select(current);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') {
      close();
    }
  });

  for (const option of options) {
    option.addEventListener('click', () => select(option));
  }

  on(document, 'click', (event) => {
    const target = event.target as Node | null;
    if (!popup.hidden && target && !root.contains(target)) close();
  });

  sortOptions();
  document.addEventListener(LANGUAGE_EVENT, () => {
    sortOptions();
    if (!popup.hidden) filter(search.value);
  });
}
