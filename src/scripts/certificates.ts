/**
 * Visualizador ampliado dos certificados.
 *
 * O carrossel em si vive em `src/scripts/carousel.ts`, compartilhado com a
 * seção de depoimentos.
 *
 * Os painéis já existem no HTML; trocar de certificado é só alternar `hidden`.
 * Nada é montado com innerHTML.
 */
import { qs, qsa, on } from '../utils/dom';
import { lockBodyScroll, trapFocus } from '../utils/accessibility';
import { certificates } from '../data/certificates';
import { DIALOG_EVENT } from './carousel';
import { LANGUAGE_EVENT } from './i18nRuntime';

function initLightbox(): void {
  const rootEl = qs<HTMLElement>('[data-certificate-lightbox]');
  const dialogEl = qs<HTMLElement>('[data-lightbox-dialog]');
  if (!rootEl || !dialogEl) return;

  const root = rootEl;
  const dialog = dialogEl;

  const panels = qsa<HTMLElement>('[data-lightbox-panel]', root);
  const title = qs<HTMLElement>('[data-lightbox-title]', root);
  const subtitle = qs<HTMLElement>('[data-lightbox-subtitle]', root);
  const indexLabel = qs<HTMLElement>('[data-lightbox-index]', root);
  const fullLink = qs<HTMLAnchorElement>('[data-lightbox-full]', root);
  const credentialLink = qs<HTMLAnchorElement>('[data-lightbox-credential]', root);
  const closeButton = qs<HTMLButtonElement>('[data-lightbox-close]', root);

  let current = 0;
  let releaseFocus: (() => void) | null = null;
  let releaseScroll: (() => void) | null = null;
  let lastFocused: HTMLElement | null = null;

  function announce(open: boolean): void {
    document.dispatchEvent(new CustomEvent(DIALOG_EVENT, { detail: { open } }));
  }

  function show(index: number): void {
    if (panels.length === 0) return;
    current = (index + panels.length) % panels.length;

    panels.forEach((panel, position) => {
      panel.hidden = position !== current;
    });

    const certificate = certificates[current];
    if (!certificate) return;

    // textContent, nunca innerHTML.
    if (title) title.textContent = certificate.title;
    if (subtitle) {
      const parts = [certificate.issuer, certificate.year];
      if (certificate.workload) parts.push(certificate.workload);
      subtitle.textContent = parts.join(' · ');
    }
    if (indexLabel) indexLabel.textContent = String(current + 1);

    if (fullLink) {
      const image = panels[current]?.querySelector('img');
      if (image?.src) {
        fullLink.href = image.src;
        fullLink.hidden = false;
      } else {
        fullLink.removeAttribute('href');
        fullLink.hidden = true;
      }
    }

    if (credentialLink) {
      if (certificate.credentialUrl) {
        credentialLink.href = certificate.credentialUrl;
        credentialLink.hidden = false;
      } else {
        credentialLink.removeAttribute('href');
        credentialLink.hidden = true;
      }
    }
  }

  function open(index: number): void {
    // Se já estiver aberto, só troca o certificado exibido.
    if (!root.hidden) {
      show(index);
      return;
    }
    lastFocused = document.activeElement as HTMLElement | null;
    root.hidden = false;
    show(index);
    releaseScroll = lockBodyScroll();
    releaseFocus = trapFocus(dialog);
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

  for (const button of qsa<HTMLButtonElement>('[data-certificate-open]')) {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.certificateOpen ?? '0');
      open(Number.isNaN(index) ? 0 : index);
    });
  }

  closeButton?.addEventListener('click', close);
  qs<HTMLElement>('[data-lightbox-backdrop]', root)?.addEventListener('click', close);
  qs<HTMLButtonElement>('[data-lightbox-prev]', root)?.addEventListener('click', () =>
    show(current - 1),
  );
  qs<HTMLButtonElement>('[data-lightbox-next]', root)?.addEventListener('click', () =>
    show(current + 1),
  );

  on(document, 'keydown', (event) => {
    if (root.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    }
  });

  // Ao trocar de idioma, o subtítulo e os rótulos precisam acompanhar.
  document.addEventListener(LANGUAGE_EVENT, () => {
    if (!root.hidden) show(current);
  });
}

export function initCertificates(): void {
  initLightbox();
}
