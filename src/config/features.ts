/**
 * Liga/desliga funcionalidades avançadas sem remover código.
 * Ao desativar, o componente e o script correspondentes não são renderizados
 * nem enviados ao navegador.
 */
export const features = {
  bootScreen: true,
  particles: true,
  commandPalette: true,
  projectFilters: true,
  languageToggle: true,
  themeToggle: true,
  contactForm: true,
  scrollProgress: true,
  animatedTerminal: true,
  /** Seção de certificados com carrossel e visualizador ampliado. */
  certificates: true,
  /** Seção de depoimentos de clientes, com carrossel e leitura completa. */
  testimonials: true,
  /**
   * Fundo animado em WebGL, com um shader diferente para cada tema.
   * Quando ligado, substitui o canvas de partículas (a grade de fundo
   * continua). Desligue para voltar ao fundo anterior.
   */
  shaderBackground: true,
} as const;

export type Features = typeof features;

/** Ajustes finos de comportamento das animações. */
export const motionConfig = {
  /** Duração máxima da tela de boot, em milissegundos. */
  bootMaxDurationMs: 3200,
  /** Intervalo entre linhas da tela de boot. */
  bootLineIntervalMs: 380,
  /** Velocidade de digitação do terminal, em ms por caractere. */
  terminalTypingMs: 18,
  /** Duração da animação dos contadores numéricos. */
  counterDurationMs: 1200,
} as const;

/** Limites das partículas de fundo. */
export const particlesConfig = {
  /** Densidade: 1 partícula a cada N pixels² (quanto maior, menos partículas). */
  areaPerParticle: 22000,
  maxParticles: 70,
  minParticles: 14,
  /** Distância máxima (px) para desenhar a linha entre duas partículas. */
  linkDistance: 130,
  speed: 0.16,
} as const;
