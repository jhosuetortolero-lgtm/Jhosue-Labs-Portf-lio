import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTranslations,
  detectLanguage,
  getLanguage,
  nextLanguage,
  setLanguage,
  LANGUAGE_EVENT,
} from '../../src/scripts/i18nRuntime';
import { siteConfig } from '../../src/config/site';
import { t } from '../../src/i18n';

const KEY = siteConfig.storageKeys.language;

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  document.head.innerHTML = '<meta name="description" content="" />';
  window.history.replaceState(null, '', '/');
  setLanguage('pt-BR', false);
});

describe('persistência de idioma', () => {
  it('salva o idioma escolhido', () => {
    setLanguage('en-US');
    expect(localStorage.getItem(KEY)).toBe('en-US');
    expect(getLanguage()).toBe('en-US');
  });

  it('ignora idioma não suportado', () => {
    setLanguage('fr' as never);
    expect(getLanguage()).toBe('pt-BR');
  });

  it('prioriza idioma válido na URL sobre idioma salvo', () => {
    localStorage.setItem(KEY, 'pt-BR');
    window.history.replaceState(null, '', '/?lang=es');
    expect(detectLanguage()).toBe('es');
  });

  it('aceita atalhos de idioma na URL', () => {
    window.history.replaceState(null, '', '/?lang=en');
    expect(detectLanguage()).toBe('en-US');

    window.history.replaceState(null, '', '/?lang=pt');
    expect(detectLanguage()).toBe('pt-BR');
  });

  it('ignora idioma inválido na URL e lê o idioma salvo', () => {
    localStorage.setItem(KEY, 'es');
    window.history.replaceState(null, '', '/?lang=invalid');
    expect(detectLanguage()).toBe('es');
  });

  it('lê o idioma salvo', () => {
    localStorage.setItem(KEY, 'es');
    expect(detectLanguage()).toBe('es');
  });

  it('atualiza URL preservando parâmetros e âncora', () => {
    window.history.replaceState(null, '', '/?utm_source=share#contact');
    setLanguage('en-US');
    expect(window.location.search).toBe('?utm_source=share&lang=en-US');
    expect(window.location.hash).toBe('#contact');
  });

  it('não atualiza URL durante inicialização', () => {
    window.history.replaceState(null, '', '/?utm_source=share');
    setLanguage('es', false);
    expect(window.location.search).toBe('?utm_source=share');
  });

  it('normaliza idioma completo sem diferenciar maiúsculas', () => {
    window.history.replaceState(null, '', '/?lang=EN-us');
    expect(detectLanguage()).toBe('en-US');
  });

  it('cai no idioma do navegador quando não há nada salvo', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB', 'en']);
    expect(detectLanguage()).toBe('en-US');
  });

  it('usa o padrão quando o navegador não bate com nenhum idioma', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ja-JP']);
    expect(detectLanguage()).toBe('pt-BR');
  });

  it('cicla entre os idiomas suportados', () => {
    setLanguage('pt-BR', false);
    expect(nextLanguage()).toBe('en-US');
    setLanguage('en-US', false);
    expect(nextLanguage()).toBe('es');
    setLanguage('es', false);
    expect(nextLanguage()).toBe('pt-BR');
  });
});

describe('applyTranslations', () => {
  it('troca o texto de elementos com data-i18n', () => {
    document.body.innerHTML = '<h2 data-i18n="navigation.projects">Projetos</h2>';
    setLanguage('en-US');
    const heading = document.querySelector('h2');
    expect(heading?.textContent).toBe('Projects');
  });

  it('troca atributos declarados em data-i18n-attr', () => {
    document.body.innerHTML =
      '<input data-i18n-attr="placeholder:form.namePlaceholder;aria-label:form.name" />';
    setLanguage('es');
    const input = document.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe(t('es', 'form.namePlaceholder'));
    expect(input?.getAttribute('aria-label')).toBe(t('es', 'form.name'));
  });

  it('não interpreta a tradução como HTML', () => {
    document.body.innerHTML = '<p data-i18n="chave.inexistente"></p>';
    applyTranslations();
    const paragraph = document.querySelector('p');
    expect(paragraph?.querySelector('*')).toBeNull();
    expect(paragraph?.textContent).toBe('chave.inexistente');
  });

  it('atualiza lang do html, title e meta description', () => {
    setLanguage('en-US');
    expect(document.documentElement.lang).toBe('en-US');
    expect(document.title).toBe(t('en-US', 'meta.title'));
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    expect(meta?.content).toBe(t('en-US', 'meta.description'));
  });

  it('dispara o evento de troca de idioma', () => {
    const listener = vi.fn();
    document.addEventListener(LANGUAGE_EVENT, listener);
    setLanguage('es');
    expect(listener).toHaveBeenCalledTimes(1);
    document.removeEventListener(LANGUAGE_EVENT, listener);
  });
});
