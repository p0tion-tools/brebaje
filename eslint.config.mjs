// @ts-check
import * as eslintJs from "@eslint/js";
import * as prettierRecommended from "eslint-plugin-prettier/recommended";
import * as tsdocPlugin from "eslint-plugin-tsdoc";
import * as globalsModule from "globals";
import tseslint from "typescript-eslint";
import * as prettierPlugin from "eslint-plugin-prettier";
import * as typescriptPlugin from "@typescript-eslint/eslint-plugin";

// Handle CommonJS default exports
const eslint = /** @type {typeof import('@eslint/js')} */ (
  "default" in eslintJs ? eslintJs.default : eslintJs
);
const eslintPluginPrettierRecommended = /** @type {import('eslint').Linter.Config} */ (
  "default" in prettierRecommended ? prettierRecommended.default : prettierRecommended
);
const tsdoc = "default" in tsdocPlugin ? tsdocPlugin.default : tsdocPlugin;
const globals = /** @type {typeof import('globals')} */ (
  "default" in globalsModule ? globalsModule.default : globalsModule
);
const prettier = "default" in prettierPlugin ? prettierPlugin.default : prettierPlugin;
const typescript = "default" in typescriptPlugin ? typescriptPlugin.default : typescriptPlugin;

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/pnpm-lock.yaml",
      "**/package-lock.json",
      "**/docusaurus.config.js",
      "**/sidebars.js",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "@typescript-eslint": typescript,
      tsdoc: tsdoc,
      prettier: prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
    rules: {
      "prettier/prettier": "error",
      // TSDoc syntax enforcement
      "tsdoc/syntax": "error",
      // Allow unused variables prefixed with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // TypeScript-specific files with stricter TSDoc rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "tsdoc/syntax": "error",
    },
  },
);
