import { z } from 'zod';

export const certificateSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'id deve ser kebab-case'),
  /** Nome do curso, como está no certificado. Nome próprio: não é traduzido. */
  title: z.string().min(1),
  /** Instituição, escola ou plataforma que emitiu. */
  issuer: z.string().min(1),
  /** Ano ou período. Use [ANO] enquanto não confirmar. */
  year: z.string().min(1),
  /** Carga horária, opcional. Ex.: "40h" */
  workload: z.string().nullable().optional(),
  /**
   * Caminho da imagem em `public/images/certificates/`.
   * `null` mostra um cartão gerado, sem imagem quebrada.
   */
  image: z.string().min(1).nullable(),
  /** Link público de verificação da credencial, quando existir. */
  credentialUrl: z.string().url().nullable().optional(),
});

export type Certificate = z.infer<typeof certificateSchema>;
