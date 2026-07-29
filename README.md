# Jhosue Labs — Portfólio

Portfólio profissional da **Jhosue Labs** — software, automação e inteligência artificial.
Site estático de página única, com navegação por âncoras, três idiomas, tema claro/escuro,
terminal interativo e paleta de comandos.

> **Transformando ideias em sistemas inteligentes.**

---

## Índice

1. [Preview](#preview)
2. [Tecnologias](#tecnologias)
3. [Arquitetura](#arquitetura)
4. [Estrutura de pastas](#estrutura-de-pastas)
5. [Instalação](#instalação)
6. [Desenvolvimento local](#desenvolvimento-local)
7. [Build](#build)
8. [Testes](#testes)
9. [Personalização](#personalização)
10. [Internacionalização](#internacionalização)
11. [Tema](#tema)
12. [Projetos](#projetos)
13. [Serviços](#serviços)
14. [Fundo animado (shader)](#fundo-animado-shader)
15. [Foto do Hero](#foto-do-hero)
16. [Certificados](#certificados)
17. [Depoimentos](#depoimentos)
18. [Timeline](#timeline)
19. [Formulário de contato](#formulário-de-contato)
20. [Variáveis de ambiente](#variáveis-de-ambiente)
21. [Deploy](#deploy)
22. [Acessibilidade](#acessibilidade)
23. [Performance](#performance)
24. [Licença](#licença)

---

## Preview

Rode `npm run dev` e abra <http://localhost:8090>.

Seções na ordem: **Boot Screen → Header → Hero → Sobre → Serviços → Projetos →
Laboratório de IA → Stack → Jornada → Certificados → Depoimentos → Contato →
Footer → Command Palette**.

Para gerar uma captura para este README, tire um print da home em 1280×800 e salve em
`public/images/branding/preview.png`.

---

## Tecnologias

| Camada        | O que é usado                                            |
| ------------- | -------------------------------------------------------- |
| Framework     | Astro 5 (saída 100% estática, zero JS por padrão)         |
| Linguagem     | TypeScript em modo estrito                                |
| Estilos       | CSS moderno com tokens (custom properties), sem framework |
| Interações    | TypeScript nativo — sem React, jQuery ou libs de animação |
| Validação     | Zod (só em tempo de build)                                |
| Fontes        | Space Grotesk + JetBrains Mono, self-hosted via Fontsource |
| Ícones        | SVG locais escritos no próprio projeto                    |
| Testes        | Vitest (unitários) + Playwright (navegador)               |
| Qualidade     | ESLint 9 (flat config) + Prettier                         |

**Não usamos:** jQuery, Bootstrap, bibliotecas pesadas de animação, ícones remotos,
dependências apontando para branches sem versão.

---

## Arquitetura

Três princípios:

1. **Fonte única de conteúdo.** Nada de texto espalhado em componente. Todo conteúdo
   editável vive em `src/config/` (identidade) e `src/data/` (projetos, serviços,
   stack, timeline, comandos). Os componentes só consomem.
2. **Zero JavaScript desnecessário.** Todos os componentes são `.astro` (HTML no build).
   O único bundle enviado ao navegador é `src/scripts/main.ts`, que liga as interações.
   O `zod` nunca chega ao navegador: a validação roda em `src/data/validate.ts`,
   importada apenas no layout (lado servidor).
3. **Degradação graciosa.** Sem JavaScript o site continua legível: o conteúdo do
   terminal está no HTML, os projetos aparecem todos, a tela de boot nunca é exibida
   e as animações de entrada não escondem nada.

### Como o conteúdo vira tradução

Cada texto em `src/data` é um objeto com os três idiomas. No build,
`src/i18n/index.ts` achata os dicionários de interface **e** o conteúdo dos dados em um
único mapa `chave → texto` por idioma. O componente renderiza em pt-BR e marca o
elemento com `data-i18n="chave"`. No navegador, trocar de idioma só troca o
`textContent` — sem recarregar, sem `innerHTML`, sem conteúdo duplicado.

---

## Estrutura de pastas

```text
.
├── public/                      # servido como está
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── manifest.webmanifest
│   ├── images/
│   │   ├── profile/             # foto do Hero em 3 tamanhos (.webp)
│   │   ├── projects/            # capas dos projetos
│   │   ├── certificates/        # imagens dos certificados (.webp)
│   │   ├── testimonials/        # prints dos depoimentos (.webp)
│   │   └── social/              # imagem de compartilhamento (Open Graph)
│   └── documents/               # coloque aqui curriculo-jhosue.pdf
│
├── src/
│   ├── assets/styles/           # tokens, reset, global, animações, utilitários, a11y
│   ├── components/
│   │   ├── common/              # Button, Icon, Container, SectionHeader, Seo…
│   │   ├── layout/              # Header, Navigation, MobileMenu, Footer, Particles
│   │   ├── controls/            # ThemeToggle, LanguageToggle, CommandPaletteButton
│   │   ├── sections/            # uma seção da página por arquivo
│   │   ├── projects/            # card, grid e filtros
│   │   ├── skills/              # barras de competência e grade de tecnologias
│   │   ├── timeline/            # linha do tempo
│   │   ├── certificates/        # carrossel e visualizador ampliado
│   │   ├── testimonials/        # depoimentos de clientes
│   │   └── terminal/            # BootScreen, AnimatedTerminal, CommandPalette
│   ├── config/                  # site.ts, navigation.ts, social.ts, features.ts
│   ├── data/                    # projetos, serviços, skills, stack, timeline, comandos
│   ├── i18n/                    # pt-BR.ts, en-US.ts, es.ts, index.ts
│   ├── layouts/BaseLayout.astro
│   ├── pages/                   # index.astro, 404.astro
│   ├── scripts/                 # um módulo por comportamento
│   ├── services/contact/        # camada de provedores do formulário
│   ├── types/                   # modelos + schemas Zod
│   └── utils/                   # dom, storage, sanitize, accessibility, paths
│
├── tools/
│   ├── pdf-to-image.mjs         # converte PDFs de certificado em .webp
│   └── image-to-webp.mjs        # gera a foto do Hero em vários tamanhos
│
├── tests/
│   ├── unit/                    # Vitest
│   └── e2e/                     # Playwright
│
└── .github/workflows/deploy-pages.yml
```

---

## Instalação

Requer **Node.js 20.11 ou superior**.

```bash
npm install
```

---

## Desenvolvimento local

```bash
npm run dev
```

Abre em <http://localhost:8090> (porta fixa do projeto — a 8085 já é usada por
outro projeto nesta máquina). Os testes end-to-end usam a 8099, separada.

---

## Build

```bash
npm run build      # gera dist/
npm run preview    # serve dist/ em http://localhost:8090
```

A saída é estática pura — funciona em GitHub Pages, Cloudflare Pages, Netlify, Vercel
ou qualquer servidor de arquivos.

---

## Testes

```bash
npm run lint        # ESLint
npm run typecheck   # astro check (TypeScript estrito)
npm run test        # Vitest — 97 testes unitários
npm run test:e2e    # Playwright — 60 em desktop/mobile + 5 do fundo WebGL
```

Na primeira vez, instale o navegador do Playwright:

```bash
npx playwright install chromium
```

Cobertura dos testes unitários: alternância de tema, persistência de idioma, troca de
textos e atributos, filtros de projeto, resolução de comandos, validação e sanitização
do formulário, dados dos certificados e integridade do conteúdo.

Cobertura E2E: carregamento, ausência de erro no console, navegação por menu, menu
mobile (abrir/fechar/Escape/foco), tema, idioma, filtros, command palette (`Ctrl+K`,
`/`, `Escape`, comando `projetos`, tentativa de injeção de HTML), carrossel de
certificados (roda sozinho, pausa no botão, para com movimento reduzido), visualizador
ampliado (abre, navega por teclado e botões, fecha com Escape), validação e envio do
formulário, `rel` de links externos, skip link, link do currículo e ausência de rolagem
horizontal em 8 larguras (320 → 1920px).

---

## Personalização

**Onde alterar cada coisa:**

| O que                          | Onde                                                       |
| ------------------------------ | ---------------------------------------------------------- |
| Nome, marca, slogan            | `src/config/site.ts` → `brand`                              |
| Cargo / título profissional    | `src/config/site.ts` → `brand.professionalTitle`            |
| Textos do Hero                 | `src/config/site.ts` → `hero` e `src/i18n/*.ts` → `hero`     |
| Foto do Hero                   | `src/config/site.ts` → `photo` + `public/images/profile/`    |
| Biografia (3 idiomas)          | `src/data/owner.ts` → `owner.bio`                           |
| Diferenciais e idiomas falados | `src/data/owner.ts` → `highlights`, `languages`             |
| Indicadores numéricos          | `src/data/owner.ts` → `statistics`                          |
| E-mail, WhatsApp, redes        | `src/config/site.ts` → `contact`                            |
| Projetos                       | `src/data/projects.ts`                                      |
| Serviços                       | `src/data/services.ts`                                      |
| Certificados                   | `src/data/certificates.ts` + `public/images/certificates/`  |
| Depoimentos                    | `src/data/testimonials.ts` + `public/images/testimonials/` |
| Competências (barras)          | `src/data/skills.ts`                                        |
| Tecnologias (grade)            | `src/data/technologies.ts`                                  |
| Laboratório / terminal         | `src/data/lab.ts`                                           |
| Jornada profissional           | `src/data/timeline.ts`                                      |
| Comandos do terminal           | `src/data/terminalCommands.ts`                              |
| Cores e sombras                | `src/assets/styles/tokens.css`                              |
| Fontes                         | `src/assets/styles/tokens.css` → `--font-display`, `--font-body` |
| Currículo (PDF)                | `public/documents/` + `siteConfig.cvUrl`                    |
| Imagem social (Open Graph)     | `public/images/social/` + `siteConfig.seo.ogImage`          |
| URL do site                    | `PUBLIC_SITE_URL` no `.env` (ou `siteConfig.siteUrl`)       |
| Ligar/desligar recursos        | `src/config/features.ts`                                    |
| Ordem das seções no menu       | `src/config/navigation.ts`                                  |

### Placeholders

Campos escritos como `[INSERIR_EMAIL]`, `[QUANTIDADE]` ou `[ANO]` são **propositais**:
nenhum dado profissional foi inventado. Enquanto não forem preenchidos:

- links sociais não configurados **somem** da página (nunca viram `href="#"`);
- indicadores e períodos pendentes aparecem sinalizados visualmente;
- comandos da paleta que dependeriam desses links não são registrados.

### Ligar e desligar recursos

`src/config/features.ts`:

```ts
export const features = {
  bootScreen: true,
  particles: true,
  commandPalette: true,
  projectFilters: true,
  languageToggle: true,
  themeToggle: true,
  contactForm: true,
  scrollProgress: true,
  animatedTerminal: true,
  certificates: true,
  testimonials: true,
  shaderBackground: true,
};
```

Ao desligar, o componente **e** o script correspondente deixam de ser enviados ao
navegador — não é só esconder com CSS.

---

## Internacionalização

Três idiomas: **pt-BR** (padrão), **en-US** e **es**.

- Textos de interface: `src/i18n/pt-BR.ts`, `en-US.ts`, `es.ts`.
- `pt-BR.ts` é a referência de tipos: se faltar uma chave em outro idioma, o
  `npm run typecheck` falha.
- Conteúdo (projetos, serviços, timeline…) fica traduzido dentro do próprio dado.
- O idioma escolhido é salvo em `localStorage` na chave `portfolioLanguage`.
- Ao trocar: textos, atributos (`placeholder`, `aria-label`, `alt`), `lang` do `<html>`,
  `<title>` e a meta description são atualizados — **sem recarregar a página**.

Para adicionar um idioma: crie `src/i18n/xx.ts` tipado como `DictionaryShape`, registre
em `src/types/i18n.ts` (`LANGUAGES`, `HTML_LANG`, `OG_LOCALE`, `LANGUAGE_LABEL`,
`LANGUAGE_NAME`), adicione a chave em cada texto de `src/data` e inclua o código em
`siteConfig.supportedLanguages`.

---

## Tema

- Claro e escuro, alternados por `data-theme` no `<html>`.
- Apenas os **tokens de cor** mudam — a folha de estilo não é duplicada.
- Um script inline no `<head>` aplica o tema **antes da primeira pintura**: sem flash.
- Ordem de decisão: preferência salva → `siteConfig.theme.default` → `prefers-color-scheme`.
- Salvo em `localStorage` na chave `portfolioTheme`.
- O botão atualiza `aria-label`, `aria-pressed` e ícone.

Para trocar a identidade visual inteira, edite só `src/assets/styles/tokens.css`.

---

## Projetos

`src/data/projects.ts`. Cada item:

```ts
{
  id: 'meu-projeto',                 // kebab-case, único
  title: 'Meu Projeto',
  category: 'SAAS',                  // WEB | SAAS | AI | AUTOMATION | CRM | API | MOBILE
  year: '2025',
  featured: true,                    // destaques aparecem primeiro
  status: 'online',                  // online | development | private
  technologies: ['Golang', 'React'],
  projectUrl: 'https://exemplo.com', // ou null
  repositoryUrl: null,
  image: '/images/projects/meu.webp',// ou null → cartão gerado automaticamente
  shortDescription: { 'pt-BR': '…', 'en-US': '…', es: '…' },
  fullDescription:  { 'pt-BR': '…', 'en-US': '…', es: '…' },
  imageAlt:         { 'pt-BR': '…', 'en-US': '…', es: '…' },
}
```

Os filtros são gerados sozinhos a partir das categorias realmente usadas. Todos os
projetos ficam no HTML inicial (bom para busca); o filtro só usa `hidden`.

Use imagens **WebP ou AVIF**, proporção 16:10, largura de 640 a 960px.

### Grade ou carrossel — automático

Com **menos de 4** projetos a seção usa **grade**. A partir do **quarto**, vira
**carrossel** sozinho, com o mesmo motor dos certificados e depoimentos
(`src/scripts/carousel.ts`) — sem mexer em código.

Os filtros funcionam nos dois modos. No carrossel a lista é renderizada duas
vezes para emendar o loop; as cópias são escondidas junto com os originais,
mas **não entram na contagem** anunciada ao usuário. Se um filtro deixar a
faixa menor que a tela, a rotação para sozinha em vez de tremer no lugar.

### Cor por categoria

Cada categoria tem sua cor no chip e no brilho do cartão gerado, definidas em
`src/components/projects/ProjectCard.astro`:

| Categoria | Cor |
| --- | --- |
| WEB | verde `#21c07a` |
| SAAS | violeta `#6b4bff` |
| AI | coral `#ff6a3d` |
| AUTOMATION | ciano `#12a5c9` |
| CRM | rosa `#e05c9c` |
| API | âmbar `#f5a623` |
| MOBILE | azul `#5b7cfa` |

Projetos sem imagem ganham um cartão gerado: brilho na cor da categoria, grade
técnica, iniciais grandes e o ícone da categoria — nada de imagem quebrada.

---

## Serviços

`src/data/services.ts`. O campo `icon` referencia um ícone de
`src/components/common/Icon.astro` (`code`, `layers`, `sparkles`, `chat`, `plug`,
`workflow`, `bot`, `database`, `shield`, …). Para criar um novo ícone, adicione a
entrada no mapa `paths` daquele arquivo.

---

## Fundo animado (shader)

O site tem um fundo em **WebGL2** que cobre a página toda e usa um **shader
diferente para cada tema**:

- **Escuro** — nebulosa em movimento, em tons de verde/ciano da marca.
  Baseado no shader de nuvens de Matthias Hurrle ([@atzedent](https://twitter.com/atzedent)),
  adaptado aqui: uniforms de ponteiro removidos, menos camadas e paleta trocada.
- **Claro** — malha de cores (mesh gradient) escrita para este projeto: base
  creme com manchas de verde, violeta e coral passeando devagar.

Arquivos:

| O quê | Onde |
| --- | --- |
| Código GLSL dos dois shaders | `src/scripts/shaders/sources.ts` |
| Motor WebGL (TypeScript puro) | `src/scripts/shaderBackground.ts` |
| Elemento e opacidades | `src/components/layout/ShaderBackground.astro` |
| Liga/desliga | `src/config/features.ts` → `shaderBackground` |

### Como funciona a troca de tema

O motor observa o atributo `data-theme` do `<html>` com um `MutationObserver`
e recompila o shader correspondente. Por isso funciona tanto pelo botão quanto
pelo comando `tema` da command palette — sem código duplicado.

### Legibilidade

O contraste do texto é garantido pela **opacidade do canvas**, definida em
`ShaderBackground.astro`:

```css
.shader-bg canvas[data-shader-ready] { opacity: 0.92; }            /* claro  */
:root[data-theme='dark'] ... { opacity: 0.5; }                     /* escuro */
```

Subir esses valores deixa o fundo mais vistoso **e o texto menos legível**.
Se mexer, confira o contraste antes de publicar.

### Desempenho

- Renderiza a **60% da resolução da tela** (com teto de 1,6 milhão de pixels) e
  deixa o CSS esticar — fundo desfocado não perde nada e a GPU trabalha menos.
- Limitado a **30 quadros por segundo**.
- **Pausa** quando a aba fica escondida.
- **Não liga** quando: não há WebGL2, o usuário pediu `prefers-reduced-motion`,
  o navegador está em economia de dados, ou o aparelho tem ≤ 2 GB de memória.
  Nesses casos o canvas é removido do DOM e o site segue normal.

O canvas é `aria-hidden`, tem `pointer-events: none` e fica em
`z-index: var(--z-particles)` — não recebe cliques, não entra na navegação por
teclado e não afeta o layout.

### Voltar ao fundo anterior

Em `src/config/features.ts`:

```ts
shaderBackground: false,
```

Isso traz de volta o canvas de partículas (pontos ligados por linhas). A grade
de fundo continua nos dois casos.

---

## Foto do Hero

A foto de destaque aparece no lado direito do Hero (no mobile, **acima** do
título — é a primeira coisa que se vê).

### Trocar a foto

```bash
node tools/image-to-webp.mjs "C:/caminho/foto.png" public/images/profile jhosue 560,840,1120
```

Gera três `.webp` (para `srcset`) e imprime o tamanho de cada um. Depois ajuste
`src/config/site.ts` → `photo` se os nomes mudarem.

- **Proporção recomendada:** 4/5 (retrato).
- **`objectPosition`**: controla o recorte. `'50% 22%'` mantém o rosto no lugar
  certo quando a moldura corta a imagem — suba o segundo valor se o rosto ficar
  baixo demais.
- O texto alternativo fica em `src/i18n/*.ts` → `hero.photoAlt` (traduzido).

A moldura traz cantos de mira, uma linha de varredura animada, selo de status e
legenda com nome e cargo. A varredura e o efeito de hover são desligados por
`prefers-reduced-motion`. A imagem é carregada com `fetchpriority="high"`, por
estar acima da dobra.

O "perfil em código" que ficava no Hero foi para a seção **Sobre**
(`src/components/common/CodePanel.astro`).

---

## Certificados

Seção com carrossel que roda sozinho e visualizador ampliado.

**Fonte de dados:** `src/data/certificates.ts`
**Imagens:** `public/images/certificates/`

### Adicionar um certificado

Se você tem o PDF, converta primeiro:

```bash
node tools/pdf-to-image.mjs "C:/caminho/certificado.pdf"
```

O script renderiza a primeira página em `.webp` (1400px de largura, legível
ampliado), salva em `public/images/certificates/` e imprime o texto lido do PDF
para você conferir título, instituição e carga horária.

Depois adicione o bloco em `src/data/certificates.ts`:

```ts
{
  id: 'nome-do-curso',                                  // kebab-case, único
  title: 'Nome do Curso',
  issuer: 'Escola ou plataforma',
  year: '2026',
  workload: '40h',                                      // ou null
  image: '/images/certificates/nome-do-curso.webp',     // ou null
  credentialUrl: 'https://link-de-verificacao',         // ou null
}
```

A ordem da lista é a ordem do carrossel. Campos ainda não confirmados podem
ficar como `[ANO]` — o site marca visualmente como pendente em vez de inventar.
Com `image: null` o cartão mostra um selo gerado, sem imagem quebrada.

### Comportamento

- Rola sozinho a **30 px/s**, em loop infinito (a lista é duplicada por baixo dos panos).
- **Pausa** quando: o mouse está em cima, algo dentro recebe foco pelo teclado,
  a aba fica escondida, o visualizador está aberto, ou o usuário clica no botão de pausa.
- Com `prefers-reduced-motion` **não roda** — fica parado e navegável pelos botões.
- Clicar em um cartão abre o certificado em tela grande (até 74% da altura da tela).
- No visualizador: setas ← →, `Escape` fecha, foco preso dentro e devolvido ao
  cartão de origem, contador "3 de 14", link de verificação e "abrir em tamanho real".
- Todos os painéis já estão no HTML: trocar de certificado só alterna `hidden`,
  sem montar nada com `innerHTML`.

---

## Depoimentos

`src/data/testimonials.ts` + prints em `public/images/testimonials/`.

### Regra de ouro: `quote` é uma citação

Copie o texto **exatamente** como o cliente escreveu — sem corrigir, encurtar
ou traduzir. Por isso o depoimento aparece sempre no **idioma original**,
mesmo com o site em inglês ou espanhol; só os rótulos ao redor mudam.

### Adicionar um depoimento

```bash
# 1. converta o print do depoimento original
node tools/image-to-webp.mjs "print.png" public/images/testimonials nome-cliente 900,1400
```

```ts
// 2. src/data/testimonials.ts
{
  id: 'nome-cliente',
  author: 'Nome',
  company: 'Empresa',                  // ou null
  source: '99Freelas',                 // onde foi publicado
  project: 'Nome do serviço prestado',
  period: 'jul. 2026',
  rating: 5,                           // 0 a 5, ou null
  quote: 'Texto exatamente como o cliente escreveu…',
  proofImage: '/images/testimonials/nome-cliente-998.webp',  // ou null
  sourceUrl: 'https://…',              // ou null
}
```

### Carrossel ou grade — automático

Com **menos de 3** depoimentos a seção mostra uma **grade estática**. Repetir
o mesmo cartão para preencher a faixa fica evidente e passa má impressão.
A partir do **terceiro**, o carrossel liga sozinho, com o mesmo comportamento
do de certificados (roda, pausa no mouse/foco/aba oculta, para com movimento
reduzido).

Clicar em qualquer depoimento abre o texto completo e, quando houver,
o **print original** como comprovação.

O motor de carrossel é compartilhado: `src/scripts/carousel.ts` liga qualquer
elemento `[data-carousel]` da página.

---

## Timeline

`src/data/timeline.ts`. Tipos disponíveis: `career`, `education`, `project`,
`achievement`. Use `highlighted: true` no item atual.

Períodos ainda não confirmados ficam como `[ANO]` e são exibidos com marcação de
pendência — **nunca invente datas, empresas ou certificados**.

---

## Formulário de contato

Camada de provedores em `src/services/contact/`:

```ts
interface ContactProvider {
  readonly id: string;
  isConfigured(): boolean;
  send(data: ContactFormData): Promise<ContactResponse>;
}
```

Provedores prontos: `demo` (padrão), `formspree`, `emailjs`, `api` (endpoint próprio).
Escolha em `PUBLIC_CONTACT_PROVIDER`. Se o escolhido não estiver configurado, o sistema
cai automaticamente no **modo demonstração**, que valida tudo e avisa na tela que nada
foi enviado e onde configurar.

Já incluso: validação no cliente, honeypot antispam, limite de caracteres com contador,
botão desativado durante o envio, feedback em `aria-live="polite"`, sanitização das
entradas e **nenhum dado pessoal no console**.

Para criar um provedor novo, implemente a interface em
`src/services/contact/providers/` e registre no mapa de `contact.service.ts`.

---

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```env
PUBLIC_SITE_URL=https://seudominio.com.br
PUBLIC_BASE_PATH=/

PUBLIC_CONTACT_PROVIDER=demo
PUBLIC_FORMSPREE_ENDPOINT=
PUBLIC_EMAILJS_PUBLIC_KEY=
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
PUBLIC_CONTACT_API_URL=
```

> ⚠️ **Variáveis `PUBLIC_` não são segredos.** Tudo que começa com `PUBLIC_` é embutido
> no HTML/JS final e fica visível para qualquer visitante. Isso vale inclusive para as
> chaves do EmailJS, que são públicas por design do serviço — proteja restringindo os
> domínios permitidos no painel deles. **Nunca** coloque aqui chave privada, token com
> permissão de escrita ou senha. O `.env` está no `.gitignore`.

---

## Deploy

### GitHub Pages (automático)

O workflow `.github/workflows/deploy-pages.yml` roda a cada push na `main`:
instala com `npm ci` → lint → typecheck → testes → build → publica `dist/`.

1. No repositório: **Settings → Pages → Source: GitHub Actions**.
2. O `base` é resolvido sozinho pelo `actions/configure-pages`:
   `/` em domínio próprio, `/nome-do-repositorio/` em `usuario.github.io/repo/`.
3. Opcional: em **Settings → Secrets and variables → Actions → Variables**, adicione
   `PUBLIC_CONTACT_PROVIDER` e as demais variáveis do provedor de e-mail.

Todos os caminhos (imagens, CSS, JS, favicon, currículo, âncoras) passam pelo helper
`withBase()`, então funcionam em subpasta sem quebrar.

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20`
- Variáveis: `PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH=/` e as do formulário.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Em `Site settings → Environment variables`, defina `PUBLIC_SITE_URL` e `PUBLIC_BASE_PATH=/`.

### Vercel

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Variáveis de ambiente iguais às acima.

---

## Acessibilidade

Meta: **WCAG 2.2 nível AA**.

- HTML semântico: `header`, `nav`, `main`, `section`, `footer`, hierarquia de títulos correta.
- Skip link para o conteúdo principal.
- Navegação completa por teclado; foco sempre visível (`:focus-visible` com contorno).
- Menu mobile e command palette com `role="dialog"`, `aria-modal`, foco preso dentro,
  fechamento por `Escape` e foco devolvido ao botão de origem.
- Estados anunciados: `aria-expanded`, `aria-controls`, `aria-current`, `aria-pressed`,
  `aria-live` para resultados de filtro e feedback do formulário.
- Alvos de toque com no mínimo 44×44px.
- Alternativas textuais em todas as imagens; ícones decorativos com `aria-hidden`.
- Estados nunca dependem só de cor (há texto e forma junto).
- `prefers-reduced-motion` desliga digitação simulada, partículas, reveal e a tela de boot.
- Suporte a modo de alto contraste (`forced-colors`).

---

## Performance

- Saída estática; **um único** bundle JS, carregado como módulo com `defer`.
- Fontes self-hosted (`font-display: swap`), sem requisição a terceiros.
- Ícones SVG inline — zero requisições extras.
- `IntersectionObserver` para reveal, terminal, contadores e scroll spy.
- Listeners de scroll passivos, agrupados em `requestAnimationFrame`.
- Partículas com quantidade proporcional à tela, pausadas quando a aba está oculta e
  desligadas em `prefers-reduced-motion`, `saveData` ou aparelhos com pouca memória.
- Imagens com `width`/`height` declarados e `loading="lazy"` — sem layout shift.
- `zod` roda só no build e não entra no bundle do cliente.

---

## Licença

MIT — veja [LICENSE](./LICENSE).

O código é livre. **A identidade da marca Jhosue Labs, textos, projetos e imagens do
proprietário não são cobertos pela licença** e não devem ser reutilizados.
