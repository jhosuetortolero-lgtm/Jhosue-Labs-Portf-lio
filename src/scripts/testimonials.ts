/**
 * Diálogo dos depoimentos: abre o texto completo e o print de comprovação.
 *
 * Mesma abordagem do visualizador de certificados: todos os depoimentos já
 * estão no HTML, e trocar de item é só alternar `hidden`. Nada é montado com
 * innerHTML.
 */
import { qs, qsa, on } from '../utils/dom';
import { lockBodyScroll, trapFocus } from '../utils/accessibility';
import { testimonials } from '../data/testimonials';
import { DIALOG_EVENT } from './carousel';

export function initTestimonials(): void {
  const rootEl = qs<HTMLElement>('[data-testimonial-dialog]');
  const panelEl = qs<HTMLElement>('[data-testimonial-panel]');
  if (!rootEl || !panelEl) return;

  const root = rootEl;
  const panel = panelEl;

  const items = qsa<HTMLElement>('[data-testimonial-item]', root);
  const author = qs<HTMLElement>('[data-testimonial-author]', root);
  const indexLabel = qs<HTMLElement>('[data-testimonial-index]', root);
  const closeButton = qs<HTMLButtonElement>('[data-testimonial-close]', root);

  let current = 0;
  let releaseFocus: (() => void) | null = null;
  let releaseScroll: (() => void) | null = null;
  let lastFocused: HTMLElement | null = null;

  function announce(open: boolean): void {
    document.dispatchEvent(new CustomEvent(DIALOG_EVENT, { detail: { open } }));
  }

  function show(index: number): void {
    if (items.length === 0) return;
    current = (index + items.length) % items.length;

    items.forEach((item, position) => {
      item.hidden = position !== current;
    });

    const testimonial = testimonials[current];
    if (!testimonial) return;

    if (author) {
      // textContent: o conteúdo vem de dados, nunca vira HTML.
      author.textContent = testimonial.company
        ? `${testimonial.author} — ${testimonial.company}`
        : testimonial.author;
    }
    if (indexLabel) indexLabel.textContent = String(current + 1);

    // Volta ao topo ao trocar de depoimento.
    const body = qs<HTMLElement>('.tdialog__body', root);
    if (body) body.scrollTop = 0;
  }

  function open(index: number): void {
    if (!root.hidden) {
      show(index);
      return;
    }
    lastFocused = document.activeElement as HTMLElement | null;
    root.hidden = false;
    show(index);
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

  for (const button of qsa<HTMLButtonElement>('[data-testimonial-open]')) {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.testimonialOpen ?? '0');
      open(Number.isNaN(index) ? 0 : index);
    });
  }

  closeButton?.addEventListener('click', close);
  qs<HTMLElement>('[data-testimonial-backdrop]', root)?.addEventListener('click', close);
  qs<HTMLButtonElement>('[data-testimonial-prev]', root)?.addEventListener('click', () =>
    show(current - 1),
  );
  qs<HTMLButtonElement>('[data-testimonial-next]', root)?.addEventListener('click', () =>
    show(current + 1),
  );

  on(document, 'keydown', (event) => {
    if (root.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowRight' && items.length > 1) {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === 'ArrowLeft' && items.length > 1) {
      event.preventDefault();
      show(current - 1);
    }
  });
}
