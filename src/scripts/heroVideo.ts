/**
 * Vídeo do fundador no hero.
 *
 * Mudo, em loop e "inline" — a combinação que iPhone e Android aceitam tocar
 * sozinha. A reprodução começa por aqui (e não pelo atributo autoplay) para
 * respeitar "movimento reduzido" e "economia de dados": nesses casos o vídeo
 * fica no primeiro quadro, com o botão de reproduzir à mostra.
 *
 * Fora da tela ele pausa, para poupar bateria, e volta sozinho ao reaparecer.
 */
import { prefersReducedMotion, qs } from '../utils/dom';
import { translate } from './i18nRuntime';

interface NetworkInformation {
  saveData?: boolean;
}

function prefersStill(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return prefersReducedMotion() || connection?.saveData === true;
}

function bindHeroVideo(video: HTMLVideoElement, toggle: HTMLButtonElement): void {
  // Reforça o que o HTML já pede: sem som e sem abrir em tela cheia no iPhone.
  video.muted = true;
  video.playsInline = true;

  /** A pessoa quer o vídeo tocando (muda só pelo botão). */
  let wanted = !prefersStill();
  let visible = true;
  let retryArmed = false;

  function syncToggle(): void {
    const playing = !video.paused;
    const key = playing ? 'hero.videoPause' : 'hero.videoPlay';
    toggle.dataset.playing = String(playing);
    // A troca de idioma relê este atributo e traduz o rótulo certo.
    toggle.dataset.i18nAttr = `aria-label:${key}`;
    toggle.setAttribute('aria-label', translate(key));
  }

  /** Autoplay bloqueado (ex.: iPhone em modo de pouca energia): tenta no primeiro toque. */
  function armRetry(): void {
    if (retryArmed) return;
    retryArmed = true;

    const retry = (): void => {
      document.removeEventListener('touchend', retry);
      document.removeEventListener('click', retry);
      retryArmed = false;
      if (wanted && visible && video.paused) void play();
    };

    document.addEventListener('touchend', retry, { passive: true });
    document.addEventListener('click', retry);
  }

  async function play(): Promise<void> {
    try {
      await video.play();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') armRetry();
    }
  }

  video.addEventListener('play', syncToggle);
  video.addEventListener('pause', syncToggle);

  toggle.addEventListener('click', () => {
    wanted = video.paused;
    if (wanted) void play();
    else video.pause();
  });

  syncToggle();

  if (!('IntersectionObserver' in window)) {
    if (wanted) void play();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) video.pause();
    else if (wanted && video.paused) void play();
  });
  observer.observe(video);
}

export function initHeroVideo(): void {
  const video = qs<HTMLVideoElement>('[data-hero-video]');
  const toggle = qs<HTMLButtonElement>('[data-hero-video-toggle]');
  if (video && toggle) bindHeroVideo(video, toggle);
}
