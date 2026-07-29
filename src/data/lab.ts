import type { LabCapability } from '../types/site';

/** Capacidades exibidas na seção "Laboratório de IA e Automação". */
export const labCapabilities: LabCapability[] = [
  {
    id: 'applied-ai',
    icon: 'sparkles',
    title: {
      'pt-BR': 'IA aplicada',
      'en-US': 'Applied AI',
      es: 'IA aplicada',
    },
    description: {
      'pt-BR':
        'Modelos de linguagem conectados a dados reais da operação, com regras claras de uso e custo controlado.',
      'en-US':
        'Language models connected to real operational data, with clear usage rules and controlled cost.',
      es: 'Modelos de lenguaje conectados a datos reales de la operación, con reglas claras de uso y coste controlado.',
    },
  },
  {
    id: 'agents',
    icon: 'bot',
    title: {
      'pt-BR': 'Agentes inteligentes',
      'en-US': 'Intelligent agents',
      es: 'Agentes inteligentes',
    },
    description: {
      'pt-BR':
        'Assistentes que consultam sistemas, executam ações e devolvem resposta pronta para o time comercial ou de suporte.',
      'en-US':
        'Assistants that query systems, take actions and return ready answers for sales or support teams.',
      es: 'Asistentes que consultan sistemas, ejecutan acciones y devuelven respuestas listas para el equipo comercial o de soporte.',
    },
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    title: {
      'pt-BR': 'Integrações com WhatsApp',
      'en-US': 'WhatsApp integrations',
      es: 'Integraciones con WhatsApp',
    },
    description: {
      'pt-BR':
        'Atendimento, notificações e funis comerciais rodando na WhatsApp Business API, ligados ao CRM.',
      'en-US':
        'Support, notifications and sales funnels running on the WhatsApp Business API, connected to the CRM.',
      es: 'Atención, notificaciones y embudos comerciales sobre la API de WhatsApp Business, conectados al CRM.',
    },
  },
  {
    id: 'workflows',
    icon: 'workflow',
    title: {
      'pt-BR': 'Automação com N8N',
      'en-US': 'Automation with N8N',
      es: 'Automatización con N8N',
    },
    description: {
      'pt-BR':
        'Fluxos que integram sistemas, tratam exceções e registram cada execução para auditoria.',
      'en-US':
        'Flows that integrate systems, handle exceptions and log every run for auditing.',
      es: 'Flujos que integran sistemas, tratan excepciones y registran cada ejecución para auditoría.',
    },
  },
  {
    id: 'data',
    icon: 'database',
    title: {
      'pt-BR': 'Processamento de dados',
      'en-US': 'Data processing',
      es: 'Procesamiento de datos',
    },
    description: {
      'pt-BR':
        'Ingestão, limpeza e consolidação de dados em PostgreSQL, com cache em Redis para consultas frequentes.',
      'en-US':
        'Ingestion, cleaning and consolidation of data in PostgreSQL, with Redis cache for frequent queries.',
      es: 'Ingesta, limpieza y consolidación de datos en PostgreSQL, con caché en Redis para consultas frecuentes.',
    },
  },
  {
    id: 'infra',
    icon: 'shield',
    title: {
      'pt-BR': 'Infraestrutura e segurança',
      'en-US': 'Infrastructure and security',
      es: 'Infraestructura y seguridad',
    },
    description: {
      'pt-BR':
        'Deploy com Docker, ambientes separados, controle de acesso e monitoramento das rotinas críticas.',
      'en-US':
        'Docker-based deployment, separate environments, access control and monitoring of critical routines.',
      es: 'Despliegue con Docker, entornos separados, control de acceso y monitoreo de rutinas críticas.',
    },
  },
];

/**
 * Roteiro do terminal animado da seção Laboratório.
 * O conteúdo também existe em texto simples no HTML (ver AnimatedTerminal.astro),
 * então a informação continua acessível mesmo sem a animação.
 */
export const terminalScript = [
  { type: 'command', text: 'jhosue --profile' },
  {
    type: 'output',
    text: {
      'pt-BR': 'Programador Fullstack · Especialista em IA\nSaaS, CRM, automação e APIs',
      'en-US': 'Fullstack Developer · AI Specialist\nSaaS, CRM, automation and APIs',
      es: 'Programador Fullstack · Especialista en IA\nSaaS, CRM, automatización y APIs',
    },
  },
  { type: 'command', text: 'stack --primary' },
  {
    type: 'output',
    text: {
      'pt-BR':
        'Frontend  Astro, React, Vite, TypeScript\nBackend   Golang, Fiber\nDatabase  PostgreSQL\nCache     Redis\nAutomação N8N, WhatsApp Business API\nIA        OpenAI APIs',
      'en-US':
        'Frontend   Astro, React, Vite, TypeScript\nBackend    Golang, Fiber\nDatabase   PostgreSQL\nCache      Redis\nAutomation N8N, WhatsApp Business API\nAI         OpenAI APIs',
      es: 'Frontend   Astro, React, Vite, TypeScript\nBackend    Golang, Fiber\nDatabase   PostgreSQL\nCache      Redis\nAutomación N8N, WhatsApp Business API\nIA         OpenAI APIs',
    },
  },
  { type: 'command', text: 'availability --check' },
  {
    type: 'output',
    text: {
      'pt-BR': 'Status: disponível para novos projetos',
      'en-US': 'Status: available for new projects',
      es: 'Estado: disponible para nuevos proyectos',
    },
  },
] as const;
