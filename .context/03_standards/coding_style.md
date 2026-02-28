# Universal Coding Standards (JavaScript/TypeScript)

## General Principles

- **DRY (Don't Repeat Yourself):** Extract common logic; use `@brebaje/actions` for shared crypto/API helpers.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering.
- **SOLID:** Strictly adhere to SOLID principles.
- **Explicit over Implicit:** Prefer explicit code over "magic".
- **Composition over Inheritance:** Use composition for better flexibility.

## Naming Conventions

- **Variables & Functions:** `camelCase` (descriptive; no single letters unless in short loops).
- **Constants:** `UPPER_SNAKE_CASE` (e.g. `MAX_RETRIES`); `camelCase` for config objects.
- **Classes & Components:** `PascalCase` (e.g. `UserService`, `CeremonyCard`).
- **Files:** **kebab-case** for backend/CLI/packages (e.g. `user-service.ts`, `create-ceremony.dto.ts`). **PascalCase** for React components (e.g. `CeremonyCard.tsx`, `AttributeCard.tsx`) is acceptable where already used in the frontend.
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

## Import Organization

1. External dependencies (NestJS, React, Next, etc.).
2. Internal packages (e.g. `@brebaje/actions`).
3. Relative imports.
4. Type-only imports: use `import type` where possible.

Example (backend):

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { User } from "../types";
import { UserService } from "./user.service";
```

## Git: Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Format:** `<type>(<scope>): <subject>` with optional body and footer.
- **Scope:** Optional (e.g. `backend`, `frontend`, `cli`, `ceremonies`). Keeps history and changelogs clear for contributors and AI.
