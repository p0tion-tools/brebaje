# Library Patterns

This section describes the libraries in Brebaje. Use them consistently so new contributors and AI tools can rely on the same patterns.

## Backend Validation: class-validator and class-transformer

- **DTOs:** Request bodies and query/param validation use **class-validator** decorators (e.g. `@IsString()`, `@IsNumber()`, `@IsEnum()`, `@IsOptional()`, `@IsObject()`). Define DTOs in each feature’s `dto/` folder.
- **Transformation:** Use **class-transformer** when you need to map plain objects to DTO instances or exclude properties in responses.
- **Pipeline:** Enable NestJS `ValidationPipe` globally so invalid DTOs return 400 with a consistent error shape. Use `@Body()`, `@Param()`, `@Query()` with DTO classes.
- **Optional Zod:** Zod may be used for env validation or one-off schemas; the primary API validation in the backend is class-validator.

## Database: Sequelize with sequelize-typescript

- **ORM:** Backend uses **Sequelize** with **@nestjs/sequelize** and **sequelize-typescript**. Models are defined as classes (e.g. `user.model.ts`, `ceremony.model.ts`) and registered in `SequelizeModule.forRoot()` and `SequelizeModule.forFeature()`.
- **Schema source:** The source of truth is **DBML**: `apps/backend/src/database/diagram.dbml`. Enums and table definitions are used to generate or align TypeScript enums (`types/enums.ts`) and Sequelize models. Do not change schema without updating DBML and regenerating/updating models as per project scripts.
- **Dialect:** SQLite in development (configurable via env). Use parameterized queries via Sequelize; avoid raw SQL with string interpolation.
- **Inject models:** Inject repositories/models in services via NestJS DI; use transactions for multi-step writes when needed.

## Auth: JWT and multiple providers

- **JWT:** Backend uses **@nestjs/jwt** for signing and verifying access tokens. Use short-lived tokens; store and validate via `JwtAuthGuard` and strategy.
- **Providers:** The backend supports multiple auth providers: **GitHub** (OAuth authorization code flow and device flow), **Ethereum** (SIWE with ethers), and **Cardano** (Mesh). User identity is stored with a provider type (e.g. `UserProvider.GITHUB`, `UserProvider.ETHEREUM`). Do not store raw secrets; use env for client IDs/secrets and nonce storage as implemented.
- **CLI auth:** CLI uses GitHub OAuth device flow (e.g. @octokit/auth-oauth-device) and stores tokens for subsequent API calls (see env config for token path).

## Shared package: @brebaje/actions

- **Purpose:** `packages/actions` is published as **@brebaje/actions**. It holds shared logic used by the **backend** and **CLI**: crypto helpers, snarkjs integration, hashing, upload/download utilities, retries, etc.
- **Usage:** Backend and CLI depend on `@brebaje/actions`; import from the package entry (e.g. `import { ... } from '@brebaje/actions'`). After changing `packages/actions`, rebuild it and ensure backend/CLI use the built output (or link locally).
- **Dependencies:** Actions package uses **snarkjs**, **@noble/hashes**, **mime-types**, **cli-progress**, **@adobe/node-fetch-retry**, etc. Keep these aligned with backend/CLI needs.

## API Client (Frontend)

- **Data fetching:** Use **TanStack React Query** for all server state. Define query hooks (e.g. in `app/hooks/`) that call the backend API (fetch or a small wrapper). Use query keys consistently (e.g. by resource and id).
- **Auth:** Send JWT (or session) with requests as required by the backend (e.g. Authorization header). Auth state is typically provided by a context (e.g. `AuthContext`) and used by hooks or layout.
- **Typed responses:** Type response data with TypeScript interfaces or types; align with backend DTOs or API docs (Swagger) where possible.

## Cryptographic Integration (Groth16 / Phase 2)

The application integrates with a cryptographic provider (e.g. snarkjs) for Phase 2 trusted setup. All paths are file-system paths; the provider reads/writes artifacts.

### Operations

- **newZKey:** Genesis zKey from R1CS + PoT; inputs: `r1csPath`, `potPath`, `zkeyPath`; output: zKey file.
- **contribute:** Entropy-based contribution; inputs: `lastZkeyPath`, `nextZkeyPath`, `contributorIdentifier`, `entropy`, optional `logger`; outputs: new zKey file and transcript (parse contribution hash from transcript).
- **beacon:** Final contribution; inputs: `lastZkeyPath`, `finalZkeyPath`, `coordinatorIdentifier`, `beaconValue`, `numExpIterations`, optional `logger`; outputs: final zKey and transcript; store `SHA-256(beaconValue)`.
- **verify:** Chain validation—either from R1CS + PoT + zKey, or from first zKey + PoT + last zKey; returns boolean.
- **exportVerificationKey:** From final zKey path; returns verification key (JSON).
- **exportSolidityVerifier:** From final zKey path + template; returns Solidity verifier source.

### Hashing

- **File hashes (zKey, transcript, R1CS, PoT, vKey, verifier):** BLAKE2b (512-bit).
- **Beacon value:** SHA-256 for storage and attestation.
- **Contribution hash:** Parsed from the contribution transcript (emitted by the crypto provider).

### Pre- and Post-Conditions

- **contribute:** Last zKey exists and is valid; output path writable; sufficient disk and memory. After: new zKey at path; transcript contains contribution hash.
- **beacon:** Last contributor zKey valid; beacon value available; output path writable. After: final zKey exists; usable for proof generation and vKey/verifier export.
- **verify:** All input paths exist; R1CS, PoT, and zKey are compatible (same curve, circuit). Result indicates whether the chain is valid.
