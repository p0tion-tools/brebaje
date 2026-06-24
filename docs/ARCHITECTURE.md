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

Tooling: **pnpm ≥10 workspaces** (local package linking), **Lerna** (versioning + changelog from Conventional Commits), **Husky + lint-staged** (pre-commit gate: ESLint + Prettier on staged files only, keeping commits clean without linting the whole repo).

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

- `ValidationPipe` — `whitelist: true` (strips undeclared fields), `forbidNonWhitelisted: true` (rejects requests with unknown fields entirely — security boundary), `transform: true` (converts raw JSON into typed DTO instances — avoids manual casting)
- CORS — allowed origins from `CORS_ORIGINS` env var
- Swagger — OpenAPI doc at `/api` with JWT Bearer auth

Entry point: `src/main.ts`.

### Guards

Every protected route uses `JwtAuthGuard` first, then one or more resource guards:

| Guard                                       | File                                                                       | Purpose                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JwtAuthGuard                                | `auth/guards/jwt-auth.guard.ts`                                            | Validate Bearer token; attach user to `req.user`                                                                                                                          |
| IsProjectCoordinatorGuard                   | `projects/guards/is-project-coordinator.guard.ts`                          | User is coordinator of the project supplied in the **request body** (`projectId`) — used on action routes like `POST /ceremonies` where there is no project ID in the URL |
| ProjectOwnershipGuard                       | `projects/guards/project-ownership.guard.ts`                               | User is coordinator of the project supplied in the **route param** (`:id`) — used on resource routes like `PATCH /projects/:id` and `DELETE /projects/:id`                |
| IsCeremonyCoordinatorGuard                  | `ceremonies/guards/is-ceremony-coordinator.guard.ts`                       | User is coordinator of ceremony's project                                                                                                                                 |
| IsCircuitCoordinatorGuard                   | `circuits/guards/is-circuit-coordinator.guard.ts`                          | User is coordinator of circuit's ceremony                                                                                                                                 |
| IsCircuitCreateCoordinatorGuard             | `circuits/guards/is-circuit-create-coordinator.guard.ts`                   | Same, for circuit creation                                                                                                                                                |
| IsParticipantOwnerOrCoordinatorGuard        | `participants/guards/is-participant-owner-or-coordinator.guard.ts`         | Participant or ceremony coordinator                                                                                                                                       |
| IsContributionCoordinatorGuard              | `contributions/guards/is-contribution-coordinator.guard.ts`                | Ceremony coordinator only; attaches contribution to req                                                                                                                   |
| IsContributionParticipantOrCoordinatorGuard | `contributions/guards/is-contribution-participant-or-coordinator.guard.ts` | Participant or coordinator                                                                                                                                                |

### Key Files

| File                                            | Role                                                                                                                                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts`                                   | Entry point — bootstraps the NestJS app and applies global config                                                                                                                                   |
| `src/app.config.ts`                             | Wires global pipe, CORS, and Swagger — touch this before adding any global middleware                                                                                                               |
| `src/types/enums.ts`                            | Source of truth for all state machines — all valid states and transitions are defined here                                                                                                          |
| `src/contributions/contribution-transitions.ts` | Enforces contribution step ordering — invalid transitions throw here, never in services                                                                                                             |
| `src/database/diagram.dbml`                     | Entity relationship reference diagram — renderable at dbdiagram.io for a visual overview of the schema. Kept in sync with the Sequelize models; the models are the authoritative schema definition. |
| `src/utils/constants.ts`                        | Env var names and defaults — check here before adding a new environment variable                                                                                                                    |

---

## Frontend — Next.js 14

### Route Structure

```
app/
├── page.tsx                              /  — public landing
├── layout.tsx                            Root layout (AuthContext, QueryClientProvider)
├── ceremonies/[slug]/page.tsx            Ceremony detail (public)
├── coordinator/
│   ├── page.tsx                          Coordinator dashboard
│   └── projects/[id]/page.tsx           Project detail
├── blog/page.tsx                         Blog listing
├── blog/[slug]/page.tsx                  Blog post
├── ppot/page.tsx                         Perpetual Powers of Tau info
└── auth/github/authorize-login/page.tsx  GitHub OAuth callback handler
```

### Patterns

- **Server state:** TanStack React Query v5. All API calls live in hooks under
  `app/hooks/` (e.g., `useGetCeremonies`, `useGetCeremonyById`,
  `useGetCeremonyContributors`, `useGetCeremonyArtifacts`, `useGetLiveStatsByCeremonyId`,
  `useProjects`).
- **Auth:** `AuthContext` (`app/contexts/AuthContext.tsx`) stores JWT in `localStorage`
  and exposes `useAuth()`. Current browser auth supports **GitHub OAuth (Authorization Code Flow) only**; Ethereum and Cardano auth is backend-ready but not yet wired in the frontend. GitHub **Device Flow** is available via the CLI. Note: `localStorage` is used for simplicity but is vulnerable to XSS; migrating to `httpOnly` cookies is the recommended hardening step.
- **UI:** Tailwind CSS + Lucide React. Shared components in `app/components/ui/` and
  `app/components/shared/`; coordinator-specific in `app/components/coordinator/`. Rule: `ui/` — generic, reusable primitives (buttons, inputs); `shared/` — cross-feature composed components; `coordinator/` — coordinator-specific components.

---

## CLI — Commander.js

The CLI is ESM (`"type": "module"`) using Commander.js. Command groups live under
`apps/cli/src/`:

| Group                      | Commands                                                                                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth/`                    | `login-github` (device flow), `logout`, `status`, `whoami`                                                                                                                               |
| `ceremonies/`              | participant: `contribute`, `list`; coordinator: `create`, `delete`, `finalize`, `update`                                                                                                 |
| `config/`                  | `path`, `new`, `gh-token`, `gh-token-scoped`, `name`, `ceremony-repo`, `migrate`                                                                                                         |
| `perpetual-powers-of-tau/` | `new`, `download`, `contribute`, `auto-contribute`, `upload`, `verify`, `post-record`, `beacon`, `generate-upload-url`, `generate-download-url`, `generate-urls`, `generate-urls-unsafe` |
| `projects/`                | `create` (from JSON template), `list`                                                                                                                                                    |
| `participants/`            | `list`                                                                                                                                                                                   |
| `vm/`                      | `verify`                                                                                                                                                                                 |

