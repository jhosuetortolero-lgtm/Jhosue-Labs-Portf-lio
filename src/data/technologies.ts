import type { Technology, TechnologyCategory } from '../types/skill';

/**
 * TECNOLOGIAS.
 *
 * Os selos são gerados localmente a partir do campo `badge` (sem baixar
 * logotipos de terceiros e sem requisições externas). Se quiser usar o
 * logotipo oficial de alguma tecnologia, coloque o SVG em
 * `public/icons/technologies/<id>.svg` — o componente usa o arquivo
 * automaticamente quando ele existir.
 */
export const technologies: Technology[] = [
  // frontend
  { id: 'astro', name: 'Astro', category: 'frontend', badge: 'AS', note: n('Framework do site, geração estática', 'Site framework, static generation', 'Framework del sitio, generación estática') },
  { id: 'react', name: 'React', category: 'frontend', badge: 'RE', note: n('Interfaces com estado complexo', 'Interfaces with complex state', 'Interfaces con estado complejo') },
  { id: 'vite', name: 'Vite', category: 'frontend', badge: 'VI', note: n('Build e desenvolvimento rápido', 'Fast build and dev server', 'Build y desarrollo rápido') },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', badge: 'TS', note: n('Tipagem estrita em todo o projeto', 'Strict typing across the project', 'Tipado estricto en todo el proyecto') },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', badge: 'JS', note: n('Interações nativas, sem framework', 'Native interactions, no framework', 'Interacciones nativas, sin framework') },

  // backend
  { id: 'golang', name: 'Golang', category: 'backend', badge: 'GO', note: n('Serviços de alta performance', 'High performance services', 'Servicios de alto rendimiento') },
  { id: 'fiber', name: 'Fiber', category: 'backend', badge: 'FB', note: n('Framework HTTP em Go', 'HTTP framework for Go', 'Framework HTTP en Go') },
  { id: 'rest', name: 'APIs REST', category: 'backend', badge: 'API', note: n('Contratos previsíveis e versionados', 'Predictable, versioned contracts', 'Contratos predecibles y versionados') },
  { id: 'websockets', name: 'WebSockets', category: 'backend', badge: 'WS', note: n('Comunicação em tempo real', 'Real time communication', 'Comunicación en tiempo real') },

  // dados
  { id: 'postgresql', name: 'PostgreSQL', category: 'data', badge: 'PG', note: n('Banco relacional principal', 'Main relational database', 'Base relacional principal') },
  { id: 'redis', name: 'Redis', category: 'data', badge: 'RD', note: n('Cache, filas e sessões', 'Cache, queues and sessions', 'Caché, colas y sesiones') },

  // ia e automação
  { id: 'openai', name: 'OpenAI', category: 'ai', badge: 'AI', note: n('Modelos de linguagem em produção', 'Language models in production', 'Modelos de lenguaje en producción') },
  { id: 'ai-agents', name: 'Agentes de IA', category: 'ai', badge: 'AG', note: n('Assistentes com ferramentas e memória', 'Assistants with tools and memory', 'Asistentes con herramientas y memoria') },
  { id: 'n8n', name: 'N8N', category: 'ai', badge: 'N8', note: n('Orquestração de automações', 'Automation orchestration', 'Orquestación de automatizaciones') },
  { id: 'whatsapp', name: 'WhatsApp Business API', category: 'ai', badge: 'WA', note: n('Atendimento e notificações', 'Support and notifications', 'Atención y notificaciones') },

  // infraestrutura
  { id: 'docker', name: 'Docker', category: 'devops', badge: 'DK', note: n('Ambientes reproduzíveis', 'Reproducible environments', 'Entornos reproducibles') },
  { id: 'linux', name: 'Linux', category: 'devops', badge: 'LX', note: n('Servidores e automação de rotina', 'Servers and routine automation', 'Servidores y automatización') },
  { id: 'cloudflare', name: 'Cloudflare', category: 'devops', badge: 'CF', note: n('CDN, DNS e proteção', 'CDN, DNS and protection', 'CDN, DNS y protección') },
  { id: 'vercel', name: 'Vercel', category: 'devops', badge: 'VC', note: n('Deploy de frontends', 'Frontend deployment', 'Despliegue de frontends') },
  { id: 'github-pages', name: 'GitHub Pages', category: 'devops', badge: 'GP', note: n('Hospedagem estática', 'Static hosting', 'Alojamiento estático') },

  // ferramentas
  { id: 'git', name: 'Git', category: 'tools', badge: 'GT', note: n('Versionamento e revisão', 'Versioning and review', 'Versionado y revisión') },
  { id: 'github', name: 'GitHub', category: 'tools', badge: 'GH', note: n('Colaboração e CI/CD', 'Collaboration and CI/CD', 'Colaboración y CI/CD') },
];

function n(pt: string, en: string, es: string) {
  return { 'pt-BR': pt, 'en-US': en, es };
}

export const technologyCategoryLabels: Record<
  TechnologyCategory,
  { 'pt-BR': string; 'en-US': string; es: string }
> = {
  frontend: n('Frontend', 'Frontend', 'Frontend'),
  backend: n('Backend', 'Backend', 'Backend'),
  data: n('Dados', 'Data', 'Datos'),
  ai: n('IA e automação', 'AI and automation', 'IA y automatización'),
  devops: n('Infraestrutura', 'Infrastructure', 'Infraestructura'),
  tools: n('Ferramentas', 'Tools', 'Herramientas'),
};
