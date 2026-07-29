/**
 * Sanitização de entradas.
 *
 * Regra do projeto: nenhuma entrada do usuário chega ao DOM via innerHTML.
 * Tudo é inserido com textContent. Estas funções existem como camada extra
 * (limite de tamanho, remoção de caracteres de controle, validação de URL).
 */

const TAB = 9;
const LINE_FEED = 10;
const CARRIAGE_RETURN = 13;
const SPACE = 32;
const DELETE = 127;

/** true para caracteres de controle, preservando tab, LF e CR. */
function isControlChar(code: number): boolean {
  if (code === TAB || code === LINE_FEED || code === CARRIAGE_RETURN) return false;
  return code < SPACE || code === DELETE;
}

/** Remove caracteres de controle e limita o tamanho. */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  let output = '';
  for (const char of input) {
    const code = char.codePointAt(0);
    if (code === undefined || isControlChar(code)) continue;
    output += char;
  }
  return output.trim().slice(0, maxLength);
}

/** Colapsa espaços e quebras de linha — para campos de uma linha só. */
export function sanitizeSingleLine(input: unknown, maxLength = 200): string {
  return sanitizeText(input, maxLength).replace(/\s+/g, ' ');
}

/** Escapa os cinco caracteres perigosos em HTML. Use apenas em texto estático. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Devolve a URL apenas se o protocolo for seguro.
 * Bloqueia javascript:, data:, vbscript: e afins.
 */
export function safeUrl(input: string, origin = 'https://localhost'): string | null {
  const value = input.trim();
  if (!value) return null;
  // Caminhos relativos são seguros por definição.
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('./')) return value;
  try {
    const url = new URL(value, origin);
    return SAFE_PROTOCOLS.has(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

/** Validação de e-mail suficiente para formulário (o servidor revalida). */
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
  return /^[^\s@,;:<>()[\]\\]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}
