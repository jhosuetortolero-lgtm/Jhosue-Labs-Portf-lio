/** Utilidades de acessibilidade para diálogos e menus. */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

/**
 * Mantém o foco dentro de um container enquanto ele estiver aberto.
 * Devolve a função de limpeza.
 */
export function trapFocus(container: HTMLElement): () => void {
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const items = focusableElements(container);
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0] as HTMLElement;
    const last = items[items.length - 1] as HTMLElement;
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', handleKeydown);
  return () => container.removeEventListener('keydown', handleKeydown);
}

/** Bloqueia a rolagem do fundo sem causar salto de layout. */
export function lockBodyScroll(): () => void {
  const { body } = document;
  const previousOverflow = body.style.overflow;
  const previousPadding = body.style.paddingRight;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;

  body.style.overflow = 'hidden';
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

  return () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPadding;
  };
}

/** Anuncia uma mensagem em uma região aria-live existente. */
export function announce(region: HTMLElement | null, message: string): void {
  if (!region) return;
  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = message;
  }, 50);
}
