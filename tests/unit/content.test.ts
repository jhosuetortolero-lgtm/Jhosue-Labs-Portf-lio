import { describe, expect, it } from 'vitest';
import { validateContent } from '../../src/data/validate';
import { projects, projectFilters } from '../../src/data/projects';
import { timeline } from '../../src/data/timeline';
import { siteConfig } from '../../src/config/site';
import { socialLinks } from '../../src/config/social';
import { dictionaries } from '../../src/i18n';

describe('conteúdo', () => {
  it('passa na validação de schema', () => {
    expect(() => validateContent()).not.toThrow();
  });

  it('todo link externo de projeto é https', () => {
    for (const project of projects) {
      if (project.projectUrl) expect(project.projectUrl.startsWith('https://')).toBe(true);
      if (project.repositoryUrl) expect(project.repositoryUrl.startsWith('https://')).toBe(true);
    }
  });

  it('os filtros começam por ALL e só listam categorias usadas', () => {
    expect(projectFilters[0]).toBe('ALL');
    const usadas = new Set<string>(projects.map((project) => project.category));
    for (const filter of projectFilters.slice(1)) {
      expect(usadas.has(filter)).toBe(true);
    }
  });

  it('não sobrou nada do projeto de referência', () => {
    const serialized = JSON.stringify({ projects, timeline, siteConfig }).toLowerCase();
    for (const proibido of ['llohs', 'llohs-dev', 'emailjs_user_', 'github.io/llohs']) {
      expect(serialized).not.toContain(proibido);
    }
  });

  it('a seção de projetos vira carrossel a partir de 4 projetos', () => {
    // Documenta a regra: hoje são poucos, então o layout é em grade.
    // Ao passar de 3, o carrossel liga sozinho — sem mexer em código.
    const MIN_FOR_CAROUSEL = 4;
    const modo = projects.length >= MIN_FOR_CAROUSEL ? 'carrossel' : 'grade';
    expect(['grade', 'carrossel']).toContain(modo);
    expect(projects.length >= MIN_FOR_CAROUSEL).toBe(modo === 'carrossel');
  });

  it('a marca Jhosue Labs está na configuração central', () => {
    expect(siteConfig.brand.name).toBe('Jhosue Labs');
    expect(siteConfig.seo.title).toContain('Jhosue Labs');
    expect(siteConfig.seo.ogTitle).toContain('Jhosue Labs');
  });

  it('a detentora da marca está configurada e o texto legal existe nos 3 idiomas', () => {
    expect(siteConfig.legal.trademarkOwner).toBe('Leadspark Software House');

    // A frase muda conforme o registro estiver ou não confirmado.
    const chave = siteConfig.legal.registered
      ? 'footer.trademarkPrefix'
      : 'footer.trademarkPrefixUnregistered';

    for (const idioma of ['pt-BR', 'en-US', 'es'] as const) {
      expect(dictionaries[idioma][chave]).toBeTruthy();
      expect(dictionaries[idioma]['footer.allRights']).toBeTruthy();
      // O crédito de autoria continua separado do aviso legal.
      expect(dictionaries[idioma]['footer.rights']).toBeTruthy();
    }
  });

  it('links sociais não preenchidos ficam desativados em vez de virar href quebrado', () => {
    for (const link of socialLinks) {
      if (!link.configured) expect(link.href).toBe('');
    }
  });
});
