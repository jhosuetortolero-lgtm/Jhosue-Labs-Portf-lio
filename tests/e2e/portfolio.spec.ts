import { test, expect, type Page } from '@playwright/test';

/** Pula a tela de boot para não interferir nos testes. */
async function gotoHome(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
    /*
      O navegador de teste está em inglês, então o site trocaria de idioma
      sozinho ao carregar — e o resultado dependeria do instante em que o
      teste olha o DOM. Fixamos pt-BR (o idioma do HTML gerado no build) para
      a suíte ser determinística. Os testes que trocam de idioma continuam
      clicando no seletor normalmente.
    */
    // Só na primeira carga: este script roda também nos reloads, e
    // sobrescrever aqui desfaria a troca de idioma feita pelo teste.
    if (!window.localStorage.getItem('portfolioLanguage')) {
      window.localStorage.setItem('portfolioLanguage', 'pt-BR');
    }
  });
  // domcontentloaded: não espera fontes/imagens, que não importam para estes testes.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#hero')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await gotoHome(page);
});

test('abre a home com a marca Jhosue Labs', async ({ page }) => {
  await expect(page).toHaveTitle(/Jhosue Labs/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText('Jhosue Labs');
});

test('o título entra letra a letra e continua legível para leitores de tela', async ({ page }) => {
  const titulo = page.locator('#hero-title');
  await expect(titulo).toBeVisible();

  // As letras viram spans individuais...
  const letras = await page.locator('#hero-title .split__letter').count();
  expect(letras).toBeGreaterThan(30);

  // ...mas o texto completo continua num nó acessível, sem espaços picotados.
  const acessivel = await page.locator('#hero-title .visually-hidden').textContent();
  expect(acessivel).toBe('Construo sistemas que transformam ideias em resultados.');

  // O bloco decorativo é escondido de leitores de tela.
  await expect(page.locator('#hero-title .split__visual')).toHaveAttribute('aria-hidden', 'true');
});

test('o título é remontado ao trocar de idioma', async ({ page }) => {
  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="en-US"]').click();
  await page.waitForTimeout(400);

  await expect(page.locator('#hero-title .visually-hidden')).toHaveText(
    'I build systems that turn ideas into results.',
  );
  // Continua dividido em letras depois da troca.
  expect(await page.locator('#hero-title .split__letter').count()).toBeGreaterThan(30);
});

test('a linha de especialidades troca sozinha', async ({ page }) => {
  const atual = page.locator('[data-rotator-item][data-current]');
  await expect(atual).toHaveCount(1);

  const primeira = await atual.textContent();
  await page.waitForTimeout(3200);
  const segunda = await page.locator('[data-rotator-item][data-current]').textContent();
  expect(segunda).not.toBe(primeira);
});

test('com movimento reduzido as especialidades aparecem todas de uma vez', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const reduced = await context.newPage();
  await reduced.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
  });
  await reduced.goto('/', { waitUntil: 'domcontentloaded' });
  await reduced.waitForTimeout(600);

  // Sem rotação: todos os itens ficam visíveis.
  const itens = reduced.locator('[data-rotator-item]');
  const total = await itens.count();
  for (let i = 0; i < total; i += 1) {
    await expect(itens.nth(i)).toBeVisible();
  }

  await context.close();
});

/* Os testes do fundo em WebGL ficam em tests/e2e/shader.spec.ts, em um
   projeto separado do Playwright (precisa de GPU emulada, que e lenta). */

test('a foto de destaque carrega no hero com texto alternativo', async ({ page }) => {
  const foto = page.locator('#hero .photo__image');
  await expect(foto).toBeVisible();

  // alt preenchido e imagem realmente decodificada pelo navegador
  const alt = await foto.getAttribute('alt');
  expect(alt?.length ?? 0).toBeGreaterThan(20);

  const carregou = await foto.evaluate(
    (img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0,
  );
  expect(carregou).toBe(true);

  // srcset com os três tamanhos
  const srcset = await foto.getAttribute('srcset');
  expect(srcset).toContain('560w');
  expect(srcset).toContain('1120w');
});

test('no mobile a foto aparece antes do título', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);

  const fotoY = await page.locator('#hero .photo__frame').evaluate((el) => el.getBoundingClientRect().top);
  const tituloY = await page.locator('#hero-title').evaluate((el) => el.getBoundingClientRect().top);
  expect(fotoY).toBeLessThan(tituloY);
});

