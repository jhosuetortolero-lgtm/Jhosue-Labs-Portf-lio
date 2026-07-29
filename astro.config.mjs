// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Ajuste estes dois valores ao publicar.
 *
 * - SITE: URL absoluta final (usada em canonical, Open Graph e sitemap).
 * - BASE: "/" para domínio próprio, Cloudflare Pages, Netlify e Vercel.
 *         "/nome-do-repositorio/" quando publicado em usuario.github.io/nome-do-repositorio/
 *
 * Ambos podem vir do ambiente para não precisar editar o arquivo no CI.
 */
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://jhosue-labs.example.com';
const BASE = process.env.PUBLIC_BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    // 8085 é usada por outro projeto nesta máquina.
    port: 8090,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
});
