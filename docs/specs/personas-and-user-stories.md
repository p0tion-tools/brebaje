# Personas And User Stories

## Coordinator

The coordinator owns a project and is accountable for the lifecycle of every ceremony inside it.

- As a coordinator, I want to create a project that groups my ceremonies, so that participants and observers can identify the team running them.
- As a coordinator, I want to update or remove projects that I own, so that I can keep my organization's public footprint accurate.
- As a coordinator, I want to create a ceremony from a complete setup definition under one of my projects, so that all participants contribute against the intended circuits.
- As a coordinator, I want to choose which identity providers a ceremony accepts, so that I can match the trust expectations of the contributing community.
- As a coordinator, I want setup validation before the ceremony opens, so that invalid configuration does not create unusable public state.
- As a coordinator, I want to observe queue and verification progress, so that I can detect blocked ceremonies.
- As a coordinator, I want to close or cancel a ceremony, so that finalization can begin or the ceremony can be retired without finalization.
- As a coordinator, I want to apply a final beacon and publish final artifacts, so that applications can use the ceremony outputs.

Acceptance criteria:

- Coordinator-only actions require coordinator authorization.
- Mutations on a project shall require ownership of that project.
- Ceremony setup fails if required circuit, timing, or provider data is invalid.
- Finalization is blocked until required verification work is complete.
- Canceled ceremonies cannot be finalized.

## Participant

The participant contributes entropy to one or more circuits.

- As a participant, I want to authenticate with one of the identity providers accepted by the ceremony, so that I can join without forcing a specific account type.
- As a participant, I want to see available ceremonies and the providers each one accepts, so that I can choose where to contribute.
- As a participant, I want to enter the queue for a ceremony, so that I can contribute when my turn arrives.
- As a participant, I want my entropy to remain local and private, so that my contribution preserves the ceremony trust model.
- As a participant, I want upload recovery, so that an interrupted large upload does not force me to restart unnecessarily.
- As a participant, I want an attestation after valid contribution, so that I can publicly demonstrate participation.

Acceptance criteria:

- A participant cannot contribute unless assigned to the active queue position.
- A participant whose identity provider is not accepted by the ceremony cannot enroll.
- Participant entropy is never persisted by the product.
- A participant can resume eligible interrupted work.

## Observer

The observer inspects ceremony state and outputs.

- As an observer, I want to list public projects and ceremonies, so that I can understand which ceremonies are scheduled, open, paused, closed, canceled, or finalized.
- As an observer, I want to inspect public artifacts and hashes, so that I can audit ceremony integrity.
- As an observer, I want to see final verification outputs, so that I can validate downstream use.

Acceptance criteria:

- Public data does not expose secrets or privileged credentials.
- Final outputs include enough metadata for independent inspection.

## Operator

The operator keeps long-running ceremony work available and recoverable.

- As an operator, I want blocked participants to time out, so that one stalled user cannot stop the ceremony.
- As an operator, I want failed verification to be recoverable, so that temporary failures do not corrupt ceremony state.
- As an operator, I want durable audit records, so that incident review is possible.

Acceptance criteria:

- Timeout actions are recorded.
- Retried work is idempotent or otherwise protected from duplicate valid records.

## Application Developer

The application developer consumes final verifier outputs.

- As an application developer, I want final verification keys and verifier contracts, so that I can integrate proofs into my application.
- As an application developer, I want final artifact hashes, so that I can pin and verify the exact files used.

Acceptance criteria:

- Final artifacts are named and published consistently.
- Final hashes are available before the ceremony is considered complete.
