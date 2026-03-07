# User context

## Product and domain context for AI and contributors.

## Product

- **What:** Zero-knowledge proof ceremony management platform: Phase 2 Trusted Setup coordination for Groth16/zkSNARK circuits (queueing, verification, beacon finalization).
- **Value:** Coordinates decentralized Phase 2 ceremonies with coordinator/participant flows, contribution/verification timeouts (dynamic or fixed), penalty and exhumation, resumable uploads, and cryptographic verification before accepting contributions.

### Domain Models

- **Users** — Authenticated via GitHub, Ethereum, or Cardano.
- **Projects** — Container for ceremonies; coordinators manage.
- **Ceremonies** — Time-bounded events; phases: SCHEDULED → OPENED → CLOSED → FINALIZED (and PAUSED).
- **Circuits** — Individual zkSNARK circuits; each has its own contribution chain.
- **Participants** — Users enrolled in a ceremony; contribution tracking.
- **Contributions** — Cryptographic contributions to circuit trusted setup.

### Personas

- **Coordinator:** Creates ceremony and circuits; uploads artifacts (R1CS, PoT, WASM, genesis zKey); opens/closes ceremony; monitors contributions; runs beacon and finalization (verification key, verifier contract).
- **Participant:** Authenticates; joins waitlist per circuit; downloads last zKey; computes contribution with local entropy; uploads new zKey and transcript; awaits verification; completes all circuits in sequence (or DONE).

### Non-Functional Requirements

- **Performance:** API &lt; 200ms where applicable; React SPA responsive.
- **Scalability:** Backend concurrent connections; frontend code-splitting/lazy loading.
- **Privacy:** GDPR compliant; no PII in logs.
- **Ceremony:** Contribution/verification timeouts (dynamic/fixed); penalty and exhumation; resumable uploads; cryptographic verification (invalid contributions rejected, queue updated).

### Current Implementation

- **Monorepo:** pnpm workspaces. **Apps:** backend (NestJS), frontend (Next.js 14 App Router), cli (Commander.js ESM), website (Docusaurus 3). **Shared:** @brebaje/actions (crypto, snarkjs, upload/download).
- **Auth (GitHub):** Frontend gets client ID from backend → user completes OAuth (device or code flow) → backend exchanges token, creates/finds user → JWT issued for session.

---

## Domain Glossary

### Lifecycle and Roles

- **Ceremony lifecycle:** Initialization → Queueing → Contribution → Validation → Finalization.
- **Phase 1 / Phase 2:** Phase 1 = Powers of Tau (PoT); Phase 2 = circuit-specific proving key (zKey) chain from R1CS + PoT and participant contributions.
- **Waitlist (CircuitWaitingQueue):** Per-circuit queue (participant IDs, current contributor, completed/failed counts).

### Ceremony States

SCHEDULED → OPENED (start date); OPENED ↔ PAUSED; OPENED → CLOSED (end date); CLOSED → FINALIZED (beacon + export).

### Participant States

CREATED → WAITING → READY → CONTRIBUTING (steps: DOWNLOADING → COMPUTING → UPLOADING → VERIFYING → COMPLETED) → CONTRIBUTED → DONE. Timeout path: READY/CONTRIBUTING → TIMEDOUT → (penalty) → EXHUMED → re-queue. Coordinator: READY → FINALIZING → FINALIZED → DONE.

### Artifacts

- **R1CS** (`.r1cs`), **PoT** (`.ptau`), **zKey** (`.zkey`, index 00000=genesis … final), **Transcript** (`.log`, contribution hash), **Verification key**, **Verifier contract** (Solidity), **WASM** (witness generation).

### Crypto and Timeouts

- **Beacon:** Deterministic final contribution; value + SHA-256 hash; must be public and unpredictable.
- **Contribution hash:** From transcript (crypto provider). **BLAKE2b** for file hashes; **SHA-256** for beacon.
- **Timeouts:** BLOCKING_CONTRIBUTION (download/compute/upload), BLOCKING_VERIFICATION. **DYNAMIC** or **FIXED**. **Penalty** duration; **Exhumation** when penalty expires.
