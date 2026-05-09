# Workflow Specification

## Project Creation

1. Coordinator authenticates with a supported identity provider.
2. Coordinator submits a project definition with name and public contact.
3. System validates required fields.
4. System records the coordinator as the project owner.
5. System makes the project available as a container for ceremonies.

Failure requirements:

- Missing required project fields shall block creation.
- Project mutations from non-owners shall be rejected.

## Ceremony Creation

1. Coordinator authenticates.
2. Coordinator selects a project they own.
3. Coordinator submits a ceremony setup definition, including ceremony type, dates, penalty, allowed identity providers, timeout policy, and the circuit list.
4. System validates ceremony metadata, dates, timeout policy, allowed identity providers, and circuit list.
5. System validates every circuit definition and artifact reference.
6. System extracts required circuit metadata.
7. System creates the ceremony in `SCHEDULED` or `OPENED` state according to the configured dates.
8. System creates circuit records in sequence order.
9. System initializes all circuit queues.

Failure requirements:

- Invalid setup shall fail before partial public ceremony state is accepted.
- Missing required artifacts shall block setup.
- Duplicate circuit positions shall block setup.
- An empty allowed identity providers configuration shall block setup.

## Participant Contribution Journey

1. Participant authenticates with one of the ceremony's allowed identity providers.
2. Participant lists ceremonies and selects an open ceremony.
3. System checks participant eligibility, including provider acceptance.
4. System creates or updates the participant record.
5. System places the participant in the queue for the next required circuit.
6. Participant waits until assigned as current contributor.
7. System marks the participant `READY`.
8. Participant starts the contribution and is marked `CONTRIBUTING`.
9. Participant downloads required artifacts and latest valid contribution state.
10. Participant computes a new contribution locally.
11. Participant uploads produced artifacts using resumable multipart upload.
12. System marks the participant `VERIFYING`.
13. Verification runs.
14. If valid, system records the contribution and advances the participant.
15. If more circuits remain, participant enters the next circuit queue.
16. If no circuits remain, participant becomes `CONTRIBUTED` and then `DONE` after verification is settled.

Failure requirements:

- A participant whose identity provider is not accepted by the ceremony shall not enroll.
- Invalid verification shall not advance the participant.
- Interrupted upload shall remain recoverable when recovery metadata exists.
- Timeout shall release the active queue slot without accepting the incomplete contribution.

## Timeout Journey

1. System identifies active contribution or verification work past its allowed time.
2. System confirms the work has not already completed.
3. System records a timeout event with its type.
4. System moves the participant to `TIMEDOUT`.
5. System releases the circuit's active contributor slot.
6. System advances the queue to the next eligible participant.
7. After the penalty period, the participant becomes `EXHUMED` and eligible to resume or rejoin.

## Ceremony Closing

1. Contribution window reaches its end date or coordinator closes the ceremony.
2. System changes state from `OPENED` to `CLOSED`.
3. System rejects new contribution check-ins.
4. System allows remaining verification work to settle according to ceremony policy.
5. System allows finalization when the ceremony is ready.

A coordinator may also move a ceremony to `CANCELED`. A canceled ceremony rejects new contributions and shall not finalize.

## Finalization Journey

1. Coordinator authenticates.
2. Coordinator selects a closed ceremony in a project they own.
3. System checks that finalization prerequisites are satisfied and that the ceremony is not canceled.
4. Coordinator provides or confirms beacon input.
5. System applies the final beacon contribution to every circuit and records the SHA-256 hash of the beacon value.
6. System verifies final outputs.
7. System exports final verification artifacts.
8. System computes BLAKE2b hashes for every final file artifact and stores them.
9. System publishes final artifact metadata.
10. System marks the ceremony `FINALIZED`.

## Observation Journey

1. Viewer opens project or ceremony status.
2. System returns current ceremony state, including allowed identity providers.
3. System returns circuit order and queue status.
4. System returns contribution and verification progress.
5. System returns final artifacts when available.

Observation shall not mutate ceremony state.
