import type { SocialLink } from '../types/site';
import { isPlaceholder, mailtoUrl, siteConfig, whatsappUrl } from './site';

function link(
  id: string,
  labelKey: string,
  icon: string,
  href: string | null,
): SocialLink {
  const configured = href !== null && !isPlaceholder(href);
  return { id, labelKey, icon, href: configured ? (href as string) : '', configured };
}

/**
 * Links sociais. Os não preenchidos em `site.ts` são automaticamente
 * omitidos da renderização — nunca geramos href="#".
 */
export const socialLinks: SocialLink[] = [
  link('github', 'social.github', 'github', siteConfig.contact.github),
  link('linkedin', 'social.linkedin', 'linkedin', siteConfig.contact.linkedin),
  link('instagram', 'social.instagram', 'instagram', siteConfig.contact.instagram),
  link('whatsapp', 'social.whatsapp', 'whatsapp', whatsappUrl()),
  link('email', 'social.email', 'mail', mailtoUrl(`Contato via ${siteConfig.brand.name}`)),
];

export const activeSocialLinks = socialLinks.filter((item) => item.configured);

export function socialHref(id: string): string | null {
  const found = socialLinks.find((item) => item.id === id);
  return found?.configured ? found.href : null;
}

/** Lista para o JSON-LD `sameAs` — somente perfis reais e configurados. */
export const sameAsProfiles = socialLinks
  .filter((item) => item.configured && ['github', 'linkedin', 'instagram'].includes(item.id))
  .map((item) => item.href);
