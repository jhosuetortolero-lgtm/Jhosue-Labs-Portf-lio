/**
 * Converte PDFs de certificado em imagens WebP para o carrossel.
 *
 * Renderiza a primeira página de cada PDF com pdf.js dentro do Chromium
 * (via Playwright) e salva o resultado em public/images/certificates/.
 * Também extrai o texto da página, para ajudar a preencher título e
 * instituição em src/data/certificates.ts.
 *
 * Uso:
 *   node tools/pdf-to-image.mjs "C:/caminho/arquivo.pdf" [mais arquivos...]
 *
 * Requer: npm install (pdfjs-dist e @playwright/test já são devDependencies).
 */
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUT_DIR = join(ROOT, 'public', 'images', 'certificates');
const PDFJS = join(ROOT, 'node_modules', 'pdfjs-dist', 'build');

/** Largura alvo da imagem: precisa dar para ler o certificado ampliado. */
const TARGET_WIDTH = 1400;
const QUALITY = 0.88;

/** nome-do-arquivo -> kebab-case sem acento */
function slug(name) {
  return basename(name, extname(name))
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Informe ao menos um caminho de PDF.');
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const [pdfLib, pdfWorker] = await Promise.all([
  readFile(join(PDFJS, 'pdf.min.mjs'), 'utf8'),
  readFile(join(PDFJS, 'pdf.worker.min.mjs'), 'utf8'),
]);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

await page.setContent('<!doctype html><html><body><canvas id="c"></canvas></body></html>');

// pdf.js é um módulo ES: carregamos por import dinâmico de um blob.
await page.evaluate(
  async ({ lib, worker }) => {
    window.__worker = worker;
    const url = URL.createObjectURL(new Blob([lib], { type: 'text/javascript' }));
    window.pdfjsLib = await import(url);
  },
  { lib: pdfLib, worker: pdfWorker },
);

const results = [];

for (const file of files) {
  const buffer = await readFile(file);
  const name = slug(file);

  const result = await page.evaluate(
    async ({ bytes, width, quality }) => {
      const pdfjs = window.pdfjsLib;
      const blob = new Blob([window.__worker], { type: 'text/javascript' });
      pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);

      const data = Uint8Array.from(atob(bytes), (c) => c.charCodeAt(0));
      const doc = await pdfjs.getDocument({ data }).promise;
      const pdfPage = await doc.getPage(1);

      const base = pdfPage.getViewport({ scale: 1 });
      const scale = width / base.width;
      const viewport = pdfPage.getViewport({ scale });

      const canvas = document.getElementById('c');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await pdfPage.render({ canvasContext: context, viewport, canvas }).promise;

      const text = await pdfPage.getTextContent();
      const lines = text.items
        .map((item) => (typeof item.str === 'string' ? item.str.trim() : ''))
        .filter(Boolean);

      return {
        dataUrl: canvas.toDataURL('image/webp', quality),
        width: canvas.width,
        height: canvas.height,
        pages: doc.numPages,
        lines,
      };
    },
    { bytes: buffer.toString('base64'), width: TARGET_WIDTH, quality: QUALITY },
  );

  const base64 = result.dataUrl.split(',')[1];
  const outPath = join(OUT_DIR, `${name}.webp`);
  await writeFile(outPath, Buffer.from(base64, 'base64'));

  results.push({
    file: basename(file),
    image: `/images/certificates/${name}.webp`,
    size: `${result.width}x${result.height}`,
    pages: result.pages,
    text: result.lines,
  });

  console.log(`ok  ${basename(file)}  ->  ${name}.webp  (${result.width}x${result.height})`);
}

await browser.close();

await writeFile(join(OUT_DIR, '_extraido.json'), JSON.stringify(results, null, 2), 'utf8');
console.log(`\nTexto extraido salvo em public/images/certificates/_extraido.json`);
