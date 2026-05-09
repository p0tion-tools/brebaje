# Brebaje Product Specification

This documentation describes the users, goals, rules, workflows, and acceptance criteria required to coordinate Groth16 trusted setup ceremonies in Brebaje.

Brebaje is the community version of [P0tion](https://github.com/privacy-scaling-explorations/p0tion).

## Reading Order

1. [Product Brief](./product-brief.md)
2. [Personas And User Stories](./personas-and-user-stories.md)
3. [Domain Specification](./domain-specification.md)
4. [Functional Requirements](./functional-requirements.md)
5. [Workflow Specification](./workflow-specification.md)
6. [Artifact And Integrity Specification](./artifact-and-integrity-specification.md)
7. [Security And Trust Requirements](./security-and-trust-requirements.md)
8. [Acceptance Criteria](./acceptance-criteria.md)
9. [Delivery Roadmap](./delivery-roadmap.md)

## Product Definition

Brebaje is a ceremony coordination product for projects that need Groth16 Phase 2 trusted setup ceremonies. It enables coordinators to organize ceremonies under projects, participants to contribute securely, and observers to inspect the resulting artifacts and audit trail.

The product shall prioritize:

- Correct ceremony ordering and contribution integrity.
- Participant privacy for secret entropy.
- Public verifiability of final outputs.
- Recoverability from interrupted long-running work.
- Clear governance and role boundaries.
- Open identity options for participants without forcing a single provider.

## Terminology

- Project: A coordinator-owned container that groups one or more ceremonies and provides a stable contact and identity for the team running them.
- Ceremony: A coordinated trusted setup process for one or more circuits, owned by a project.
- Circuit: A compiled arithmetic circuit that receives ordered contributions.
- Coordinator: A trusted role that owns a project, configures ceremonies, opens, closes, and finalizes them.
- Participant: A user who contributes entropy to the ceremony.
- Contribution: A participant-produced update to a circuit artifact.
- Artifact: A file required or produced by the ceremony, including circuit inputs, keys, transcripts, and verifier outputs.
- Verification: The process that proves a contribution correctly extends the previous ceremony state.
- Attestation: A public statement proving that a participant completed valid contributions.
- Identity Provider: A supported authentication backend through which a user proves identity (GitHub, Ethereum, Cardano).
