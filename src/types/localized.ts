import { z } from 'zod';

/**
 * Schema de um texto traduzido nos três idiomas suportados.
 * Mantido em arquivo próprio para ser reaproveitado por todos os modelos.
 */
export const localizedSchema = z.object({
  'pt-BR': z.string().min(1),
  'en-US': z.string().min(1),
  es: z.string().min(1),
});

export type LocalizedText = z.infer<typeof localizedSchema>;
