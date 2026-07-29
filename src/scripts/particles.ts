/**
 * Fundo de partículas em canvas.
 * Leve por construção: quantidade proporcional à área, pausa quando a aba
 * fica oculta e desligado com movimento reduzido ou economia de dados.
 */
import { qs, prefersReducedMotion, on } from '../utils/dom';
import { particlesConfig } from '../config/features';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface NavigatorWithSaveData extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

function shouldSkip(): boolean {
  if (prefersReducedMotion()) return true;
  const nav = navigator as NavigatorWithSaveData;
  if (nav.connection?.saveData) return true;
  // Aparelhos modestos: sem partículas.
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true;
  return false;
}

export function initParticles(): void {
  const canvas = qs<HTMLCanvasElement>('[data-particles]');
  if (!canvas) return;

  if (shouldSkip()) {
    canvas.remove();
    return;
  }

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  let particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let paused = false;

  function particleCount(): number {
    const target = Math.round((width * height) / particlesConfig.areaPerParticle);
    return Math.max(particlesConfig.minParticles, Math.min(particlesConfig.maxParticles, target));
  }

  function resize(): void {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    if (!canvas) return;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = particleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * particlesConfig.speed * 2,
      vy: (Math.random() - 0.5) * particlesConfig.speed * 2,
    }));
  }

  function strokeColor(): string {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--color-text-muted').trim() || '#888';
  }

  function draw(): void {
    if (!context) return;
    context.clearRect(0, 0, width, height);

    const color = strokeColor();
    const linkDistanceSquared = particlesConfig.linkDistance ** 2;

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
    }

    context.strokeStyle = color;
    context.fillStyle = color;

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      if (!a) continue;

      context.globalAlpha = 0.5;
      context.beginPath();
      context.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
      context.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        if (!b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = dx * dx + dy * dy;
        if (distance > linkDistanceSquared) continue;

        context.globalAlpha = 0.16 * (1 - distance / linkDistanceSquared);
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    context.globalAlpha = 1;
    if (!paused) frame = window.requestAnimationFrame(draw);
  }

  resize();
  frame = window.requestAnimationFrame(draw);

  let resizeTimer = 0;
  on(
    window,
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    },
    { passive: true },
  );

  // Pausa quando a aba não está visível — zero CPU em segundo plano.
  on(document, 'visibilitychange', () => {
    paused = document.hidden;
    if (paused) {
      window.cancelAnimationFrame(frame);
    } else {
      frame = window.requestAnimationFrame(draw);
    }
  });
}