test('não tem erro no console', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  // O currículo em PDF é opcional — 404 dele não conta como erro de código.
  const relevantes = errors.filter((error) => !error.includes('curriculo-jhosue.pdf'));
  expect(relevantes).toEqual([]);
});

test('todas as seções esperadas existem', async ({ page }) => {
  const secoes = [
    'hero',
    'about',
    'services',
    'projects',
    'lab',
    'stack',
    'journey',
    'certificates',
    'testimonials',
    'contact',
  ];
  for (const id of secoes) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('navega pelo menu e marca a seção ativa', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.getByRole('button', { name: /menu/i }).click();
    await page.locator('[data-mobile-link][data-nav-link="projects"]').click();
  } else {
    await page.locator('#primary-navigation [data-nav-link="projects"]').click();
  }

  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.1 });
});

test('menu mobile abre, fecha com Escape e devolve o foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator('[data-mobile-toggle]');
  const menu = page.locator('[data-mobile-menu]');

  await toggle.click();
  await expect(menu).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('alterna o tema e mantém a escolha depois de recarregar', async ({ page }) => {
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');

  await page.locator('[data-theme-toggle]').click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(html).toHaveAttribute('data-theme', after ?? 'dark');
});

test('alterna o idioma sem recarregar a página', async ({ page }) => {
  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="en-US"]').click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await expect(page.locator('#projects h2')).toHaveText('Projects and products');
  await expect(page).toHaveTitle(/Software, Automation/);

  // A escolha sobrevive ao recarregar.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});

test('filtra projetos por categoria', async ({ page }) => {
  const cards = page.locator('[data-project]');
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);

  await page.locator('[data-filter="SAAS"]').click();
  await expect(page.locator('[data-filter="SAAS"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project][data-category="SAAS"]').first()).toBeVisible();
  await expect(page.locator('[data-project][data-category="WEB"]').first()).toBeHidden();

  await page.locator('[data-filter="ALL"]').click();
  await expect(cards.first()).toBeVisible();
});

test('command palette abre, executa "projetos" e fecha com Escape', async ({ page }) => {
  const palette = page.locator('[data-palette]');

  await page.keyboard.press('Control+k');
  await expect(palette).toBeVisible();

  await page.locator('[data-palette-input]').fill('projetos');
  await page.keyboard.press('Enter');

  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.1 });

  await page.keyboard.press('Control+k');
  await expect(palette).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});

test('command palette abre com "/" mas não enquanto digita no formulário', async ({ page }) => {
  await page.keyboard.press('/');
  await expect(page.locator('[data-palette]')).toBeVisible();
  await page.keyboard.press('Escape');

  const nameInput = page.locator('#contact-name');
  await nameInput.scrollIntoViewIfNeeded();
  await nameInput.click();
  await nameInput.pressSequentially('/');
  await expect(page.locator('[data-palette]')).toBeHidden();
  await expect(nameInput).toHaveValue('/');
});

test('comando desconhecido não injeta HTML', async ({ page }) => {
  await page.keyboard.press('Control+k');
  await page.locator('[data-palette-input]').fill('<img src=x onerror=alert(1)>');
  await page.keyboard.press('Enter');

  const output = page.locator('[data-palette-output]');
  await expect(output).toBeVisible();
  await expect(output.locator('img')).toHaveCount(0);
});

test('formulário valida campos obrigatórios', async ({ page }) => {
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-contact-submit]').click();

  await expect(page.locator('[data-error-for="name"]')).not.toBeEmpty();
  await expect(page.locator('[data-error-for="email"]')).not.toBeEmpty();
  await expect(page.locator('[data-error-for="message"]')).not.toBeEmpty();
});

