import { describe, expect, it } from 'vitest';
import { testimonials, averageRating } from '../../src/data/testimonials';
import { testimonialSchema } from '../../src/types/testimonial';
import { dictionaries } from '../../src/i18n';
import { LANGUAGES } from '../../src/types/i18n';
import { navigation } from '../../src/config/navigation';
import { features } from '../../src/config/features';

describe('dados dos depoimentos', () => {
  it('passa no schema', () => {
    for (const testimonial of testimonials) {
      expect(() => testimonialSchema.parse(testimonial)).not.toThrow();
    }
  });

  it('não tem ids repetidos', () => {
    const ids = testimonials.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('o print de comprovação aponta para a pasta certa', () => {
    for (const testimonial of testimonials) {
      if (testimonial.proofImage) {
        expect(testimonial.proofImage.startsWith('/images/testimonials/')).toBe(true);
      }
    }
  });

  it('nota fica entre 0 e 5', () => {
    for (const testimonial of testimonials) {
      if (testimonial.rating !== null) {
        expect(testimonial.rating).toBeGreaterThanOrEqual(0);
        expect(testimonial.rating).toBeLessThanOrEqual(5);
      }
    }
  });

  it('link da origem, quando existe, é https', () => {
    for (const testimonial of testimonials) {
      if (testimonial.sourceUrl) {
        expect(testimonial.sourceUrl.startsWith('https://')).toBe(true);
      }
    }
  });

  it('o depoimento do Rodrigo está registrado por inteiro', () => {
    const rodrigo = testimonials.find((item) => item.id === 'rodrigo-99freelas');
    expect(rodrigo).toBeDefined();
    expect(rodrigo?.author).toBe('Rodrigo');
    expect(rodrigo?.source).toBe('99Freelas');
    expect(rodrigo?.rating).toBe(5);
    // A citação precisa terminar como o cliente escreveu.
    expect(rodrigo?.quote).toContain('Nota 10');
    expect(rodrigo?.quote).toContain('Grupo RMC');
  });
});

describe('averageRating', () => {
  it('calcula a média das notas informadas', () => {
    const media = averageRating();
    expect(media).not.toBeNull();
    expect(media).toBeGreaterThan(0);
    expect(media).toBeLessThanOrEqual(5);
  });
});

describe('integração da seção', () => {
  it('entra no menu quando o recurso está ligado', () => {
    const ids = navigation.map((item) => item.id);
    if (features.testimonials) {
      expect(ids).toContain('testimonials');
    } else {
      expect(ids).not.toContain('testimonials');
    }
  });

  it('todos os textos existem nos três idiomas', () => {
    const chaves = [
      'navigation.testimonials',
      'testimonials.eyebrow',
      'testimonials.title',
      'testimonials.subtitle',
      'testimonials.readFull',
      'testimonials.rating',
      'testimonials.average',
      'testimonials.countOne',
      'testimonials.countMany',
      'testimonials.proof',
      'testimonials.proofAlt',
      'testimonials.viewSource',
      'testimonials.carousel',
      'testimonials.previous',
      'testimonials.next',
      'testimonials.pause',
      'testimonials.play',
      'testimonials.close',
      'testimonials.empty',
    ];

    for (const chave of chaves) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][chave], `${language} → ${chave}`).toBeTruthy();
      }
    }
  });

  it('a citação NÃO entra no dicionário: é texto original, não traduzível', () => {
    for (const testimonial of testimonials) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][`testimonial.${testimonial.id}.quote`]).toBeUndefined();
      }
    }
  });
});
