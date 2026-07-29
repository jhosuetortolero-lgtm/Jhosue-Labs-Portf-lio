import { describe, expect, it } from 'vitest';
import { dictionaries, t } from '../../src/i18n';
import { LANGUAGES, DEFAULT_LANGUAGE, isLanguage } from '../../src/types/i18n';
import { projects } from '../../src/data/projects';
import { services } from '../../src/data/services';

describe('dicionários', () => {
  it('tem os três idiomas', () => {
    expect(Object.keys(dictionaries).sort()).toEqual([...LANGUAGES].sort());
  });

  it('todos os idiomas têm exatamente as mesmas chaves', () => {
    const base = Object.keys(dictionaries[DEFAULT_LANGUAGE]).sort();
    for (const language of LANGUAGES) {
      expect(Object.keys(dictionaries[language]).sort()).toEqual(base);
    }
  });

  it('não tem valor vazio', () => {
    for (const language of LANGUAGES) {
      for (const [key, value] of Object.entries(dictionaries[language])) {
        expect(value, `${language} → ${key}`).not.toBe('');
      }
    }
  });

  it('inclui o conteúdo vindo de src/data', () => {
    for (const project of projects) {
      expect(dictionaries['pt-BR'][`project.${project.id}.short`]).toBeTruthy();
      expect(dictionaries['en-US'][`project.${project.id}.short`]).toBeTruthy();
    }
    for (const service of services) {
      expect(dictionaries.es[`service.${service.id}.title`]).toBeTruthy();
    }
  });
});

describe('t()', () => {
  it('traduz em cada idioma', () => {
    expect(t('pt-BR', 'navigation.projects')).toBe('Projetos');
    expect(t('en-US', 'navigation.projects')).toBe('Projects');
    expect(t('es', 'navigation.projects')).toBe('Proyectos');
  });

  it('devolve a chave quando a tradução não existe', () => {
    expect(t('pt-BR', 'chave.que.nao.existe')).toBe('chave.que.nao.existe');
  });

  it('mantém a marca Jhosue Labs no título', () => {
    for (const language of LANGUAGES) {
      expect(t(language, 'meta.title')).toContain('Jhosue Labs');
    }
  });
});

describe('isLanguage', () => {
  it('reconhece apenas idiomas suportados', () => {
    expect(isLanguage('pt-BR')).toBe(true);
    expect(isLanguage('es')).toBe(true);
    expect(isLanguage('fr')).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });
});
