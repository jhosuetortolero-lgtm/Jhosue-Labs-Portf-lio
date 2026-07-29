import { z } from 'zod';
import { localizedSchema } from './localized';

export const TIMELINE_TYPES = ['career', 'education', 'project', 'achievement'] as const;

export type TimelineType = (typeof TIMELINE_TYPES)[number];

export const timelineItemSchema = z.object({
  id: z.string().min(1),
  /** Período livre: "Atual", "2024 — 2025", "[ANO]" enquanto não confirmado. */
  period: localizedSchema,
  title: localizedSchema,
  organization: z.string().optional(),
  description: localizedSchema,
  type: z.enum(TIMELINE_TYPES),
  highlighted: z.boolean().optional(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
