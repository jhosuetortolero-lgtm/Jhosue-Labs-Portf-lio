import type { Statistic } from '../types/site';
import { siteConfig } from '../config/site';
import { projects } from './projects';

/**
 * Perfil profissional. Textos longos ficam aqui, traduzidos nos 3 idiomas.
 */
export const owner = {
  name: siteConfig.brand.owner,
  displayName: siteConfig.brand.owner,
  professionalTitle: siteConfig.brand.professionalTitle,
  location: siteConfig.location,

  bio: [
    {
      'pt-BR':
        'Sou Jhosue, fundador da Jhosue Labs e CEO e fundador da Leadspark, uma software house. Trabalho com desenvolvimento fullstack e inteligência artificial aplicada, criando sistemas que resolvem problemas reais de operação: plataformas SaaS, CRMs, integrações e automações que tiram o trabalho repetitivo do caminho das equipes.',
      'en-US':
        'I am Jhosue, founder of Jhosue Labs and CEO and founder of Leadspark, a software house. I work with fullstack development and applied artificial intelligence, building systems that solve real operational problems: SaaS platforms, CRMs, integrations and automations that take repetitive work off the team.',
      es: 'Soy Jhosue, fundador de Jhosue Labs y CEO y fundador de Leadspark, una software house. Trabajo con desarrollo fullstack e inteligencia artificial aplicada, creando sistemas que resuelven problemas reales de operación: plataformas SaaS, CRMs, integraciones y automatizaciones que sacan el trabajo repetitivo del camino de los equipos.',
    },
    {
      'pt-BR':
        'No frontend uso Astro, React, Vite e TypeScript com foco em performance e acessibilidade. No backend, Golang com Fiber, PostgreSQL e Redis, expostos por APIs REST e WebSockets. Para automação e IA, combino N8N, WhatsApp Business API e APIs da OpenAI em fluxos que rodam sem supervisão. Também tenho formação em cibersegurança, com prática em defesa cibernética, proteção de sistemas e redes e mitigação de vulnerabilidades.',
      'en-US':
        'On the frontend I use Astro, React, Vite and TypeScript with a focus on performance and accessibility. On the backend, Golang with Fiber, PostgreSQL and Redis, exposed through REST APIs and WebSockets. For automation and AI, I combine N8N, the WhatsApp Business API and OpenAI APIs into flows that run unattended. I am also trained in cybersecurity, with hands-on practice in cyber defence, system and network protection and vulnerability mitigation.',
      es: 'En el frontend uso Astro, React, Vite y TypeScript con foco en rendimiento y accesibilidad. En el backend, Golang con Fiber, PostgreSQL y Redis, expuestos mediante APIs REST y WebSockets. Para automatización e IA, combino N8N, la API de WhatsApp Business y las APIs de OpenAI en flujos que funcionan sin supervisión. También tengo formación en ciberseguridad, con práctica en defensa cibernética, protección de sistemas y redes y mitigación de vulnerabilidades.',
    },
    {
      'pt-BR':
        'Meu jeito de trabalhar é direto: entender a operação antes de escrever código, entregar em etapas curtas, medir o resultado e manter tudo documentado para o time do cliente conseguir tocar sozinho depois.',
      'en-US':
        'The way I work is straightforward: understand the operation before writing code, deliver in short increments, measure the outcome and keep everything documented so the client team can run it on their own afterwards.',
      es: 'Mi forma de trabajar es directa: entender la operación antes de escribir código, entregar en etapas cortas, medir el resultado y mantener todo documentado para que el equipo del cliente pueda continuar por su cuenta.',
    },
  ],

  /** Diferenciais listados na seção Sobre. */
  highlights: [
    {
      'pt-BR': 'Arquitetura pensada para escalar desde o primeiro cliente.',
      'en-US': 'Architecture designed to scale from the very first customer.',
      es: 'Arquitectura pensada para escalar desde el primer cliente.',
    },
    {
      'pt-BR': 'IA aplicada a processo real, não a demonstração.',
      'en-US': 'AI applied to real processes, not to demos.',
      es: 'IA aplicada a procesos reales, no a demostraciones.',
    },
    {
      'pt-BR': 'Automação que reduz trabalho manual e erro humano.',
      'en-US': 'Automation that reduces manual work and human error.',
      es: 'Automatización que reduce trabajo manual y error humano.',
    },
    {
      'pt-BR': 'Entrega documentada e pronta para o time assumir.',
      'en-US': 'Documented delivery, ready for the team to take over.',
      es: 'Entrega documentada y lista para que el equipo la asuma.',
    },
    {
      'pt-BR': 'Cibersegurança aplicada: sistemas e redes protegidos desde o projeto.',
      'en-US': 'Applied cybersecurity: systems and networks protected from the design stage.',
      es: 'Ciberseguridad aplicada: sistemas y redes protegidos desde el diseño.',
    },
  ],

  languages: [
    { name: 'Português', level: { 'pt-BR': 'Nativo', 'en-US': 'Native', es: 'Nativo' } },
    { name: 'Español', level: { 'pt-BR': 'Nativo', 'en-US': 'Native', es: 'Nativo' } },
    { name: 'English', level: { 'pt-BR': 'Técnico', 'en-US': 'Technical', es: 'Técnico' } },
  ],
} as const;

/**
 * Indicadores da seção Sobre.
 * `placeholder: true` faz o site exibir o valor como pendente, em vez de
 * apresentar um número inventado como fato.
 */
export const statistics: Statistic[] = [
  {
    // Conta os projetos publicados no site: aumenta sozinho quando você
    // adiciona um bloco novo em src/data/projects.ts.
    id: 'projects',
    value: String(projects.length),
    label: {
      'pt-BR': 'Projetos desenvolvidos',
      'en-US': 'Projects delivered',
      es: 'Proyectos desarrollados',
    },
  },
  {
    id: 'technologies',
    value: '20+',
    label: {
      'pt-BR': 'Tecnologias utilizadas',
      'en-US': 'Technologies used',
      es: 'Tecnologías utilizadas',
    },
  },
  {
    id: 'languages',
    value: '3',
    label: { 'pt-BR': 'Idiomas', 'en-US': 'Languages', es: 'Idiomas' },
  },
  {
    id: 'focus',
    value: 'SaaS + IA',
    label: { 'pt-BR': 'Foco', 'en-US': 'Focus', es: 'Enfoque' },
  },
];
