# Product Requirements & Context

## Project Overview

Brebaje is the community based next-generation **Phase 2 Trusted Setup ceremony coordination system** for Groth16 proving keys. It coordinates decentralized trusted setup ceremonies where multiple participants contribute to one or more circuits, with queueing, cryptographic verification, and beacon finalization.

## Core Value Proposition

- **Problem:** Coordinating decentralized Phase 2 trusted setup manually is complex, time consuming and vulnerable of human errors.
- **Solution:** A trusted setup ceremony management suite that automates the ceremony lifecycle (Initialization, Queueing, Contribution, Validation, Finalization) with coordinator and participant flows, contribution/verification timeouts (dynamic or fixed), penalty and exhumation, resumable uploads, and cryptographic verification before accepting contributions.

## User Personas

1. **Coordinator:** Creates the ceremony and circuits, uploads artifacts (R1CS, PoT, WASM, genesis zKey), opens and closes the ceremony, monitors contributions, runs the beacon contribution and finalization (export of verification key and verifier contract).
2. **Participant:** Authenticates, joins the waiting queue per circuit, downloads the last zKey, computes a contribution with local entropy, uploads the new zKey and transcript, awaits verification, and completes all circuits in sequence (or reaches Done when finished).

## Non-Functional Requirements

- **Performance:** API response time &lt; 200ms where applicable; React SPA remains responsive under load.
- **Scalability:** Backend must handle concurrent connections; frontend supports code-splitting and lazy loading.
- **Privacy:** GDPR compliant, no PII in logs.
- **Ceremony-specific:** Contribution and verification timeouts (dynamic or fixed); penalty duration and exhumation when penalty expires; resumable uploads for contribution artifacts; cryptographic verification of each contribution before acceptance (invalid contributions rejected, queue updated).
