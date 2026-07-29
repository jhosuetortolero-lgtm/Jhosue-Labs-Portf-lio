/**
 * Tela de inicialização.
 * Só na primeira visita da sessão, com botão de pular, duração máxima e
 * remoção do DOM ao final. Nunca bloqueia o acesso ao conteúdo.
 */
import { qs, qsa, prefersReducedMotion } from '../utils/dom';
import { motionConfig } from '../config/features';
import { siteConfig } from '../config/site';
import { readStorage, writeStorage } from '../utils/storage';

export function initBootScreen(): void {
  const screen = qs<HTMLElement>('[data-boot-screen]');
  if (!screen) return;

  const alreadySeen = readStorage(siteConfig.storageKeys.boot, 'session') === '1';
  if (alreadySeen || prefersReducedMotion()) {
    screen.remove();
    return;
  }

  writeStorage(siteConfig.storageKeys.boot, '1', 'session');

  const lines = qsa<HTMLElement>('[data-boot-line]', screen);
  const bar = qs<HTMLElement>('[data-boot-bar]', screen);
  const skip = qs<HTMLButtonElement>('[data-boot-skip]', screen);

  screen.hidden = false;
  screen.classList.add('is-active');
  document.documentElement.style.overflow = 'hidden';

  let finished = false;
  const timers: number[] = [];

  function finish(): void {
    if (finished) return;
    finished = true;
    for (const timer of timers) window.clearTimeout(timer);

    screen?.classList.add('is-leaving');
    document.documentElement.style.overflow = '';
    window.setTimeout(() => screen?.remove(), 340);
  }

  lines.forEach((line, index) => {
    timers.push(
      window.setTimeout(
        () => {
          line.hidden = false;
          if (bar) bar.style.width = `${Math.round(((index + 1) / lines.length) * 100)}%`;
        },
        motionConfig.bootLineIntervalMs * (index + 1),
      ),
    );
  });

  // Limite máximo de duração: a tela nunca trava a página.
  timers.push(window.setTimeout(finish, motionConfig.bootMaxDurationMs));

  if (skip) {
    skip.tabIndex = 0;
    skip.addEventListener('click', finish);
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') finish();
    },
    { once: true },
  );
}
