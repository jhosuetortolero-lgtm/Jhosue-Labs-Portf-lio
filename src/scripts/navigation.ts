/**
 * Header, scroll spy, menu mobile e barra de progresso.
 * Usa IntersectionObserver para o scroll spy (sem listener pesado de scroll)
 * e um listener passivo com rAF para o progresso.
 */
import { qs, qsa, on } from '../utils/dom';
import { sectionIds } from '../config/navigation';
import { lockBodyScroll, trapFocus } from '../utils/accessibility';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

function initHeaderState(): void {
  const header = qs<HTMLElement>('[data-header]');
  if (!header) return;

  let ticking = false;
  const update = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  };

  update();
  on(
    window,
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );
}

function initScrollSpy(): void {
  const links = qsa<HTMLAnchorElement>('[data-nav-link]');
  if (links.length === 0) return;

  const setActive = (id: string): void => {
    for (const link of links) {
      const isActive = link.dataset.navLink === id;
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null);

  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const visible = new Map<string, number>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      }

      let bestId = '';
      let bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio >= bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestId) setActive(bestId);
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  for (const section of sections) observer.observe(section);
}

function initScrollProgress(): void {
  const container = qs<HTMLElement>('[data-scroll-progress]');
  const bar = qs<HTMLElement>('[data-scroll-progress-bar]');
  if (!container || !bar) return;

  const caret = qs<HTMLElement>('[data-scroll-progress-caret]');
  const rule = qs<HTMLElement>('.progress__rule', container);

  let ticking = false;
  const update = (): void => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;

    // O "código escrito" e o fio verde crescem juntos; o cursor segue a ponta.
    bar.style.width = `${percent}%`;
    if (rule) rule.style.width = `${percent}%`;
    if (caret) caret.style.left = `${percent}%`;

    container.setAttribute('aria-valuenow', String(Math.round(percent)));
    ticking = false;
  };

  update();
  on(
    window,
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );
  on(window, 'resize', update, { passive: true });
}

function initMobileMenu(): void {
  const toggle = qs<HTMLButtonElement>('[data-mobile-toggle]');
  const menu = qs<HTMLElement>('[data-mobile-menu]');
  const closeButton = qs<HTMLButtonElement>('[data-mobile-close]');
  if (!toggle || !menu) return;

  let releaseFocus: (() => void) | null = null;
  let releaseScroll: (() => void) | null = null;

  function updateToggleLabel(open: boolean): void {
    toggle?.setAttribute('aria-label', translate(open ? 'a11y.closeMenu' : 'a11y.openMenu'));
  }

  function open(): void {
    if (!toggle || !menu) return;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    updateToggleLabel(true);
    releaseScroll = lockBodyScroll();
    releaseFocus = trapFocus(menu);
    (closeButton ?? qs<HTMLElement>('[data-mobile-link]', menu))?.focus();
  }

  function close(returnFocus = true): void {
    if (!toggle || !menu || menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    updateToggleLabel(false);
    releaseFocus?.();
    releaseScroll?.();
    releaseFocus = null;
    releaseScroll = null;
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (menu.hidden) open();
    else close();
  });

  closeButton?.addEventListener('click', () => close());

  for (const link of qsa<HTMLAnchorElement>('[data-mobile-link]', menu)) {
    link.addEventListener('click', () => close(false));
  }

  menu.addEventListener('click', (event) => {
    // Clique no fundo escuro fecha.
    if (event.target === menu) close();
  });

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) close();
  });

  // Ao voltar para desktop, garante o menu fechado e a rolagem liberada.
  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) close(false);
  });

  document.addEventListener(LANGUAGE_EVENT, () => updateToggleLabel(!menu.hidden));
}

export function initNavigation(): void {
  initHeaderState();
  initScrollSpy();
  initScrollProgress();
  initMobileMenu();
}
