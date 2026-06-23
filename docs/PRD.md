# Brebaje Product Requirements Document

Brebaje is the community version of [P0tion](https://github.com/privacy-scaling-explorations/p0tion): a Groth16 Phase 2 trusted setup ceremony coordination platform.

This document is the single source of truth for the product. It describes the users, goals, domain rules, functional requirements, workflows, integrity rules, security model, acceptance criteria, and delivery roadmap required to coordinate Groth16 trusted setup ceremonies in Brebaje. Each rule is stated once and referenced elsewhere by section; states and entities are defined only in [Domain Model](#domain-model), the hash policy only in [Artifacts & Integrity](#artifacts--integrity), and roles only in [Personas & Roles](#personas--roles).

## Contents

1. [Overview](#overview)
2. [Goals & Non-Goals](#goals--non-goals)
3. [Personas & Roles](#personas--roles)
4. [Domain Model](#domain-model)
5. [Functional Requirements](#functional-requirements)
6. [Workflows](#workflows)
7. [Artifacts & Integrity](#artifacts--integrity)
8. [Security & Trust](#security--trust)
9. [Acceptance Criteria](#acceptance-criteria)
10. [Delivery Roadmap](#delivery-roadmap)
11. [Glossary](#glossary)

---

## Overview

Brebaje is a ceremony coordination product for projects that need Groth16 Phase 2 trusted setup ceremonies. It enables coordinators to organize ceremonies under projects, participants to contribute securely, and observers to inspect the resulting artifacts and audit trail.

Brebaje makes Groth16 trusted setup ceremonies practical, transparent, and repeatable for projects that need production-grade zero-knowledge proving systems, while keeping the platform open to multiple identity providers and community-hosted deployments. It preserves the cryptographic intent of P0tion and extends it with project-level organization and pluggable authentication.

**Problem.** Running a trusted setup ceremony requires careful coordination of people, circuit artifacts, contribution ordering, verification, recovery, and publication. Without a dedicated product, teams risk invalid artifacts, unclear audit trails, blocked queues, lost uploads, and weak participant guidance. Teams that already operate multiple ceremonies also need a stable container to group them, expose a public contact, and reuse coordinator credentials across ceremonies. Brebaje shall provide a structured ceremony process that reduces operational mistakes while preserving the cryptographic assumptions of the underlying ceremony.

The product shall prioritize:

- Correct ceremony ordering and contribution integrity.
- Participant privacy for secret entropy.
- Public verifiability of final outputs.
- Recoverability from interrupted long-running work.
- Clear governance and role boundaries.
- Open identity options for participants without forcing a single provider.

---

## Goals & Non-Goals

### Goals

- Allow coordinators to organize ceremonies under a project they own.
- Allow coordinators to define and manage Phase 2 ceremonies with one or more circuits.
- Allow participants to authenticate with the identity providers supported by the ceremony and to contribute to every required circuit in the correct order.
- Verify every contribution before it becomes part of the trusted setup history.
- Publish final artifacts, hashes, transcripts, and verifier outputs for public inspection.
- Support recovery from interrupted downloads, computation, uploads, and verification.
- Provide clear role boundaries for participants, coordinators, observers, and workers.

### Non-Goals

- Brebaje shall not design a new proving system.
- Brebaje shall not remove the need for ceremony-specific security review.
- Brebaje shall not expose participant secret entropy to any server-side process or public record.
- Brebaje shall not treat uploaded artifacts as valid before verification.
- Brebaje shall not impose a single mandatory identity provider on every ceremony.

---

## Personas & Roles

This section is the canonical definition of roles and their permissions. [Security & Trust](#security--trust) references these roles for authorization rather than restating them.

### Public Reader / Observer

Auditors, integrators, and prospective participants who inspect ceremonies without authenticating.

- **Can:** inspect public project metadata, public ceremony metadata, public artifacts, final hashes, transcripts, verification keys, verifier contracts, and public participant information.
- **Cannot:** mutate ceremony state or access sensitive operational credentials.
- **User story:** _As an observer, I want to inspect a finalized ceremony's artifacts and hashes so that I can independently verify the trusted setup before integrating the verifier contract._

### Participant

A user who contributes entropy to the ceremony.

- **Can:** authenticate, join open ceremonies that accept their identity provider, wait in queues, download required artifacts, upload assigned contribution artifacts, resume eligible interrupted work, and view personal contribution status.
- **Cannot:** modify ceremony configuration, assign queue positions, mark contributions valid, alter another participant, or finalize a ceremony.
- **User story:** _As a participant, I want to join a ceremony, contribute to each required circuit in order with my own local entropy, recover if my upload is interrupted, and receive an attestation when I finish._

### Coordinator

A trusted role that owns a project and runs its ceremonies.

- **Can:** create projects they own, configure ceremonies inside their projects, configure circuits, control ceremony lifecycle (open, pause, close, cancel), view operational progress, start finalization, and publish final outputs.
- **Cannot:** mutate projects they do not own. Coordinator actions shall be auditable, and mutating authority is scoped to owned projects.
- **User story:** _As a coordinator, I want to create a project, define a ceremony with one or more circuits, open it, monitor progress, then close and finalize it so that final verifier artifacts are published._

### Worker

A system actor that performs verification or finalization tasks. The Worker is **not a
human user** — it is the automated verification process that runs inside an AWS EC2 VM,
managed by `VmModule` and `verification-monitoring.service.ts`. It is assigned tasks by
the backend, executes snarkjs verification, and its output is validated before it can
affect public ceremony state.

- **Can:** perform verification or finalization tasks assigned by the system.
- **Cannot:** exceed narrowly scoped permissions; worker authority is limited to the required ceremony, circuit, and artifact operation, and its output is validated before it changes public ceremony state.

### Other Stakeholders

- Project teams that need trusted setup ceremonies.
- Operators who keep ceremony infrastructure available.
- Developers integrating final verifier artifacts into applications.

---

## Domain Model

This section is the single source of truth for entities, states, and enums. All other sections refer to these names without redefining them.

### User

A user is an authenticated identity that can take coordinator or participant roles.

Required properties:

- Display name.
- Identity provider.
- Wallet address when the provider is wallet-based.
- Avatar reference when available.
- Creation timestamp.
- Last sign-in timestamp.
- Last update timestamp.

Allowed identity providers:

- `GITHUB`
- `ETHEREUM`
- `CARDANO`

A user may authenticate with more than one identity provider. Provider binding allows linking multiple provider identities into a single account. Until provider binding is available, each provider registration creates a distinct user record.

### Project

A project is a coordinator-owned container that groups one or more ceremonies.

Required properties:

- Name.
- Public contact reference.
- Coordinator identity.
- Creation timestamp.
- Last update timestamp.

A project shall have exactly one coordinator. A coordinator may own more than one project. Ceremonies shall always belong to a project.

### Ceremony

A ceremony coordinates Phase 2 contributions for one or more circuits inside a project.

Required properties:

- Project identity.
- Description.
- State.
- Start date and end date.
- Penalty duration applied to timed-out participants.
- Allowed identity providers configuration.
- Last update timestamp.

Allowed states:

- `SCHEDULED`: setup is complete and the contribution window has not opened.
- `OPENED`: participants may join and contribute.
- `PAUSED`: contribution activity is temporarily suspended.
- `CLOSED`: new contribution work is no longer accepted.
- `CANCELED`: the ceremony has been abandoned and shall not finalize.
- `FINALIZED`: final outputs have been produced and published.

Allowed identity providers configuration shall enumerate which user providers may join the ceremony as participants. A ceremony may accept any subset of `GITHUB`, `ETHEREUM`, or `CARDANO`.

### Circuit

A circuit is a compiled target for the ceremony.

Required properties:

- Name and sequence position.
- Compiler and source-template metadata.
- Public circuit input artifacts and extracted circuit metadata.
- Required Phase 1 parameter power.
- Verification configuration, including verification machine type.
- Timeout mechanism configuration.
- Queue state.
- Artifact references and hashes.

Allowed timeout mechanism types:

- `DYNAMIC`: the timeout window is calculated from the average of previous contribution
  times observed in the ceremony. As contributions are recorded, the target time adjusts
  based on observed timings, gated by a configured threshold to prevent unbounded growth.
  Suitable for ceremonies where contribution time is unpredictable and fairness should
  adapt to real conditions.
- `FIXED`: a hard, pre-configured time window that applies equally to every contributor
  regardless of how long others took. Simple and predictable — contributors know exactly
  how long they have. Suitable for ceremonies with well-understood contribution times.
- `LOBBY`: no per-step timeout is enforced. Participants wait in a lobby-style queue and
  are not penalized for taking too long. Suitable for ceremonies where timing pressure is
  not a concern or where coordinators want full manual control over pacing.

Allowed verification machine types:

- `server`: verification runs in the coordinator backend.
- `vm`: verification runs in a dedicated virtual machine.

Required queue state:

- Current contributor reference when one is active.
- Ordered contributors list.
- Completed contribution count.
- Failed contribution count.

Optional performance metadata:

- zKey size in bytes.
- Constraint count.
- Average contribution computation time.
- Average full contribution time.
- Average verification time.

Circuit sequence position defines the order in which participants must contribute across multi-circuit ceremonies.

### Queue

Each circuit has an ordered contribution queue derived from the circuit's queue state.

Queue updates shall be atomic. At most one participant may hold the active contribution slot for a circuit at any time.

### Participant

A participant is an authenticated user enrolled in a ceremony.

Required properties:

- User identity.
- Ceremony identity.
- Current status.
- Current contribution step.
- Contribution progress indicator.
- Contribution start timestamp.
- Verification start timestamp.
- Temporary upload recovery data.
- Recorded timeout history.
- Last update timestamp.

A participant record shall be unique per ceremony and user.

Allowed statuses:

- `CREATED`
- `WAITING`
- `READY`
- `CONTRIBUTING`
- `CONTRIBUTED`
- `DONE`
- `FINALIZING`
- `FINALIZED`
- `TIMEDOUT`
- `EXHUMED`

Allowed contribution steps:

- `DOWNLOADING`
- `COMPUTING`
- `UPLOADING`
- `VERIFYING`
- `COMPLETED`

### Contribution

A contribution records one verified or failed circuit update.

Required properties:

- Participant identity.
- Circuit identity.
- zKey index.
- Validity flag set after verification.
- Contribution computation time.
- Full contribution time.
- Verification time.
- Produced artifact references and hashes.
- Verification software metadata.
- Last update timestamp.
- Optional final beacon metadata when the contribution is the final beacon contribution.

### Timeout

A timeout records a participant or verification process that blocked progress.

Required properties:

- Ceremony identity.
- Participant identity.
- Circuit identity when applicable.
- Timeout type.
- Start timestamp.
- End timestamp.

Allowed timeout types:

- `BLOCKING_CONTRIBUTION`: download, compute, or upload exceeded the contribution window.
  The participant is at fault — a penalty shall be applied and the participant moved to
  `TIMEDOUT`. After the penalty period expires the participant is exhumed and re-queued.
- `BLOCKING_VERIFICATION`: verification did not settle within the verification window.
  The failure is on the system side — the participant shall not be penalized. The
  ceremony or circuit state requires system-side recovery or verification retry.
- `BLOCKING_BACKEND_FUNCTION`: a backend operation required to advance the participant
  did not complete in time. Treated as a system failure — no participant penalty applies.
- `UNKNOWN`: the cause cannot be classified at the time the event is recorded.

### Artifact

An artifact is any ceremony file that must be stored, hashed, downloaded, uploaded, verified, or published. Artifact types and integrity rules are detailed in [Artifacts & Integrity](#artifacts--integrity).

Artifact categories:

- Phase 1 parameter files.
- Circuit input files.
- Initial contribution state.
- Intermediate contribution state.
- Final contribution state.
- Transcripts.
- Verification keys.
- Verifier contracts.
- Public attestations.

---

## Functional Requirements

Requirements are grouped by capability area. They reference states and entities defined in [Domain Model](#domain-model).

### Project Management

- [x] The system shall let an authenticated coordinator create, list, retrieve, update, and delete projects.
- [x] The system shall enforce that project mutations are performed only by the owning coordinator.
- [x] The system shall require every ceremony to belong to exactly one project.

### Ceremony Lifecycle

- [x] The system shall let a coordinator define a ceremony under a project with a description, start/end dates, penalty duration, and an allowed identity providers configuration.
- [x] The system shall validate ceremony and circuit configuration before a ceremony leaves `SCHEDULED`.
- [x] The system shall let a coordinator transition a ceremony `OPENED`, `PAUSED`, `CLOSED`, and `CANCELED` according to the allowed states.
- [x] The system shall expose a public listing of ceremonies, including each ceremony's allowed identity providers.

### Circuits & Queues

- [x] The system shall let a coordinator define one or more circuits per ceremony, each with a sequence position.
- [x] The system shall maintain a per-circuit ordered queue whose updates are atomic, with at most one active contributor per circuit.
- [x] The system shall support `DYNAMIC`, `FIXED`, and `LOBBY` timeout mechanisms per circuit.
- [x] The system shall require participants to contribute across multi-circuit ceremonies in circuit sequence order.

### Participant Contribution

- [x] The system shall enroll a user as a participant only when their identity provider is in the ceremony's whitelist (see [Security & Trust](#security--trust)).
- [x] The system shall let a participant check in, wait in a queue, and become the active contributor for one circuit at a time.
- [x] The system shall drive a participant through the contribution steps `DOWNLOADING` → `COMPUTING` → `UPLOADING` → `VERIFYING` → `COMPLETED`.
- [x] The system shall accept entropy only as a local participant input and shall never transmit or persist it (see [Security & Trust](#security--trust)).
- [x] The system shall support resumable uploads via temporary recovery metadata on the participant record (see [Artifacts & Integrity](#artifacts--integrity)).

### Verification & Queue Advancement

- [x] The system shall verify every contribution before marking it valid.
- [x] The system shall record the verification result, timing, and integrity metadata for each contribution.
- [x] The system shall handle failed contributions without advancing the ceremony.
- [x] The system shall make verification completion idempotent, so a contribution advances the queue exactly once.

### Finalization & Publication

- [x] The system shall let a coordinator close a ceremony and then finalize it only after all required final outputs exist.
- [x] The system shall produce the final beacon contribution and record the beacon value with its SHA-256 hash (see [Artifacts & Integrity](#artifacts--integrity)).
- [ ] The system shall publish the verification key and, when applicable, the verifier contract, with BLAKE2b hashes for final file artifacts.
- [x] The system shall never finalize a ceremony in the `CANCELED` state.

---

## Workflows

Workflows describe how personas move the domain through its states. They reference states defined in [Domain Model](#domain-model).

### Coordinator Journey

1. Coordinator creates a project they own.
2. Coordinator defines a ceremony (`SCHEDULED`) with one or more circuits and an allowed identity providers configuration.
3. Coordinator opens the ceremony (`OPENED`); it may be temporarily suspended (`PAUSED`) and resumed.
4. Coordinator monitors per-circuit queues and contribution progress.
5. Coordinator stops accepting new work (`CLOSED`), or abandons the ceremony (`CANCELED`).
6. Coordinator starts finalization, producing the final beacon contribution and final outputs, ending in `FINALIZED`.

### Participant Contribution Journey

1. Participant authenticates and enrolls (`CREATED`) in an `OPENED` ceremony whose whitelist accepts their provider.
2. Participant waits in the per-circuit queue (`WAITING`) until selected (`READY`).
3. Participant becomes the active contributor (`CONTRIBUTING`) for one circuit and proceeds through the steps `DOWNLOADING` → `COMPUTING` → `UPLOADING` → `VERIFYING` → `COMPLETED`, computing the contribution with local entropy.
4. On successful verification the contribution is recorded valid and the queue advances; the participant is `CONTRIBUTED` for that circuit.
5. The participant repeats for every required circuit in sequence; after all circuits, the participant is `DONE` and receives a public attestation.

### Timeout, Penalty & Exhumation

1. If a participant blocks progress beyond the active window, the system records a typed timeout (`BLOCKING_CONTRIBUTION`, `BLOCKING_VERIFICATION`, `BLOCKING_BACKEND_FUNCTION`, or `UNKNOWN`) and moves the participant to `TIMEDOUT`.
2. The ceremony's penalty duration applies before the participant may return.
3. When the penalty expires the participant is exhumed (`EXHUMED`) and re-queued to retry the contribution.

### Finalization

1. From `CLOSED`, the coordinator initiates finalization; affected participants enter `FINALIZING`.
2. The system produces the final beacon contribution, generates final artifacts, and computes hashes (BLAKE2b for files, SHA-256 for the beacon value).
3. The ceremony becomes `FINALIZED` and final outputs are published for public inspection; finalization is rejected for a `CANCELED` ceremony.

---

## Artifacts & Integrity

### Artifact Principles

- Every ceremony artifact that affects correctness shall have a recorded hash.
- Every accepted contribution shall be linked to the previous valid contribution state.
- Every final output shall be publicly inspectable.
- Artifact names shall be deterministic enough to support audit, recovery, and reproducibility.
- Hash mismatch, missing artifact, or incompatible circuit metadata shall be treated as a hard failure.

### Hash Policy

This is the single definition of the hash policy; other sections reference it.

- The system shall use BLAKE2b for hashing file artifacts, including zKey files, transcripts, R1CS files, Phase 1 parameter files, verification keys, and verifier contracts.
- The system shall use SHA-256 for the beacon value used in final beacon contributions.
- Recorded hashes shall be stored alongside the artifacts they describe and remain available to public readers for finalized ceremonies.

### Required Artifact Types

#### Phase 1 Parameter File

The system shall associate each circuit with the smallest suitable Phase 1 parameter file required by the circuit metadata.

Required metadata:

- Filename.
- Source or storage reference.
- Required power.
- BLAKE2b hash when available.

#### Circuit Input Files

Each circuit shall include:

- Constraint file.
- Witness-generation file.
- Compiler metadata.
- Source-template metadata.
- Parameter configuration.
- Extracted circuit metadata.
- BLAKE2b hashes for all input files.

#### Contribution State Files

Each circuit shall maintain:

- Initial contribution state.
- Latest valid contribution state.
- Intermediate contribution states.
- Final contribution state.

Contribution state filenames shall encode circuit identity and contribution position.

#### Transcript Files

Each valid contribution shall produce or reference a transcript.

Required metadata:

- Filename.
- Storage reference.
- BLAKE2b hash.
- Associated participant.
- Associated circuit.
- Contribution index.

#### Final Verification Outputs

Finalization shall publish:

- Final contribution state.
- Final transcript or final contribution metadata.
- Verification key.
- Verifier contract when applicable.
- BLAKE2b hash for each final file output.
- Beacon value and its SHA-256 hash.

### Integrity Rules

- The system shall never mark a contribution valid before verification succeeds.
- The system shall never finalize from an unverified latest contribution state.
- The system shall never finalize a ceremony in the `CANCELED` state.
- The system shall never accept final artifacts without hashes.
- The system shall preserve enough metadata to independently reproduce artifact selection decisions.
- The system shall protect write access for active uploads and final outputs.

### Upload Recovery

Large uploads shall support resumption through temporary metadata stored on the participant record.

Required recovery metadata:

- Multipart upload identifier.
- Ordered list of completed parts, each described by part number and ETag.
- Accumulated contribution computation time so timing measurements survive restarts.
- Participant and circuit association.
- Completion status.

Temporary upload metadata shall be cleared or archived after the contribution is resolved.

---

## Security & Trust

Roles and their permissions are defined in [Personas & Roles](#personas--roles); the hash policy is defined in [Artifacts & Integrity](#artifacts--integrity). This section covers authentication, trust boundaries, authorization, abuse handling, and audit.

### Authentication Providers

The system shall support multiple identity providers. A user is uniquely scoped per provider (see [Domain Model](#domain-model)).

#### GitHub

- Authorization Code Flow: the frontend obtains the GitHub client identifier from the backend, the user completes the GitHub authorization, and the backend exchanges the resulting authorization code for an access token, then returns a session token.
- Device Flow: a CLI or constrained client receives a device code from GitHub, the user authorizes the device, and the access token is exchanged with the backend for a session token.

#### Ethereum

- Sign-In with Ethereum (EIP-4361). The backend issues a nonce for the requesting address, the user signs a SIWE message containing the nonce, and the backend verifies the signature before issuing a session token.

#### Cardano

- Wallet signature flow. The backend issues a nonce for the requesting wallet address, the wallet signs the nonce, and the backend verifies the signature before issuing a session token.

#### Session

- The system shall issue short-lived JSON Web Tokens for session authentication.
- The system shall not persist private signing inputs from any provider beyond the verification step.
- The system shall scope every mutating operation to the authenticated user derived from the session token.

#### Per-Ceremony Provider Whitelist

- Each ceremony shall declare the set of identity providers it accepts.
- The system shall reject participant enrollment when the user's provider is not in the ceremony's whitelist.
- The system shall expose the whitelist to public readers so prospective participants can choose ceremonies they are eligible for.

### Trust Boundaries

- Participant entropy shall remain private to the participant.
- Uploaded artifacts shall be untrusted until verified.
- Public readers shall not be trusted with private operational data.
- Coordinator privileges shall be explicit, scoped to owned projects, and revocable.
- Worker output shall be validated before it changes public ceremony state.

### Authorization Requirements

- Every mutating operation shall require authentication.
- Coordinator-only operations shall require coordinator authorization.
- Project mutations shall require ownership of the target project.
- Participant operations shall use the authenticated user's identity.
- Queue mutation shall be mediated by the system.
- Upload permissions shall be scoped to one participant, one ceremony, one circuit, and one contribution position.
- Final artifact publication shall require coordinator authorization and successful validation.

### Abuse & Failure Cases

The system shall handle:

- Participant disconnect during download, compute, or upload.
- Participant attempting to upload when not current contributor.
- Participant attempting to reuse another participant's upload permission.
- Participant attempting to enroll with a provider not accepted by the ceremony.
- Replay of a SIWE or Cardano nonce after it has been consumed.
- Non-owner attempting to mutate a project.
- Duplicate verification completion.
- Verification failure after successful upload.
- Coordinator attempting finalization before prerequisites are met.
- Coordinator attempting finalization on a `CANCELED` ceremony.
- Hash mismatch on any required artifact.
- Public requests for private operational data.

### Audit Requirements

The system shall record:

- Project creation and deletion.
- Ceremony creation and lifecycle transitions, including cancellation.
- Queue assignment and release.
- Contribution verification results.
- Timeout events and their type.
- Finalization actions.
- Published final hashes.

Audit records shall be sufficient to explain why a contribution was accepted, rejected, timed out, or superseded.

---

## Acceptance Criteria

Criteria are written as Given/When/Then and derived from product success criteria and the [Delivery Roadmap](#delivery-roadmap) acceptance targets.

### Project & Ceremony Setup

- **Given** an authenticated coordinator, **when** they create a project and then a ceremony with at least one circuit inside it, **then** the ceremony belongs to that project and a participant can enroll into the first circuit's queue.
- **Given** a user whose identity provider is not in a ceremony's whitelist, **when** they attempt to enroll, **then** the system rejects the enrollment.

### Artifact Integrity

- **Given** required input artifacts and participant-produced artifacts, **when** they are registered, **then** each is tracked with a BLAKE2b hash and recoverable upload state.

### Participant Contribution

- **Given** an opened ceremony, **when** a participant authenticates with any of the ceremony's allowed identity providers, **then** they can complete a valid contribution for every circuit in sequence and receive a completion attestation.
- **Given** an interrupted upload, **when** the participant resumes, **then** completed parts and accumulated timing survive the restart.

### Verification & Advancement

- **Given** a submitted contribution, **when** verification runs, **then** an invalid contribution cannot advance the ceremony and a valid contribution advances the queue exactly once.
- **Given** a duplicate verification completion, **when** it is processed, **then** the queue does not advance more than once.

### Finalization & Publication

- **Given** a closed ceremony, **when** all required final outputs are published, **then** it can become `FINALIZED`; **and given** a `CANCELED` ceremony, **when** finalization is attempted, **then** it is rejected.
- **Given** a finalized ceremony, **when** an observer inspects it, **then** final outputs can be independently verified using public artifacts and hashes.

### Audit & Traceability

- **Given** a ceremony's history, **when** an operator or auditor reviews it, **then** they can explain every state transition and resolve common blocked states.

---

## Delivery Roadmap

Brebaje is delivered as a pnpm monorepo with the following surfaces:

- A NestJS backend that exposes the REST API and orchestrates ceremony state.
- A Next.js 14 App Router frontend for coordinators, participants, and observers.
- A Commander.js CLI for participants and operators.
- A Docusaurus website for public documentation.
- A shared `@brebaje/actions` package that holds crypto, snarkjs, hashing, and upload/download helpers used by the backend and the CLI.

The roadmap defines product capabilities; the reference implementation is the order in which these capabilities are landed across the surfaces above. States referenced below are defined in [Domain Model](#domain-model).

### Phase 1: Product Core

Deliver the minimum product needed to define projects and ceremonies and model progress.

Capabilities:

- [x] Project management: create, list, retrieve, update, delete with ownership enforcement.
- [x] Ceremony setup definition under a project.
- [x] Ceremony and circuit validation.
- [x] Participant enrollment.
- [x] Circuit queues.
- [x] Fixed timeout policy.
- [x] Public ceremony listing.

- [x] Acceptance target: a coordinator can create a project, then create a ceremony with at least one circuit inside it, and a participant can enroll into the first queue.

### Phase 2: Artifact Integrity

Deliver artifact registration, hashing, and recovery foundations.

Capabilities:

- [x] Circuit input artifact registration.
- [x] Required Phase 1 parameter association.
- [x] Deterministic artifact naming.
- [x] BLAKE2b hash computation and storage for file artifacts.
- [x] Resumable multipart upload recovery metadata.

- [x] Acceptance target: required input artifacts and participant-produced artifacts are tracked with hashes and recoverable upload state.

### Phase 3: Participant Contribution Experience

Deliver the participant-facing ceremony journey.

Capabilities:

- [x] Ceremony discovery, including allowed identity providers per ceremony.
- [x] Multi-provider authentication — backend (GitHub, Ethereum, Cardano); frontend: GitHub only.
- [ ] Participant check-in UI.
- [x] Queue waiting.
- [ ] Contribution status updates UI.
- [ ] Local entropy entry UI.
- [ ] Public participation attestation.

- [ ] Acceptance target: a participant can complete a valid contribution for every circuit in a ceremony using any of the ceremony's allowed identity providers.

### Phase 4: Verification And Queue Advancement

Deliver reliable verification and state advancement.

Capabilities:

- [x] Contribution verification.
- [x] Verification result recording.
- [x] Failed contribution handling.
- [x] Idempotent verification completion.
- [x] Queue advancement after successful verification.

- [x] Acceptance target: invalid contributions cannot advance the ceremony, and valid contributions advance the queue exactly once.

### Phase 5: Finalization And Publication

Deliver the complete ceremony output flow.

Capabilities:

- [x] Ceremony closing and cancellation.
- [x] Final beacon contribution with SHA-256 hashing of the beacon value.
- [ ] Final artifact generation endpoint.
- [x] BLAKE2b hash publication for final file artifacts.
- [ ] Verification key and verifier contract publication via public endpoint.

- [ ] Acceptance target: a closed ceremony can become finalized only after all required final outputs are published, and a canceled ceremony cannot finalize.

### Phase 6: Governance And Operations

Deliver operational maturity for public ceremonies.

Capabilities:

- [ ] Coordinator role management and project ownership transfer.
- [ ] Audit event review.
- [ ] Timeout monitoring with typed timeout events.
- [ ] Incident recovery procedures.
- [ ] Public documentation for participants and auditors.

- [ ] Acceptance target: operators and auditors can explain ceremony state transitions and resolve common blocked states.

---

## Glossary

- **Project:** A coordinator-owned container that groups one or more ceremonies and provides a stable contact and identity for the team running them.
- **Ceremony:** A coordinated trusted setup process for one or more circuits, owned by a project.
- **Circuit:** A compiled arithmetic circuit that receives ordered contributions.
- **Coordinator:** A trusted role that owns a project, configures ceremonies, opens, closes, and finalizes them.
- **Participant:** A user who contributes entropy to the ceremony.
- **Contribution:** A participant-produced update to a circuit artifact.
- **Artifact:** A file required or produced by the ceremony, including circuit inputs, keys, transcripts, and verifier outputs.
- **Verification:** The process that proves a contribution correctly extends the previous ceremony state.
- **Attestation:** A public statement proving that a participant completed valid contributions.
- **Identity Provider:** A supported authentication backend through which a user proves identity (GitHub, Ethereum, Cardano).
