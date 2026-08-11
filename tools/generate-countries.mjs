/**
 * Gera src/data/countries.ts — lista de países com DDI e nome traduzido.
 *
 * Uso:
 *   node tools/generate-countries.mjs
 *
 * Os nomes vêm do próprio Node (Intl.DisplayNames), então acompanham o padrão
 * usado pelos navegadores. Os DDI ficam na tabela abaixo: para editar um país,
 * mexa aqui e rode o script de novo — não edite o arquivo gerado à mão.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { getExampleNumber } = require('libphonenumber-js');
const phoneExamples = require('libphonenumber-js/examples.mobile.json');

/** ISO 3166-1 alfa-2 -> código de discagem (sem o "+"). */
const DIAL_CODES = {
  AF: '93',
  AL: '355',
  DZ: '213',
  AS: '1684',
  AD: '376',
  AO: '244',
  AI: '1264',
  AG: '1268',
  AR: '54',
  AM: '374',
  AW: '297',
  AU: '61',
  AT: '43',
  AZ: '994',
  BS: '1242',
  BH: '973',
  BD: '880',
  BB: '1246',
  BY: '375',
  BE: '32',
  BZ: '501',
  BJ: '229',
  BM: '1441',
  BT: '975',
  BO: '591',
  BQ: '599',
  BA: '387',
  BW: '267',
  BR: '55',
  IO: '246',
  VG: '1284',
  BN: '673',
  BG: '359',
  BF: '226',
  BI: '257',
  KH: '855',
  CM: '237',
  CA: '1',
  CV: '238',
  KY: '1345',
  CF: '236',
  TD: '235',
  CL: '56',
  CN: '86',
  CO: '57',
  KM: '269',
  CG: '242',
  CD: '243',
  CK: '682',
  CR: '506',
  CI: '225',
  HR: '385',
  CU: '53',
  CW: '599',
  CY: '357',
  CZ: '420',
  DK: '45',
  DJ: '253',
  DM: '1767',
  DO: '1809',
  EC: '593',
  EG: '20',
  SV: '503',
  GQ: '240',
  ER: '291',
  EE: '372',
  SZ: '268',
  ET: '251',
  FK: '500',
  FO: '298',
  FJ: '679',
  FI: '358',
  FR: '33',
  GF: '594',
  PF: '689',
  GA: '241',
  GM: '220',
  GE: '995',
  DE: '49',
  GH: '233',
  GI: '350',
  GR: '30',
  GL: '299',
  GD: '1473',
  GP: '590',
  GU: '1671',
  GT: '502',
  GG: '44',
  GN: '224',
  GW: '245',
  GY: '592',
  HT: '509',
  HN: '504',
  HK: '852',
  HU: '36',
  IS: '354',
  IN: '91',
  ID: '62',
  IR: '98',
  IQ: '964',
  IE: '353',
  IM: '44',
  IL: '972',
  IT: '39',
  JM: '1876',
  JP: '81',
  JE: '44',
  JO: '962',
  KZ: '7',
  KE: '254',
  KI: '686',
  KW: '965',
  KG: '996',
  LA: '856',
  LV: '371',
  LB: '961',
  LS: '266',
  LR: '231',
  LY: '218',
  LI: '423',
  LT: '370',
  LU: '352',
  MO: '853',
  MG: '261',
  MW: '265',
  MY: '60',
  MV: '960',
  ML: '223',
  MT: '356',
  MH: '692',
  MQ: '596',
  MR: '222',
  MU: '230',
  MX: '52',
  FM: '691',
  MD: '373',
  MC: '377',
  MN: '976',
  ME: '382',
  MS: '1664',
  MA: '212',
  MZ: '258',
  MM: '95',
  NA: '264',
  NR: '674',
  NP: '977',
  NL: '31',
  NC: '687',
  NZ: '64',
  NI: '505',
  NE: '227',
  NG: '234',
  NU: '683',
  NF: '672',
  KP: '850',
  MK: '389',
  MP: '1670',
  NO: '47',
  OM: '968',
  PK: '92',
  PW: '680',
  PS: '970',
  PA: '507',
  PG: '675',
  PY: '595',
  PE: '51',
  PH: '63',
  PL: '48',
  PT: '351',
  PR: '1787',
  QA: '974',
  RE: '262',
  RO: '40',
  RU: '7',
  RW: '250',
  BL: '590',
  SH: '290',
  KN: '1869',
  LC: '1758',
  MF: '590',
  PM: '508',
  VC: '1784',
  WS: '685',
  SM: '378',
  ST: '239',
  SA: '966',
  SN: '221',
  RS: '381',
  SC: '248',
  SL: '232',
  SG: '65',
  SX: '1721',
  SK: '421',
  SI: '386',
  SB: '677',
  SO: '252',
  ZA: '27',
  KR: '82',
  SS: '211',
  ES: '34',
  LK: '94',
  SD: '249',
  SR: '597',
  SE: '46',
  CH: '41',
  SY: '963',
  TW: '886',
  TJ: '992',
  TZ: '255',
  TH: '66',
  TL: '670',
  TG: '228',
  TK: '690',
  TO: '676',
  TT: '1868',
  TN: '216',
  TR: '90',
  TM: '993',
  TC: '1649',
  TV: '688',
  UG: '256',
  UA: '380',
  AE: '971',
  GB: '44',
  US: '1',
  UY: '598',
  UZ: '998',
  VU: '678',
  VA: '39',
  VE: '58',
  VN: '84',
  WF: '681',
  YE: '967',
  ZM: '260',
  ZW: '263',
  AX: '358',
};

