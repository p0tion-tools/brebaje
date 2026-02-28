# Project Structure: Brebaje Monorepo

Brebaje is a **pnpm workspaces** monorepo (with Lerna for running scripts across packages). The layout reflects the actual codebase so new contributors and AI assistants can navigate and contribute consistently.

```text
root/
├── apps/
│   ├── backend/              # NestJS API (SQLite, Sequelize)
│   │   ├── src/
│   │   │   ├── auth/         # Auth (GitHub OAuth, Ethereum SIWE, Cardano)
│   │   │   ├── ceremonies/   # Ceremony CRUD, guards
│   │   │   ├── circuits/      # Circuit CRUD, guards
│   │   │   ├── contributions/
│   │   │   ├── database/      # DBML schema, model generation
│   │   │   ├── health/
│   │   │   ├── participants/
│   │   │   ├── projects/
│   │   │   ├── storage/       # Presigned URLs, S3
│   │   │   ├── users/
│   │   │   ├── vm/            # Verification monitoring / lifecycle
│   │   │   ├── types/         # Enums (from DBML), declarations
│   │   │   ├── utils/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/              # E2E
│   │   └── package.json
│   ├── frontend/              # Next.js 14 (App Router)
│   │   ├── app/               # App Router: pages, layouts, routes
│   │   │   ├── components/    # UI and feature components
│   │   │   ├── contexts/      # e.g. AuthContext
│   │   │   ├── hooks/         # e.g. useGetCeremonies, useGetCeremonyById
│   │   │   ├── sections/      # Page sections (homepage, ceremonies)
│   │   │   ├── auth/          # Auth callback (e.g. GitHub)
│   │   │   ├── coordinator/   # Coordinator UI
│   │   │   ├── ceremonies/   # Public ceremony pages
│   │   │   └── ...
│   │   └── package.json
│   ├── cli/                   # Commander.js CLI (ESM)
│   │   ├── src/
│   │   │   ├── auth/          # Auth commands (e.g. GitHub device flow)
│   │   │   ├── ceremonies/
│   │   │   ├── config/
│   │   │   ├── participants/
│   │   │   ├── perpetual-powers-of-tau/
│   │   │   ├── projects/
│   │   │   ├── vm/
│   │   │   └── index.ts
│   │   ├── build/             # Compiled output
│   │   └── package.json
│   └── website/               # Docusaurus 3 (documentation site)
│       ├── docs/
│       └── package.json
├── packages/
│   └── actions/              # @brebaje/actions — shared logic for CLI, backend, docs
│       ├── src/               # Crypto helpers, snarkjs wrappers, upload/download, etc.
│       └── package.json
├── docs/                      # Developer guide, setup (see docs/DEVELOPER_GUIDE.md)
├── .context/                  # AI-ready context (this folder)
├── .p0tion/architecture/      # Protocol specs (FRS, domain model, state machine, crypto)
├── package.json               # Root: pnpm workspaces, lint, test, build
├── eslint.config.mjs          # ESLint v9 flat config (TSDoc, Prettier)
└── .husky/                    # Pre-commit: ESLint, Prettier
```

## Module Definitions

- **`apps/backend/`**: NestJS application. Feature modules: `AuthModule`, `UsersModule`, `ProjectsModule`, `CeremoniesModule`, `CircuitsModule`, `ParticipantsModule`, `ContributionsModule`, `StorageModule`, `VmModule`, `HealthModule`. Database: Sequelize with SQLite; schema is defined in `src/database/diagram.dbml`; enums and models are generated/derived from it (`types/enums.ts`, `*.model.ts`). DTOs use **class-validator** and **class-transformer**. API documented with **Swagger**.
- **`apps/frontend/`**: Next.js 14 with **App Router** (`app/`). State: **TanStack React Query** for server state; React context for auth. Styling: **TailwindCSS**. Components under `app/components/`, `app/sections/`, route pages under `app/`, `app/coordinator/`, `app/ceremonies/`, etc.
- **`apps/cli/`**: **Commander.js** CLI; **ESM** (`"type": "module"`). Command groups: auth, ceremonies, config, participants, perpetual-powers-of-tau, projects, vm. Uses `@brebaje/actions`, **snarkjs**, **dotenv**, GitHub OAuth device flow.
- **`apps/website/`**: **Docusaurus 3** for documentation; can reference Typedoc for API docs.
- **`packages/actions/`**: Shared package **@brebaje/actions**. Used by backend and CLI. Contains crypto/contribution helpers, snarkjs, hashing, upload/download utilities. Build: `tsc`; tests: Jest.

## Brebaje Domain Mapping

The main domain concepts from the p0tion protocol—**Ceremony**, **Circuit**, **Participant**, **Contribution**, **Waitlist**—map onto the codebase as follows:

- **Domain layer:** Ceremony, circuit, contribution, participant, and waitlist entities and invariants (e.g. ceremony state transitions, participant status rules). In the backend these appear as **Sequelize models** and **enums** (`types/enums.ts`) derived from `diagram.dbml`; business rules live in **services**.
- **Application layer:** Ceremony lifecycle (initialization, queueing, contribution, validation, finalization), queue coordination, contribution verification orchestration, timeout and exhumation logic. Implemented in NestJS **services** and **VmModule**; CLI reuses logic via **@brebaje/actions** where applicable.
- **Infrastructure layer:** SQLite (Sequelize), object storage (e.g. AWS S3 via presigned URLs in **StorageModule**), cryptographic provider (snarkjs, used in backend and **@brebaje/actions**), HTTP API (NestJS), UI (Next.js).

## Schema and Code Generation

- **Database schema:** `apps/backend/src/database/diagram.dbml` (DBML). Enums and table definitions drive `types/enums.ts` and Sequelize models. Use the project’s scripts (e.g. `generate-models` / DBML-to-Sequelize) to regenerate models after schema changes; do not edit generated files by hand when avoidable.
