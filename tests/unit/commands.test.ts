import { describe, expect, it } from 'vitest';
import {
  commands,
  filterCommands,
  listedCommands,
  normalizeCommandInput,
  resolveCommand,
} from '../../src/data/terminalCommands';
import { dictionaries } from '../../src/i18n';
import { LANGUAGES } from '../../src/types/i18n';

describe('normalizeCommandInput', () => {
  it('ignora maiúsculas, acentos e espaços extras', () => {
    expect(normalizeCommandInput('  PROJETOS ')).toBe('projetos');
    expect(normalizeCommandInput('Currículo')).toBe('curriculo');
    expect(normalizeCommandInput('sudo   hire   jhosue')).toBe('sudo hire jhosue');
  });
});

describe('resolveCommand', () => {
  it('encontra pelo nome', () => {
    expect(resolveCommand('projetos')?.name).toBe('projetos');
    expect(resolveCommand('help')?.name).toBe('help');
  });

  it('encontra pelos apelidos, inclusive em outros idiomas', () => {
    expect(resolveCommand('projects')?.name).toBe('projetos');
    expect(resolveCommand('proyectos')?.name).toBe('projetos');
    expect(resolveCommand('about')?.name).toBe('sobre');
    expect(resolveCommand('cv')?.name).toBe('curriculo');
  });

  it('reconhece o comando da marca', () => {
    expect(resolveCommand('sudo hire jhosue')?.name).toBe('sudo hire jhosue');
    expect(resolveCommand('contratar')?.name).toBe('sudo hire jhosue');
  });

  it('devolve null para comando desconhecido ou vazio', () => {
    expect(resolveCommand('rm -rf /')).toBeNull();
    expect(resolveCommand('')).toBeNull();
    expect(resolveCommand('   ')).toBeNull();
  });
});

describe('filterCommands', () => {
  it('sem busca devolve todos os listados', () => {
    expect(filterCommands('')).toHaveLength(listedCommands.length);
  });

  it('filtra por trecho do nome', () => {
    const found = filterCommands('pro');
    expect(found.some((command) => command.name === 'projetos')).toBe(true);
  });

  it('devolve lista vazia quando nada bate', () => {
    expect(filterCommands('zzzzz')).toHaveLength(0);
  });
});

describe('ações dos comandos', () => {
  it('todo comando tem descrição traduzida em todos os idiomas', () => {
    for (const command of commands) {
      for (const language of LANGUAGES) {
        expect(
          dictionaries[language][command.descriptionKey],
          `${language} → ${command.descriptionKey}`,
        ).toBeTruthy();
      }
    }
  });

  it('nenhum comando externo aponta para link vazio', () => {
    for (const command of commands) {
      if (command.action.kind === 'external') {
        expect(command.action.url.length).toBeGreaterThan(1);
      }
    }
  });

  it('comandos de navegação apontam para seções da página', () => {
    const sections = ['about', 'services', 'projects', 'lab', 'stack', 'journey', 'contact'];
    for (const command of commands) {
      if (command.action.kind === 'navigate') {
        expect(sections).toContain(command.action.target);
      }
    }
  });
});
