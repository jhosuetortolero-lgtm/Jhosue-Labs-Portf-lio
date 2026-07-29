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
    image: null,
    shortDescription: {
      'pt-BR':
        'Projeto web institucional com foco em experiência, performance e apresentação da marca.',
      'en-US':
        'Institutional web project focused on experience, performance and brand presentation.',
      es: 'Proyecto web institucional enfocado en experiencia, rendimiento y presentación de marca.',
    },
    fullDescription: {
      'pt-BR':
        'Site institucional construído para carregar rápido em conexões instáveis, com conteúdo estruturado, SEO técnico e navegação simples em qualquer tamanho de tela.',
      'en-US':
        'Institutional website built to load fast on unstable connections, with structured content, technical SEO and simple navigation on any screen size.',
      es: 'Sitio institucional construido para cargar rápido en conexiones inestables, con contenido estructurado, SEO técnico y navegación simple en cualquier tamaño de pantalla.',
    },
    imageAlt: {
      'pt-BR': 'Página inicial do projeto Inovar Sertão',
      'en-US': 'Home page of the Inovar Sertão project',
      es: 'Página de inicio del proyecto Inovar Sertão',
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
    image: null,
    shortDescription: {
      'pt-BR':
        'Sistema para gestão, automação e otimização de processos operacionais.',
      'en-US': 'System for managing, automating and optimizing operational processes.',
      es: 'Sistema para gestión, automatización y optimización de procesos operativos.',
    },
    fullDescription: {
      'pt-BR':
        'Plataforma de gestão com backend em Golang, banco PostgreSQL, cache em Redis e interface web. Cobre cadastro, acompanhamento de processos e automação das rotinas repetitivas da operação.',
      'en-US':
        'Management platform with a Golang backend, PostgreSQL database, Redis cache and a web interface. It covers records, process tracking and automation of repetitive operational routines.',
      es: 'Plataforma de gestión con backend en Golang, base PostgreSQL, caché en Redis e interfaz web. Cubre registros, seguimiento de procesos y automatización de rutinas repetitivas.',
    },
    imageAlt: {
      'pt-BR': 'Painel do sistema Visium System',
      'en-US': 'Visium System dashboard',
      es: 'Panel del sistema Visium System',
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
