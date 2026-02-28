# Language Rules: TypeScript & Node.js

## Versioning

- **Node.js:** Target **Node >=22.17.1** (enforced in root and backend `package.json` engines). Use pnpm (>=10.0.0) as the package manager; npm/yarn are disabled via engines.
- **TypeScript:** Use strict mode across apps and packages. Target ES2022+ or as required by NestJS/Next.js/CLI.
- **Module system:** Backend and frontend use TypeScript with their framework’s module resolution. **CLI** uses **ESM** (`"type": "module"` in `apps/cli/package.json`); use `import`/`export` and `import.meta.url` where needed. Avoid `require` in new code.

## Async/Await

- Use `async/await` for all I/O (DB, HTTP, file system). Avoid blocking the main event loop; use async APIs.

## Typing

- **Strict:** No `any`; use `unknown` and type guards when the type is truly unknown. Enable strict compiler options.
- **Path aliases:** Backend uses `src/` aliases (e.g. `src/utils/constants`). Frontend can use `@/` or similar if configured in `tsconfig.json`. Use path aliases for cleaner imports.

## Tooling

- **Formatting:** **Prettier** (single quotes, semicolons, 2-space indent, trailing commas, ~80 character line where practical). Run `pnpm prettier:fix` at root; pre-commit runs Prettier on staged files.
- **Linting:** **ESLint v9** with **flat config** (`eslint.config.mjs` at root). Includes TypeScript ESLint, Prettier integration, and **TSDoc** syntax validation (eslint-plugin-tsdoc). Run `pnpm lint` at root; fix with `pnpm lint:fix` where applicable.
- **Build:** Backend: `nest build`. Frontend: `next build`. CLI: `tsc` (output in `build/`). Packages (e.g. actions): `tsc`. Root: `pnpm build` runs Lerna (can ignore website if needed).