The CLI does **not** currently consume `@brebaje/actions`; its storage and crypto helpers
are duplicated locally. Migrating to the shared package is a known gap.

---

## Website — Docusaurus 3

Static documentation site (`apps/website/`). Built and deployed to GitHub Pages via
`.github/workflows/deploy-docs.yml` on pushes to `main`.

---

## Shared Package — @brebaje/actions

`packages/actions/src/helpers/`:

| File                | Purpose                                                             | Exports                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `crypto.ts`         | BLAKE2b hashing for file artifact integrity                         | `calculateBlake2bHash(input)`                                                                                                                                                                                                                                                                                                              |
| `storage.ts`        | Resumable S3 multipart upload and download helpers                  | `multiPartUploadAPI()`, `downloadCeremonyArtifact()`, `generateGetObjectPreSignedUrlAPI()`, `generatePreSignedUrlsPartsAPI()`, `completeMultiPartUploadAPI()`, `temporaryStoreCurrentContributionUploadedChunkDataAPI()`, `temporaryStoreCurrentContributionMultiPartUploadIdAPI()`, `openMultiPartUploadAPI()`, `checkIfObjectExistAPI()` |
| `authentication.ts` | Auth utilities — role check and SIWE message formatting             | `isCoordinatorAPI()`, `formatMessageForSIWE()`                                                                                                                                                                                                                                                                                             |
| `utils.ts`          | Domain utilities — PoT sizing, zKey formatting, string sanitization | `computeSmallestPowersOfTauForCircuit()`, `formatZkeyIndex()`, `sanitizeString()`, `getURLOfPowersOfTau()`, `convertBytesOrKbToGb()`, `convertToDoubleDigits()`                                                                                                                                                                            |
| `fetch.ts`          | HTTP retry with exponential back-off and socket timeout             | `fetchRetry()`                                                                                                                                                                                                                                                                                                                             |
| `constants.ts`      | Shared constants — PoT URLs, genesis zKey index, VM script filename | —                                                                                                                                                                                                                                                                                                                                          |

Currently imported by: **backend only**. CLI depends on the same logic but has local
copies; consolidation is pending.

---

## Data Model & Storage

### Sequelize Models (SQLite)

```
User ──(coordinator of)──▶ Project ──▶ Ceremony ──▶ Circuit ────────────────────
 │                                          │                                      │
 │                                     (has many)                             (has many)
 │                                          │                                      │
 └────────────(has many)──────────────▶ Participant                               │
                                            │                                      │
                                       (has many)                                  │
                                            └──────▶ Contribution ◀──(has many)──┘
```