const LANGUAGES = { 'pt-BR': 'pt-BR', 'en-US': 'en-US', es: 'es' };

const displayNames = Object.fromEntries(
  Object.entries(LANGUAGES).map(([key, locale]) => [
    key,
    new Intl.DisplayNames([locale], { type: 'region' }),
  ]),
);

/** 🇧🇷 a partir de "BR": duas letras viram indicadores regionais. */
function flag(iso) {
  return String.fromCodePoint(...[...iso].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

/**
 * Tira o DDI do começo do número internacional, preservando o espaçamento.
 * "+55 11 96123 4567" com DDI 55 vira "11 96123 4567".
 */
function withoutDial(international, dial) {
  const rest = international.replace(/^\+/, '');
  let index = 0;
  for (const digit of dial) {
    while (rest[index] === ' ' || rest[index] === '-') index += 1;
    if (rest[index] !== digit) return rest.trim();
    index += 1;
  }
  return rest.slice(index).trim();
}

/**
 * Exemplo de celular no formato local, já sem o DDI — vira a dica do campo.
 * Sem exemplo conhecido, devolve string vazia.
 */
function example(iso, dial) {
  try {
    const number = getExampleNumber(iso, phoneExamples);
    if (!number) return '';
    return withoutDial(number.formatInternational(), dial);
  } catch {
    return '';
  }
}

const entries = Object.entries(DIAL_CODES)
  .map(([iso, dial]) => ({
    iso,
    dial,
    flag: flag(iso),
    example: example(iso, dial),
    name: Object.fromEntries(
      Object.keys(LANGUAGES).map((language) => [language, displayNames[language].of(iso) ?? iso]),
    ),
  }))
  .sort((a, b) => a.name['pt-BR'].localeCompare(b.name['pt-BR'], 'pt-BR'));

const body = entries
  .map(
    (entry) =>
      `  {\n` +
      `    iso: '${entry.iso}',\n` +
      `    dial: '${entry.dial}',\n` +
      `    flag: '${entry.flag}',\n` +
      `    example: ${JSON.stringify(entry.example)},\n` +
      `    name: {\n` +
      `      'pt-BR': ${JSON.stringify(entry.name['pt-BR'])},\n` +
      `      'en-US': ${JSON.stringify(entry.name['en-US'])},\n` +
      `      es: ${JSON.stringify(entry.name.es)},\n` +
      `    },\n` +
      `  },`,
  )
  .join('\n');

const file = `import type { Country } from '../types/country';

/**
 * ARQUIVO GERADO — não edite à mão.
 * Fonte: tools/generate-countries.mjs (rode \`node tools/generate-countries.mjs\`).
 *
 * ${entries.length} países e territórios, com código de discagem (DDI) e nome
 * nos três idiomas do site. A ordem é alfabética em português; o formulário
 * reordena conforme o idioma ativo.
 */
export const countries: Country[] = [
${body}
];

/** País pré-selecionado no formulário de contato. */
export const DEFAULT_COUNTRY = 'BR';

export function findCountry(iso: string): Country | undefined {
  return countries.find((country) => country.iso === iso);
}
`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(join(root, 'src/data/countries.ts'), file, 'utf8');
console.log(`ok  ${entries.length} países escritos em src/data/countries.ts`);
