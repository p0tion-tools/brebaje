# Project Structure: Brebaje Monorepo

Brebaje is a **pnpm workspaces** monorepo (with Lerna for running scripts across packages). The layout reflects the actual codebase so new contributors and AI assistants can navigate and contribute consistently.

```text
root/
├── apps/
│   ├── backend/              # NestJS API (SQLite, Sequelize)
│   │   ├── src/
│   │   │   ├── auth/         # Auth (GitHub OAuth, Ethereum SIWE, Cardano)
│   │   │   ├── ceremonies/   # Ceremony CRUD, guards
│   │   │   ├── circuits/      # Circuit CRUD, guards
│   │   │   ├── contributions/
│   │   │   ├── database/      # DBML schema, model generation
│   │   │   ├── health/
│   │   │   ├── participants/
│   │   │   ├── projects/
│   │   │   ├── storage/       # Presigned URLs, S3
│   │   │   ├── users/
│   │   │   ├── vm/            # Verification monitoring / lifecycle
│   │   │   ├── types/         # Enums (from DBML), declarations
│   │   │   ├── utils/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/              # E2E
│   │   └── package.json
│   ├── frontend/              # Next.js 14 (App Router)
│   │   ├── app/               # App Router: pages, layouts, routes
│   │   │   ├── components/    # UI and feature components
│   │   │   ├── contexts/      # e.g. AuthContext
│   │   │   ├── hooks/         # e.g. useGetCeremonies, useGetCeremonyById
│   │   │   ├── sections/      # Page sections (homepage, ceremonies)
│   │   │   ├── auth/          # Auth callback (e.g. GitHub)
│   │   │   ├── coordinator/   # Coordinator UI
│   │   │   ├── ceremonies/   # Public ceremony pages
│   │   │   └── ...
│   │   └── package.json
│   ├── cli/                   # Commander.js CLI (ESM)
│   │   ├── src/
│   │   │   ├── auth/          # Auth commands (e.g. GitHub device flow)
│   │   │   ├── ceremonies/
│   │   │   ├── config/
│   │   │   ├── participants/
│   │   │   ├── perpetual-powers-of-tau/
│   │   │   ├── projects/
│   │   │   ├── vm/
│   │   │   └── index.ts
│   │   ├── build/             # Compiled output
│   │   └── package.json
│   └── website/               # Docusaurus 3 (documentation site)
│       ├── docs/
│       └── package.json
├── packages/
│   └── actions/              # @brebaje/actions — shared logic for CLI, backend, docs
│       ├── src/               # Crypto helpers, snarkjs wrappers, upload/download, etc.
│       └── package.json
├── docs/                      # Developer guide, setup (see docs/DEVELOPER_GUIDE.md)
├── .context/                  # AI-ready context (this folder)
├── .p0tion/architecture/      # Protocol specs (FRS, domain model, state machine, crypto)
├── package.json               # Root: pnpm workspaces, lint, test, build
├── eslint.config.mjs          # ESLint v9 flat config (TSDoc, Prettier)
└── .husky/                    # Pre-commit: ESLint, Prettier
``
```
