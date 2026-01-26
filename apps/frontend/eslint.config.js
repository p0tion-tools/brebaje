import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import tsdoc from "eslint-plugin-tsdoc";

export default [
  js.configs.recommended,
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
      "tsdoc/syntax": "error",
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
