# Testing Tools

This section reflects the testing stack used in Brebaje.

## Core Framework

- **Jest:** Primary test runner for **backend**, **CLI**, and **packages/actions**. Config lives in each app’s or package’s `package.json` (e.g. `jest` key) or `jest.config.js`. Use `pnpm test` at root (Lerna runs tests across packages) or run tests per app: e.g. `cd apps/backend && pnpm test`, `cd apps/cli && pnpm test`.
- **Coverage:** Use Jest’s coverage (e.g. `pnpm test:cov` in backend). Coverage output is typically under `coverage/` in each package.

## Backend (NestJS) Testing

- **Unit tests:** Test services and guards in isolation; mock repositories and external services with Jest mocks. Place specs next to the unit (e.g. `ceremonies.service.spec.ts`) or in a `test/` folder as per project convention.
- **E2E / API tests:** Use **supertest** against the NestJS app. Backend uses `supertest` and a test app instance (see `test/jest-e2e.json` and E2E test files). Run with `pnpm test:e2e` in `apps/backend`.
- **Test DB:** Use a test SQLite DB or in-memory store for E2E if required; avoid touching development DB.

## Frontend (Next.js) Testing

- **Component tests:** Use **React Testing Library** where adopted; render components and assert on behavior and accessibility; avoid testing implementation details.
- **Data & mocks:** Use **MSW (Mock Service Worker)** to mock API requests in component or integration tests if the project uses it. **Faker** (`@faker-js/faker`) can be used for realistic test data where present.

## CLI and Packages

- **CLI:** Jest with Node environment; test command modules and helpers; mock file system or API calls as needed.
- **@brebaje/actions:** Jest; test crypto helpers and utilities with unit tests; mock snarkjs or I/O where appropriate.