test('formulário aceita envio válido e responde em modo demonstração', async ({ page }) => {
  /*
    Só faz sentido quando o build NAO tem provedor configurado. Com um
    provedor real (`PUBLIC_CONTACT_PROVIDER` no .env ou nas vars do CI) este
    envio sairia de verdade e encheria a caixa de entrada a cada execução.
  */
  const provider = await page
    .locator('[data-contact-form]')
    .getAttribute('data-provider');
  test.skip(provider !== 'demo', `build usa o provedor "${provider}", não o modo demonstração`);

  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('#contact-name').fill('Maria Souza');
  await page.locator('#contact-email').fill('maria@empresa.com.br');
  await page.locator('#contact-type').selectOption('saas');
  await page
    .locator('#contact-message')
    .fill('Quero um sistema de gestão com integração de WhatsApp e cobrança automática.');
  await page.locator('input[name="consent"]').check();

  await page.locator('[data-contact-submit]').click();
  await expect(page.locator('[data-contact-feedback]')).not.toBeEmpty({ timeout: 10_000 });
});

test('carrossel de certificados anda sozinho e pausa no botão', async ({ page }) => {
  const viewport = page.locator('#certificates [data-carousel-viewport]');
  await page.locator('#certificates').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const antes = await viewport.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1500);
  const depois = await viewport.evaluate((el) => el.scrollLeft);
  expect(depois).toBeGreaterThan(antes);

  // Botão de pausa congela a rotação.
  await page.locator('#certificates [data-carousel-toggle]').click();
  await expect(page.locator('#certificates [data-carousel-toggle]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const pausado = await viewport.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1000);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(pausado);
});

test('carrossel para com movimento reduzido', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const reduced = await context.newPage();
  await reduced.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
  });
  await reduced.goto('/#certificates', { waitUntil: 'domcontentloaded' });
  await reduced.waitForTimeout(1200);

  const viewport = reduced.locator('#certificates [data-carousel-viewport]');
  const antes = await viewport.evaluate((el) => el.scrollLeft);
  await reduced.waitForTimeout(1200);
  expect(await viewport.evaluate((el) => el.scrollLeft)).toBe(antes);

  await context.close();
});

test('clicar em um certificado amplia, navega e fecha com Escape', async ({ page }) => {
  const lightbox = page.locator('[data-certificate-lightbox]');
  await page.locator('#certificates').scrollIntoViewIfNeeded();

  await page.locator('[data-certificate-open="0"]').first().click();
  await expect(lightbox).toBeVisible();
  await expect(page.locator('[data-lightbox-index]')).toHaveText('1');

  // Seta do teclado passa para o próximo.
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-lightbox-index]')).toHaveText('2');

  // Botão de anterior volta.
  await page.locator('[data-lightbox-prev]').click();
  await expect(page.locator('[data-lightbox-index]')).toHaveText('1');

  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
});

test('o visualizador mostra só um certificado por vez', async ({ page }) => {
  await page.locator('#certificates').scrollIntoViewIfNeeded();
  await page.locator('[data-certificate-open="0"]').first().click();

  const visiveis = page.locator('[data-lightbox-panel]:not([hidden])');
  await expect(visiveis).toHaveCount(1);
});

test('depoimento abre em diálogo com o texto completo e o print original', async ({ page }) => {
  await page.locator('#testimonials').scrollIntoViewIfNeeded();

  // Espera o cartão parar de animar (reveal de entrada) antes de clicar.
  const cartao = page.locator('[data-testimonial-open="0"]').first();
  await expect(cartao).toBeVisible();
  await cartao.click();

  const dialogo = page.locator('[data-testimonial-dialog]');
  await expect(dialogo).toBeVisible();
  await expect(page.locator('[data-testimonial-author]')).toContainText('Rodrigo');

  // Texto completo (no cartão fica cortado em 6 linhas).
  await expect(dialogo.locator('.tdialog__quote p')).toContainText('Nota 10');

  // Print de comprovação carregado de verdade.
  // É `loading="lazy"`: só começa a baixar quando o diálogo abre, então
  // esperamos a decodificação terminar em vez de checar na hora.
  const prova = dialogo.locator('.tdialog__proof img');
  await expect(prova).toBeVisible();
  await expect
    .poll(
      () =>
        prova.evaluate(
          (img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0,
        ),
      { timeout: 10_000 },
    )
    .toBe(true);

  await page.keyboard.press('Escape');
  await expect(dialogo).toBeHidden();
});

test('o depoimento é citação: continua no idioma original ao trocar o site', async ({ page }) => {
  const trecho = 'Excelente profissional';
  await expect(page.locator('#testimonials .quote__text').first()).toContainText(trecho);

  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="en-US"]').click();
  await page.waitForTimeout(500);

  // Rótulos traduzem...
  await expect(page.locator('#testimonials h2')).toHaveText('What clients say');
  // ...mas a citação do cliente, não.
  await expect(page.locator('#testimonials .quote__text').first()).toContainText(trecho);
});

