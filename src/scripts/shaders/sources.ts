/**
 * Fontes GLSL dos fundos animados (WebGL2).
 *
 * São dois planos de fundo, um por tema. Rodam em um único canvas atrás de
 * todo o conteúdo, sem capturar eventos e sem interferir no layout.
 */

/** Vertex shader: desenha um retângulo que cobre a tela inteira. */
export const VERTEX_SOURCE = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

/** Ruído compartilhado pelos dois fragment shaders. */
const NOISE = `
float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  float a = rnd(i),
        b = rnd(i + vec2(1, 0)),
        c = rnd(i + vec2(0, 1)),
        d = rnd(i + 1.);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}`;

/**
 * TEMA ESCURO — nebulosa em movimento.
 *
 * Baseado no shader "clouds/nebula" de Matthias Hurrle (@atzedent),
 * adaptado para este projeto: uniforms de ponteiro removidos, número de
 * camadas reduzido e paleta puxada para o verde da marca.
 */
export const DARK_SOURCE = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x, R.y)
${NOISE}

float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 4; i++) {
    t += a * noise(p);
    p *= 2. * m;
    a *= .5;
  }
  return t;
}

float clouds(vec2 p) {
  float d = 1., t = .0;
  for (float i = .0; i < 3.; i++) {
    float a = d * fbm(i * 10. + p.x * .2 + .2 * (1. + i) * p.y + d + i * i + p);
    t = mix(t, d, a);
    d = a;
    p *= 2. / (i + 1.);
  }
  return t;
}

void main(void) {
  vec2 uv = (FC - .5 * R) / MN, st = uv * vec2(2, 1);
  vec3 col = vec3(0);
  float bg = clouds(vec2(st.x + T * .35, -st.y));

  uv *= 1. - .3 * (sin(T * .18) * .5 + .5);

  for (float i = 1.; i < 9.; i++) {
    uv += .1 * cos(i * vec2(.1 + .01 * i, .8) + i * i + T * .4 + .1 * uv.x);
    vec2 p = uv;
    float d = length(p);
    // Paleta puxada para o verde/ciano da marca.
    col += .0012 / d * (cos(sin(i) * vec3(2.2, 1.0, 1.6)) + 1.);
    float b = noise(i + p + bg * 1.731);
    col += .0018 * b / length(max(p, vec2(b * p.x * .02, p.y)));
    col = mix(col, vec3(bg * .10, bg * .22, bg * .17), d);
  }

  O = vec4(col, 1);
}`;

/**
 * TEMA CLARO — malha de cores suaves (mesh gradient) em movimento.
 *
 * Escrito para este projeto, usando os tokens da identidade: base creme,
 * com manchas de verde, violeta e coral passeando devagar.
 */
export const LIGHT_SOURCE = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
${NOISE}

float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    t += a * noise(p);
    p = m * p;
    a *= .5;
  }
  return t;
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = uv * 2. - 1.;
  p.x *= resolution.x / resolution.y;

  float t = time * .05;

  // Três manchas que passeiam em ritmos diferentes.
  vec2 c1 = vec2(sin(t * 1.10) * .62, cos(t * 0.90) * .42);
  vec2 c2 = vec2(cos(t * 0.70) * .74, sin(t * 1.30) * .52);
  vec2 c3 = vec2(sin(t * 0.50 + 2.) * .54, cos(t * 0.60 + 1.) * .64);

  float n = fbm(p * 1.35 + t);

  float d1 = smoothstep(1.15, .0, length(p - c1) + n * .26);
  float d2 = smoothstep(1.25, .0, length(p - c2) + n * .22);
  float d3 = smoothstep(1.05, .0, length(p - c3) + n * .30);

  vec3 col = vec3(.957, .945, .914);            // creme da base
  col = mix(col, vec3(.129, .753, .478), d1 * .34);  // verde da marca
  col = mix(col, vec3(.420, .294, 1.00), d2 * .17);  // violeta
  col = mix(col, vec3(1.00, .416, .239), d3 * .14);  // coral

  // Grão bem leve, para não ficar "plástico".
  col += (rnd(uv * resolution + t) - .5) * .012;

  O = vec4(col, 1.);
}`;
