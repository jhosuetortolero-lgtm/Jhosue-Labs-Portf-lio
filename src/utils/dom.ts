/** Helpers de DOM tipados, usados pelos scripts do cliente. */

export function qs<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

export function qsa<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** true quando o usuário pediu menos movimento no sistema operacional. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Rola até um elemento respeitando o header fixo e o movimento reduzido. */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  // Move o foco para a seção sem criar rolagem extra.
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Abre um link externo em nova aba de forma segura. */
export function openExternal(url: string): void {
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) win.opener = null;
}

export function on<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): () => void;
export function on(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
