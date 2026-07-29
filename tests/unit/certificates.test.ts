import { describe, expect, it } from 'vitest';
import { certificates, isCertificatePending, isPending } from '../../src/data/certificates';
import { certificateSchema } from '../../src/types/certificate';
import { dictionaries } from '../../src/i18n';
import { LANGUAGES } from '../../src/types/i18n';
import { navigation } from '../../src/config/navigation';
import { features } from '../../src/config/features';

describe('dados dos certificados', () => {
  it('passa no schema', () => {
    for (const certificate of certificates) {
      expect(() => certificateSchema.parse(certificate)).not.toThrow();
    }
  });

  it('não tem ids repetidos', () => {
    const ids = certificates.map((certificate) => certificate.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caminho da imagem, quando existe, aponta para a pasta certa', () => {
    for (const certificate of certificates) {
      if (certificate.image) {
        expect(certificate.image.startsWith('/images/certificates/')).toBe(true);
      }
    }
  });

  it('link de credencial, quando existe, é https', () => {
    for (const certificate of certificates) {
      if (certificate.credentialUrl) {
        expect(certificate.credentialUrl.startsWith('https://')).toBe(true);
      }
    }
  });
});

describe('detecção de pendências', () => {
  it('reconhece placeholder entre colchetes', () => {
    expect(isPending('[ANO]')).toBe(true);
    expect(isPending('  [NOME DO CURSO 1]  ')).toBe(true);
    expect(isPending('2025')).toBe(false);
    expect(isPending('React Avançado')).toBe(false);
  });

  it('marca como pendente quando falta imagem', () => {
    expect(
      isCertificatePending({
        id: 'x',
        title: 'Curso Real',
        issuer: 'Escola Real',
        year: '2025',
        image: null,
      }),
    ).toBe(true);
  });

  it('marca como pendente quando algum texto ainda é placeholder', () => {
    expect(
      isCertificatePending({
        id: 'x',
        title: '[NOME DO CURSO]',
        issuer: 'Escola Real',
        year: '2025',
        image: '/images/certificates/x.webp',
      }),
    ).toBe(true);
  });

  it('não marca como pendente quando está tudo preenchido', () => {
    expect(
      isCertificatePending({
        id: 'x',
        title: 'Curso Real',
        issuer: 'Escola Real',
        year: '2025',
        image: '/images/certificates/x.webp',
      }),
    ).toBe(false);
  });
});

describe('integração da seção', () => {
  it('a seção entra no menu quando o recurso está ligado', () => {
    const ids = navigation.map((item) => item.id);
    if (features.certificates) {
      expect(ids).toContain('certificates');
    } else {
      expect(ids).not.toContain('certificates');
    }
  });

  it('todos os textos da seção existem nos três idiomas', () => {
    const chaves = [
      'navigation.certificates',
      'certificates.eyebrow',
      'certificates.title',
      'certificates.subtitle',
      'certificates.viewCertificate',
      'certificates.altPrefix',
      'certificates.pending',
      'certificates.pendingHint',
      'certificates.credential',
      'certificates.openFull',
      'certificates.previous',
      'certificates.next',
      'certificates.pause',
      'certificates.play',
      'certificates.close',
      'certificates.carousel',
      'certificates.of',
      'certificates.empty',
    ];

    for (const chave of chaves) {
      for (const language of LANGUAGES) {
        expect(dictionaries[language][chave], `${language} → ${chave}`).toBeTruthy();
      }
    }
  });

  it('a numeração das seções não se repete', () => {
    const numeros = [
      'about',
      'services',
      'projects',
      'lab',
      'stack',
      'journey',
      'certificates',
      'testimonials',
      'contact',
    ].map((secao) => dictionaries['pt-BR'][`${secao}.eyebrow`]?.split('/')[0]?.trim());

    expect(new Set(numeros).size).toBe(numeros.length);
  });
});
