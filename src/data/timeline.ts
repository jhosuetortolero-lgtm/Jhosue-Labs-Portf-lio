import type { TimelineItem } from '../types/timeline';

/**
 * JORNADA PROFISSIONAL.
 *
 * Os períodos marcados como [ANO] são placeholders propositais: nenhuma data,
 * empresa ou certificado foi inventado. Substitua pelos dados reais antes de
 * publicar — o site exibe o placeholder de forma visível até lá.
 */
export const timeline: TimelineItem[] = [
  {
    id: 'jhosue-labs',
    type: 'career',
    highlighted: true,
    period: { 'pt-BR': 'Atual', 'en-US': 'Current', es: 'Actual' },
    title: {
      'pt-BR': 'Programador Fullstack e Expert em IA',
      'en-US': 'Fullstack Developer and AI Expert',
      es: 'Programador Fullstack y Experto en IA',
    },
    organization: 'Jhosue Labs',
    description: {
      'pt-BR':
        'Engenharia de software aplicada a sistemas SaaS, CRMs, APIs e automações, com inteligência artificial integrada ao processo e cibersegurança na proteção de sistemas e redes.',
      'en-US':
        'Software engineering applied to SaaS systems, CRMs, APIs and automations, with artificial intelligence embedded in the process and cybersecurity protecting systems and networks.',
      es: 'Ingeniería de software aplicada a sistemas SaaS, CRMs, APIs y automatizaciones, con inteligencia artificial integrada al proceso y ciberseguridad en la protección de sistemas y redes.',
    },
  },
  {
    id: 'hub-rmc-engenharia',
    type: 'project',
    period: { 'pt-BR': '2026', 'en-US': '2026', es: '2026' },
    title: {
      'pt-BR': 'Hub RMC',
      'en-US': 'Hub RMC',
      es: 'Hub RMC',
    },
    description: {
      'pt-BR':
        'Plataforma SaaS multi-tenant para engenharia e construção: finanças, obras, orçamentos, CRM e automações com WhatsApp, OCR e IA.',
      'en-US':
        'Multi-tenant SaaS platform for engineering and construction: finance, projects, budgets, CRM and automations with WhatsApp, OCR and AI.',
      es: 'Plataforma SaaS multi-tenant para ingeniería y construcción: finanzas, obras, presupuestos, CRM y automatizaciones con WhatsApp, OCR e IA.',
    },
  },
  {
    id: 'visium',
    type: 'project',
    period: { 'pt-BR': '2025', 'en-US': '2025', es: '2025' },
    title: {
      'pt-BR': 'Visium System',
      'en-US': 'Visium System',
      es: 'Visium System',
    },
    description: {
      'pt-BR':
        'Plataforma de gestão e automação de processos com backend em Golang, PostgreSQL e Redis.',
      'en-US':
        'Process management and automation platform with a Golang backend, PostgreSQL and Redis.',
      es: 'Plataforma de gestión y automatización de procesos con backend en Golang, PostgreSQL y Redis.',
    },
  },
  {
    id: 'inovar-sertao',
    type: 'project',
    period: { 'pt-BR': '2025', 'en-US': '2025', es: '2025' },
    title: {
      'pt-BR': 'Inovar Sertão',
      'en-US': 'Inovar Sertão',
      es: 'Inovar Sertão',
    },
    description: {
      'pt-BR':
        'Projeto web institucional com foco em performance, SEO técnico e experiência em qualquer dispositivo.',
      'en-US':
        'Institutional web project focused on performance, technical SEO and experience on any device.',
      es: 'Proyecto web institucional enfocado en rendimiento, SEO técnico y experiencia en cualquier dispositivo.',
    },
  },
  {
    id: 'ai-focus',
    type: 'achievement',
    period: { 'pt-BR': '2025 — 2026', 'en-US': '2025 — 2026', es: '2025 — 2026' },
    title: {
      'pt-BR': 'Especialização em IA aplicada',
      'en-US': 'Specialization in applied AI',
      es: 'Especialización en IA aplicada',
    },
    description: {
      'pt-BR':
        'Aprofundamento em agentes, integrações com modelos de linguagem e automação de processos comerciais.',
      'en-US':
        'Deep dive into agents, language model integrations and business process automation.',
      es: 'Profundización en agentes, integraciones con modelos de lenguaje y automatización de procesos comerciales.',
    },
  },
  {
    id: 'start',
    type: 'education',
    period: { 'pt-BR': '2025', 'en-US': '2025', es: '2025' },
    title: {
      'pt-BR': 'Início na programação',
      'en-US': 'Getting started in programming',
      es: 'Inicio en la programación',
    },
    description: {
      'pt-BR':
        'Base em lógica de programação, primeiras automações com n8n e integrações que resolviam tarefas repetitivas do dia a dia.',
      'en-US':
        'Foundation in programming logic, first automations with n8n and integrations that solved everyday repetitive tasks.',
      es: 'Base en lógica de programación, primeras automatizaciones con n8n e integraciones que resolvían tareas repetitivas del día a día.',
    },
  },
];
