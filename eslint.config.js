import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // Scripts de configuração e ferramentas rodam em Node.
    files: ['*.config.{js,mjs,ts}', 'tests/e2e/*.mjs', 'tools/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    /**
     * tools/pdf-to-image.mjs roda parte do código dentro do navegador
     * (page.evaluate), então usa APIs de DOM em um arquivo Node.
     */
    files: ['tools/**/*.mjs'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        atob: 'readonly',
        Image: 'readonly',
        Uint8Array: 'readonly',
      },
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);
