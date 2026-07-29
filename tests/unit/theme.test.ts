import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, getCurrentTheme, toggleTheme } from '../../src/scripts/theme';
import { siteConfig } from '../../src/config/site';

const KEY = siteConfig.storageKeys.theme;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.head.innerHTML = '<meta name="theme-color" content="#ffffff" />';
});

describe('tema', () => {
  it('assume claro quando não há data-theme', () => {
    expect(getCurrentTheme()).toBe('light');
  });

  it('aplica o tema no elemento html', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(getCurrentTheme()).toBe('dark');
  });

  it('persiste a escolha no localStorage', () => {
    applyTheme('dark');
    expect(localStorage.getItem(KEY)).toBe('dark');
    applyTheme('light');
    expect(localStorage.getItem(KEY)).toBe('light');
  });

  it('não persiste quando pedido para não persistir', () => {
    applyTheme('dark', false);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('atualiza a meta theme-color', () => {
    applyTheme('dark');
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    expect(meta?.content).toBe(siteConfig.seo.themeColorDark);

    applyTheme('light');
    expect(meta?.content).toBe(siteConfig.seo.themeColorLight);
  });

  it('alterna entre claro e escuro', () => {
    applyTheme('light');
    expect(toggleTheme()).toBe('dark');
    expect(toggleTheme()).toBe('light');
  });

  it('atualiza aria-label e aria-pressed do botão', () => {
    document.body.innerHTML = '<button data-theme-toggle aria-label=""></button>';
    applyTheme('dark');
    const button = document.querySelector('[data-theme-toggle]');
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(button?.getAttribute('aria-label')).toBeTruthy();

    applyTheme('light');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
  });
});
