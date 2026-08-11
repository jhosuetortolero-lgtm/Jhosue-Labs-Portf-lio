/**
 * Mantém os links de WhatsApp com a mensagem pré-preenchida no idioma ativo.
 *
 * Cada link marca a chave de tradução em `data-whatsapp-message`; a cada troca
 * de idioma o href é reconstruído com o texto correspondente.
 */
import { qsa } from '../utils/dom';
import { whatsappUrl } from '../config/site';
import { LANGUAGE_EVENT, translate } from './i18nRuntime';

function applyWhatsappLinks(root: ParentNode = document): void {
  for (const link of qsa<HTMLAnchorElement>('a[data-whatsapp-message]', root)) {
    const key = link.dataset.whatsappMessage;
    if (!key) continue;
    const href = whatsappUrl(translate(key));
    if (href) link.href = href;
  }
}

export function initWhatsappLinks(): void {
  applyWhatsappLinks();
  document.addEventListener(LANGUAGE_EVENT, () => applyWhatsappLinks());
}
