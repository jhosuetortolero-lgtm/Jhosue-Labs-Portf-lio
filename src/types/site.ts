import { z } from 'zod';
import { localizedSchema } from './localized';
import type { Language } from './i18n';

export const serviceSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  title: localizedSchema,
  description: localizedSchema,
});

export type Service = z.infer<typeof serviceSchema>;

export const statisticSchema = z.object({
  id: z.string().min(1),
  label: localizedSchema,
  value: z.string().min(1),
  /** true quando o valor ainda é um placeholder a ser preenchido. */
  placeholder: z.boolean().optional(),
});

export type Statistic = z.infer<typeof statisticSchema>;

export const labCapabilitySchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  title: localizedSchema,
  description: localizedSchema,
});

export type LabCapability = z.infer<typeof labCapabilitySchema>;

export interface NavigationItem {
  /** Âncora de destino, sem "#". */
  id: string;
  /** Chave no dicionário de tradução. */
  labelKey: string;
}

export interface SocialLink {
  id: string;
  labelKey: string;
  href: string;
  icon: string;
  /** false quando o link ainda não foi preenchido pelo dono. */
  configured: boolean;
}

export type ThemeName = 'light' | 'dark';

export interface CommandDefinition {
  name: string;
  aliases: string[];
  descriptionKey: string;
  action:
    | { kind: 'navigate'; target: string }
    | { kind: 'external'; url: string }
    | { kind: 'toggle-theme' }
    | { kind: 'toggle-language' }
    | { kind: 'print'; outputKey: string }
    | { kind: 'clear' }
    | { kind: 'close' }
    | { kind: 'help' };
  /** Quando false o comando é escondido da lista (mas continua funcionando). */
  listed: boolean;
}

export type Dictionary = Record<string, string>;
export type Dictionaries = Record<Language, Dictionary>;
