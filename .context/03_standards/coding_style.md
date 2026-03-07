# Universal Coding Standards (JavaScript/TypeScript)

## General Principles

- **"WET" First Approach:** Prefer "Write Everything Twice" (WET) over "Don't Repeat Yourself" (DRY) for new features to ensure abstractions are discovered through evidence rather than predicted through guesswork.
- **DRY (Don't Repeat Yourself):** Extract common logic; use `@brebaje/actions` for shared crypto/API helpers.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering.
- **SOLID:** Strictly adhere to SOLID principles.
- **Explicit over Implicit:** Prefer explicit code over "magic".
- **Composition over Inheritance:** Use composition for better flexibility.
- **Premature abstractions:** Avoid premature abstractions.

## Naming Conventions

- **Variables & Functions:** `camelCase` (descriptive; no single letters unless in short loops).
- **Constants:** `UPPER_SNAKE_CASE` (e.g. `MAX_RETRIES`); `camelCase` for config objects.
- **Classes & Components:** `PascalCase` (e.g. `UserService`, `CeremonyCard`).
- **Files:** **kebab-case** for backend/CLI/packages (e.g. `user-service.ts`, `create-ceremony.dto.ts`). **PascalCase** for React components (e.g. `CeremonyCard.tsx`), **camelCase** for utilities. **Test files** use the `.spec.ts` suffix (e.g. `ceremonies.service.spec.ts`). **DTOs** use descriptive kebab-case names (e.g. `create-ceremony.dto.ts`, `update-ceremony.dto.ts`).
- **Booleans:** Prefix with `is`, `has`, `should` (e.g. `isValid`).
- **Interfaces/Types:** `PascalCase` (e.g. `UserProfile`).

## TypeScript

- **Strict mode:** Enable strict TypeScript; avoid `any`; use `unknown` when type is truly unknown.
- **Explicit return types:** Use explicit return types for public functions and API handlers.
- **Shared types:** Prefer interfaces for object shapes. Backend: use `types/enums.ts` and `types/` for domain types; align with DBML/Sequelize models. Frontend/CLI: align with backend DTOs or Swagger; shared logic types can live in `@brebaje/actions` or app-local types.

## Comments & Documentation

- **Why, not What:** Comment _why_ the code does something (business context).
- **TSDoc:** Use **TSDoc** for public APIs and non-obvious behavior. TSDoc syntax is validated by ESLint (`eslint-plugin-tsdoc`); follow the project’s TSDoc guide if present (e.g. `docs/TSDOC_GUIDE.md`).
- **Self-documenting code:** Prioritize clear names over comments.

## Git: Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Format:** `<type>(<scope>): <subject>` with optional body and footer.
- **Scope:** Optional (e.g. `backend`, `frontend`, `cli`, `ceremonies`). Keeps history and changelogs clear for contributors and AI.

## Development Workflow

- **Database changes:** Always update `apps/backend/src/database/diagram.dbml` first; then run the database generation commands (e.g. `pnpm run generate-models` in apps/backend, or `pnpm convert` / `pnpm setup-dml-to-database` as documented).
- **Tests:** Write tests for new features (unit tests alongside services and controllers; E2E where appropriate). Prefer writing or updating tests as part of the same change.
- **Code organization:** Backend modules follow the NestJS pattern (controller, service, module, DTOs). Frontend hooks are prefixed with `use` and live in `app/hooks/`. Shared types are centralized in `apps/backend/src/types/`. Organize components by feature (e.g. under `app/components/` by feature), not by type alone.
