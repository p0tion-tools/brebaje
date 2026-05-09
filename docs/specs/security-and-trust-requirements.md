# Security And Trust Requirements

## Roles

### Public Reader

Can inspect public project metadata, public ceremony metadata, public artifacts, final hashes, transcripts, verification keys, verifier contracts, and public participant information.

Cannot mutate ceremony state or access sensitive operational credentials.

### Participant

Can authenticate, join open ceremonies that accept their identity provider, wait in queues, download required artifacts, upload assigned contribution artifacts, resume eligible interrupted work, and view personal contribution status.

Cannot modify ceremony configuration, assign queue positions, mark contributions valid, alter another participant, or finalize a ceremony.

### Coordinator

Can create projects they own, configure ceremonies inside their projects, configure circuits, control ceremony lifecycle (open, pause, close, cancel), view operational progress, start finalization, and publish final outputs.

Coordinator actions shall be auditable. A coordinator's mutating authority is scoped to projects they own.

### Worker

Can perform verification or finalization tasks assigned by the system.

Worker permissions shall be narrow and scoped to the required ceremony, circuit, and artifact operation.

## Authentication Providers

The system shall support multiple identity providers. A user is uniquely scoped per provider.

### GitHub

- Authorization Code Flow: the frontend obtains the GitHub client identifier from the backend, the user completes the GitHub authorization, and the backend exchanges the resulting authorization code for an access token, then returns a session token.
- Device Flow: a CLI or constrained client receives a device code from GitHub, the user authorizes the device, and the access token is exchanged with the backend for a session token.

### Ethereum

- Sign-In with Ethereum (EIP-4361). The backend issues a nonce for the requesting address, the user signs a SIWE message containing the nonce, and the backend verifies the signature before issuing a session token.

### Cardano

- Wallet signature flow. The backend issues a nonce for the requesting wallet address, the wallet signs the nonce, and the backend verifies the signature before issuing a session token.

### Session

- The system shall issue short-lived JSON Web Tokens for session authentication.
- The system shall not persist private signing inputs from any provider beyond the verification step.
- The system shall scope every mutating operation to the authenticated user derived from the session token.

### Per-Ceremony Provider Whitelist

- Each ceremony shall declare the set of identity providers it accepts.
- The system shall reject participant enrollment when the user's provider is not in the ceremony's whitelist.
- The system shall expose the whitelist to public readers so prospective participants can choose ceremonies they are eligible for.

## Trust Boundaries

- Participant entropy shall remain private to the participant.
- Uploaded artifacts shall be untrusted until verified.
- Public readers shall not be trusted with private operational data.
- Coordinator privileges shall be explicit, scoped to owned projects, and revocable.
- Worker output shall be validated before it changes public ceremony state.

## Authorization Requirements

- Every mutating operation shall require authentication.
- Coordinator-only operations shall require coordinator authorization.
- Project mutations shall require ownership of the target project.
- Participant operations shall use the authenticated user's identity.
- Queue mutation shall be mediated by the system.
- Upload permissions shall be scoped to one participant, one ceremony, one circuit, and one contribution position.
- Final artifact publication shall require coordinator authorization and successful validation.

## Abuse And Failure Cases

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

## Audit Requirements

The system shall record:

- Project creation and deletion.
- Ceremony creation and lifecycle transitions, including cancellation.
- Queue assignment and release.
- Contribution verification results.
- Timeout events and their type.
- Finalization actions.
- Published final hashes.

Audit records shall be sufficient to explain why a contribution was accepted, rejected, timed out, or superseded.
