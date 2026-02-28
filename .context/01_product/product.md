# Product Requirements & Context

## Project Overview

Brebaje is the community-maintained next-generation p0tion: a **Phase 2 Trusted Setup ceremony coordination system** for Groth16 proving keys. It coordinates decentralized trusted setup ceremonies where multiple participants contribute to one or more circuits, with queueing, cryptographic verification, and beacon finalization.

## Core Value Proposition

- **Problem:** Coordinating decentralized Phase 2 trusted setup ceremonies—multiple participants, circuits, and contribution chains—with queueing, verification, and finalization in a reliable, auditable way.
- **Solution:** A trusted setup ceremony management suite that automates the ceremony lifecycle (Initialization, Queueing, Contribution, Validation, Finalization) with coordinator and participant flows, contribution/verification timeouts (dynamic or fixed), penalty and exhumation, resumable uploads, and cryptographic verification before accepting contributions.

## User Personas

1. **Coordinator:** Creates the ceremony and circuits, uploads artifacts (R1CS, PoT, WASM, genesis zKey), opens and closes the ceremony, monitors contributions, runs the beacon contribution and finalization (export of verification key and verifier contract).
2. **Participant:** Authenticates, joins the waiting queue per circuit, downloads the last zKey, computes a contribution with local entropy, uploads the new zKey and transcript, awaits verification, and completes all circuits in sequence (or reaches Done when finished).

## Non-Functional Requirements

- **Performance:** API response time &lt; 200ms where applicable; React SPA remains responsive under load.
- **Scalability:** Backend must handle concurrent connections; frontend supports code-splitting and lazy loading.
- **Privacy:** GDPR compliant, no PII in logs.
- **Ceremony-specific:** Contribution and verification timeouts (dynamic or fixed); penalty duration and exhumation when penalty expires; resumable uploads for contribution artifacts; cryptographic verification of each contribution before acceptance (invalid contributions rejected, queue updated).

## Current Implementation (Workspace)

The following reflects the **actual codebase** so contributors and AI can align with it:

- **Monorepo:** pnpm workspaces; apps: **backend** (NestJS), **frontend** (Next.js 14 App Router), **cli** (Commander.js ESM), **website** (Docusaurus 3). Shared package: **@brebaje/actions** (crypto, snarkjs, upload/download helpers).
- **Backend:** NestJS 11, Sequelize + SQLite, schema in DBML (`apps/backend/src/database/diagram.dbml`). Auth: GitHub OAuth (code + device flow), Ethereum (SIWE), Cardano (Mesh). Storage: AWS S3 (presigned URLs). Verification/orchestration: **VmModule** and use of **snarkjs** / **@brebaje/actions**.
- **Frontend:** Next.js 14, TanStack React Query, TailwindCSS, auth via context (e.g. GitHub authorize callback). Coordinator and public ceremony UIs under `app/`.
- **CLI:** Commander.js command groups: auth, ceremonies, config, participants, perpetual-powers-of-tau, projects, vm. Uses GitHub OAuth device flow, dotenv, and @brebaje/actions.
- **Docs:** `docs/DEVELOPER_GUIDE.md`, `docs/SETUP.md`; Docusaurus site in `apps/website`. Pre-commit: ESLint (incl. TSDoc), Prettier; Conventional Commits.
