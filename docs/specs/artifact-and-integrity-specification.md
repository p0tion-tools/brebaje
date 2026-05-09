# Artifact And Integrity Specification

## Artifact Principles

- Every ceremony artifact that affects correctness shall have a recorded hash.
- Every accepted contribution shall be linked to the previous valid contribution state.
- Every final output shall be publicly inspectable.
- Artifact names shall be deterministic enough to support audit, recovery, and reproducibility.
- Hash mismatch, missing artifact, or incompatible circuit metadata shall be treated as a hard failure.

## Hash Policy

- The system shall use BLAKE2b for hashing file artifacts, including zKey files, transcripts, R1CS files, Phase 1 parameter files, verification keys, and verifier contracts.
- The system shall use SHA-256 for the beacon value used in final beacon contributions.
- Recorded hashes shall be stored alongside the artifacts they describe and remain available to public readers for finalized ceremonies.

## Required Artifact Types

### Phase 1 Parameter File

The system shall associate each circuit with the smallest suitable Phase 1 parameter file required by the circuit metadata.

Required metadata:

- Filename.
- Source or storage reference.
- Required power.
- BLAKE2b hash when available.

### Circuit Input Files

Each circuit shall include:

- Constraint file.
- Witness-generation file.
- Compiler metadata.
- Source-template metadata.
- Parameter configuration.
- Extracted circuit metadata.
- BLAKE2b hashes for all input files.

### Contribution State Files

Each circuit shall maintain:

- Initial contribution state.
- Latest valid contribution state.
- Intermediate contribution states.
- Final contribution state.

Contribution state filenames shall encode circuit identity and contribution position.

### Transcript Files

Each valid contribution shall produce or reference a transcript.

Required metadata:

- Filename.
- Storage reference.
- BLAKE2b hash.
- Associated participant.
- Associated circuit.
- Contribution index.

### Final Verification Outputs

Finalization shall publish:

- Final contribution state.
- Final transcript or final contribution metadata.
- Verification key.
- Verifier contract when applicable.
- BLAKE2b hash for each final file output.
- Beacon value and its SHA-256 hash.

## Integrity Rules

- The system shall never mark a contribution valid before verification succeeds.
- The system shall never finalize from an unverified latest contribution state.
- The system shall never finalize a ceremony in the `CANCELED` state.
- The system shall never accept final artifacts without hashes.
- The system shall preserve enough metadata to independently reproduce artifact selection decisions.
- The system shall protect write access for active uploads and final outputs.

## Upload Recovery

Large uploads shall support resumption through temporary metadata stored on the participant record.

Required recovery metadata:

- Multipart upload identifier.
- Ordered list of completed parts, each described by part number and ETag.
- Accumulated contribution computation time so timing measurements survive restarts.
- Participant and circuit association.
- Completion status.

Temporary upload metadata shall be cleared or archived after the contribution is resolved.
