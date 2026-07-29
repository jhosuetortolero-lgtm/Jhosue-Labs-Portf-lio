/** Reveal ao entrar no viewport, contadores e barras de competência. */
import { qsa, prefersReducedMotion } from '../utils/dom';
import { motionConfig } from '../config/features';

function revealAll(): void {
  for (const element of qsa<HTMLElement>('[data-reveal]')) {
    element.classList.add('is-revealed');
  }
  for (const fill of qsa<HTMLElement>('[data-skill-fill]')) {
    fill.classList.add('is-filled');
  }
  for (const counter of qsa<HTMLElement>('[data-counter]')) {
    counter.textContent = counter.dataset.counter ?? counter.textContent;
  }
}

function animateCounter(element: HTMLElement): void {
  const raw = element.dataset.counter ?? element.textContent ?? '';
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return;

  const target = Number(match[1]);
  const suffix = match[2] ?? '';
  const start = performance.now();

  const step = (now: number): void => {
    const progress = Math.min(1, (now - start) / motionConfig.counterDurationMs);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) window.requestAnimationFrame(step);
  };

  element.textContent = `0${suffix}`;
  window.requestAnimationFrame(step);
}

export function initScrollReveal(): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.classList.add('is-revealed');

        for (const fill of qsa<HTMLElement>('[data-skill-fill]', element)) {
          fill.classList.add('is-filled');
        }
        for (const counter of qsa<HTMLElement>('[data-counter]', element)) {
          if (!counter.dataset.counted) {
            counter.dataset.counted = 'true';
            animateCounter(counter);
          }
        }

        observer.unobserve(element);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const element of qsa<HTMLElement>('[data-reveal]')) {
    observer.observe(element);
  }
}
