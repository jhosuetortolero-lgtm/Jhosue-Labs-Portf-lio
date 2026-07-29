/**
 * Monta URLs respeitando o `base` do Astro.
 * Necessário para o site funcionar tanto em domínio próprio quanto em
 * https://usuario.github.io/nome-do-repositorio/
 */
const BASE: string = import.meta.env.BASE_URL ?? '/';

export function withBase(path: string): string {
  if (/^https?:\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}

/** URL absoluta a partir do site configurado (canonical, Open Graph). */
export function absoluteUrl(path: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = siteUrl.replace(/\/+$/, '');
  const relative = withBase(path);
  return `${origin}${relative.startsWith('/') ? relative : `/${relative}`}`;
}
