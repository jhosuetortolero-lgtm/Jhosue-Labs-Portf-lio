import { describe, expect, it } from 'vitest';
import {
  cybersecurityAreas,
  leadsparkAreas,
  professionalFocus,
  securityKnowledgeAreas,
  securityLabTracks,
  type ExpansionArea,
} from '../../src/data/professionalExpansion';
import { dictionaries } from '../../src/i18n';
import { LANGUAGES } from '../../src/types/i18n';
import { navigation } from '../../src/config/navigation';

const sectionKeys = [
  'expansion.profile.eyebrow',
  'expansion.profile.name',
  'expansion.profile.role',
  'expansion.profile.founder',
  'expansion.profile.description',
  'expansion.profile.focusLabel',
  'expansion.leadspark.eyebrow',
  'expansion.leadspark.title',
  'expansion.leadspark.subtitle',
  'expansion.leadspark.description',
  'expansion.leadspark.areasLabel',
  'expansion.cybersecurity.eyebrow',
  'expansion.cybersecurity.title',
  'expansion.cybersecurity.subtitle',
  'expansion.cybersecurity.areasLabel',
  'expansion.securityLab.eyebrow',
  'expansion.securityLab.title',
  'expansion.securityLab.subtitle',
  'expansion.securityLab.description',
  'expansion.securityLab.status',
  'expansion.securityLab.tracksTitle',
  'expansion.securityLab.futureNote',
  'expansion.securityStack.eyebrow',
  'expansion.securityStack.title',
  'expansion.securityStack.subtitle',
  'expansion.securityStack.note',
  'expansion.securityStack.areasLabel',
];

function areaKeys(areas: ExpansionArea[]): string[] {
  return areas.flatMap((area) => [
    area.nameKey,
    area.focusKey,
    ...area.items.map((item) => item.labelKey),
  ]);
}

const contentKeys = [
  ...sectionKeys,
  ...professionalFocus.map((item) => item.labelKey),
  ...areaKeys(leadsparkAreas),
  ...areaKeys(cybersecurityAreas),
  ...securityLabTracks.map((item) => item.labelKey),
  ...areaKeys(securityKnowledgeAreas),
];

describe('expansão profissional', () => {
  it('mantém todos os textos novos disponíveis nos três idiomas', () => {
    for (const language of LANGUAGES) {
      for (const key of contentKeys) {
        expect(dictionaries[language][key], `${language} → ${key}`).toBeTruthy();
      }
    }
  });

  it('traduz as frases institucionais nos três idiomas', () => {
    expect(dictionaries['pt-BR']['expansion.profile.description']).toBe(
      'Desenvolvendo software seguro, sistemas inteligentes e produtos digitais escaláveis.',
    );
    expect(dictionaries['en-US']['expansion.leadspark.description']).toBe(
      'Leadspark is a technology company focused on software engineering, artificial intelligence and cybersecurity.',
    );
    expect(dictionaries.es['expansion.cybersecurity.subtitle']).toBe(
      'La seguridad no es una consideración posterior. Forma parte de la arquitectura.',
    );
  });

  it('não adiciona certificações, clientes ou vulnerabilidades como realizações', () => {
    const serialized = JSON.stringify({
      leadsparkAreas,
      cybersecurityAreas,
      securityLabTracks,
      securityKnowledgeAreas,
    }).toLowerCase();

    expect(serialized).not.toContain('certification');
    expect(serialized).not.toContain('client');
    expect(serialized).not.toContain('cve-');
  });

  it('mantém a navegação original sem novos itens ou alterações de ordem', () => {
    expect(navigation.map((item) => item.id)).toEqual([
      'about',
      'services',
      'projects',
      'lab',
      'stack',
      'journey',
      'certificates',
      'testimonials',
      'contact',
    ]);
  });
});
