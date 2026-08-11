/**
 * Copia as bandeiras usadas no seletor de país para public/images/flags/.
 *
 * Uso:
 *   node tools/copy-flags.mjs
 *
 * A fonte é o pacote `flag-icons`. Copiamos só os países que existem em
 * src/data/countries.ts em vez de importar o CSS do pacote — o CSS traz
 * ~500 bandeiras de uma vez e atrasaria o primeiro carregamento da página.
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules/flag-icons/flags/4x3');
const target = join(root, 'public/images/flags');

if (!existsSync(source)) {
  console.error('flag-icons não encontrado. Rode: npm install');
  process.exit(1);
}

// Lê os ISO direto do arquivo de dados para as duas listas não saírem de sincronia.
const data = readFileSync(join(root, 'src/data/countries.ts'), 'utf8');
const isoCodes = [...data.matchAll(/iso: '([A-Z]{2})'/g)].map((match) => match[1]);

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

const missing = [];
for (const iso of isoCodes) {
  const file = `${iso.toLowerCase()}.svg`;
  const from = join(source, file);
  if (!existsSync(from)) {
    missing.push(iso);
    continue;
  }
  copyFileSync(from, join(target, file));
}

const copied = readdirSync(target).length;
console.log(`ok  ${copied} bandeiras em public/images/flags/`);
if (missing.length > 0) console.log(`sem bandeira no pacote: ${missing.join(', ')}`);
