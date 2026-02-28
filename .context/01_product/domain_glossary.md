# Domain Glossary: Brebaje Stack & Phase 2 Trusted Setup

## Frontend (Next.js) Terms

- **App Router:** Next.js file-based routing under `app/`; each folder segment maps to a route; `page.tsx` is the UI for that segment.
- **Component:** Reusable UI; prefer function components with hooks. In Brebaje, shared UI lives in `app/components/` (e.g. `app/components/ui/`).
- **Hook:** Function (e.g. `useState`, `useEffect`, custom) for state and lifecycle. Server state: **TanStack React Query** hooks (e.g. `useGetCeremonies`, `useGetCeremonyById`) in `app/hooks/`.
- **API Route / Endpoint:** URL path and HTTP method on the backend (e.g. `GET /ceremonies`). Frontend calls these via fetch or a small client; React Query wraps the calls.

## Backend (NestJS) Terms

- **Module:** NestJS feature unit (e.g. `CeremoniesModule`); groups controller(s), service(s), and dependencies. Registered in `AppModule`.
- **Controller:** Handles HTTP requests; uses `@Get()`, `@Post()`, etc.; delegates to services. DTOs validate input via **class-validator**.
- **DTO (Data Transfer Object):** Class with **class-validator** decorators (`@IsString()`, `@IsNumber()`, etc.) used for request validation. Defined per feature in `dto/` folders.
- **Guard:** NestJS guard (e.g. `JwtAuthGuard`, `IsCeremonyCoordinatorGuard`) runs before route handler; used for auth and authorization.
- **Swagger:** OpenAPI docs generated from NestJS decorators (`@ApiTags()`, `@ApiOperation()`, etc.) for the REST API.

## Architectural Terms

- **CRUD:** Create, Read, Update, Delete — basic database operations.
- **Service Layer:** Business logic and orchestration; in Brebaje, NestJS **services** inject Sequelize models and other services.
- **DBML:** Database Markup Language. In Brebaje, the schema is defined in `apps/backend/src/database/diagram.dbml`; it drives enums (`types/enums.ts`) and Sequelize models. Change schema there and regenerate models.
- **@brebaje/actions:** Shared npm package (`packages/actions`) used by backend and CLI for crypto (snarkjs), hashing, upload/download, and other shared logic.

## Security Terms

- **JWT:** JSON Web Token — used for stateless authentication.
- **OAuth2:** Industry-standard protocol for authorization.
- **Bcrypt:** A password-hashing function.
- **CORS:** Cross-Origin Resource Sharing — security feature for browser-based API calls.

## Brebaje / Phase 2 Trusted Setup

### Protocol and Lifecycle

- **Ceremony lifecycle:** The five phases—Initialization, Queueing, Contribution, Validation, Finalization—through which a Phase 2 trusted setup ceremony progresses.
- **Phase 1 / Phase 2:** Phase 1 produces Powers of Tau (PoT); Phase 2 builds the circuit-specific proving key (zKey) chain from R1CS + PoT and participant contributions.
- **Coordinator:** User who creates the ceremony and circuits, uploads artifacts, opens/closes the ceremony, and runs beacon and finalization.
- **Participant:** User enrolled in a ceremony who contributes to one or more circuits (one participant record per user–ceremony pair).

### Entities

- **User:** Authenticated identity (participant or coordinator).
- **Ceremony:** A Phase 2 Trusted Setup event with a defined contribution window and one or more circuits.
- **Circuit:** A single Groth16 circuit within a ceremony; has its own zKey contribution chain and waitlist.
- **Contribution:** A single contribution (zKey + transcript) to a circuit, or the final beacon contribution.
- **Waitlist (CircuitWaitingQueue):** Per-circuit queue of participant IDs, current contributor, and completed/failed contribution counts.
- **Participant (ceremony-scoped):** Links a user to a ceremony; tracks status, contribution progress, and contribution step.

### Ceremony States

- **SCHEDULED:** Setup complete; contribution period has not started.
- **OPENED:** Contribution period is active; participants may contribute.
- **PAUSED:** Manually paused by coordinator; contributions suspended.
- **CLOSED:** Contribution period ended; no new contributions.
- **FINALIZED:** Beacon applied; verification artifacts exported; ceremony complete.

### Participant States

- **CREATED:** Participant record created; not yet in queue.
- **WAITING:** In queue for a circuit; awaiting turn.
- **READY:** At head of queue; ready to contribute.
- **CONTRIBUTING:** Actively contributing (download, compute, upload, verify).
- **CONTRIBUTED:** Completed one circuit; may be awaiting next circuit.
- **DONE:** Completed all circuits; all verifications passed.
- **FINALIZING:** Coordinator is running finalization.
- **FINALIZED:** Ceremony finalized; coordinator participant.
- **TIMEDOUT:** Timed out while contributing; penalty applies.
- **EXHUMED:** Penalty expired; ready to resume when turn arrives.

### Contribution Steps (within CONTRIBUTING)

- **DOWNLOADING:** Downloading last zKey from storage.
- **COMPUTING:** Computing contribution with local entropy.
- **UPLOADING:** Uploading new zKey and transcript.
- **VERIFYING:** Waiting for verification result.
- **COMPLETED:** Verification received; contribution done.

### Artifacts

- **R1CS:** Rank-1 Constraint System (`.r1cs`); circuit representation.
- **PoT (Powers of Tau):** Phase 1 output (`.ptau`); used to bootstrap the zKey chain.
- **zKey:** Proving key (`.zkey`); evolves through contributions; index convention: `00000` (genesis), `00001`, `00002`, …, `final`.
- **Transcript:** Contribution log (`.log`); contains contribution hash.
- **Verification Key:** JSON artifact for proof verification (from final zKey).
- **Verifier Contract:** Solidity verifier contract (from final zKey).
- **WASM:** Compiled circuit for witness generation.

### Crypto / Verification

- **Beacon:** Deterministic final contribution; value (e.g. block hash) plus SHA-256 hash; must be public and unpredictable.
- **Contribution hash:** Parsed from the contribution transcript; emitted by the crypto provider.
- **BLAKE2b:** Used for file hashes (zKey, transcript, R1CS, PoT, vKey, verifier).
- **SHA-256:** Used for beacon value hash.

### Timeouts

- **BLOCKING_CONTRIBUTION:** Participant exceeded contribution time limit (download/compute/upload).
- **BLOCKING_VERIFICATION:** Verification process exceeded time limit.
- **Timeout mechanism:** **DYNAMIC** (threshold from recent times) or **FIXED** (fixed duration).
- **Penalty:** Duration (e.g. minutes) before a timed-out participant can resume (exhumation).
- **Exhumation:** Transition from TIMEDOUT to EXHUMED when penalty expires; participant can re-queue.
