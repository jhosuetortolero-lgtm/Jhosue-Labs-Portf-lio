import { z } from 'zod';
import { localizedSchema } from './localized';

export const PROJECT_CATEGORIES = [
  'ALL',
  'WEB',
  'SAAS',
  'AI',
  'AUTOMATION',
  'CRM',
  'API',
  'MOBILE',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectStatus = 'online' | 'development' | 'private';

export const projectSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'id deve ser kebab-case'),
  title: z.string().min(1),
  shortDescription: localizedSchema,
  fullDescription: localizedSchema.optional(),
  category: z.enum(PROJECT_CATEGORIES).exclude(['ALL']),
  technologies: z.array(z.string().min(1)).min(1),
  projectUrl: z.string().url().nullable().optional(),
  repositoryUrl: z.string().url().nullable().optional(),
  image: z.string().min(1).nullable().optional(),
  imageAlt: localizedSchema,
  featured: z.boolean(),
  status: z.enum(['online', 'development', 'private']),
  year: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
