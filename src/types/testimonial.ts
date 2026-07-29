import { z } from 'zod';

export const testimonialSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'id deve ser kebab-case'),
  /** Nome de quem escreveu. */
  author: z.string().min(1),
  /** Empresa, grupo ou plataforma onde o trabalho aconteceu. */
  company: z.string().min(1).nullable().optional(),
  /** Onde o depoimento foi publicado (99Freelas, LinkedIn, e-mail…). */
  source: z.string().min(1),
  /** Nome do serviço prestado. */
  project: z.string().min(1),
  /** Período do trabalho, como aparece na origem. */
  period: z.string().min(1),
  /** Nota de 0 a 5. Use null quando a origem não dá nota. */
  rating: z.number().min(0).max(5).nullable(),
  /**
   * Texto do depoimento, exatamente como o cliente escreveu.
   * NÃO editar nem traduzir: é uma citação.
   */
  quote: z.string().min(20),
  /** Print do depoimento original, para comprovar. */
  proofImage: z.string().min(1).nullable().optional(),
  /** Link público do depoimento, quando existir. */
  sourceUrl: z.string().url().nullable().optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
