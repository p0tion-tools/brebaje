# Functional Requirements

## Project Management

- The system shall allow an authenticated coordinator to create a project.
- The system shall record the creating coordinator as the owner of the project.
- The system shall allow public listing of projects.
- The system shall allow retrieval of an individual project by identifier.
- The system shall allow the project owner to update the project.
- The system shall allow the project owner to delete the project.
- The system shall reject project mutations from any user other than the project owner.
- The system shall associate every ceremony with exactly one project.

## Ceremony Setup

- The system shall allow a coordinator to create a ceremony under a project they own with one or more circuits.
- The system shall validate all required ceremony fields before the ceremony becomes visible as ready for participation.
- The system shall validate ceremony type, start and end dates, penalty duration, allowed identity providers, timeout policy, circuit metadata, artifact references, and circuit order.
- The system shall derive required circuit metadata from public circuit input artifacts.
- The system shall initialize a queue for each circuit.

## Authentication And Roles

- The system shall authenticate users before allowing participant or coordinator actions.
- The system shall support GitHub authentication using both OAuth Authorization Code Flow and Device Flow.
- The system shall support Ethereum authentication using Sign-In with Ethereum (EIP-4361).
- The system shall support Cardano authentication using a wallet signature over a server-issued nonce.
- The system shall distinguish coordinator privileges from participant privileges.
- The system shall derive participant identity from the active session, not from untrusted request fields.
- The system shall enforce the per-ceremony allowed identity providers when a participant enrolls.
- The system shall allow public reads only for data intended to be public.

## Ceremony Discovery

- The system shall allow users to list public ceremonies.
- The system shall expose enough ceremony metadata to distinguish scheduled, open, paused, closed, canceled, and finalized ceremonies.
- The system shall expose the ceremony's allowed identity providers so participants can decide whether they can join.
- The system shall hide private operational details from public readers.

## Participant Check-In

- The system shall allow an authenticated participant to join an open ceremony when their identity provider is accepted by the ceremony.
- The system shall create a participant record if one does not already exist for the user and ceremony.
- The system shall determine the participant's next required circuit.
- The system shall place eligible participants into the appropriate queue.
- The system shall return the participant's next action.

## Contribution

- The system shall assign only one active contributor per circuit.
- The participant shall download the latest valid contribution state before computing a new contribution.
- The participant shall compute the contribution locally using private entropy.
- The system shall record contribution progress through download, compute, upload, verification, and completion steps.
- The system shall support large artifact upload with resumable multipart upload metadata.
- The system shall not advance the queue after upload alone.

## Verification

- The system shall verify every contribution against the previous valid state.
- The system shall store verification results and produced artifact hashes.
- The system shall reject invalid contributions.
- The system shall advance participant and queue state only after successful verification.
- The system shall prevent duplicate successful contribution records for the same participant, circuit, and contribution position.

## Timeout Recovery

- The system shall detect participants or verification work that exceed the active timeout policy.
- The system shall release blocked queue slots when timeout rules are met.
- The system shall record timeout events and their type.
- The system shall prevent timed-out participants from immediately rejoining until the penalty period ends.
- The system shall allow eligible timed-out participants to resume or rejoin after the penalty period.

## Observation

- The system shall expose ceremony progress to authorized viewers.
- The system shall show circuit order, queue state, active contribution status, completed counts, failed counts, and verification progress.
- The system shall support repeated inspection without changing ceremony state.

## Finalization

- The system shall allow a coordinator to finalize a closed ceremony in a project they own.
- The system shall block finalization until all required contribution verification is complete.
- The system shall block finalization for ceremonies in the `CANCELED` state.
- The system shall apply a final beacon contribution for each circuit.
- The system shall publish final artifacts, hashes, transcripts, verification keys, and verifier contracts.
- The system shall mark the ceremony finalized only after final outputs are available.
