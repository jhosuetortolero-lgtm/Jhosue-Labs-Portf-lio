import type { Certificate } from '../types/certificate';

/**
 * CERTIFICADOS.
 *
 * Os dados abaixo foram lidos diretamente dos PDFs originais — títulos,
 * instituições, cargas horárias e datas são exatamente os que constam nos
 * certificados. Nada foi inventado.
 *
 * Como adicionar um certificado novo:
 *
 * 1. Converta o PDF em imagem:
 *      node tools/pdf-to-image.mjs "C:/caminho/certificado.pdf"
 *    (gera um .webp em public/images/certificates/ e imprime o texto lido)
 * 2. Copie um bloco abaixo e preencha os campos.
 * 3. `credentialUrl` só quando o link de verificação estiver impresso no
 *    próprio certificado. Caso contrário, `null`.
 *
 * A ordem da lista é a ordem do carrossel: os mais relevantes primeiro.
 * Para esconder a seção inteira, desligue `certificates` em src/config/features.ts.
 */
export const certificates: Certificate[] = [
  {
    id: 'fullstack-web-node-js-ts',
    title: 'Full Stack Web com Node, JavaScript e TypeScript 2026',
    issuer: 'Udemy',
    year: '2026',
    workload: '106h',
    image: '/images/certificates/fullstack-web-node-javascript-typescript.webp',
    credentialUrl: 'https://ude.my/UC-968e3a5e-e1d7-4045-a1c5-f601b1ecae62',
  },
  {
    id: 'bootcamp-self-checkout',
    title: 'Bootcamp Self Checkout',
    issuer: 'Full Stack Club',
    year: '2025',
    workload: '18h',
    image: '/images/certificates/bootcamp-self-checkout.webp',
    credentialUrl: null,
  },
  {
    id: 'bootcamp-saas-clinicas',
    title: 'Bootcamp: SaaS de Agendamentos para Clínicas',
    issuer: 'Full Stack Club',
    year: '2026',
    workload: '14h',
    image: '/images/certificates/bootcamp-saas-clinicas.webp',
    credentialUrl: null,
  },
  {
    id: 'codex-apps-ia-vibe-coding',
    title: 'Codex: La Guía Completa para Crear Apps con IA y Vibe Coding',
    issuer: 'Udemy',
    year: '2026',
    workload: '13h',
    image: '/images/certificates/codex-apps-ia-vibe-coding.webp',
    credentialUrl: 'https://ude.my/UC-8e3a8ede-3ab5-4478-9e80-5c15acd467c7',
  },
  {
    id: 'full-stack-weekend',
    title: 'Full Stack Weekend — SaaS de agendamentos, do zero ao deploy',
    issuer: 'Full Stack Club',
    year: '2025',
    workload: '12h',
    image: '/images/certificates/full-stack-weekend.webp',
    credentialUrl: null,
  },
  {
    id: 'bootcamp-ecommerce',
    title: 'Bootcamp Ecommerce',
    issuer: 'Full Stack Club',
    year: '2025',
    workload: null,
    image: '/images/certificates/bootcamp-ecommerce.webp',
    credentialUrl: null,
  },
  {
    id: 'logica-de-programacao-trybe',
    title: 'Curso Lógica de Programação',
    issuer: 'Trybe',
    year: '2025',
    workload: '10h',
    image: '/images/certificates/logica-de-programacao-trybe.webp',
    credentialUrl: null,
  },
  {
    id: 'automatikpro',
    title: 'AutomatikPro — Fluxos de automação de conversa',
    issuer: 'Automatik Labs',
    year: '2025',
    workload: null,
    image: '/images/certificates/automatikpro.webp',
    credentialUrl: null,
  },
  {
    id: 'automacao-com-n8n',
    title: 'Automação com n8n',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    year: '2025',
    workload: '3h',
    image: '/images/certificates/automacao-com-n8n.webp',
    credentialUrl: null,
  },
  {
    id: 'fundamentos-ia-moderna',
    title: 'Fundamentos da IA Moderna: Machine Learning, LLMs, IA Generativa e Agentes',
    issuer: 'DIO',
    year: '2026',
    workload: '2h',
    image: '/images/certificates/fundamentos-ia-moderna.webp',
    credentialUrl: null,
  },
  {
    id: 'vibe-coding-agentes-ia',
    title: 'Vibe Coding: Criando uma Solução de Negócio com Agentes de IA',
    issuer: 'DIO',
    year: '2026',
    workload: '1h',
    image: '/images/certificates/vibe-coding-agentes-ia.webp',
    credentialUrl: null,
  },
  {
    id: 'introducao-inteligencia-artificial',
    title: 'Introdução à Inteligência Artificial',
    issuer: 'DIO',
    year: '2026',
    workload: '1h',
    image: '/images/certificates/introducao-inteligencia-artificial.webp',
    credentialUrl: null,
  },
  {
    id: 'estrutura-de-software',
    title: 'Estrutura de um Software e Seu Ambiente de Desenvolvimento',
    issuer: 'DIO',
    year: '2025',
    workload: '1h',
    image: '/images/certificates/estrutura-de-software.webp',
    credentialUrl: null,
  },
  {
    id: 'introducao-logica-de-programacao',
    title: 'Introdução a Experiência de Lógica de Programação',
    issuer: 'DIO · Blip',
    year: '2025',
    workload: '1h',
    image: '/images/certificates/introducao-logica-de-programacao.webp',
    credentialUrl: null,
  },
];

/** true quando o campo ainda é um placeholder do tipo [ALGO]. */
export function isPending(value: string): boolean {
  return /^\[.*\]$/.test(value.trim());
}

/** Um certificado está incompleto enquanto faltar imagem ou dados reais. */
export function isCertificatePending(certificate: Certificate): boolean {
  return (
    certificate.image === null ||
    isPending(certificate.title) ||
    isPending(certificate.issuer) ||
    isPending(certificate.year)
  );
}
