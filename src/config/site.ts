/**
 * =============================================================================
 * PAINEL CENTRAL DE PERSONALIZAÇÃO — Jhosue Labs
 * =============================================================================
 * Este é o único arquivo que precisa ser editado para trocar identidade,
 * contatos, links e metadados do site. Nenhum componente repete estes valores.
 *
 * Campos entre colchetes ([INSERIR_...]) são placeholders visíveis:
 * enquanto não forem preenchidos, o site esconde o link correspondente em vez
 * de gerar um href quebrado.
 * =============================================================================
 */

import type { Language } from '../types/i18n';
import type { ThemeName } from '../types/site';

/** Marca um valor como ainda não preenchido. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || /^\[.*\]$/.test(value.trim());
}

const siteUrl = (import.meta.env.PUBLIC_SITE_URL as string | undefined) ?? 'https://jhosue-labs.example.com';

export const siteConfig = {
  // ---------------------------------------------------------------------------
  // Marca
  // ---------------------------------------------------------------------------
  brand: {
    name: 'Jhosue Labs',
    shortName: 'Jhosue Labs',
    /** Logotipo textual em duas linhas: "JHOSUE" / "LABS_" */
    logoTop: 'JHOSUE',
    logoBottom: 'LABS',
    owner: 'Jhosue',
    professionalTitle: 'Programador Fullstack, Expert em IA, Cibersegurança e Engenharia de Software',
    slogan: 'Transformando ideias em sistemas inteligentes.',
    secondarySlogan: 'Software, automação e inteligência artificial.',
  },

  // ---------------------------------------------------------------------------
  // SEO / metadados
  // ---------------------------------------------------------------------------
  seo: {
    title: 'Jhosue Labs | Software, Automação e Inteligência Artificial',
    description:
      'Portfólio da Jhosue Labs, especializada no desenvolvimento de sistemas SaaS, CRM, automações, integrações e soluções com inteligência artificial.',
    ogTitle: 'Jhosue Labs — Sistemas inteligentes para negócios',
    ogDescription:
      'Conheça os projetos e soluções desenvolvidos por Jhosue em software, inteligência artificial, SaaS, CRM e automação empresarial.',
    /** Caminho relativo a `public/`. Gere uma imagem 1200x630. */
    ogImage: '/images/social/og-jhosue-labs.svg',
    ogImageAlt: 'Jhosue Labs — software, automação e inteligência artificial',
    locale: 'pt_BR',
    type: 'website',
    /** Handle do X/Twitter, sem @. Deixe vazio para omitir a tag. */
    twitterHandle: '',
    /** Cor da barra do navegador em mobile. */
    themeColorLight: '#f4f1ea',
    themeColorDark: '#0b0f14',
  },

  siteUrl,

  // ---------------------------------------------------------------------------
  // Hero
  // ---------------------------------------------------------------------------
  hero: {
    greeting: 'Olá, eu sou Jhosue.',
    title: 'Construo sistemas que transformam ideias em resultados.',
    description:
      'Programador Fullstack e especialista em inteligência artificial, desenvolvimento de sistemas SaaS, CRM, automações e integrações para empresas que desejam crescer utilizando tecnologia.',
  },

  // ---------------------------------------------------------------------------
  // Contato — preencha antes de publicar
  // ---------------------------------------------------------------------------
  contact: {
    email: 'leadspark2025@gmail.com',
    /** Somente dígitos com DDI, ex.: 5511999999999 */
    whatsapp: '5581994401675',
    github: 'https://github.com/jhosuetortolero-lgtm',
    linkedin: 'https://www.linkedin.com/in/jhosue-tortolero-379756133/',
    instagram: '[INSERIR_INSTAGRAM]',
  },

  /**
   * Empresas do Jhosue. Alimenta os dados estruturados (JSON-LD) lidos por
   * buscadores. Os textos exibidos ficam em src/data/owner.ts e src/i18n.
   */
  ventures: [
    { name: 'Jhosue Labs', role: 'Fundador', description: null as string | null, url: siteUrl as string | null },
    { name: 'Leadspark', role: 'CEO e Fundador', description: 'Software house' as string | null, url: null as string | null },
  ],

  /**
   * Texto legal do rodapé.
   *
   * `trademarkOwner` é a empresa detentora da marca. Se o registro ainda não
   * estiver concluído no INPI, troque `registered` para false — o rodapé passa
   * a dizer apenas "uma marca de", sem afirmar registro.
   */
  legal: {
    trademarkOwner: 'Leadspark Software House',
    registered: true,
  },

  location: 'Brasil',

  /**
   * Currículo em `public/documents/`, uma versão por idioma.
   * `cvUrl` é o padrão (usado antes do JavaScript trocar pelo idioma ativo).
   */
  cvUrl: '/documents/curriculo-jhosue-pt-BR.pdf',
  cvUrls: {
    'pt-BR': '/documents/curriculo-jhosue-pt-BR.pdf',
    'en-US': '/documents/curriculo-jhosue-en-US.pdf',
    es: '/documents/curriculo-jhosue-es.pdf',
  },

  /**
   * Vídeo de destaque do Hero (mudo, em loop).
   * Quadro inteiro, sem recorte: a moldura segue a proporção do vídeo
   * (`width`/`height`). Sem áudio e com o índice no início do arquivo
   * (começa a tocar antes de baixar tudo).
   * O MP4 (H.264) vem primeiro porque toca em qualquer celular; o WebM (VP9)
   * cobre navegadores sem H.264. `poster` é o primeiro quadro: aparece
   * enquanto o vídeo carrega e quando a reprodução automática é bloqueada.
   */
  video: {
    sources: [
      { path: '/videos/jhosue-fundador-16x9.mp4', type: 'video/mp4' },
      { path: '/videos/jhosue-fundador-16x9.webm', type: 'video/webm' },
    ],
    poster: '/images/profile/jhosue-fundador-16x9-poster.webp',
    width: 1280,
    height: 720,
  },

  /** Aparece como selo de disponibilidade no hero e no contato. */
  availability: {
    open: true,
  },

  // ---------------------------------------------------------------------------
  // Idioma e tema
  // ---------------------------------------------------------------------------
  defaultLanguage: 'pt-BR' as Language,
  supportedLanguages: ['pt-BR', 'en-US', 'es'] as Language[],

  theme: {
    /** 'system' respeita o sistema operacional na primeira visita. */
    default: 'system' as ThemeName | 'system',
    allowToggle: true,
  },

  // ---------------------------------------------------------------------------
  // Chaves de armazenamento local
  // ---------------------------------------------------------------------------
  storageKeys: {
    theme: 'portfolioTheme',
    language: 'portfolioLanguage',
    boot: 'portfolioBootSeen',
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** URL de WhatsApp pronta, ou null quando não configurado. */
export function whatsappUrl(message?: string): string | null {
  const raw = siteConfig.contact.whatsapp;
  if (isPlaceholder(raw)) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

/**
 * Especialidades que passam em rotação no Hero.
 * São chaves de tradução (os textos ficam em src/i18n/*.ts).
 */
export const heroRotator = [
  'hero.rotate.saas',
  'hero.rotate.ai',
  'hero.rotate.automation',
  'hero.rotate.crm',
  'hero.rotate.api',
];

/**
 * Número de WhatsApp formatado para leitura: +55 (81) 99440-1675.
 * Devolve null quando não configurado.
 */
export function whatsappDisplay(): string | null {
  const raw = siteConfig.contact.whatsapp;
  if (isPlaceholder(raw)) return null;
  const digits = raw.replace(/\D/g, '');
  const match = digits.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return `+${digits}`;
  return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
}

/**
 * Nome de usuário a partir da URL do perfil, para exibição curta.
 * https://github.com/fulano        -> @fulano
 * https://linkedin.com/in/fulano/  -> @fulano
 */
export function profileHandle(url: string): string {
  const path = url
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .split('/');
  const handle = path[path.length - 1] ?? '';
  return handle ? `@${handle}` : url;
}

/** URL de e-mail pronta, ou null quando não configurado. */
export function mailtoUrl(subject?: string): string | null {
  const raw = siteConfig.contact.email;
  if (isPlaceholder(raw) || !raw.includes('@')) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${raw}${query}`;
}
