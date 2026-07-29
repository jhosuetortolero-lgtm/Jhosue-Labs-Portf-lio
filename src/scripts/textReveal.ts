/**
 * Animações de texto do Hero.
 *
 * 1. `[data-split-text]` — o Astro já renderiza as letras separadas e o CSS
 *    faz a cascata. O script só refaz a divisão quando o idioma muda (a troca
 *    de idioma substitui o textContent e apagaria os spans).
 *
 * 2. `[data-rotator]` — alterna a especialidade em destaque. Pausa quando a
 *    aba está escondida e não roda com movimento reduzido.
 */
import { qs, qsa, on, prefersReducedMotion } from '../utils/dom';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

const ROTATION_MS = 2600;

// ---------------------------------------------------------------------------
// Texto em cascata
// ---------------------------------------------------------------------------

/** Reconstrói as letras de um bloco a partir de um texto novo. */
function splitInto(container: HTMLElement, text: string): void {
  const visual = qs<HTMLElement>('.split__visual', container);
  const hidden = qs<HTMLElement>('.visually-hidden', container);
  if (!visual) return;

  if (hidden) hidden.textContent = text;

  // Monta com DOM, nunca com innerHTML.
  const fragment = document.createDocumentFragment();
  const words = text.split(' ').filter(Boolean);
  let index = 0;

  words.forEach((word, wordIndex) => {
    const wordEl = document.createElement('span');
    wordEl.className = 'split__word';

    for (const letter of word) {
      const letterEl = document.createElement('span');
      letterEl.className = 'split__letter';
      letterEl.style.setProperty('--i', String(index));
      letterEl.textContent = letter;
      wordEl.appendChild(letterEl);
      index += 1;
    }

    fragment.appendChild(wordEl);

    // Espaço de verdade entre as palavras. As palavras são inline-block:
    // sem este nó de texto elas ficariam coladas.
    if (wordIndex < words.length - 1) {
      fragment.appendChild(document.createTextNode(' '));
    }
    index += 1;
  });

  visual.replaceChildren(fragment);
}

function initSplitText(): void {
  document.addEventListener(LANGUAGE_EVENT, () => {
    for (const container of qsa<HTMLElement>('[data-split-text]')) {
      const key = container.dataset.splitKey;
      if (!key) continue;
      splitInto(container, translate(key));
    }
  });
}

// ---------------------------------------------------------------------------
// Especialidades em rotação
// ---------------------------------------------------------------------------

function initRotator(): void {
  const rotator = qs<HTMLElement>('[data-rotator]');
  if (!rotator) return;

  const items = qsa<HTMLElement>('[data-rotator-item]', rotator);
  if (items.length < 2 || prefersReducedMotion()) return;

  let current = 0;
  let paused = false;

  function show(index: number): void {
    items.forEach((item, position) => {
      if (position === index) item.dataset.current = 'true';
      else delete item.dataset.current;
    });
  }

  show(0);

  const timer = window.setInterval(() => {
    if (paused) return;
    current = (current + 1) % items.length;
    show(current);
  }, ROTATION_MS);

  on(document, 'visibilitychange', () => {
    paused = document.hidden;
  });

  // Pausa ao passar o mouse: dá tempo de ler.
  on(rotator, 'mouseenter', () => {
    paused = true;
  });
  on(rotator, 'mouseleave', () => {
    paused = false;
  });

  window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });
}

export function initTextReveal(): void {
  initSplitText();
  initRotator();
}
