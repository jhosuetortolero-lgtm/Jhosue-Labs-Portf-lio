import {
  siAstro,
  siCloudflare,
  siDocker,
  siGit,
  siGithub,
  siGo,
  siJavascript,
  siLinux,
  siN8n,
  siPostgresql,
  siReact,
  siRedis,
  siTypescript,
  siVercel,
  siVite,
  siWhatsapp,
} from 'simple-icons';

/**
 * Icones das tecnologias.
 *
 * Marcas reais usam o logotipo oficial do pacote `simple-icons` (CC0), na cor
 * oficial da marca. O pacote e devDependency: o caminho do SVG e embutido no
 * HTML durante o build, entao a pagina publicada continua sem baixar nada de
 * terceiros.
 *
 * O que nao e marca (REST, WebSockets, agentes) e o que nao existe no pacote
 * (OpenAI, Fiber) usa desenho proprio, em traco, na grade 24x24.
 *
 * Todos os icones ficam sobre um selo escuro, entao a cor escolhida precisa ter
 * contraste sobre fundo quase preto — por isso alguns logotipos escuros
 * (GitHub, Vercel) trocam o preto oficial por branco.
 */
export interface TechIconDef {
  /** `brand` e preenchido; `outline` e so traco. */
  kind: 'brand' | 'outline';
  /** Um ou mais caminhos desenhados na grade 24x24. */
  paths: string[];
  /** Cor aplicada ao icone sobre o selo escuro. */
  color: string;
}

interface SimpleIcon {
  path: string;
  hex: string;
}

/** Logotipo oficial. `onDark` troca a cor quando o original some no escuro. */
function brand(icon: SimpleIcon, onDark?: string): TechIconDef {
  return { kind: 'brand', paths: [icon.path], color: onDark ?? `#${icon.hex}` };
}

/** Desenho proprio, no estilo do site. */
function outline(paths: string[], color: string): TechIconDef {
  return { kind: 'outline', paths, color };
}

export const techIcons: Record<string, TechIconDef> = {
  // --- Frontend ---------------------------------------------------------
  astro: brand(siAstro),
  react: brand(siReact),
  vite: brand(siVite, '#B77BFF'),
  typescript: brand(siTypescript, '#4B9BE8'),
  javascript: brand(siJavascript),

  // --- Backend ----------------------------------------------------------
  golang: brand(siGo),
  fiber: outline(
    ['M3 8.4c4.2 0 6.2 7.4 10.2 7.4 3 0 4.4-3.4 7.8-3.4', 'M3 13.4c3.2 0 5 4.2 8.2 4.2'],
    '#7fd0ff',
  ),
  rest: outline(['M4 8.5h13', 'm14 5.5 3 3-3 3', 'M20 15.5H7', 'm10 12.5-3 3 3 3'], '#33d68c'),
  websockets: outline(
    ['M3 12h18', 'm7.5 7.5-4.5 4.5 4.5 4.5', 'm16.5 7.5 4.5 4.5-4.5 4.5'],
    '#33d68c',
  ),

  // --- Dados ------------------------------------------------------------
  postgresql: brand(siPostgresql, '#6A8EF0'),
  redis: brand(siRedis),

  // --- IA e automacao ---------------------------------------------------
  openai: outline(
    [
      'M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4l8-4.6Z',
      'M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z',
    ],
    '#19c39c',
  ),
  'ai-agents': outline(
    [
      'M12 2.6v2.6',
      'M5.4 7.8h13.2a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2V9.8a2 2 0 0 1 2-2Z',
      'M9 13h.01',
      'M15 13h.01',
      'M10 16.4h4',
    ],
    '#ff8963',
  ),
  n8n: brand(siN8n),
  whatsapp: brand(siWhatsapp),

  // --- Infraestrutura ---------------------------------------------------
  docker: brand(siDocker, '#3AA4F0'),
  linux: brand(siLinux),
  cloudflare: brand(siCloudflare),
  vercel: brand(siVercel, '#ffffff'),
  // O logotipo oficial do GitHub Pages e um wordmark: vira borrao a 22px.
  'github-pages': outline(
    ['M6.2 3h7.6l4.2 4.2V21H6.2z', 'M13.6 3v4.4H18', 'M9.2 13h5.6', 'M9.2 16.6h4'],
    '#f0f6fc',
  ),

  // --- Ferramentas ------------------------------------------------------
  git: brand(siGit),
  github: brand(siGithub, '#f0f6fc'),
};

export function getTechIcon(id: string): TechIconDef | null {
  return techIcons[id] ?? null;
}

export function hasTechIcon(id: string): boolean {
  return id in techIcons;
}
