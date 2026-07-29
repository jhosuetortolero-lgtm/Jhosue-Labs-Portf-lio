import type { Service } from '../types/site';

/**
 * SERVIÇOS oferecidos. `icon` referencia um ícone de `src/components/common/Icon.astro`.
 */
export const services: Service[] = [
  {
    id: 'systems',
    icon: 'code',
    title: {
      'pt-BR': 'Desenvolvimento de Sistemas',
      'en-US': 'Custom System Development',
      es: 'Desarrollo de Sistemas',
    },
    description: {
      'pt-BR': 'Sistemas web completos, escaláveis e estruturados para empresas.',
      'en-US': 'Complete, scalable and well-structured web systems for companies.',
      es: 'Sistemas web completos, escalables y estructurados para empresas.',
    },
  },
  {
    id: 'saas',
    icon: 'layers',
    title: { 'pt-BR': 'Plataformas SaaS', 'en-US': 'SaaS Platforms', es: 'Plataformas SaaS' },
    description: {
      'pt-BR':
        'Produtos digitais com arquitetura multiempresa, planos e gestão de usuários.',
      'en-US': 'Digital products with multi-tenant architecture, plans and user management.',
      es: 'Productos digitales con arquitectura multiempresa, planes y gestión de usuarios.',
    },
  },
  {
    id: 'ai',
    icon: 'sparkles',
    title: {
      'pt-BR': 'Inteligência Artificial',
      'en-US': 'Artificial Intelligence',
      es: 'Inteligencia Artificial',
    },
    description: {
      'pt-BR': 'Agentes, assistentes, automações e integrações inteligentes.',
      'en-US': 'Agents, assistants, automations and intelligent integrations.',
      es: 'Agentes, asistentes, automatizaciones e integraciones inteligentes.',
    },
  },
  {
    id: 'crm',
    icon: 'chat',
    title: { 'pt-BR': 'CRM e WhatsApp', 'en-US': 'CRM and WhatsApp', es: 'CRM y WhatsApp' },
    description: {
      'pt-BR':
        'Sistemas de atendimento, funis comerciais e automações integradas ao WhatsApp.',
      'en-US': 'Support systems, sales funnels and automations integrated with WhatsApp.',
      es: 'Sistemas de atención, embudos comerciales y automatizaciones integradas a WhatsApp.',
    },
  },
  {
    id: 'api',
    icon: 'plug',
    title: {
      'pt-BR': 'APIs e Integrações',
      'en-US': 'APIs and Integrations',
      es: 'APIs e Integraciones',
    },
    description: {
      'pt-BR': 'APIs REST, WebSockets, gateways de pagamento e serviços externos.',
      'en-US': 'REST APIs, WebSockets, payment gateways and third-party services.',
      es: 'APIs REST, WebSockets, pasarelas de pago y servicios externos.',
    },
  },
  {
    id: 'automation',
    icon: 'workflow',
    title: {
      'pt-BR': 'Automação de Processos',
      'en-US': 'Process Automation',
      es: 'Automatización de Procesos',
    },
    description: {
      'pt-BR': 'Automação de tarefas operacionais com N8N, APIs e inteligência artificial.',
      'en-US': 'Automation of operational tasks with N8N, APIs and artificial intelligence.',
      es: 'Automatización de tareas operativas con N8N, APIs e inteligencia artificial.',
    },
  },
];