| Model        | File                                  | Key Fields                                                                                                                                                                                |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User         | `users/user.model.ts`                 | `id`, `displayName` (indexed), `provider` (enum), `walletAddress` (Cardano/Ethereum), `avatarUrl`, timestamps                                                                             |
| Project      | `projects/project.model.ts`           | `id`, `name`, `contact`, `coordinatorId` (FK → User)                                                                                                                                      |
| Ceremony     | `ceremonies/ceremony.model.ts`        | `id`, `projectId`, `state` (enum), `type` (enum), `start_date`, `end_date`, `penalty`, `authProviders` (JSON)                                                                             |
| Circuit      | `circuits/circuit.model.ts`           | `id`, `ceremonyId`, `name`, `sequencePosition`, `timeoutMechanismType` (enum), `currentContributor`, `contributors` (JSON), `verification` (JSON), `artifacts` (JSON), `pot`              |
| Participant  | `participants/participant.model.ts`   | `id`, `userId`, `ceremonyId` (unique together — one participant per ceremony per user), `status` (enum), `contributionStep` (enum), `tempContributionData` (JSON), `timeout` (JSON array) |
| Contribution | `contributions/contribution.model.ts` | `id`, `circuitId`, `participantId`, `zkeyIndex`, `valid`, timing fields, `files` (JSON), `verificationSoftware` (JSON), `beacon` (JSON)                                                   |

All enums are defined in `src/types/enums.ts`. A visual entity relationship diagram is maintained at `src/database/diagram.dbml` (renderable at dbdiagram.io); the Sequelize models are the authoritative schema definition.

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

The verification machine type is configured **per circuit** by the coordinator at creation
time via the `verification.serverOrVm` field. The deciding factor is artifact size
(`zKeySizeInBytes`): smaller zKey files use `VerificationMachineType.server` (snarkjs runs
in-process on the backend); larger zKey files that demand more compute use
`VerificationMachineType.vm` (a dedicated EC2 instance is provisioned for that circuit).
The specific size threshold will be defined by the application in a future iteration. The
choice is fixed at circuit creation — there is no per-contribution switching.

`VmModule` (`vm.service.ts` + `vm.controller.ts`) manages EC2 instances. SSM
(`@aws-sdk/client-ssm`) dispatches verification commands to instances.
`verification-monitoring.service.ts` polls for progress and records the result.

---

## Authentication

All auth logic is in `apps/backend/src/auth/auth.service.ts`. Three providers are
supported:

| Provider         | Flow                                    | Key Endpoints                                                                              |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------------------------------ |
| GitHub (browser) | OAuth Authorization Code Flow           | `GET /auth/github/client-id`, `POST /auth/github/user`, `GET /auth/github/authorize-login` |
| GitHub (CLI)     | Device Flow                             | `GET /auth/github/client-id`, `POST /auth/github/user`                                     |
| Ethereum         | Sign-In with Ethereum — EIP-4361 (SIWE) | `POST /auth/eth/generate-nonce`, `POST /auth/eth/verify-signature`                         |
| Cardano          | Wallet nonce + signature                | `POST /auth/cardano/generate-nonce`, `POST /auth/cardano/verify-signature`                 |

Every successful auth returns a **short-lived JWT** (default expiry `1d`, from
`JWT_EXPIRES_IN`). `JwtAuthGuard` validates Bearer tokens on protected routes and
attaches the user record to `req.user`. There is no token refresh endpoint — when a token expires the user must re-authenticate.

Each provider registration creates a **distinct user record** — the same person
authenticating with GitHub and then with Ethereum results in two separate accounts.
**Provider binding (planned):** a future feature will allow linking multiple provider
identities into a single account. Until then, the one-provider-per-user model is
intentional but temporary.

Per-ceremony **provider whitelist** (`ceremony.authProviders` JSON column): stores the list
of allowed auth providers for a ceremony. Enforcement at enrollment is **not yet
implemented** — `participants.service.ts` does not currently check the participant's
provider against this list, so any authenticated user can enroll in any ceremony.

**Nonce management** (in `auth.service.ts`):

- **Ethereum:** `ethNonceStore` (`Map<address, { nonce, timestamp }>`). Nonces expire
  after 5 minutes; a cleanup function purges expired entries on each verification call.
- **Cardano:** `nonceStore` (`Map<address, string[]>`). Used nonces are accumulated in an
  array with **no expiry and no cleanup** — a known memory leak that grows unbounded over
  time.
- **Both stores are in-memory only:** nonces are lost on server restart, and the approach
  does not scale horizontally — multiple instances would maintain separate stores with no
  shared state.

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
       └─ Authorization: Bearer <jwt stored in token file (~/.brebaje/token or configured path) via token.ts>
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
2. Load the target entity from the DB using the route param (`:id`) or the request body (`projectId`), depending on the route shape.
3. Compare ownership or role; throw `ForbiddenException` / `NotFoundException` on mismatch.
4. Optionally attach the loaded entity to `req` (e.g., `IsContributionCoordinatorGuard`
   attaches the `Contribution` so the controller skips a redundant DB call).

