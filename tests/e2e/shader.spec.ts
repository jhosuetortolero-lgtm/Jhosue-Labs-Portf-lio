import { test, expect } from '@playwright/test';

/**
 * Fundo animado em WebGL.
 *
 * Roda em um projeto próprio do Playwright (ver playwright.config.ts) porque
 * precisa do renderizador por software, que é lento demais para ficar junto
 * com o resto da suíte.
 */

test.describe.configure({ timeout: 120_000 });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
    window.localStorage.setItem('portfolioTheme', 'dark');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#hero')).toBeVisible();
});

test('compila e troca de shader junto com o tema', async ({ page }) => {
  const canvas = page.locator('[data-shader-bg]');

  // Sem WebGL2 o script remove o canvas — a página segue normal.
  if ((await canvas.count()) === 0) {
    await expect(page.locator('#hero')).toBeVisible();
    test.skip(true, 'WebGL2 indisponível neste ambiente');
    return;
  }

  await expect(canvas).toHaveAttribute('data-shader-ready', 'true', { timeout: 20_000 });
  await expect(canvas).toHaveAttribute('data-shader-theme', 'dark');

  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(canvas).toHaveAttribute('data-shader-theme', 'light', { timeout: 20_000 });

  // E volta.
  await page.locator('[data-theme-toggle]').click();
  await expect(canvas).toHaveAttribute('data-shader-theme', 'dark', { timeout: 20_000 });
});

test('não recebe cliques nem aparece para leitores de tela', async ({ page }) => {
  const wrapper = page.locator('.shader-bg');
  await expect(wrapper).toHaveAttribute('aria-hidden', 'true');

  const eventos = await wrapper.evaluate((el) => getComputedStyle(el).pointerEvents);
  expect(eventos).toBe('none');

  // O conteúdo continua clicável por cima dele.
  await page.locator('#hero a[href="#projects"]').first().click();
  await expect(page.locator('#projects')).toBeInViewport({ ratio: 0.1 });
});

test('não entra na navegação por teclado', async ({ page }) => {
  const focavel = await page
    .locator('.shader-bg')
    .evaluate((el) => el.querySelectorAll('a,button,input,[tabindex]').length);
  expect(focavel).toBe(0);
});

test('não roda com movimento reduzido', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // O script remove o canvas e o CSS esconde o container.
  expect(await page.locator('[data-shader-bg]').count()).toBe(0);

  await context.close();
});

test('não deixa erro no console', async ({ page }) => {
  const erros: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') erros.push(m.text());
  });
  page.on('pageerror', (e) => erros.push(e.message));

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.locator('[data-theme-toggle]').click();
  await page.waitForTimeout(1500);

  const relevantes = erros.filter((e) => !e.includes('curriculo-jhosue.pdf'));
  expect(relevantes).toEqual([]);
});
