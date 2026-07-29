/**
 * Carrossel de rolagem contínua, reutilizável.
 *
 * Usa o scroll nativo (e não `transform`) porque o navegador continua rolando
 * sozinho até o item que recebeu foco pelo teclado — o carrossel fica
 * navegável por Tab sem gambiarra.
 *
 * Pausa automaticamente: mouse em cima, foco dentro, aba escondida, algum
 * diálogo aberto e `prefers-reduced-motion`.
 *
 * Marcação esperada:
 *   [data-carousel]                     raiz
 *     [data-carousel-viewport]          área com overflow-x
 *       [data-carousel-track]           faixa (lista renderizada 2x)
 *         [data-carousel-item]          cada item
 *     [data-carousel-prev|next|toggle]  controles
 *
 * `data-carousel-speed` na raiz ajusta a velocidade em pixels por segundo.
 */
import { qs, qsa, on, prefersReducedMotion } from '../utils/dom';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

const DEFAULT_SPEED = 30;

/** Evento que qualquer diálogo dispara para pausar os carrosséis. */
export const DIALOG_EVENT = 'jhosue:lightbox';

function setup(root: HTMLElement): void {
  const viewport = qs<HTMLElement>('[data-carousel-viewport]', root);
  const track = qs<HTMLElement>('[data-carousel-track]', root);
  if (!viewport || !track) return;

  const toggle = qs<HTMLButtonElement>('[data-carousel-toggle]', root);
  const prev = qs<HTMLButtonElement>('[data-carousel-prev]', root);
  const next = qs<HTMLButtonElement>('[data-carousel-next]', root);

  const speed = Number(root.dataset.carouselSpeed ?? DEFAULT_SPEED) || DEFAULT_SPEED;
  const pauseKey = root.dataset.carouselPauseKey ?? 'certificates.pause';
  const playKey = root.dataset.carouselPlayKey ?? 'certificates.play';

  let userPaused = prefersReducedMotion();
  let hovering = false;
  let focused = false;
  let hidden = false;
  let blocked = false;
  let frame = 0;
  let lastTime = 0;
  /**
   * `scrollLeft` é arredondado para pixel inteiro: somar meio pixel por
   * quadro não sai do lugar. Acumulamos a fração aqui.
   */
  let carry = 0;

  /**
   * Só faz sentido rolar se a faixa for mais larga que a área visível.
   * Filtrar itens pode reduzir a faixa a ponto de não haver o que rolar —
   * nesse caso a rotação para sozinha, em vez de tremer no lugar.
   */
  const hasOverflow = (): boolean => track.scrollWidth > viewport.clientWidth + 4;

  const running = (): boolean =>
    !userPaused && !hovering && !focused && !hidden && !blocked && hasOverflow();

  /** Metade da faixa: a segunda cópia existe só para emendar o loop. */
  const loopWidth = (): number => track.scrollWidth / 2;

  function updateToggleLabel(): void {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    toggle.setAttribute('aria-label', translate(userPaused ? playKey : pauseKey));
  }

  function normalize(): void {
    const half = loopWidth();
    if (half <= 0) return;
    if (viewport!.scrollLeft >= half) viewport!.scrollLeft -= half;
    else if (viewport!.scrollLeft < 0) viewport!.scrollLeft += half;
  }

  function step(now: number): void {
    const delta = lastTime > 0 ? Math.min(now - lastTime, 100) : 0;
    lastTime = now;

    if (running() && delta > 0) {
      carry += (speed * delta) / 1000;
      const pixels = Math.floor(carry);
      if (pixels > 0) {
        carry -= pixels;
        viewport!.scrollLeft += pixels;
        normalize();
      }
    }

    frame = window.requestAnimationFrame(step);
  }

  /** Largura de um item + espaçamento, para os botões andarem item a item. */
  function itemStep(): number {
    const first = qs<HTMLElement>('[data-carousel-item]', track!);
    if (!first) return 280;
    const gap = Number.parseFloat(getComputedStyle(track!).columnGap || '16') || 16;
    return first.getBoundingClientRect().width + gap;
  }

  function nudge(direction: 1 | -1): void {
    viewport!.scrollBy({
      left: itemStep() * direction,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  on(viewport, 'mouseenter', () => {
    hovering = true;
  });
  on(viewport, 'mouseleave', () => {
    hovering = false;
  });
  on(viewport, 'focusin', () => {
    focused = true;
  });
  on(viewport, 'focusout', () => {
    focused = false;
  });

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nudge(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nudge(-1);
    }
  });

  on(viewport, 'scroll', normalize, { passive: true });

  prev?.addEventListener('click', () => nudge(-1));
  next?.addEventListener('click', () => nudge(1));

  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    updateToggleLabel();
  });

  on(document, 'visibilitychange', () => {
    hidden = document.hidden;
  });

  document.addEventListener(LANGUAGE_EVENT, updateToggleLabel);
  document.addEventListener(DIALOG_EVENT, (event) => {
    blocked = (event as CustomEvent<{ open: boolean }>).detail.open;
  });

  updateToggleLabel();
  frame = window.requestAnimationFrame(step);

  window.addEventListener('pagehide', () => window.cancelAnimationFrame(frame), { once: true });
}

/** Liga todos os carrosséis da página. */
export function initCarousels(): void {
  for (const root of qsa<HTMLElement>('[data-carousel]')) {
    setup(root);
  }
}
