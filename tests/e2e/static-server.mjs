/**
 * Servidor estático mínimo para os testes end-to-end.
 *
 * Carrega todo o `dist/` em memória na inicialização — sem depender de leitura
 * de disco a cada requisição (o projeto pode estar em uma pasta sincronizada,
 * o que deixa o servidor de preview lento e derruba os testes por timeout).
 *
 * Uso: node tests/e2e/static-server.mjs [porta]
 */
import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('../../', import.meta.url)), 'dist');
const PORT = Number(process.argv[2] ?? 8099);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
};

/** caminho de URL -> Buffer */
const files = new Map();

async function loadDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await loadDirectory(fullPath);
      continue;
    }
    const urlPath = `/${relative(ROOT, fullPath).split(sep).join('/')}`;
    files.set(urlPath, await readFile(fullPath));
  }
}

await loadDirectory(ROOT);

function resolve(pathname) {
  const candidates = [
    pathname,
    pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}/index.html`,
    `${pathname}.html`,
  ];
  for (const candidate of candidates) {
    const found = files.get(candidate);
    if (found) return { body: found, path: candidate };
  }
  return null;
}

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const match = resolve(pathname);

  if (!match) {
    const notFound = files.get('/404.html');
    response.writeHead(404, { 'Content-Type': MIME['.html'] });
    response.end(notFound ?? 'Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': MIME[extname(match.path)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  response.end(match.body);
});

server.listen(PORT, () => {
  process.stdout.write(`static-server: ${files.size} arquivos em http://localhost:${PORT}\n`);
});
