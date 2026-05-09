# Acceptance Criteria

## Project Management

- Given an authenticated coordinator, when they create a project with valid fields, then the project is stored and the coordinator is recorded as its owner.
- Given a non-owner, when they attempt to update or delete a project, then the request is rejected.
- Given a project with associated ceremonies, when an observer lists projects, then the project is publicly visible without exposing private operational data.

## Ceremony Setup

- Given a valid setup definition under an owned project, when a coordinator creates a ceremony, then the ceremony, circuits, and queues exist with valid initial state.
- Given an invalid date range, when setup is submitted, then setup fails.
- Given missing circuit input artifacts, when setup is submitted, then setup fails.
- Given duplicate circuit sequence positions, when setup is submitted, then setup fails.
- Given an empty allowed identity providers configuration, when setup is submitted, then setup fails.

## Participant Enrollment

- Given an open ceremony that accepts the participant's identity provider, when an authenticated participant checks in, then the participant is enrolled and receives a next action.
- Given an open ceremony that does not accept the participant's identity provider, when the participant checks in, then enrollment is rejected.
- Given a closed ceremony, when a participant checks in, then new contribution enrollment is rejected.
- Given a canceled ceremony, when a participant checks in, then enrollment is rejected.
- Given an existing participant, when they check in again, then the system returns their current status without creating a duplicate participant.

## Queueing

- Given multiple waiting participants, when a circuit is available, then exactly one participant becomes current contributor.
- Given a participant who is not current contributor, when they attempt to upload a contribution, then the upload is rejected.
- Given successful verification, when queue advancement occurs, then the next eligible participant is assigned.

## Contribution

- Given a participant assigned to a circuit, when they complete download, compute, and upload, then their status advances to verification.
- Given an interrupted upload with recovery metadata, when the participant resumes, then already completed parts are not required again.
- Given upload completion, when verification has not succeeded, then the contribution is not valid yet.

## Verification

- Given a valid contribution, when verification succeeds, then a contribution record and BLAKE2b hashes are stored.
- Given an invalid contribution, when verification fails, then the queue does not advance as if the contribution were valid.
- Given duplicate verification completion for the same contribution position, then only one valid contribution result is accepted.

## Timeout

- Given a participant exceeds the contribution window, when timeout processing runs, then the participant is marked `TIMEDOUT`, the queue slot is released, and the timeout type is recorded.
- Given an active timeout penalty, when the participant checks in, then immediate requeue is denied.
- Given an expired timeout penalty, when the participant checks in, then the participant becomes `EXHUMED` and may resume or rejoin according to ceremony rules.

## Finalization

- Given an open ceremony, when finalization is requested, then finalization is rejected.
- Given a closed ceremony with unsettled verification work, when finalization is requested, then finalization is rejected.
- Given a canceled ceremony, when finalization is requested, then finalization is rejected.
- Given a ready closed ceremony, when the project's coordinator finalizes it, then final artifacts, BLAKE2b hashes, beacon value with SHA-256 hash, and verifier outputs are published.
- Given successful publication of all final outputs, then the ceremony state becomes `FINALIZED`.

## Public Audit

- Given a finalized ceremony, when a public reader inspects it, then final hashes, allowed identity providers, and artifact metadata are visible.
- Given public inspection, when private credentials or participant entropy would be exposed, then the data is not returned.
