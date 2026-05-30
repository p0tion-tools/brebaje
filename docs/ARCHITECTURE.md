# Brebaje Architecture

## Contents

1. [Overview](#overview)
2. [Monorepo Layout](#monorepo-layout)
3. [Backend — NestJS](#backend--nestjs)
4. [Frontend — Next.js 14](#frontend--nextjs-14)
5. [CLI — Commander.js](#cli--commanderjs)
6. [Website — Docusaurus 3](#website--docusaurus-3)
7. [Shared Package — @brebaje/actions](#shared-package--brebaje-actions)
8. [Data Model & Storage](#data-model--storage)
9. [Authentication](#authentication)
10. [Request Lifecycle & Data Flow](#request-lifecycle--data-flow)
11. [Key Patterns](#key-patterns)
12. [Infrastructure & CI](#infrastructure--ci)

---

## Overview

Brebaje is a Groth16 Phase 2 trusted setup ceremony coordination platform organized as a
pnpm monorepo. Four application surfaces share a single NestJS REST API as the authority
for all domain state:

- The **backend** owns ceremony state, contribution records, and file references.
- The **frontend** provides coordinator and observer UIs backed by React Query.
- The **CLI** drives participant contributions and coordinator operations from the terminal.
- The **website** publishes public documentation via Docusaurus.
- **@brebaje/actions** is a shared package that holds crypto, S3 storage, and snarkjs
  helpers used by the backend and (eventually) the CLI.

The product specification lives in [docs/PRD.md](./PRD.md).

---

## Monorepo Layout

```
brebaje/
├── apps/
│   ├── backend/        NestJS REST API — ceremony state authority
│   ├── frontend/       Next.js 14 App Router — coordinator + observer UI
│   ├── cli/            Commander.js ESM — participant contributions + coordinator ops
│   └── website/        Docusaurus 3 — public documentation
├── packages/
│   └── actions/        @brebaje/actions — shared crypto, storage, snarkjs helpers
├── docs/               ARCHITECTURE.md, PRD.md, DEVELOPER_GUIDE.md, SETUP.md
├── .github/workflows/  CI pipelines
├── eslint.config.mjs   ESLint v9 flat config (root)
├── .prettierrc.json    Prettier config
├── lerna.json          Versioning + changelog (conventional commits)
└── pnpm-workspace.yaml Workspace definitions
```

Tooling: pnpm ≥10 workspaces, Lerna for versioning, Husky + lint-staged for pre-commit
hooks (ESLint + Prettier on staged files).

---

## Backend — NestJS

### Layer Model

Clean Architecture with three layers:

1. **HTTP** — controllers receive requests, validate DTOs, delegate to services, return
   responses. Guards run between the HTTP layer and services.
2. **Domain** — services hold business rules and orchestrate DB reads/writes.
3. **Infrastructure** — Sequelize models (SQLite), AWS S3 (storage), AWS EC2/SSM (VM
   verification).

### Module Map

```
AppModule
├── AuthModule          GitHub / Ethereum / Cardano auth; exports JwtAuthGuard
├── UsersModule         User CRUD; exported by AuthModule for user lookups
├── ProjectsModule      Project CRUD + coordinator ownership enforcement
├── CeremoniesModule    Ceremony lifecycle state machine
├── CircuitsModule      Circuit config + queue state
├── ParticipantsModule  Participant enrollment + status tracking
├── ContributionsModule Contribution recording + step state machine
├── StorageModule       S3 pre-signed URL generation + multipart upload
├── VmModule            EC2 instance lifecycle + verification monitoring
└── HealthModule        Liveness endpoint
```

Global bootstrap (`app.config.ts`):
- `ValidationPipe` — `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- CORS — allowed origins from `CORS_ORIGINS` env var
- Swagger — OpenAPI doc at `/api` with JWT Bearer auth

Entry point: `src/main.ts`.

### Guards

Every protected route uses `JwtAuthGuard` first, then one or more resource guards:

| Guard | File | Purpose |
|-------|------|---------|
| JwtAuthGuard | `auth/guards/jwt-auth.guard.ts` | Validate Bearer token; attach user to `req.user` |
| IsProjectCoordinatorGuard | `projects/guards/is-project-coordinator.guard.ts` | User is coordinator of target project |
| ProjectOwnershipGuard | `projects/guards/project-ownership.guard.ts` | User owns the project resource |
| IsCeremonyCoordinatorGuard | `ceremonies/guards/is-ceremony-coordinator.guard.ts` | User is coordinator of ceremony's project |
| IsCircuitCoordinatorGuard | `circuits/guards/is-circuit-coordinator.guard.ts` | User is coordinator of circuit's ceremony |
| IsCircuitCreateCoordinatorGuard | `circuits/guards/is-circuit-create-coordinator.guard.ts` | Same, for circuit creation |
| IsParticipantOwnerOrCoordinatorGuard | `participants/guards/is-participant-owner-or-coordinator.guard.ts` | Participant or ceremony coordinator |
| IsContributionCoordinatorGuard | `contributions/guards/is-contribution-coordinator.guard.ts` | Ceremony coordinator only; attaches contribution to req |
| IsContributionParticipantOrCoordinatorGuard | `contributions/guards/is-contribution-participant-or-coordinator.guard.ts` | Participant or coordinator |

### Key Files

| File | Role |
|------|------|
| `src/types/enums.ts` | Canonical enums for all state machines |
| `src/contributions/contribution-transitions.ts` | Explicit state machine for contribution steps |
| `src/database/diagram.dbml` | DBML schema (source of truth for models) |
| `src/utils/constants.ts` | Env var names + defaults |
| `src/app.config.ts` | Global pipe, CORS, Swagger wiring |

---

## Frontend — Next.js 14

### Route Structure

```
app/
├── page.tsx                        /  — public landing
├── layout.tsx                      Root layout (AuthContext, QueryClientProvider)
├── ceremonies/[slug]/page.tsx      Ceremony detail (public)
├── coordinator/
│   ├── page.tsx                    Coordinator dashboard
│   └── projects/[id]/page.tsx      Project detail
├── blog/[slug]/page.tsx            Blog post
├── ppot/page.tsx                   Perpetual Powers of Tau info
└── auth/github/authorize-login/    GitHub OAuth callback handler
```

### Patterns

- **Server state:** TanStack React Query v5. All API calls live in hooks under
  `app/hooks/` (e.g., `useGetCeremonies`, `useGetCeremonyById`,
  `useGetCeremonyContributors`, `useGetCeremonyArtifacts`, `useGetLiveStatsByCeremonyId`,
  `useProjects`).
- **Auth:** `AuthContext` (`app/contexts/AuthContext.tsx`) stores JWT in `localStorage`
  and exposes `useAuth()`. Current browser auth supports **GitHub OAuth only**; Ethereum
  and Cardano auth is backend-ready but not yet wired in the frontend.
- **UI:** Tailwind CSS + Lucide React. Shared components in `app/components/ui/` and
  `app/components/shared/`; coordinator-specific in `app/components/coordinator/`.

---

## CLI — Commander.js

The CLI is ESM (`"type": "module"`) using Commander.js. Command groups live under
`apps/cli/src/`:

| Group | Commands |
|-------|---------|
| `auth/` | `login-github` (device flow), `logout`, `status`, `whoami` |
| `ceremonies/` | participant: `contribute`, `list`; coordinator: `create`, `delete`, `finalize`, `update` |
| `config/` | `path`, `new`, `gh-token`, `gh-token-scoped`, `name`, `ceremony-repo`, `migrate` |
| `perpetual-powers-of-tau/` | `new`, `download`, `contribute`, `auto-contribute`, `upload`, `verify`, `post-record`, `beacon`, `generate-upload-url`, `generate-download-url`, `generate-urls`, `generate-urls-unsafe` |
| `projects/` | `create` (from JSON template), `list` |
| `participants/` | `list` |
| `vm/` | `verify` |

The CLI does **not** currently consume `@brebaje/actions`; its storage and crypto helpers
are duplicated locally. Migrating to the shared package is a known gap.

---

## Website — Docusaurus 3

Static documentation site (`apps/website/`). Built and deployed to GitHub Pages via
`.github/workflows/deploy-docs.yml` on pushes to `main`.

---

## Shared Package — @brebaje/actions

`packages/actions/src/helpers/`:

| File | Exports |
|------|---------|
| `crypto.ts` | `calculateBlake2bHash(input)` — BLAKE2b-512 via `@noble/hashes` |
| `storage.ts` | `multiPartUploadAPI()`, `downloadCeremonyArtifact()`, `generateGetObjectPreSignedUrlAPI()`, `generatePreSignedUrlsPartsAPI()`, `completeMultiPartUploadAPI()`, `temporaryStoreCurrentContributionUploadedChunkDataAPI()`, `temporaryStoreCurrentContributionMultiPartUploadIdAPI()`, `openMultiPartUploadAPI()`, `checkIfObjectExistAPI()` |
| `authentication.ts` | `isCoordinatorAPI()`, `formatMessageForSIWE()` |
| `utils.ts` | `computeSmallestPowersOfTauForCircuit()`, `formatZkeyIndex()`, `sanitizeString()`, `getURLOfPowersOfTau()`, `convertBytesOrKbToGb()`, `convertToDoubleDigits()` |
| `fetch.ts` | `fetchRetry()` — exponential back-off, socket timeout, configurable max duration |
| `constants.ts` | PoT file URLs + sizes, genesis zKey index (`"00000"`), VM bootstrap script filename |

Currently imported by: **backend only**. CLI depends on the same logic but has local
copies; consolidation is pending.

---

## Data Model & Storage

### Sequelize Models (SQLite)

```
User ──────────────────────────────┐
 └─(has many)─▶ Project            │
                 └─(has many)─▶ Ceremony ─(has many)─▶ Participant ─(has many)─▶ Contribution
                                    └─(has many)─▶ Circuit ──────────────────────────────────▶ Contribution
```

| Model | File | Key Fields |
|-------|------|-----------|
| User | `users/user.model.ts` | `id`, `displayName` (indexed), `provider` (enum), `walletAddress`, `avatarUrl`, timestamps |
| Project | `projects/project.model.ts` | `id`, `name`, `contact`, `coordinatorId` (FK → User) |
| Ceremony | `ceremonies/ceremony.model.ts` | `id`, `projectId`, `state` (enum), `type` (enum), `start_date`, `end_date`, `penalty`, `authProviders` (JSON) |
| Circuit | `circuits/circuit.model.ts` | `id`, `ceremonyId`, `name`, `sequencePosition`, `timeoutMechanismType` (enum), `currentContributor`, `contributors` (JSON), `verification` (JSON), `artifacts` (JSON), `pot` |
| Participant | `participants/participant.model.ts` | `id`, `userId`, `ceremonyId` (unique together), `status` (enum), `contributionStep` (enum), `tempContributionData` (JSON), `timeout` (JSON array) |
| Contribution | `contributions/contribution.model.ts` | `id`, `circuitId`, `participantId`, `zkeyIndex`, `valid`, timing fields, `files` (JSON), `verificationSoftware` (JSON), `beacon` (JSON) |

All enums are defined in `src/types/enums.ts`. The DBML source is
`src/database/diagram.dbml`.

### File Storage

Artifacts are stored in **AWS S3**. The backend issues pre-signed URLs; clients upload
and download directly without routing large files through the API server.

- **Bucket naming:** `{project-name}-{ceremony-description}-{AWS_CEREMONY_BUCKET_POSTFIX}`
  (sanitized via `sanitizeString()` in `@brebaje/actions`).
- **Chunk size:** `CONFIG_STREAM_CHUNK_SIZE_IN_MB` (default 50 MB).
- **Resumable uploads:** multipart upload ID and completed-parts list are stored in
  `participant.tempContributionData` (JSON) between restarts.
- **Presigned URL TTL:** `AWS_PRESIGNED_URL_EXPIRATION` (default 3600 s).

### VM Verification

Heavy proof verification runs on dedicated **AWS EC2** instances managed by `VmModule`
(`vm.service.ts` + `vm.controller.ts`). SSM (`@aws-sdk/client-ssm`) is used to run
commands on instances. `verification-monitoring.service.ts` polls verification progress.
Lighter contributions can be verified server-side (`VerificationMachineType.server`).

---

## Authentication

All auth logic is in `apps/backend/src/auth/auth.service.ts`. Three providers are
supported:

| Provider | Flow | Key Endpoints |
|----------|------|--------------|
| GitHub | OAuth Authorization Code Flow + Device Flow | `GET /auth/github/client-id`, `POST /auth/github/user`, `GET /auth/github/authorize-login` |
| Ethereum | Sign-In with Ethereum — EIP-4361 (SIWE) | `POST /auth/eth/generate-nonce`, `POST /auth/eth/verify-signature` |
| Cardano | Wallet nonce + signature | `POST /auth/cardano/generate-nonce`, `POST /auth/cardano/verify-signature` |

Every successful auth returns a **short-lived JWT** (default expiry `1d`, from
`JWT_EXPIRES_IN`). `JwtAuthGuard` validates Bearer tokens on protected routes and
attaches the user record to `req.user`.

Per-ceremony **provider whitelist** (`ceremony.authProviders` JSON column): the system
rejects participant enrollment when the user's provider is not in the ceremony's whitelist.

---

## Request Lifecycle & Data Flow

```
Browser / CLI
      │
      ▼ HTTP (REST)
 Controller  ←── DTO (class-validator + class-transformer via ValidationPipe)
      │
      ▼ Guard chain
 JwtAuthGuard → Resource guard (loads entity, checks ownership)
      │
      ▼
   Service  ──── Sequelize ──── SQLite
                    │
                    ├── AWS S3 (pre-signed URL generation, bucket ops)
                    └── AWS EC2 / SSM (VM verification lifecycle)
```

Frontend path:
```
Page component
  └─ React Query hook (app/hooks/)
       └─ fetch → Authorization: Bearer <jwt>
            └─ Backend REST API
```

CLI path:
```
Commander action handler
  └─ HTTP client (axios / node-fetch)
       └─ Authorization: Bearer <jwt stored in .env or config file>
            └─ Backend REST API
```

---

## Key Patterns

### DTO Validation

Every request body, param, and query is typed as a DTO class decorated with
`class-validator`. The global `ValidationPipe` (configured in `app.config.ts`) rejects
requests with unknown or invalid fields before they reach services.

### Guard Chain

Guards follow a consistent pattern:

1. Extract authenticated user from `req.user` (set by `JwtAuthGuard`).
2. Load the target entity from the DB using the route param.
3. Compare ownership or role; throw `ForbiddenException` / `NotFoundException` on mismatch.
4. Optionally attach the loaded entity to `req` (e.g., `IsContributionCoordinatorGuard`
   attaches the `Contribution` so the controller skips a redundant DB call).

### Contribution State Machine

`src/contributions/contribution-transitions.ts` implements the explicit state machine for
a participant's contribution steps:

```
DOWNLOADING → COMPUTING → UPLOADING → VERIFYING → COMPLETED
```

Invalid transitions throw; the service never writes an illegal state.

### Swagger / OpenAPI

Every controller uses `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth`.
The generated spec is served at `/api` (configured in `configureSwagger()` in
`app.config.ts`).

---

## Infrastructure & CI

### Required Environment Variables

Defined with defaults in `apps/backend/src/utils/constants.ts`:

| Category | Variable | Default |
|----------|----------|---------|
| Server | `PORT` | `3000` |
| Database | `DB_SQLITE_STORAGE_PATH` | `.db/data.sqlite3` |
| | `DB_SQLITE_SYNCHRONIZE` | `true` |
| JWT | `JWT_SECRET` | `defaultSecret` |
| | `JWT_EXPIRES_IN` | `1d` |
| GitHub OAuth | `GITHUB_CLIENT_ID` | required |
| | `GITHUB_CLIENT_SECRET` | required |
| | `GITHUB_OAUTH_APP_CALLBACK` | required |
| AWS | `AWS_ACCESS_KEY_ID` | required |
| | `AWS_SECRET_ACCESS_KEY` | required |
| | `AWS_REGION` | `us-east-1` |
| | `AWS_CEREMONY_BUCKET_POSTFIX` | `brebaje-testing` |
| | `AWS_AMI_ID` | (Ubuntu 22.04 AMI) |
| CORS | `CORS_ORIGINS` | `http://localhost:3000,http://localhost:3001` |
| Upload | `CONFIG_STREAM_CHUNK_SIZE_IN_MB` | `50` |

### CI Pipelines

`.github/workflows/`:

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `lint.yml` | push to main, PRs | install → build packages → ESLint |
| `backend.yml` | push to main, PRs | install → build → unit tests → coverage → e2e tests |
| `frontend.yml` | push to main, PRs | install → build packages → Next.js build |
| `cli.yml` | push to main, PRs | install → build packages → CLI tests |
| `actions.yml` | push to main, PRs | install → build packages → actions tests |
| `deploy-docs.yml` | push to main, PRs | Docusaurus build → GitHub Pages (deploy on main only) |

All pipelines use Node 22.17.x and pnpm 10.24.0. Concurrent duplicate runs are cancelled.
