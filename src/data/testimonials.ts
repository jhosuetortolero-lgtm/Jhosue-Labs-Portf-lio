import type { Testimonial } from '../types/testimonial';

/**
 * DEPOIMENTOS DE CLIENTES.
 *
 * Regra: `quote` é uma CITAÇÃO — copie exatamente como o cliente escreveu,
 * sem corrigir, encurtar ou traduzir. Por isso o texto aparece sempre no
 * idioma original, mesmo com o site em inglês ou espanhol; só os rótulos ao
 * redor mudam de idioma.
 *
 * Para adicionar um depoimento novo:
 *
 * 1. Tire o print do depoimento original e converta:
 *      node tools/image-to-webp.mjs "print.png" public/images/testimonials nome-cliente 900,1400
 * 2. Copie um bloco abaixo e preencha os campos.
 * 3. `proofImage` é o print — aparece ao abrir o depoimento, como comprovação.
 *    Use `null` se não tiver.
 *
 * Para esconder a seção, desligue `testimonials` em src/config/features.ts.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'rodrigo-99freelas',
    author: 'Rodrigo',
    company: 'Grupo RMC',
    source: '99Freelas',
    project: 'Desenvolvimento de plataforma de compras',
    period: 'jul. 2026',
    rating: 5,
    quote:
      'Excelente profissional! Entregou o escopo conforme o combinado, com alta qualidade e dentro do prazo. Comunicação muito clara e rápida, o que é fundamental para quem empreende e precisa de agilidade. Com certeza, será meu parceiro em futuras demandas do Grupo RMC. Nota 10',
    proofImage: '/images/testimonials/rodrigo-99freelas-998.webp',
    sourceUrl: null,
  },
  {
    id: 'juliana-whatsapp',
    author: 'Juliana B.',
    company: null,
    source: 'WhatsApp',
    project: 'Projeto digital',
    period: 'ago. 2026',
    rating: null,
    quote:
      'Você foi extremamente rápido e atencioso. Amei o resultado, ficou exatamente como eu queria. E chegou bem antes do prazo.',
    proofImage: '/images/testimonials/whatsapp-cliente-720.webp',
    sourceUrl: null,
  },
];

/** Média das notas informadas. `null` quando ninguém deu nota. */
export function averageRating(): number | null {
  const notas = testimonials
    .map((item) => item.rating)
    .filter((nota): nota is number => typeof nota === 'number');

  if (notas.length === 0) return null;
  return notas.reduce((total, nota) => total + nota, 0) / notas.length;
}
