import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as eslintJs from '@eslint/js';
import * as prettierRecommended from 'eslint-plugin-prettier/recommended';
import * as tsdocPlugin from 'eslint-plugin-tsdoc';
import * as globalsModule from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Handle CommonJS default exports
const eslint = /** @type {typeof import('@eslint/js')} */ (
  'default' in eslintJs ? eslintJs.default : eslintJs
);
const eslintPluginPrettierRecommended = /** @type {import('eslint').Linter.Config} */ (
  'default' in prettierRecommended ? prettierRecommended.default : prettierRecommended
);
const tsdoc = 'default' in tsdocPlugin ? tsdocPlugin.default : tsdocPlugin;
const globals = /** @type {typeof import('globals')} */ (
  'default' in globalsModule ? globalsModule.default : globalsModule
);

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'jest.config.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      tsdoc: tsdoc,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
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