test('a barra de progresso escreve código conforme a rolagem', async ({ page }) => {
  const barra = page.locator('[data-scroll-progress]');
  await expect(barra).toHaveAttribute('aria-valuenow', '0');

  await page.evaluate(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, total * 0.5);
  });
  await page.waitForTimeout(500);

  const estado = await page.evaluate(() => {
    const container = document.querySelector('[data-scroll-progress]');
    const escrito = document.querySelector<HTMLElement>('[data-scroll-progress-bar]');
    const cursor = document.querySelector<HTMLElement>('[data-scroll-progress-caret]');
    return {
      valor: Number(container?.getAttribute('aria-valuenow') ?? '0'),
      escrito: Number.parseFloat(escrito?.style.width ?? '0'),
      cursor: Number.parseFloat(cursor?.style.left ?? '0'),
    };
  });

  // Perto da metade, e o cursor acompanha a ponta do código escrito.
  expect(estado.valor).toBeGreaterThan(35);
  expect(estado.valor).toBeLessThan(65);
  expect(Math.abs(estado.escrito - estado.cursor)).toBeLessThan(1);
});

test('a faixa de código não cobre o título ao navegar por âncora', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.getByRole('button', { name: /menu/i }).click();
    await page.locator('[data-mobile-link][data-nav-link="projects"]').click();
  } else {
    await page.locator('#primary-navigation [data-nav-link="projects"]').click();
  }
  await page.waitForTimeout(900);

  const coberto = await page.evaluate(() => {
    const titulo = document.querySelector('#projects h2');
    const faixa = document.querySelector('[data-scroll-progress]');
    if (!titulo || !faixa) return false;
    return titulo.getBoundingClientRect().top < faixa.getBoundingClientRect().bottom;
  });
  expect(coberto).toBe(false);
});

test('o rodapé traz a marca, a detentora e o crédito de autoria', async ({ page }) => {
  const rodape = page.locator('.footer__bottom');

  // Nomes próprios não mudam de idioma.
  await expect(rodape).toContainText('Jhosue Labs');
  await expect(rodape).toContainText('Leadspark Software House');

  await expect(rodape).toContainText('é uma marca registrada de');
  await expect(rodape).toContainText('Todos os direitos reservados');
  await expect(rodape).toContainText('Desenvolvido por Jhosue');
});

test('links externos usam rel de segurança', async ({ page }) => {
  const externos = page.locator('a[target="_blank"]');
  const total = await externos.count();
  expect(total).toBeGreaterThan(0);

  for (let index = 0; index < total; index += 1) {
    const rel = await externos.nth(index).getAttribute('rel');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  }
});

test('não há link vazio href="#"', async ({ page }) => {
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test('o botão do currículo aponta para o PDF do idioma ativo', async ({ page }) => {
  // Há um PDF por idioma; `cv.ts` troca o href e o nome do download sem
  // recarregar a página. O teste antigo esperava um arquivo único e ficou
  // para trás quando o currículo passou a ser por idioma.
  const link = page.locator('a[data-cv-link]').first();
  await expect(link).toHaveAttribute('href', /curriculo-jhosue-pt-BR\.pdf$/);
  await expect(link).toHaveAttribute('download', /-PT\.pdf$/);

  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="en-US"]').click();
  await expect(link).toHaveAttribute('href', /curriculo-jhosue-en-US\.pdf$/);
  await expect(link).toHaveAttribute('download', /-EN\.pdf$/);

  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="es"]').click();
  await expect(link).toHaveAttribute('href', /curriculo-jhosue-es\.pdf$/);
  await expect(link).toHaveAttribute('download', /-ES\.pdf$/);
});

test('skip link leva ao conteúdo principal', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('sem rolagem horizontal em nenhuma largura', async ({ page }) => {
  const larguras = [320, 375, 430, 768, 1024, 1280, 1440, 1920];

  for (const width of larguras) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `largura ${width}px`).toBeLessThanOrEqual(1);
  }
});
