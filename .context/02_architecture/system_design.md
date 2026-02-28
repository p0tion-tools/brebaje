# System Architecture

## Architectural Pattern

- We follow **Clean Architecture** (or Hexagonal/MVC). Dependency rule: dependencies point inwards; core logic depends on nothing.
- **Backend:** Implemented as **NestJS** with feature modules (auth, users, projects, ceremonies, circuits, participants, contributions, storage, vm, health). Each module typically has controller(s), service(s), DTOs, and guards; domain entities are Sequelize models backed by DBML.
- **Frontend:** **Next.js App Router**; server state via TanStack React Query; auth and UI in React.
- **CLI:** **Commander.js** command groups; shared logic in **@brebaje/actions**.

## Layers

1. **Domain Layer:** Entities and business rules (pure TypeScript). In the backend: enums and models (from DBML); invariants in services.
2. **Application Layer:** Use cases and orchestration (NestJS services; CLI command handlers; @brebaje/actions where shared).
3. **Infrastructure Layer:** Database (Sequelize/SQLite), object storage (S3), crypto (snarkjs), HTTP (NestJS), UI (Next.js).

## Data Flow

- **Backend:** Request → Router → Middleware → Controller/Handler → Service → Repository/DB.
- **Frontend:** User action → React component → API client → Node API → DB; response flows back to UI.

## Brebaje Protocol

### Ceremony Lifecycle (Five Phases)

1. **Initialization:** Coordinator creates the ceremony and circuits, uploads artifacts (R1CS, PoT, WASM, genesis zKey) to storage; ceremony state is **SCHEDULED**.
2. **Queueing:** When start date is reached, ceremony transitions to **OPENED**. Participants join the waitlist per circuit; one participant per circuit is **READY** (at head of queue).
3. **Contribution:** Participants download the last zKey, compute a contribution with local entropy, upload the new zKey and transcript, and await verification. Progress is per circuit; after all circuits, participant reaches **DONE**.
4. **Validation:** Each contribution is cryptographically verified (chain from R1CS + PoT or from initial zKey). Queue is updated (completed/failed counts, current contributor cleared); participant moves to **CONTRIBUTED** or **DONE**.
5. **Finalization:** When the ceremony is **CLOSED**, coordinator runs the beacon contribution per circuit, exports verification key and Solidity verifier, and sets ceremony state to **FINALIZED**.

### State Machines

- **Ceremony:** SCHEDULED → OPENED (start date); OPENED ↔ PAUSED (coordinator); OPENED → CLOSED (end date); CLOSED → FINALIZED (beacon + export).
- **Participant:** CREATED → WAITING → READY → CONTRIBUTING (with steps: DOWNLOADING → COMPUTING → UPLOADING → VERIFYING → COMPLETED) → CONTRIBUTED or DONE, or CONTRIBUTING → TIMEDOUT → EXHUMED (after penalty) → READY when re-queued. Coordinator path: DONE → FINALIZING → FINALIZED.

Detailed states and transitions are in `.p0tion/architecture/03-protocol-state-machine-map.md`.

### Data Flow (High Level)

Coordinator and participants interact with the system for: ceremony and circuit creation and artifact upload; automated opening when start date is reached; participant eligibility and queue join; contribution download, compute, upload, and verification; queue advance and participant status updates; and coordinator-triggered finalization (beacon, export, FINALIZED).
