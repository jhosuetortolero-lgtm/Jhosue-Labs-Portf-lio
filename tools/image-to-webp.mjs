/**
 * Converte uma imagem (PNG/JPG) em WebP otimizado, em vários tamanhos.
 *
 * Usa o Chromium (via Playwright) para redimensionar e codificar — sem
 * dependências nativas de imagem.
 *
 * Uso:
 *   node tools/image-to-webp.mjs <entrada> <pasta-destino> <nome-base> [larguras]
 *
 * Exemplo:
 *   node tools/image-to-webp.mjs "C:/foto.png" public/images/profile jhosue 640,960,1280
 */
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [input, outDir, baseName, widthsArg] = process.argv.slice(2);

if (!input || !outDir || !baseName) {
  console.error('Uso: node tools/image-to-webp.mjs <entrada> <pasta> <nome> [larguras]');
  process.exit(1);
}

const widths = (widthsArg ?? '640,960,1280').split(',').map((value) => Number(value.trim()));
const QUALITY = 0.86;

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

await mkdir(outDir, { recursive: true });

const buffer = await readFile(input);
const mime = MIME[extname(input).toLowerCase()] ?? 'image/png';
const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><body><canvas id="c"></canvas></body></html>');

const results = await page.evaluate(
  async ({ source, targets, quality }) => {
    const image = new Image();
    image.src = source;
    await image.decode();

    const canvas = document.getElementById('c');
    const context = canvas.getContext('2d');
    const output = [];

    for (const width of targets) {
      const scale = Math.min(1, width / image.naturalWidth);
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      output.push({
        width: canvas.width,
        height: canvas.height,
        dataUrl: canvas.toDataURL('image/webp', quality),
      });
    }

    return { original: { width: image.naturalWidth, height: image.naturalHeight }, output };
  },
  { source: dataUrl, targets: widths, quality: QUALITY },
);

await browser.close();

console.log(`original: ${results.original.width}x${results.original.height}`);

for (const item of results.output) {
  const base64 = item.dataUrl.split(',')[1];
  const bytes = Buffer.from(base64, 'base64');
  const file = join(outDir, `${baseName}-${item.width}.webp`);
  await writeFile(file, bytes);
  console.log(`ok  ${baseName}-${item.width}.webp  ${item.width}x${item.height}  ${Math.round(bytes.length / 1024)} KB`);
}
