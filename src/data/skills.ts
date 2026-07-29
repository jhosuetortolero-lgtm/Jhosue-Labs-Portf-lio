import type { Skill } from '../types/skill';

/**
 * COMPETÊNCIAS — autoavaliação editável.
 *
 * IMPORTANTE: estes percentuais são uma leitura pessoal de domínio relativo
 * entre as áreas. NÃO representam certificação, prova técnica ou métrica
 * auditada. Ajuste os números livremente; a interface deixa isso explícito
 * para o visitante.
 */
export const skills: Skill[] = [
  {
    id: 'frontend',
    percentage: 90,
    name: { 'pt-BR': 'Frontend', 'en-US': 'Frontend', es: 'Frontend' },
  },
  {
    id: 'backend',
    percentage: 90,
    name: { 'pt-BR': 'Backend', 'en-US': 'Backend', es: 'Backend' },
  },
  {
    id: 'saas',
    percentage: 88,
    name: { 'pt-BR': 'Sistemas SaaS', 'en-US': 'SaaS systems', es: 'Sistemas SaaS' },
  },
  {
    id: 'ai',
    percentage: 90,
    name: {
      'pt-BR': 'Inteligência Artificial',
      'en-US': 'Artificial Intelligence',
      es: 'Inteligencia Artificial',
    },
  },
  {
    id: 'automation',
    percentage: 90,
    name: { 'pt-BR': 'Automação', 'en-US': 'Automation', es: 'Automatización' },
  },
  {
    id: 'databases',
    percentage: 85,
    name: { 'pt-BR': 'Bancos de dados', 'en-US': 'Databases', es: 'Bases de datos' },
  },
];
