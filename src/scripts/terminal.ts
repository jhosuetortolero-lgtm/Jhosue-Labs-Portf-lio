/**
 * Terminal animado da seção Laboratório.
 * O texto já está no HTML; a animação apenas revela. Sem JS, com movimento
 * reduzido ou fora do viewport, o conteúdo continua legível.
 */
import { qs, qsa, prefersReducedMotion } from '../utils/dom';
import { motionConfig } from '../config/features';
import { LANGUAGE_EVENT } from './i18nRuntime';

interface LineState {
  element: HTMLElement;
  textNode: HTMLElement;
  /** Chave de tradução, quando a linha é traduzível. */
  key: string | null;
  fullText: string;
}

let running = false;
let played = false;
let states: LineState[] = [];

function capture(root: HTMLElement): LineState[] {
  return qsa<HTMLElement>('[data-terminal-line]', root)
    .map((element) => {
      const textNode = qs<HTMLElement>('[data-terminal-text]', element);
      if (!textNode) return null;
      // Guarda o texto original: a animação apaga o textContent.
      if (!textNode.dataset.fullText) {
        textNode.dataset.fullText = textNode.textContent ?? '';
      }
      return {
        element,
        textNode,
        key: textNode.dataset.i18n ?? null,
        fullText: textNode.dataset.fullText,
      };
    })
    .filter((line): line is LineState => line !== null);
}

/** Após troca de idioma, o textContent traduzido vira o novo texto completo. */
function refreshTranslated(): void {
  for (const line of states) {
    if (!line.key) continue;
    const translated = line.textNode.textContent ?? '';
    if (translated) {
      line.fullText = translated;
      line.textNode.dataset.fullText = translated;
    }
  }
}

function hideAll(caret: HTMLElement | null): void {
  for (const line of states) {
    line.element.hidden = true;
    line.textNode.textContent = '';
  }
  if (caret) caret.hidden = true;
}

function showAll(caret: HTMLElement | null): void {
  for (const line of states) {
    line.element.hidden = false;
    line.textNode.textContent = line.fullText;
  }
  if (caret) caret.hidden = false;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeLine(line: LineState, speed: number): Promise<void> {
  line.element.hidden = false;
  const isCommand = line.element.classList.contains('terminal__line--command');

  // Saídas aparecem de uma vez; comandos são digitados caractere a caractere.
  if (!isCommand) {
    line.textNode.textContent = line.fullText;
    await wait(220);
    return;
  }

  for (let index = 1; index <= line.fullText.length; index += 1) {
    line.textNode.textContent = line.fullText.slice(0, index);
    await wait(speed);
  }
  await wait(180);
}

async function play(caret: HTMLElement | null, replay: HTMLButtonElement | null): Promise<void> {
  if (running) return;
  running = true;

  hideAll(caret);
  for (const line of states) {
    await typeLine(line, motionConfig.terminalTypingMs);
  }
  if (caret) caret.hidden = false;
  if (replay) replay.hidden = false;

  running = false;
  played = true;
}

export function initTerminal(): void {
  const root = qs<HTMLElement>('[data-terminal]');
  if (!root) return;

  states = capture(root);
  const caret = qs<HTMLElement>('[data-terminal-caret]', root);
  const replay = qs<HTMLButtonElement>('[data-terminal-replay]', root);

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    showAll(caret);
    played = true;
    return;
  }

  hideAll(caret);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !played && !running) {
          observer.disconnect();
          void play(caret, replay);
        }
      }
    },
    { threshold: 0.35 },
  );

  observer.observe(root);

  replay?.addEventListener('click', () => {
    if (!running) void play(caret, replay);
  });

  // Troca de idioma: mostra tudo já traduzido, sem reiniciar a digitação.
  document.addEventListener(LANGUAGE_EVENT, () => {
    window.setTimeout(() => {
      refreshTranslated();
      if (!running) {
        showAll(caret);
        played = true;
        if (replay) replay.hidden = false;
      }
    }, 0);
  });
}
