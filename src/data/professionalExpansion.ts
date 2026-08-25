/**
 * Conteúdo estrutural da expansão profissional.
 *
 * Os textos ficam em `src/i18n/professionalExpansion.ts`; este arquivo mantém
 * somente a composição das novas áreas, sem interferir nos dados existentes.
 */

export interface ExpansionItem {
  id: string;
  labelKey: string;
}

export interface ExpansionArea {
  id: string;
  icon: string;
  nameKey: string;
  focusKey: string;
  items: ExpansionItem[];
}

export const professionalFocus: ExpansionItem[] = [
  { id: 'software-engineering', labelKey: 'expansion.profile.focus.software' },
  { id: 'ai', labelKey: 'expansion.profile.focus.ai' },
  { id: 'cybersecurity', labelKey: 'expansion.profile.focus.cybersecurity' },
];

export const leadsparkAreas: ExpansionArea[] = [
  {
    id: 'software',
    icon: 'code',
    nameKey: 'expansion.leadspark.software.name',
    focusKey: 'expansion.leadspark.software.focus',
    items: [
      { id: 'saas', labelKey: 'expansion.leadspark.software.saas' },
      { id: 'systems', labelKey: 'expansion.leadspark.software.systems' },
      { id: 'apis', labelKey: 'expansion.leadspark.software.apis' },
      { id: 'digital-platforms', labelKey: 'expansion.leadspark.software.platforms' },
    ],
  },
  {
    id: 'ai',
    icon: 'bot',
    nameKey: 'expansion.leadspark.ai.name',
    focusKey: 'expansion.leadspark.ai.focus',
    items: [
      { id: 'ai-agents', labelKey: 'expansion.leadspark.ai.agents' },
      { id: 'automation', labelKey: 'expansion.leadspark.ai.automation' },
      { id: 'rag', labelKey: 'expansion.leadspark.ai.rag' },
      { id: 'integrations', labelKey: 'expansion.leadspark.ai.integrations' },
      { id: 'intelligent-systems', labelKey: 'expansion.leadspark.ai.systems' },
    ],
  },
  {
    id: 'cyber',
    icon: 'shield',
    nameKey: 'expansion.leadspark.cyber.name',
    focusKey: 'expansion.leadspark.cyber.focus',
    items: [
      { id: 'cybersecurity', labelKey: 'expansion.leadspark.cyber.cybersecurity' },
      { id: 'pentest', labelKey: 'expansion.leadspark.cyber.pentest' },
      { id: 'application-security', labelKey: 'expansion.leadspark.cyber.application' },
      { id: 'api-security', labelKey: 'expansion.leadspark.cyber.api' },
      { id: 'cloud-security', labelKey: 'expansion.leadspark.cyber.cloud' },
      { id: 'security-assessment', labelKey: 'expansion.leadspark.cyber.assessment' },
    ],
  },
  {
    id: 'security-lab',
    icon: 'terminal',
    nameKey: 'expansion.leadspark.securityLab.name',
    focusKey: 'expansion.leadspark.securityLab.focus',
    items: [
      { id: 'ethical-hacking', labelKey: 'expansion.leadspark.securityLab.ethicalHacking' },
      { id: 'offensive-security', labelKey: 'expansion.leadspark.securityLab.offensive' },
      { id: 'red-team', labelKey: 'expansion.leadspark.securityLab.redTeam' },
      { id: 'security-research', labelKey: 'expansion.leadspark.securityLab.research' },
      { id: 'vulnerability-analysis', labelKey: 'expansion.leadspark.securityLab.analysis' },
      { id: 'security-labs', labelKey: 'expansion.leadspark.securityLab.labs' },
    ],
  },
];