### Ceremony State Machine

Valid ceremony state transitions (defined in `src/types/enums.ts`):

```
SCHEDULED → OPENED ↔ PAUSED → CLOSED → FINALIZED
                                   ↘
                                 CANCELED  (terminal — blocks finalization)
```

> **Note:** `ceremonies.service.ts:update` does not yet enforce these transitions. Any
> state value can be written to any other state at the service layer — transition
> enforcement is not yet implemented.

### Participant Status State Machine

**Outer lifecycle** (defined in `src/types/enums.ts`):

```
CREATED → WAITING → READY → CONTRIBUTING → CONTRIBUTED → DONE
                                  ↓
                              TIMEDOUT → (penalty period) → EXHUMED → WAITING (re-queue)
```

Coordinator finalization follows a separate path: `CONTRIBUTING → FINALIZING → FINALIZED → DONE`.

**Contribution steps** (while `CONTRIBUTING`):

```
DOWNLOADING → COMPUTING → UPLOADING → VERIFYING → COMPLETED
```

Transition enforcement for contribution steps is implemented in
`src/contributions/contribution-transitions.ts` — invalid transitions throw there, never
in services. The outer participant lifecycle and ceremony state machine do not yet have
equivalent enforcement.

### Resumable Multipart Upload

Large zKey files are uploaded to S3 using multipart upload. To survive client restarts
mid-upload, the multipart upload ID and the list of completed parts are persisted in
`participant.tempContributionData` (JSON field on the Participant model) after each
chunk. On resume, the client reads this field, skips already-uploaded parts, and
continues from the last checkpoint. The upload helpers live in
`packages/actions/src/helpers/storage.ts`.

### Swagger / OpenAPI

Every controller uses `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and `@ApiBearerAuth`.
The generated spec is served at `/api` (configured in `configureSwagger()` in
`app.config.ts`).

---

## Infrastructure & CI

### Required Environment Variables

Defined with defaults in `apps/backend/src/utils/constants.ts`:

| Category     | Variable                         | Default                                                                                   |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------------- |
| Server       | `PORT`                           | `3000`                                                                                    |
| Database     | `DB_SQLITE_STORAGE_PATH`         | `.db/data.sqlite3`                                                                        |
|              | `DB_SQLITE_SYNCHRONIZE`          | `true` ⚠️ **set to `false` in production — auto-sync can silently alter or drop columns** |
| JWT          | `JWT_SECRET`                     | `defaultSecret` ⚠️ **must be overridden in production**                                   |
|              | `JWT_EXPIRES_IN`                 | `1d`                                                                                      |
| GitHub OAuth | `GITHUB_CLIENT_ID`               | required                                                                                  |
|              | `GITHUB_CLIENT_SECRET`           | required                                                                                  |
|              | `GITHUB_OAUTH_APP_CALLBACK`      | required                                                                                  |
| AWS          | `AWS_ACCESS_KEY_ID`              | required                                                                                  |
|              | `AWS_SECRET_ACCESS_KEY`          | required                                                                                  |
|              | `AWS_REGION`                     | `us-east-1`                                                                               |
|              | `AWS_CEREMONY_BUCKET_POSTFIX`    | `brebaje-testing`                                                                         |
|              | `AWS_AMI_ID`                     | (Ubuntu 22.04 AMI)                                                                        |
| CORS         | `CORS_ORIGINS`                   | `http://localhost:3000,http://localhost:3001`                                             |
| Upload       | `CONFIG_STREAM_CHUNK_SIZE_IN_MB` | `50`                                                                                      |
|              | `AWS_PRESIGNED_URL_EXPIRATION`   | `3600`                                                                                    |

### CI Pipelines

`.github/workflows/`:

| Workflow          | Trigger           | Steps                                                 |
| ----------------- | ----------------- | ----------------------------------------------------- |
| `lint.yml`        | push to main, PRs | install → build packages → ESLint                     |
| `backend.yml`     | push to main, PRs | install → build → unit tests → coverage → e2e tests   |
| `frontend.yml`    | push to main, PRs | install → build packages → Next.js build              |
| `cli.yml`         | push to main, PRs | install → build packages → CLI tests                  |
| `actions.yml`     | push to main, PRs | install → build packages → actions tests              |
| `deploy-docs.yml` | push to main, PRs | Docusaurus build → GitHub Pages (deploy on main only) |

All pipelines use Node 22.17.x and pnpm 10.24.0. Concurrent duplicate runs are cancelled.
