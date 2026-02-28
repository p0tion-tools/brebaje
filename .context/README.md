# Context-as-Code: Brebaje context for AI assisted development.

See `04_tech_stack/` and `02_architecture/` for stack and structure.

## Overview

This repository implements a **Context-as-Code** architecture. It is designed to maximize the efficiency, code quality, and security of AI coding assistants (Cursor, Claude Code, GitHub Copilot) by providing structured, hierarchical knowledge.

Instead of prompting the AI repeatedly with the same context, we treat project documentation, architectural decisions, and coding standards as part of the codebase. **New contributors** can rely on `.context/` (and `docs/DEVELOPER_GUIDE.md`) to onboard quickly and use AI assistance effectively.

## For New Contributors

1. **Read first:** `01_product/product.md` (what Brebaje is), `02_architecture/project_structure.md` (where things live), and `docs/DEVELOPER_GUIDE.md` (setup, workflow, code standards).
2. **When coding:** Keep `.cursorrules` and `.context/` in mind; AI assistants are instructed to follow architecture (`02_architecture/`), style (`03_standards/`), security (`05_security/`), and testing (`06_testing/`).
3. **When changing architecture or stack:** Update the corresponding `.context/` files in the same PR so the context stays accurate for everyone.

## Directory Structure

The core of this system lives in the `.context/` folder (sometimes aliased as `.ai/` or `docs/ai/`).

```text
root/
├── .cursorrules               # The "Router" that points Cursor to the context
├── .context/
│   ├── 00_meta/               # AI Persona and Role definitions
│   ├── 01_product/            # WHAT we are building (PRD, User Stories)
│   ├── 02_architecture/       # HOW it is structured (Diagrams, Patterns)
│   ├── 03_standards/          # GENERAL Rules (Naming, Git, Code Style)
│   ├── 04_tech_stack/         # SPECIFIC Tooling (React, Node, TypeScript)
│   ├── 05_security/           # Safety Guidelines (OWASP, JWT, CORS)
│   └── 06_testing/            # QA Strategy (Unit, Integration, E2E)
```

---

## How to Use This Standard

### 1. Installation

Copy the `.context/` folder and the `.cursorrules` file into the root of your new project.

### 2. The Setup Phase (Human Work)

Before writing code, fill out the **Project Specific** files. The AI needs this "ground truth" to function correctly.

- **Edit `01_product/product.md`:** Define the problem, solution, and core features.
- **Edit `01_product/domain_glossary.md`:** Define your specific terminology.
- **Edit `02_architecture/system_design.md`:** Define your layers (Clean Arch, MVC, etc.).

### 3. Integration with AI

- **Cursor:** The `.cursorrules` file automatically instructs Cursor to index `.context`. No action needed.
- **Claude Code / ChatGPT:** When starting a new session, attach the relevant context files or use a system prompt like:
  > "Follow the instructions in @.cursorrules to get the project context."

---

## How to Specialize (Customization Guide)

This structure is designed to be 80% reusable and 20% specialized. Here is how to adapt it for different domains.

### Scenario A: Web3 / Blockchain Project

- **02_architecture:** Add `smart_contract_layout.md` (e.g. Diamond Pattern, Proxy Pattern).
- **04_tech_stack:** Create `solidity_style.md` or similar; define rules for Foundry/Hardhat in `framework_best_practices.md`.
- **05_security:** **CRITICAL:** Create `web3_security.md`. Include checks for Reentrancy, Oracle manipulation, and Access Control.
- **06_testing:** Update `testing_tools.md` to prioritize Fuzzing and Invariant testing.

### Scenario B: AI / Data Science Project

- **03_standards:** Update `coding_style.md` for the primary language (e.g. Python PEP8).
- **04_tech_stack:** Create language-specific best practices and ML framework patterns.
- **05_security:** Add `data_privacy.md`. Focus on PII sanitization and model serialization security.
- **06_testing:** Include data validation and model regression tests.

### Scenario C: Modern Web2 (SaaS)

- **02_architecture:** Define API contract styles (REST vs GraphQL) in `api_design.md` if needed.
- **04_tech_stack:** Focus on **React** and **Node.js** rules; define state management (Zustand, Context) if applicable.
- **05_security:** Focus on OWASP Top 10 (CSRF, XSS, SQLi, CORS).

### Scenario D: ZK Ceremony Platform (Brebaje) — This variant

- **02_architecture:** Ceremony lifecycle and state machines (ceremony and participant states); see `system_design.md` and `.p0tion/architecture/`.
- **04_tech_stack:** Cryptographic integration (Groth16: contribute, verify, beacon, newZKey, export) in `library_patterns.md`.
- **05_security:** Verification before accepting contributions; artifact integrity (BLAKE2b, SHA-256 for beacon); see `general_security.md` (Ceremony / Verification).
- **06_testing:** Verification and ceremony flow tests (contribution chain, state transitions, timeout/penalty/exhumation).

---

## Maintenance & Evolution

1. **Treat Context as Code:** If the architecture changes, update `02_architecture` in the same PR as the code change.
2. **Refactor Rules:** If the AI consistently makes the same mistake, add a rule to `03_standards` or `04_tech_stack` to prevent it explicitly.
3. **Global Updates:** When you update universal rules (e.g. `03_standards/coding_style.md`), consider pulling those changes into other projects that use this template.

## License

MIT License - Free to use and modify for any personal or commercial project.
