# Delivery Roadmap

## Reference Implementation

Brebaje is delivered as a pnpm monorepo with the following surfaces:

- A NestJS backend that exposes the REST API and orchestrates ceremony state.
- A Next.js 14 App Router frontend for coordinators, participants, and observers.
- A Commander.js CLI for participants and operators.
- A Docusaurus website for public documentation.
- A shared `@brebaje/actions` package that holds crypto, snarkjs, hashing, and upload/download helpers used by the backend and the CLI.

The roadmap below defines product capabilities. The reference implementation is the order in which these capabilities are landed across the surfaces above.

## Phase 1: Product Core

Deliver the minimum product needed to define projects and ceremonies and model progress.

Capabilities:

- Project management: create, list, retrieve, update, delete with ownership enforcement.
- Ceremony setup definition under a project.
- Ceremony and circuit validation.
- Participant enrollment.
- Circuit queues.
- Fixed timeout policy.
- Public ceremony listing.

Acceptance target:

- A coordinator can create a project, then create a ceremony with at least one circuit inside it, and a participant can enroll into the first queue.

## Phase 2: Artifact Integrity

Deliver artifact registration, hashing, and recovery foundations.

Capabilities:

- Circuit input artifact registration.
- Required Phase 1 parameter association.
- Deterministic artifact naming.
- BLAKE2b hash computation and storage for file artifacts.
- Resumable multipart upload recovery metadata.

Acceptance target:

- Required input artifacts and participant-produced artifacts are tracked with hashes and recoverable upload state.

## Phase 3: Participant Contribution Experience

Deliver the participant-facing ceremony journey.

Capabilities:

- Ceremony discovery, including allowed identity providers per ceremony.
- Multi-provider authentication (GitHub, Ethereum, Cardano).
- Participant check-in.
- Queue waiting.
- Contribution status updates.
- Local entropy entry.
- Public participation attestation.

Acceptance target:

- A participant can complete a valid contribution for every circuit in a ceremony using any of the ceremony's allowed identity providers.

## Phase 4: Verification And Queue Advancement

Deliver reliable verification and state advancement.

Capabilities:

- Contribution verification.
- Verification result recording.
- Failed contribution handling.
- Idempotent verification completion.
- Queue advancement after successful verification.

Acceptance target:

- Invalid contributions cannot advance the ceremony, and valid contributions advance the queue exactly once.

## Phase 5: Finalization And Publication

Deliver the complete ceremony output flow.

Capabilities:

- Ceremony closing and cancellation.
- Final beacon contribution with SHA-256 hashing of the beacon value.
- Final artifact generation.
- BLAKE2b hash publication for final file artifacts.
- Verification key and verifier contract publication.

Acceptance target:

- A closed ceremony can become finalized only after all required final outputs are published, and a canceled ceremony cannot finalize.

## Phase 6: Governance And Operations

Deliver operational maturity for public ceremonies.

Capabilities:

- Coordinator role management and project ownership transfer.
- Audit event review.
- Timeout monitoring with typed timeout events.
- Incident recovery procedures.
- Public documentation for participants and auditors.

Acceptance target:

- Operators and auditors can explain ceremony state transitions and resolve common blocked states.
