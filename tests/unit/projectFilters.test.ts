import { beforeEach, describe, expect, it } from 'vitest';
import { applyFilter, matchesFilter } from '../../src/scripts/projectFilters';

function mountGrid(): void {
  document.body.innerHTML = `
    <ul>
      <li data-project data-category="WEB"></li>
      <li data-project data-category="SAAS"></li>
      <li data-project data-category="SAAS"></li>
      <li data-project data-category="AI"></li>
    </ul>
    <p data-projects-empty hidden></p>
  `;
}

beforeEach(mountGrid);

describe('matchesFilter', () => {
  it('ALL aceita qualquer categoria', () => {
    expect(matchesFilter('WEB', 'ALL')).toBe(true);
    expect(matchesFilter('SAAS', 'ALL')).toBe(true);
  });

  it('compara categoria exata', () => {
    expect(matchesFilter('SAAS', 'SAAS')).toBe(true);
    expect(matchesFilter('SAAS', 'WEB')).toBe(false);
  });
});

describe('applyFilter', () => {
  it('mostra tudo com ALL', () => {
    const result = applyFilter('ALL');
    expect(result.visible).toBe(4);
    expect(result.total).toBe(4);
  });

  it('esconde os que não são da categoria', () => {
    const result = applyFilter('SAAS');
    expect(result.visible).toBe(2);

    const cards = document.querySelectorAll<HTMLElement>('[data-project]');
    expect(cards[0]?.hidden).toBe(true);
    expect(cards[1]?.hidden).toBe(false);
    expect(cards[3]?.hidden).toBe(true);
  });

  it('mostra o aviso de vazio quando nada bate', () => {
    applyFilter('CRM');
    const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
    expect(empty?.hidden).toBe(false);
  });

  it('esconde o aviso de vazio quando há resultados', () => {
    applyFilter('CRM');
    applyFilter('WEB');
    const empty = document.querySelector<HTMLElement>('[data-projects-empty]');
    expect(empty?.hidden).toBe(true);
  });
});

describe('applyFilter no modo carrossel', () => {
  beforeEach(() => {
    // No carrossel a lista é renderizada duas vezes: os originais e as cópias
    // que emendam o loop.
    document.body.innerHTML = `
      <ul>
        <li data-project data-category="WEB"></li>
        <li data-project data-category="SAAS"></li>
        <li data-project data-category="SAAS"></li>
        <li data-project data-category="WEB" data-project-clone="true"></li>
        <li data-project data-category="SAAS" data-project-clone="true"></li>
        <li data-project data-category="SAAS" data-project-clone="true"></li>
      </ul>
      <p data-projects-empty hidden></p>
    `;
  });

  it('não conta as cópias: o total é o número real de projetos', () => {
    const result = applyFilter('ALL');
    expect(result.total).toBe(3);
    expect(result.visible).toBe(3);
  });

  it('conta apenas os originais ao filtrar', () => {
    const result = applyFilter('SAAS');
    expect(result.visible).toBe(2);
    expect(result.total).toBe(3);
  });

  it('esconde também as cópias, para o carrossel não mostrar o que foi filtrado', () => {
    applyFilter('SAAS');
    const clonesWeb = document.querySelectorAll<HTMLElement>(
      '[data-project-clone][data-category="WEB"]',
    );
    for (const clone of clonesWeb) {
      expect(clone.hidden).toBe(true);
    }
  });
});
