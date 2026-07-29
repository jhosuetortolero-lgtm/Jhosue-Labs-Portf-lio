import { ptBR } from './pt-BR';
import { enUS } from './en-US';
import { es } from './es';
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from '../types/i18n';
import type { Dictionaries, Dictionary } from '../types/site';
import type { LocalizedText } from '../types/localized';

import { projects } from '../data/projects';
import { services } from '../data/services';
import { skills } from '../data/skills';
import { technologies, technologyCategoryLabels } from '../data/technologies';
import { timeline } from '../data/timeline';
import { labCapabilities, terminalScript } from '../data/lab';
import { owner, statistics } from '../data/owner';

const uiDictionaries: Record<Language, unknown> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  es,
};

/** Transforma { a: { b: 'x' } } em { 'a.b': 'x' }. */
function flatten(source: unknown, prefix = '', target: Dictionary = {}): Dictionary {
  if (typeof source !== 'object' || source === null) return target;
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      target[path] = value;
    } else if (typeof value === 'object' && value !== null) {
      flatten(value, path, target);
    }
  }
  return target;
}

/**
 * Registra um texto traduzido do `src/data` em todas as línguas de uma vez.
 * É isto que evita duplicar conteúdo entre componentes e traduções.
 */
function put(dicts: Dictionaries, key: string, value: LocalizedText): void {
  for (const language of LANGUAGES) {
    dicts[language][key] = value[language];
  }
}

function buildDictionaries(): Dictionaries {
  const dicts = Object.fromEntries(
    LANGUAGES.map((language) => [language, flatten(uiDictionaries[language])]),
  ) as Dictionaries;

  for (const project of projects) {
    put(dicts, `project.${project.id}.short`, project.shortDescription);
    if (project.fullDescription) {
      put(dicts, `project.${project.id}.full`, project.fullDescription);
    }
    put(dicts, `project.${project.id}.imageAlt`, project.imageAlt);
  }

  for (const service of services) {
    put(dicts, `service.${service.id}.title`, service.title);
    put(dicts, `service.${service.id}.description`, service.description);
  }

  for (const capability of labCapabilities) {
    put(dicts, `lab.capability.${capability.id}.title`, capability.title);
    put(dicts, `lab.capability.${capability.id}.description`, capability.description);
  }

  terminalScript.forEach((entry, index) => {
    if (typeof entry.text !== 'string') {
      put(dicts, `lab.terminal.${index}`, entry.text);
    }
  });

  for (const skill of skills) {
    put(dicts, `skill.${skill.id}.name`, skill.name);
  }

  for (const technology of technologies) {
    put(dicts, `tech.${technology.id}.note`, technology.note);
  }

  for (const [category, label] of Object.entries(technologyCategoryLabels)) {
    put(dicts, `techCategory.${category}`, label);
  }

  for (const item of timeline) {
    put(dicts, `timeline.${item.id}.period`, item.period);
    put(dicts, `timeline.${item.id}.title`, item.title);
    put(dicts, `timeline.${item.id}.description`, item.description);
  }

  for (const statistic of statistics) {
    put(dicts, `stat.${statistic.id}.label`, statistic.label);
  }

  owner.bio.forEach((paragraph, index) => put(dicts, `owner.bio.${index}`, paragraph));
  owner.highlights.forEach((item, index) => put(dicts, `owner.highlight.${index}`, item));
  owner.languages.forEach((item, index) =>
    put(dicts, `owner.language.${index}.level`, item.level),
  );

  return dicts;
}

export const dictionaries: Dictionaries = buildDictionaries();

/**
 * Busca uma tradução. Cai para o idioma padrão e, em último caso,
 * devolve a própria chave (facilita achar tradução faltando).
 */
export function t(language: Language, key: string): string {
  return dictionaries[language][key] ?? dictionaries[DEFAULT_LANGUAGE][key] ?? key;
}

/** Versão pré-ligada a um idioma, usada nos componentes Astro. */
export function useTranslations(language: Language) {
  return (key: string): string => t(language, key);
}

export { DEFAULT_LANGUAGE, LANGUAGES };
export type { Language };
