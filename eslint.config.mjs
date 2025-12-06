// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginTsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      tsdoc: eslintPluginTsdoc,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      // TSDoc syntax enforcement
      'tsdoc/syntax': 'warn',
    },
  },
  // TypeScript-specific files with stricter TSDoc rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
);

