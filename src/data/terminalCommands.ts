import type { CommandDefinition } from '../types/site';
import { socialHref } from '../config/social';

/**
 * Comandos da Command Palette / terminal interativo.
 *
 * Comandos que dependem de um link não configurado em `src/config/site.ts`
 * são removidos automaticamente — nada de comando que não faz nada.
 */
function build(): CommandDefinition[] {
  const list: CommandDefinition[] = [
    {
      name: 'help',
      aliases: ['ajuda', '?'],
      descriptionKey: 'palette.commands.help',
      action: { kind: 'help' },
      listed: true,
    },
    {
      name: 'whoami',
      aliases: ['quemsou'],
      descriptionKey: 'palette.commands.whoami',
      action: { kind: 'print', outputKey: 'palette.output.whoami' },
      listed: true,
    },
    {
      name: 'sobre',
      aliases: ['about', 'acerca'],
      descriptionKey: 'palette.commands.about',
      action: { kind: 'navigate', target: 'about' },
      listed: true,
    },
    {
      name: 'servicos',
      aliases: ['services', 'serviços', 'servicios'],
      descriptionKey: 'palette.commands.services',
      action: { kind: 'navigate', target: 'services' },
      listed: true,
    },
    {
      name: 'projetos',
      aliases: ['projects', 'proyectos'],
      descriptionKey: 'palette.commands.projects',
      action: { kind: 'navigate', target: 'projects' },
      listed: true,
    },
    {
      name: 'laboratorio',
      aliases: ['lab', 'laboratório', 'laboratorio'],
      descriptionKey: 'palette.commands.lab',
      action: { kind: 'navigate', target: 'lab' },
      listed: true,
    },
    {
      name: 'stack',
      aliases: ['tecnologias', 'technologies'],
      descriptionKey: 'palette.commands.stack',
      action: { kind: 'navigate', target: 'stack' },
      listed: true,
    },
    {
      name: 'jornada',
      aliases: ['journey', 'timeline', 'trayectoria'],
      descriptionKey: 'palette.commands.journey',
      action: { kind: 'navigate', target: 'journey' },
      listed: true,
    },
    {
      name: 'contato',
      aliases: ['contact', 'contacto'],
      descriptionKey: 'palette.commands.contact',
      action: { kind: 'navigate', target: 'contact' },
      listed: true,
    },
    {
      name: 'curriculo',
      aliases: ['cv', 'currículo', 'resume'],
      descriptionKey: 'palette.commands.cv',
      action: { kind: 'download-cv' },
      listed: true,
    },
  ];

  const github = socialHref('github');
  if (github) {
    list.push({
      name: 'github',
      aliases: [],
      descriptionKey: 'palette.commands.github',
      action: { kind: 'external', url: github },
      listed: true,
    });
  }

  const linkedin = socialHref('linkedin');
  if (linkedin) {
    list.push({
      name: 'linkedin',
      aliases: [],
      descriptionKey: 'palette.commands.linkedin',
      action: { kind: 'external', url: linkedin },
      listed: true,
    });
  }

  const whatsapp = socialHref('whatsapp');
  if (whatsapp) {
    list.push({
      name: 'whatsapp',
      aliases: ['zap'],
      descriptionKey: 'palette.commands.whatsapp',
      action: { kind: 'external', url: whatsapp },
      listed: true,
    });
  }

  list.push(
    {
      name: 'tema',
      aliases: ['theme', 'dark', 'light'],
      descriptionKey: 'palette.commands.theme',
      action: { kind: 'toggle-theme' },
      listed: true,
    },
    {
      name: 'idioma',
      aliases: ['language', 'lang'],
      descriptionKey: 'palette.commands.language',
      action: { kind: 'toggle-language' },
      listed: true,
    },
    {
      name: 'sudo hire jhosue',
      aliases: ['hire', 'contratar'],
      descriptionKey: 'palette.commands.hire',
      action: { kind: 'print', outputKey: 'palette.output.hire' },
      listed: true,
    },
    {
      name: 'clear',
      aliases: ['limpar', 'cls'],
      descriptionKey: 'palette.commands.clear',
      action: { kind: 'clear' },
      listed: true,
    },
    {
      name: 'exit',
      aliases: ['sair', 'salir', 'quit'],
      descriptionKey: 'palette.commands.exit',
      action: { kind: 'close' },
      listed: true,
    },
  );

  return list;
}

export const commands: CommandDefinition[] = build();

export const listedCommands = commands.filter((command) => command.listed);

/**
 * Resolve o texto digitado para um comando.
 * Comparação sem diferenciar maiúsculas, acentos ou espaços extras.
 */
export function resolveCommand(
  input: string,
  available: CommandDefinition[] = commands,
): CommandDefinition | null {
  const normalized = normalizeCommandInput(input);
  if (!normalized) return null;
  return (
    available.find(
      (command) =>
        normalizeCommandInput(command.name) === normalized ||
        command.aliases.some((alias) => normalizeCommandInput(alias) === normalized),
    ) ?? null
  );
}

export function normalizeCommandInput(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** Filtra a lista pelo que foi digitado (busca por prefixo e por conteúdo). */
export function filterCommands(
  query: string,
  available: CommandDefinition[] = listedCommands,
): CommandDefinition[] {
  const normalized = normalizeCommandInput(query);
  if (!normalized) return available;
  return available.filter((command) => {
    const haystack = [command.name, ...command.aliases].map(normalizeCommandInput);
    return haystack.some((value) => value.includes(normalized));
  });
}
