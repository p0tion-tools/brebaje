# Tech context

Implementation rules for AI and contributors.

## Role (AI Persona)

- **Identity:** Senior JavaScript/TypeScript Engineer; React (frontend) and NestJS (backend). Prioritize type safety, clean code, modern JS.
- **Traits:** Pragmatic (simple over clever); security-conscious (OWASP, JWT, XSS, CSRF); type-strict (no `any`); async-aware.
- **Domain:** Phase 2 Trusted Setup, Groth16; coordinator vs participant; ceremony and participant states; full lifecycle: initialization → queueing → contribution → validation → finalization; timeouts and exhumation.

---

---

## Architecture

- **Pattern:** Clean Architecture; dependencies point inwards; core logic has no external deps.
- **Layers:** (1) **Domain** — entities and business rules (enums, models from DBML; invariants in services). (2) **Application** — use cases and orchestration (NestJS services, CLI handlers, @brebaje/actions). (3) **Infrastructure** — DB (Sequelize/SQLite), storage (S3 presigned URLs), crypto (snarkjs), HTTP (NestJS), UI (Next.js).
- **Backend:** NestJS feature modules (controller, service, DTOs, guards); domain = Sequelize models + `types/enums.ts` from DBML. **Frontend:** Next.js App Router; server state = TanStack React Query; auth via context. **CLI:** Commander.js groups; shared logic in @brebaje/actions.
- **Data flow:** Backend: Request → Controller → Service → DB. Frontend: Action → Component → API client → Backend.

### Project Structure

```
root/
├── apps/backend/     # NestJS; src/auth, ceremonies, circuits, contributions, database, participants, projects, storage, users, vm, types
├── apps/frontend/    # Next.js 14; app/components, contexts, hooks, sections, auth, coordinator, ceremonies
├── apps/cli/         # Commander.js ESM; auth, ceremonies, config, participants, perpetual-powers-of-tau, projects, vm
├── apps/website/     # Docusaurus 3
├── packages/actions/ # @brebaje/actions — crypto, snarkjs, upload/download (backend + CLI)
├── .context/         # non-technical.md, technical.md (AI and contributor context)
├── docs/             # DEVELOPER_GUIDE.md, SETUP.md
```

- **Schema:** Source of truth = `apps/backend/src/database/diagram.dbml` (DBML). Enums and models generated from it (`types/enums.ts`, `*.model.ts`). Do not edit generated model files. After schema changes: update DBML → run `pnpm run generate-models` (or `pnpm convert` / `pnpm setup-dml-to-database` per backend README).

---

## Coding Style

- **Principles:** WET first (extract after evidence); DRY via @brebaje/actions for shared logic; KISS; SOLID; explicit over implicit; composition over inheritance; avoid premature abstraction.
- **Naming:** Variables/functions `camelCase`; constants `UPPER_SNAKE_CASE`; classes/components `PascalCase`; files: **kebab-case** backend/CLI (e.g. `user-service.ts`), **PascalCase** React components; test files `.spec.ts`. Booleans: `is`/`has`/`should`. Interfaces/types `PascalCase`.
- **TypeScript:** Strict mode; no `any`; `unknown` + type guards when needed. Explicit return types for public functions and API handlers. Shared types: backend `types/enums.ts` and `types/`; align with DBML/Sequelize; frontend/CLI align with DTOs/Swagger.
- **Comments:** Explain _why_; TSDoc for public APIs (ESLint eslint-plugin-tsdoc). Prefer self-documenting names.
- **Git:** Conventional Commits — `<type>(<scope>): <subject>`; types: feat, fix, docs, style, refactor, test, chore.
- **Workflow:** DB changes → DBML first → generate models. Write tests with new features. Backend: NestJS layout (controller, service, module, DTOs). Frontend: hooks in `app/hooks/` with `use` prefix; components by feature under `app/components/`.

---

## Error Handling

- **Principles:** Fail fast (validate at API boundary); graceful degradation (meaningful errors, not generic 500); no silent failures (catch, log, re-throw or typed return); consistent API error format.
- **Backend:** Exception filters + custom exceptions → HTTP status and JSON (`statusCode`, `message`, `error?`). DTOs with class-validator + ValidationPipe → 400 with validation details.
- **Frontend:** Error boundaries for component-tree failures; React Query error state for API errors; user-friendly messages; log details for debugging.
- **Logging:** Structured (NestJS logger or JSON); include request IDs / user IDs; INFO milestones, WARN recoverable, ERROR failures.

---

## Tech Stack and Libraries

