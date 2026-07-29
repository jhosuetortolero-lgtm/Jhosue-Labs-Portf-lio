import { defineConfig, devices } from '@playwright/test';

/**
 * Os testes usam uma porta própria (8099) para não disputar a 8085 com o
 * servidor de desenvolvimento nem com outro projeto rodando na máquina.
 */
const PORT = 8099;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 1,
  // A máquina roda outros projetos ao mesmo tempo: poucos workers, sem disputa.
  workers: 2,
  timeout: 60_000,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },

  projects: [
    // Suíte principal: sem GPU emulada, para rodar rápido.
    {
      name: 'desktop',
      testIgnore: /shader\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      testIgnore: /shader\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    /*
     * O fundo em WebGL precisa de GPU. No headless usamos o renderizador por
     * software (swiftshader), que é MUITO lento — por isso ele fica em um
     * projeto separado, senão contaminaria o tempo de toda a suíte.
     */
    {
      name: 'shader',
      testMatch: /shader\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: {
          args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
        },
      },
    },
  ],

  // Serve o site já construído — é isso que vai para produção.
  webServer: {
    command: 'npm run build && npm run preview:e2e',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