export const cybersecurityAreas: ExpansionArea[] = [
  {
    id: 'offensive-security',
    icon: 'target',
    nameKey: 'expansion.cybersecurity.offensive.name',
    focusKey: 'expansion.cybersecurity.offensive.focus',
    items: [
      { id: 'web-pentesting', labelKey: 'expansion.cybersecurity.offensive.web' },
      { id: 'api-pentesting', labelKey: 'expansion.cybersecurity.offensive.api' },
      { id: 'vulnerability-assessment', labelKey: 'expansion.cybersecurity.offensive.assessment' },
      { id: 'red-team', labelKey: 'expansion.cybersecurity.offensive.redTeam' },
      { id: 'security-testing', labelKey: 'expansion.cybersecurity.offensive.testing' },
    ],
  },
  {
    id: 'defensive-security',
    icon: 'shield',
    nameKey: 'expansion.cybersecurity.defensive.name',
    focusKey: 'expansion.cybersecurity.defensive.focus',
    items: [
      { id: 'hardening', labelKey: 'expansion.cybersecurity.defensive.hardening' },
      { id: 'secure-architecture', labelKey: 'expansion.cybersecurity.defensive.architecture' },
      { id: 'security-monitoring', labelKey: 'expansion.cybersecurity.defensive.monitoring' },
      {
        id: 'infrastructure-security',
        labelKey: 'expansion.cybersecurity.defensive.infrastructure',
      },
    ],
  },
  {
    id: 'application-security',
    icon: 'lock',
    nameKey: 'expansion.cybersecurity.application.name',
    focusKey: 'expansion.cybersecurity.application.focus',
    items: [
      { id: 'secure-code-review', labelKey: 'expansion.cybersecurity.application.review' },
      { id: 'owasp', labelKey: 'expansion.cybersecurity.application.owasp' },
      { id: 'api-security', labelKey: 'expansion.cybersecurity.application.api' },
      { id: 'authentication-authorization', labelKey: 'expansion.cybersecurity.application.auth' },
      { id: 'threat-modeling', labelKey: 'expansion.cybersecurity.application.threatModeling' },
    ],
  },
];

export const securityLabTracks: ExpansionItem[] = [
  { id: 'ctfs', labelKey: 'expansion.securityLab.tracks.ctfs' },
  { id: 'security-labs', labelKey: 'expansion.securityLab.tracks.securityLabs' },
  { id: 'write-ups', labelKey: 'expansion.securityLab.tracks.writeUps' },
  { id: 'vulnerability-research', labelKey: 'expansion.securityLab.tracks.vulnerabilityResearch' },
  { id: 'security-projects', labelKey: 'expansion.securityLab.tracks.securityProjects' },
  { id: 'pentesting-labs', labelKey: 'expansion.securityLab.tracks.pentestingLabs' },
  { id: 'research', labelKey: 'expansion.securityLab.tracks.research' },
];

export const securityKnowledgeAreas: ExpansionArea[] = [
  {
    id: 'cybersecurity',
    icon: 'shield',
    nameKey: 'expansion.securityStack.cybersecurity.name',
    focusKey: 'expansion.securityStack.cybersecurity.focus',
    items: [
      { id: 'owasp', labelKey: 'expansion.securityStack.cybersecurity.owasp' },
      { id: 'burp-suite', labelKey: 'expansion.securityStack.cybersecurity.burpSuite' },
      { id: 'nmap', labelKey: 'expansion.securityStack.cybersecurity.nmap' },
      { id: 'wireshark', labelKey: 'expansion.securityStack.cybersecurity.wireshark' },
      { id: 'linux', labelKey: 'expansion.securityStack.cybersecurity.linux' },
      { id: 'metasploit', labelKey: 'expansion.securityStack.cybersecurity.metasploit' },
      { id: 'api-security', labelKey: 'expansion.securityStack.cybersecurity.apiSecurity' },
    ],
  },
  {
    id: 'infrastructure',
    icon: 'layers',
    nameKey: 'expansion.securityStack.infrastructure.name',
    focusKey: 'expansion.securityStack.infrastructure.focus',
    items: [
      { id: 'docker', labelKey: 'expansion.securityStack.infrastructure.docker' },
      { id: 'linux', labelKey: 'expansion.securityStack.infrastructure.linux' },
      { id: 'cloud', labelKey: 'expansion.securityStack.infrastructure.cloud' },
      { id: 'ci-cd', labelKey: 'expansion.securityStack.infrastructure.cicd' },
      { id: 'networking', labelKey: 'expansion.securityStack.infrastructure.networking' },
    ],
  },
];
