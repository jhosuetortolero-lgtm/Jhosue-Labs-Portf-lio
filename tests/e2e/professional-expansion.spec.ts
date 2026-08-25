import { test, expect } from '@playwright/test';

const legacySectionIds = [
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

const expansionSectionIds = [
  'professional-positioning',
  'leadspark',
  'cybersecurity',
  'security-lab',
  'security-infrastructure',
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('portfolioBootSeen', '1');
    window.localStorage.setItem('portfolioLanguage', 'pt-BR');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('adiciona a expansão depois de todas as seções existentes', async ({ page }) => {
  const sectionIds = await page
    .locator('#main-content > section')
    .evaluateAll((sections) => sections.map((section) => section.id));

  expect(sectionIds).toEqual([...legacySectionIds, ...expansionSectionIds]);
  await expect(page.locator('[data-expansion-section]')).toHaveCount(5);
});

test('apresenta o posicionamento, a Leadspark e as áreas de segurança', async ({ page }) => {
  await expect(page.locator('#professional-positioning h2')).toHaveText('Jhosue Tortolero');
  await expect(page.locator('#professional-positioning')).toContainText(
    'Engenheiro de Software · IA · Cibersegurança',
  );
  await expect(page.locator('#professional-positioning')).toContainText('Fundador da Leadspark');

  await expect(page.locator('#leadspark h2')).toHaveText('LEADSPARK');
  await expect(page.locator('#leadspark')).toContainText('Leadspark Software');
  await expect(page.locator('#leadspark')).toContainText('Leadspark AI');
  await expect(page.locator('#leadspark')).toContainText('Leadspark Cyber');
  await expect(page.locator('#leadspark')).toContainText('Leadspark Security Lab');

  await expect(page.locator('#cybersecurity')).toContainText('Segurança Ofensiva');
  await expect(page.locator('#cybersecurity')).toContainText('Segurança Defensiva');
  await expect(page.locator('#cybersecurity')).toContainText('Segurança de Aplicações');
});

test('mantém a linguagem de conhecimento e prática na stack complementar', async ({ page }) => {
  const stack = page.locator('#security-infrastructure');
  await expect(stack.locator('h2')).toHaveText('Segurança e Infraestrutura');
  await expect(stack).toContainText('Tecnologia · Conhecimento · Prática · Laboratórios');
  await expect(stack).toContainText('OWASP');
  await expect(stack).toContainText('Burp Suite');
  await expect(stack).toContainText('Docker');
  await expect(stack).toContainText('Redes');
});

test('traduz a expansão e o rodapé sem recarregar a página', async ({ page }) => {
  await expect(page.locator('#leadspark')).toContainText('Sistemas');
  await expect(page.locator('.footer__bottom')).toContainText(
    'Leadspark Software House e Cibersegurança',
  );
  await expect(page.locator('.footer__credit')).toContainText('Hacker Ético');

  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="en-US"]').click();

  await expect(page.locator('#leadspark')).toContainText('Systems');
  await expect(page.locator('#leadspark')).toContainText('Digital platforms');
  await expect(page.locator('#security-lab')).toContainText('Tracks for future documentation');
  await expect(page.locator('.footer__bottom')).toContainText(
    'Leadspark Software House and Cybersecurity',
  );
  await expect(page.locator('.footer__credit')).toContainText('Ethical Hacker');

  await page.locator('[data-language-button]').click();
  await page.locator('[data-language-option="es"]').click();

  await expect(page.locator('#professional-positioning')).toContainText(
    'Ingeniero de Software · IA · Ciberseguridad',
  );
  await expect(page.locator('#leadspark')).toContainText(
    'Leadspark es una empresa tecnológica centrada en ingeniería de software',
  );
  await expect(page.locator('#cybersecurity h2')).toHaveText('Ciberseguridad');
  await expect(page.locator('#security-infrastructure h2')).toHaveText(
    'Seguridad e Infraestructura',
  );
  await expect(page.locator('.footer__bottom')).toContainText(
    'Leadspark Software House y Ciberseguridad',
  );
  await expect(page.locator('.footer__credit')).toContainText('Hacker Ético');
});
