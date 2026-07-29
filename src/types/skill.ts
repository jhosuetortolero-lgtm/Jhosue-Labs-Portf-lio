import { z } from 'zod';
import { localizedSchema } from './localized';

/**
 * Percentuais de competência são AUTOAVALIAÇÃO editável, não certificação.
 * Ajuste livremente em `src/data/skills.ts`.
 */
export const skillSchema = z.object({
  id: z.string().min(1),
  name: localizedSchema,
  /** 0 a 100 — autoavaliação, exibida como barra comparativa. */
  percentage: z.number().int().min(0).max(100),
});

export type Skill = z.infer<typeof skillSchema>;

export const TECHNOLOGY_CATEGORIES = [
  'frontend',
  'backend',
  'data',
  'ai',
  'devops',
  'tools',
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export const technologySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(TECHNOLOGY_CATEGORIES),
  /** Sigla curta usada no selo local (1 a 3 caracteres). */
  badge: z.string().min(1).max(3),
  /** Descrição curta usada como tooltip acessível. */
  note: localizedSchema,
});

export type Technology = z.infer<typeof technologySchema>;
