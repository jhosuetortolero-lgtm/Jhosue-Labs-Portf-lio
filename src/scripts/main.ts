/**
 * Ponto de entrada dos scripts do cliente.
 * Cada funcionalidade só é ligada se estiver habilitada em config/features.ts.
 */
import { features } from '../config/features';
import { initLanguageToggle } from './language';
import { initTheme } from './theme';
import { initNavigation } from './navigation';
import { initScrollReveal } from './scrollReveal';
import { initTextReveal } from './textReveal';
import { initProjectFilters } from './projectFilters';
import { initCommandPalette } from './commandPalette';
import { initTerminal } from './terminal';
import { initParticles } from './particles';
import { initShaderBackground } from './shaderBackground';
import { initContactForm } from './contactForm';
import { initCarousels } from './carousel';
import { initCertificates } from './certificates';
import { initTestimonials } from './testimonials';
import { initBootScreen } from './boot';

function boot(): void {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  if (features.bootScreen) initBootScreen();

  // Idioma primeiro: os demais módulos leem rótulos traduzidos.
  if (features.languageToggle) initLanguageToggle();
  if (features.themeToggle) initTheme();

  initNavigation();
  initScrollReveal();
  initTextReveal();

  if (features.projectFilters) initProjectFilters();
  if (features.commandPalette) initCommandPalette();
  if (features.animatedTerminal) initTerminal();
  if (features.shaderBackground) initShaderBackground();
  if (features.particles && !features.shaderBackground) initParticles();
  // Um único motor de carrossel serve certificados e depoimentos.
  initCarousels();
  if (features.certificates) initCertificates();
  if (features.testimonials) initTestimonials();
  if (features.contactForm) initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
