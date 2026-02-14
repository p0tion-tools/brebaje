import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import tsdoc from "eslint-plugin-tsdoc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,ts,tsx,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // React globals
        React: "readonly",
        JSX: "readonly",
        // Web APIs
        fetch: "readonly",
        URLSearchParams: "readonly",
        URL: "readonly",
        window: "readonly",
        document: "readonly",
        // Node.js globals (for Next.js)
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettier,
      react: react,
      tsdoc: tsdoc,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          printWidth: 80,
          trailingComma: "es5",
          singleAttributePerLine: true,
        },
      ],
      "tsdoc/syntax": "warn",
      "react/jsx-max-props-per-line": [1, { maximum: 1 }],
      "react/jsx-first-prop-new-line": [1, "multiline"],
      // Allow unused vars that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
    ],
  },
];
