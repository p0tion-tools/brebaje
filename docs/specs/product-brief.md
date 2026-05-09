# Product Brief

## Vision

Brebaje makes Groth16 trusted setup ceremonies practical, transparent, and repeatable for projects that need production-grade zero-knowledge proving systems, while keeping the platform open to multiple identity providers and community-hosted deployments.

Brebaje is the community version of P0tion. It preserves the cryptographic intent of the original product and extends it with project-level organization and pluggable authentication.

## Problem Statement

Running a trusted setup ceremony requires careful coordination of people, circuit artifacts, contribution ordering, verification, recovery, and publication. Without a dedicated product, teams risk invalid artifacts, unclear audit trails, blocked queues, lost uploads, and weak participant guidance.

Teams that already operate multiple ceremonies also need a stable container to group them, expose a public contact, and reuse coordinator credentials across ceremonies.

Brebaje shall provide a structured ceremony process that reduces operational mistakes while preserving the cryptographic assumptions of the underlying ceremony.

## Goals

- Allow coordinators to organize ceremonies under a project they own.
- Allow coordinators to define and manage ceremonies with one or more circuits, supporting Phase 1 and Phase 2 setups.
- Allow participants to authenticate with the identity providers supported by the ceremony and to contribute to every required circuit in the correct order.
- Verify every contribution before it becomes part of the trusted setup history.
- Publish final artifacts, hashes, transcripts, and verifier outputs for public inspection.
- Support recovery from interrupted downloads, computation, uploads, and verification.
- Provide clear role boundaries for participants, coordinators, observers, and workers.

## Non-Goals

- Brebaje shall not design a new proving system.
- Brebaje shall not remove the need for ceremony-specific security review.
- Brebaje shall not expose participant secret entropy to any server-side process or public record.
- Brebaje shall not treat uploaded artifacts as valid before verification.
- Brebaje shall not impose a single mandatory identity provider on every ceremony.

## Stakeholders

- Project teams that need trusted setup ceremonies.
- Ceremony coordinators responsible for project ownership, configuration, and finalization.
- Participants who contribute entropy.
- Auditors who inspect ceremony outputs.
- Operators who keep ceremony infrastructure available.
- Developers integrating final verifier artifacts into applications.

## Success Criteria

- A coordinator can create a project, then create, open, monitor, close, and finalize ceremonies inside that project.
- A participant can authenticate with one of the ceremony's allowed identity providers, join, wait, contribute, recover from interruption, and receive a completion attestation.
- Every accepted contribution has a verification result and integrity metadata.
- Final outputs can be independently inspected using public artifacts and hashes.
- Invalid or incomplete work cannot advance the ceremony state.
