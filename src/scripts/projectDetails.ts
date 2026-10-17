/**
 * Diálogo de detalhes dos projetos: descrição completa e todas as tecnologias.
 *
 * Mesma abordagem do diálogo de depoimentos: todos os projetos já estão no
 * HTML, e abrir um é só alternar `hidden`. Nada é montado com innerHTML.
 */
import { qs, qsa, on } from '../utils/dom';
import { lockBodyScroll, trapFocus } from '../utils/accessibility';
import { DIALOG_EVENT } from './carousel';

export function initProjectDetails(): void {
  const rootEl = qs<HTMLElement>('[data-project-dialog]');
  const panelEl = qs<HTMLElement>('[data-project-panel]');
  if (!rootEl || !panelEl) return;

  const root = rootEl;
  const panel = panelEl;

  const items = qsa<HTMLElement>('[data-project-item]', root);
  const title = qs<HTMLElement>('[data-project-dialog-title]', root);
  const closeButton = qs<HTMLButtonElement>('[data-project-close]', root);

  let releaseFocus: (() => void) | null = null;
  let releaseScroll: (() => void) | null = null;
  let lastFocused: HTMLElement | null = null;

  function announce(open: boolean): void {
    document.dispatchEvent(new CustomEvent(DIALOG_EVENT, { detail: { open } }));
  }

  function show(id: string): boolean {
    const target = items.find((item) => item.dataset.projectItem === id);
    if (!target) return false;

    for (const item of items) {
      item.hidden = item !== target;
    }

    // textContent: o título vem de dados, nunca vira HTML.
    if (title) title.textContent = target.dataset.projectTitle ?? '';

    const body = qs<HTMLElement>('.pdialog__body', root);
    if (body) body.scrollTop = 0;
    return true;
  }

  function open(id: string): void {
    if (!show(id) || !root.hidden) return;
    lastFocused = document.activeElement as HTMLElement | null;
    root.hidden = false;
    releaseScroll = lockBodyScroll();
    releaseFocus = trapFocus(panel);
    announce(true);
    closeButton?.focus();
  }

  function close(): void {
    if (root.hidden) return;
    root.hidden = true;
    releaseFocus?.();
    releaseScroll?.();
    releaseFocus = null;
    releaseScroll = null;
    announce(false);
    lastFocused?.focus();
  }

  for (const button of qsa<HTMLButtonElement>('[data-project-open]')) {
    button.addEventListener('click', () => open(button.dataset.projectOpen ?? ''));
  }

  closeButton?.addEventListener('click', close);
  qs<HTMLElement>('[data-project-backdrop]', root)?.addEventListener('click', close);

  on(document, 'keydown', (event) => {
    if (!root.hidden && event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  });
}
