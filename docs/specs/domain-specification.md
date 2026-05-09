# Domain Specification

## User

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

User identity shall be uniquely scoped per provider. The same human may register with more than one provider, in which case each registration is a distinct user record.

## Project

A project is a coordinator-owned container that groups one or more ceremonies.

Required properties:

- Name.
- Public contact reference.
- Coordinator identity.
- Creation timestamp.
- Last update timestamp.

A project shall have exactly one coordinator. A coordinator may own more than one project. Ceremonies shall always belong to a project.

## Ceremony

A ceremony coordinates contributions for one or more circuits inside a project.

Required properties:

- Project identity.
- Description.
- Type.
- State.
- Start date and end date.
- Penalty duration applied to timed-out participants.
- Allowed identity providers configuration.
- Last update timestamp.

Allowed types:

- `PHASE1`: Powers of Tau ceremony.
- `PHASE2`: circuit-specific proving key ceremony.

Allowed states:

- `SCHEDULED`: setup is complete and the contribution window has not opened.
- `OPENED`: participants may join and contribute.
- `PAUSED`: contribution activity is temporarily suspended.
- `CLOSED`: new contribution work is no longer accepted.
- `CANCELED`: the ceremony has been abandoned and shall not finalize.
- `FINALIZED`: final outputs have been produced and published.

Allowed identity providers configuration shall enumerate which user providers may join the ceremony as participants. A ceremony may accept any subset of `GITHUB`, `ETHEREUM`, or `CARDANO`.

## Circuit

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

- `DYNAMIC`: target time derived from observed contribution timings, gated by a configured threshold.
- `FIXED`: target time defined by a fixed time window.
- `LOBBY`: lobby-style waiting that does not enforce per-step timeouts.

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

## Queue

Each circuit has an ordered contribution queue derived from the circuit's queue state.

Queue updates shall be atomic. At most one participant may hold the active contribution slot for a circuit at any time.

## Participant

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

## Contribution

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

## Timeout

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
- `BLOCKING_VERIFICATION`: verification did not settle within the verification window.
- `BLOCKING_BACKEND_FUNCTION`: a backend operation required to advance the participant did not complete in time.
- `UNKNOWN`: the cause cannot be classified at the time the event is recorded.

## Artifact

An artifact is any ceremony file that must be stored, hashed, downloaded, uploaded, verified, or published.

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
