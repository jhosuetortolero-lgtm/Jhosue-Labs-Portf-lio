import type { Project, ProjectCategory } from '../types/project';

/**
 * PROJETOS — fonte única de verdade.
 *
 * Para adicionar um projeto, copie um bloco e altere os campos.
 * - `image`: coloque o arquivo em `public/images/projects/`. Use `null` para
 *   cair no cartão gerado automaticamente (sem imagem quebrada).
 * - `status`: online | development | private
 * - `category`: WEB | SAAS | AI | AUTOMATION | CRM | API | MOBILE
 */
export const projects: Project[] = [
  {
    id: 'inovar-sertao',
    title: 'Inovar Sertão',
    category: 'WEB',
    year: '2025',
    featured: true,
    status: 'online',
    technologies: ['Astro', 'TypeScript', 'CSS', 'Cloudflare'],
    projectUrl: 'https://inovarsertao.com.br/',
    repositoryUrl: null,
    image: '/images/projects/inovar-sertao-640.webp',
    shortDescription: {
      'pt-BR':
        'Marketplace regional de materiais de construção que conecta clientes a depósitos parceiros e facilita pedidos pelo WhatsApp.',
      'en-US':
        'Regional building materials marketplace that connects customers with partner stores and streamlines orders through WhatsApp.',
      es: 'Marketplace regional de materiales de construcción que conecta clientes con tiendas asociadas y facilita pedidos por WhatsApp.',
    },
    fullDescription: {
      'pt-BR':
        'Marketplace de materiais de construção criado para exibir preços da região, localizar depósitos parceiros, calcular materiais e acompanhar pedidos até a entrega na obra.',
      'en-US':
        'Building materials marketplace designed to show regional prices, locate partner stores, calculate materials and track orders through delivery to the job site.',
      es: 'Marketplace de materiales de construcción diseñado para mostrar precios regionales, localizar tiendas asociadas, calcular materiales y seguir pedidos hasta la entrega en la obra.',
    },
    imageAlt: {
      'pt-BR': 'Página inicial do marketplace de materiais de construção Inovar Sertão',
      'en-US': 'Inovar Sertão building materials marketplace home page',
      es: 'Página de inicio del marketplace de materiales de construcción Inovar Sertão',
    },
  },
  {
    id: 'visium-system',
    title: 'Visium System',
    category: 'SAAS',
    year: '2025',
    featured: true,
    status: 'online',
    technologies: ['Golang', 'Fiber', 'PostgreSQL', 'Redis', 'React', 'Docker'],
    projectUrl: 'https://www.visiumsystem.com.br/',
    repositoryUrl: null,
    image: '/images/projects/visium-system-640.webp',
    shortDescription: {
      'pt-BR':
        'Sistema de gestão para óticas que integra vendas, estoque, ordens de serviço, laboratório, CRM e financeiro.',
      'en-US':
        'Optical store management system integrating sales, inventory, work orders, laboratory, CRM and finance.',
      es: 'Sistema de gestión para ópticas que integra ventas, inventario, órdenes de servicio, laboratorio, CRM y finanzas.',
    },
    fullDescription: {
      'pt-BR':
        'Plataforma SaaS criada para centralizar a operação de óticas, do balcão ao caixa, com vendas, clientes, estoque, laboratório, ordens de serviço e gestão financeira em tempo real.',
      'en-US':
        'SaaS platform designed to centralize optical store operations from the counter to checkout, with real-time sales, customers, inventory, laboratory, work orders and financial management.',
      es: 'Plataforma SaaS creada para centralizar la operación de ópticas, desde el mostrador hasta la caja, con ventas, clientes, inventario, laboratorio, órdenes de servicio y gestión financiera en tiempo real.',
    },
    imageAlt: {
      'pt-BR': 'Página do Visium System com painel de gestão para óticas',
      'en-US': 'Visium System page featuring an optical store management dashboard',
      es: 'Página de Visium System con panel de gestión para ópticas',
    },
  },
  {
    id: 'hub-rmc-engenharia',
    title: 'Hub RMC',
    category: 'SAAS',
    year: '2026',
    featured: true,
    status: 'online',
    technologies: [
      'Next.js',
      'TypeScript',
      'NestJS',
      'PostgreSQL',
      'Redis',
      'Prisma',
      'Docker',
    ],
    projectUrl: 'https://rmcconstrucoes.com/',
    repositoryUrl: 'https://github.com/jhosuetortolero-lgtm/hub-rmc-engenharia',
    image: '/images/projects/hub-rmc-engenharia-640.webp',
    shortDescription: {
      'pt-BR':
        'Plataforma SaaS que centraliza finanças, obras, orçamentos, CRM e automações para empresas de engenharia e construção.',
      'en-US':
        'SaaS platform that centralizes finance, projects, budgets, CRM and automation for engineering and construction companies.',
      es: 'Plataforma SaaS que centraliza finanzas, obras, presupuestos, CRM y automatizaciones para empresas de ingeniería y construcción.',
    },
    fullDescription: {
      'pt-BR':
        'O Hub RMC reúne gestão financeira, planejamento e execução de obras, compras, propostas, CRM, portais e automações em uma arquitetura multi-tenant, com integrações de WhatsApp, OCR e inteligência artificial.',
      'en-US':
        'Hub RMC brings together financial management, construction planning and execution, procurement, proposals, CRM, portals and automation in a multi-tenant architecture with WhatsApp, OCR and artificial intelligence integrations.',
      es: 'Hub RMC reúne gestión financiera, planificación y ejecución de obras, compras, propuestas, CRM, portales y automatizaciones en una arquitectura multi-tenant con integraciones de WhatsApp, OCR e inteligencia artificial.',
    },
    imageAlt: {
      'pt-BR': 'Painel de orçamento analítico do Hub RMC',
      'en-US': 'Hub RMC analytical budgeting dashboard',
      es: 'Panel de presupuesto analítico de Hub RMC',
    },
  },
];


const usedCategories = new Set<ProjectCategory>(projects.map((project) => project.category));

/** Ordem fixa dos filtros; só aparecem os que têm projeto. */
const filterOrder: ProjectCategory[] = [
  'WEB',
  'SAAS',
  'AI',
  'AUTOMATION',
  'CRM',
  'API',
  'MOBILE',
];

export const projectFilters: ProjectCategory[] = [
  'ALL',
  ...filterOrder.filter((category) => usedCategories.has(category)),
];

export const featuredProjects = projects.filter((project) => project.featured);
