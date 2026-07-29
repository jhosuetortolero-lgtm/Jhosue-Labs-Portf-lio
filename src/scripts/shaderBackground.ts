/**
 * Fundo animado em WebGL2, um shader por tema.
 *
 * Roda em TypeScript puro — sem React, sem framework. Um único canvas fixo
 * atrás de todo o conteúdo, com `pointer-events: none` e `aria-hidden`, então
 * não muda o layout, não recebe cliques e não aparece para leitores de tela.
 *
 * Desliga sozinho quando: não há WebGL2, o usuário pediu menos movimento, o
 * navegador está em economia de dados, ou o aparelho tem pouca memória.
 * Pausa quando a aba fica escondida.
 */
import { qs, on, prefersReducedMotion } from '../utils/dom';
import { LIGHT_SOURCE, DARK_SOURCE, VERTEX_SOURCE } from './shaders/sources';
import type { ThemeName } from '../types/site';

/** Quadros por segundo. 30 é suave e gasta metade do trabalho de 60. */
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

/**
 * Fator de resolução: renderiza menor e deixa o CSS esticar.
 * Fundo desfocado não perde nada com isso e economiza muito a GPU.
 */
const RESOLUTION_SCALE = 0.6;
const MAX_PIXELS = 1_600_000;

interface NavigatorWithHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

function shouldSkip(): boolean {
  if (prefersReducedMotion()) return true;
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true;
  return false;
}

function currentTheme(): ThemeName {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function initShaderBackground(): void {
  const canvas = qs<HTMLCanvasElement>('[data-shader-bg]');
  if (!canvas) return;

  if (shouldSkip()) {
    canvas.remove();
    return;
  }

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
    // Sem preservar o buffer: o navegador pode descartar entre quadros.
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    // Sem WebGL2 o site segue normal, só sem o fundo.
    canvas.remove();
    return;
  }

  let program: WebGLProgram | null = null;
  let uResolution: WebGLUniformLocation | null = null;
  let uTime: WebGLUniformLocation | null = null;
  let frame = 0;
  let lastDraw = 0;
  let paused = false;
  let width = 0;
  let height = 0;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);

  function compile(type: number, source: string): WebGLShader | null {
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Um shader quebrado não pode derrubar a página.
      console.warn('shader background:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /** Compila e passa a usar o shader do tema indicado. */
  function useShader(theme: ThemeName): boolean {
    if (!gl) return false;

    const vertex = compile(gl.VERTEX_SHADER, VERTEX_SOURCE);
    const fragment = compile(gl.FRAGMENT_SHADER, theme === 'dark' ? DARK_SOURCE : LIGHT_SOURCE);
    if (!vertex || !fragment) return false;

    const next = gl.createProgram();
    if (!next) return false;

    gl.attachShader(next, vertex);
    gl.attachShader(next, fragment);
    gl.linkProgram(next);

    if (!gl.getProgramParameter(next, gl.LINK_STATUS)) {
      console.warn('shader background:', gl.getProgramInfoLog(next));
      gl.deleteProgram(next);
      return false;
    }

    if (program) gl.deleteProgram(program);
    program = next;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uResolution = gl.getUniformLocation(program, 'resolution');
    uTime = gl.getUniformLocation(program, 'time');

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    canvas?.setAttribute('data-shader-theme', theme);
    return true;
  }

  function resize(): void {
    if (!gl || !canvas) return;

    let w = Math.floor(window.innerWidth * RESOLUTION_SCALE);
    let h = Math.floor(window.innerHeight * RESOLUTION_SCALE);

    // Teto de pixels: telas enormes não viram fornalha.
    const pixels = w * h;
    if (pixels > MAX_PIXELS) {
      const factor = Math.sqrt(MAX_PIXELS / pixels);
      w = Math.floor(w * factor);
      h = Math.floor(h * factor);
    }

    if (w === width && h === height) return;

    width = w;
    height = h;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  function draw(now: number): void {
    frame = window.requestAnimationFrame(draw);
    if (paused || !gl || !program) return;

    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;

    gl.useProgram(program);
    if (uResolution) gl.uniform2f(uResolution, width, height);
    if (uTime) gl.uniform1f(uTime, now * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  if (!useShader(currentTheme())) {
    canvas.remove();
    return;
  }

  resize();
  canvas.dataset.shaderReady = 'true';
  frame = window.requestAnimationFrame(draw);

  // --- Reagir ao ambiente ---------------------------------------------------

  let resizeTimer = 0;
  on(
    window,
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 200);
    },
    { passive: true },
  );

  on(document, 'visibilitychange', () => {
    paused = document.hidden;
  });

  // Troca o shader quando o tema muda: é observando o atributo do <html>
  // que funcionamos tanto pelo botão quanto pelo comando "tema" da paleta.
  const observer = new MutationObserver(() => {
    const theme = currentTheme();
    if (canvas.getAttribute('data-shader-theme') === theme) return;
    useShader(theme);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  window.addEventListener(
    'pagehide',
    () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    },
    { once: true },
  );
}
