import type { NavigationItem } from '../types/site';
import { features } from './features';

/**
 * Ordem das seções da página única.
 * O id vira a âncora (#about) e é usado pelo scroll spy e pela command palette.
 */
export const navigation: NavigationItem[] = [
  { id: 'about', labelKey: 'navigation.about' },
  { id: 'services', labelKey: 'navigation.services' },
  { id: 'projects', labelKey: 'navigation.projects' },
  { id: 'lab', labelKey: 'navigation.lab' },
  { id: 'stack', labelKey: 'navigation.stack' },
  { id: 'journey', labelKey: 'navigation.journey' },
  ...(features.certificates
    ? [{ id: 'certificates', labelKey: 'navigation.certificates' }]
    : []),
  ...(features.testimonials
    ? [{ id: 'testimonials', labelKey: 'navigation.testimonials' }]
    : []),
  { id: 'contact', labelKey: 'navigation.contact' },
];

/** Todas as seções observadas pelo scroll spy, incluindo o hero. */
export const sectionIds = ['hero', ...navigation.map((item) => item.id)];
