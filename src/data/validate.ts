/**
 * Validação do conteúdo em tempo de BUILD.
 *
 * Este módulo é importado apenas no frontmatter do layout (lado servidor),
 * então o `zod` nunca entra no bundle enviado ao navegador.
 * Se algum arquivo de `src/data` ficar inconsistente, o build quebra aqui
 * com a mensagem exata do campo errado.
 */
import { z } from 'zod';

import { projectSchema } from '../types/project';
import { skillSchema, technologySchema } from '../types/skill';
import { timelineItemSchema } from '../types/timeline';
import { labCapabilitySchema, serviceSchema, statisticSchema } from '../types/site';
import { localizedSchema } from '../types/localized';
import { certificateSchema } from '../types/certificate';
import { certificates } from './certificates';
import { testimonialSchema } from '../types/testimonial';
import { testimonials } from './testimonials';

import { projects } from './projects';
import { services } from './services';
import { skills } from './skills';
import { technologies } from './technologies';
import { timeline } from './timeline';
import { labCapabilities } from './lab';
import { owner, statistics } from './owner';

let validated = false;

export function validateContent(): void {
  if (validated) return;

  z.array(projectSchema).parse(projects);
  z.array(serviceSchema).parse(services);
  z.array(skillSchema).parse(skills);
  z.array(technologySchema).parse(technologies);
  z.array(timelineItemSchema).parse(timeline);
  z.array(labCapabilitySchema).parse(labCapabilities);
  z.array(statisticSchema).parse(statistics);
  z.array(certificateSchema).parse(certificates);
  z.array(testimonialSchema).parse(testimonials);
  z.array(localizedSchema).parse(owner.bio);
  z.array(localizedSchema).parse(owner.highlights);
  z.array(localizedSchema).parse(owner.languages.map((item) => item.level));

  // ids únicos evitam colisão nas chaves de tradução geradas.
  const ids = projects.map((project) => project.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('src/data/projects.ts: existem ids repetidos.');
  }

  const certificateIds = certificates.map((certificate) => certificate.id);
  if (new Set(certificateIds).size !== certificateIds.length) {
    throw new Error('src/data/certificates.ts: existem ids repetidos.');
  }

  const testimonialIds = testimonials.map((testimonial) => testimonial.id);
  if (new Set(testimonialIds).size !== testimonialIds.length) {
    throw new Error('src/data/testimonials.ts: existem ids repetidos.');
  }

  validated = true;
}