- **Runtime:** Node ≥22.17.1; pnpm ≥10.0.0 (engines). TypeScript strict; ES2022+. CLI: ESM (`"type": "module"`); use `import`/`export`, `import.meta.url`.
- **Format/Lint:** Prettier (single quotes, semicolons, 2 spaces, trailing commas). ESLint v9 flat config (`eslint.config.mjs`); TSDoc validated. Root: `pnpm lint`, `pnpm prettier:fix`. Pre-commit: ESLint, Prettier.
- **Validation (backend):** class-validator on DTOs (`@IsString()`, `@IsNumber()`, etc.) in feature `dto/`; class-transformer for mapping/excludes. ValidationPipe globally. Zod optional for env or one-off schemas.
- **DB:** Sequelize + @nestjs/sequelize + sequelize-typescript. Models from DBML; inject in services; use transactions for multi-step writes. SQLite (env-configurable); parameterized queries only.
- **Auth:** @nestjs/jwt (short-lived access tokens); JwtAuthGuard + strategy. Providers: GitHub (code + device flow), Ethereum (SIWE), Cardano (Mesh). Identity stored by provider type. CLI: GitHub device flow; tokens for API. No raw secrets in code; env for client IDs/secrets.
- **@brebaje/actions:** Shared package for backend and CLI (crypto, snarkjs, hashing, upload/download). Import from `@brebaje/actions`; rebuild after changes. Uses snarkjs, @noble/hashes, mime-types, cli-progress, @adobe/node-fetch-retry.
- **Frontend data:** TanStack React Query for server state; hooks in `app/hooks/` calling backend; consistent query keys; JWT in Authorization (e.g. from AuthContext). Type responses to DTOs/Swagger.

### Crypto (Phase 2)

- **Operations:** newZKey (R1CS+PoT→genesis zKey); contribute (lastZkeyPath, nextZkeyPath, contributorId, entropy → zKey + transcript); beacon (lastZkeyPath, finalZkeyPath, coordinatorId, beaconValue, numExpIterations → final zKey + transcript); verify (chain from R1CS+PoT or first zKey); exportVerificationKey; exportSolidityVerifier.
- **Hashes:** BLAKE2b for files (zKey, transcript, R1CS, PoT, vKey, verifier); SHA-256 for beacon value. Contribution hash from transcript.
- **Pre/post:** contribute/beacon require valid inputs and writable output; verify requires existing paths and compatible artifacts.

---

## Framework Rules

- **NestJS:** One feature per module (`*.module.ts`, `*.controller.ts`, `*.service.ts`, optional dto/, guards/, Sequelize model). Controllers thin; delegate to services. DTOs with @Body/@Param/@Query; guards (JwtAuthGuard, IsCeremonyCoordinatorGuard, IsProjectCoordinatorGuard) at controller/method level. Constructor injection; @nestjs/config for env. REST + Swagger (@ApiTags, @ApiOperation, @ApiResponse).
- **Next.js:** App Router only (`app/`); `layout.tsx`, `page.tsx`, nested folders = routes. Function components + hooks; shared UI in `app/components/`; server state = React Query; auth = context; TailwindCSS; Lucide React; file-based routing; Link/useRouter from next/navigation.
- **Commander.js:** Command groups from entry (e.g. setUpAuthCommands, setUpCeremonyCommands); ESM; `.option()`, `.argument()`, `.action()`; `program.parseAsync(process.argv)`; dotenv for .env; use @brebaje/actions for shared logic.
- **API:** Resource URLs (e.g. `/ceremonies`, `/ceremonies/:id`); standard methods and status codes; uniform success/error shape; document with Swagger.

---

## Security

- **Input:** Validate all inputs at API boundary (class-validator on DTOs); sanitize to prevent XSS and SQL injection. No internal errors or stack traces to client.
- **Auth:** Short-lived JWTs; refresh in httpOnly cookies. RBAC. No secrets in Git; .env + validated config (e.g. Zod at startup).
- **API:** CORS with explicit origins (no `*` in production). Parameterized queries only (Sequelize). Rate limiting (e.g. express-rate-limit) for brute-force protection.
- **Frontend:** No secrets in bundle; backend proxy if needed. Cookies: Secure, HttpOnly, SameSite.
- **Transport:** HTTPS in production; security headers (X-Content-Type-Options, X-Frame-Options, etc.).
- **Ceremony:** Verify every contribution cryptographically before acceptance; reject invalid and update queue. Artifact integrity: BLAKE2b for zKey, transcript, R1CS, PoT; store beacon value and SHA-256. Beacon value must be public and unpredictable.

---

## Testing

- **Strategy:** Automated tests for new features; isolated tests (no global state or order). Unit (pure logic, mock DB/APIs); integration (API + test server/DB); component (React Testing Library, mock API e.g. MSW). Fixtures/factories (e.g. faker); mocks for isolation. Aim ~80% coverage on critical paths. Include verification and ceremony flow (chain validity, state transitions, timeout/penalty/exhumation) where applicable.
- **Tools:** Jest for backend, CLI, packages/actions. Test files `.spec.ts`. Root `pnpm test` (Lerna); backend `pnpm test` (unit), `pnpm test:e2e` (supertest vs NestJS app; test DB, not dev DB). Frontend: React Testing Library; MSW for API mocks; Faker if used. CLI/packages: Jest, mock fs/API as needed.
