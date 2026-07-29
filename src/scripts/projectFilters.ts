/**
 * Filtro de projetos sem recarregar a página.
 * Os cards continuam no HTML inicial (bom para SEO); o filtro só usa
 * `hidden`, que tira o elemento do fluxo e da árvore de acessibilidade.
 */
import { qs, qsa } from '../utils/dom';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

export interface FilterResult {
  visible: number;
  total: number;
}

/** Lógica pura, testável sem DOM. */
export function matchesFilter(category: string, filter: string): boolean {
  return filter === 'ALL' || category === filter;
}

export function applyFilter(filter: string): FilterResult {
  const cards = qsa<HTMLElement>('[data-project]');
  let visible = 0;
  let total = 0;

  for (const card of cards) {
    const category = card.dataset.category ?? '';
    const show = matchesFilter(category, filter);
    card.hidden = !show;

    // As cópias do carrossel existem só para emendar o loop: escondem junto,
    // mas não entram na contagem anunciada ao usuário.
    if (card.dataset.projectClone === 'true') continue;

    total += 1;
    if (show) visible += 1;
  }

  const empty = qs<HTMLElement>('[data-projects-empty]');
  if (empty) empty.hidden = visible > 0;

  return { visible, total };
}

export function initProjectFilters(): void {
  const buttons = qsa<HTMLButtonElement>('[data-filter]');
  if (buttons.length === 0) return;

  const status = qs<HTMLElement>('[data-projects-status]');
  let currentFilter = 'ALL';

  const announce = (result: FilterResult): void => {
    if (!status) return;
    status.textContent = `${result.visible} ${translate('projects.resultsCount')}`;
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'ALL';
      currentFilter = filter;

      for (const other of buttons) {
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
      }

      announce(applyFilter(filter));
    });
  }

  document.addEventListener(LANGUAGE_EVENT, () => {
    if (status && status.textContent) announce(applyFilter(currentFilter));
  });
}
