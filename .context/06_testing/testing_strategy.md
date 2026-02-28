# Testing Strategy: Vitest/Jest & React + Node

## Philosophy

- **Automated First:** Every new feature should have corresponding tests.
- **Isolated Tests:** Each test is independent and does not rely on global state or order.

## Test Levels

- **Unit Tests:** Test pure functions and services in isolation (mock DB and external APIs).
- **Integration Tests:** Test API routes with a test server and (optionally) a test database.
- **Component Tests:** Test React components with React Testing Library; mock API calls (e.g. MSW).

## Methodology

- **Fixtures / Factories:** Use shared factories or fixtures for test data (e.g. faker).
- **Mocks:** Use Vitest/Jest mocks or MSW to isolate units from external services.
- **Coverage:** Aim for at least 80% line coverage on critical paths.
- **Verification and ceremony flow:** Test contribution chain verification (valid/invalid zKey chain), ceremony and participant state transitions, and timeout/penalty/exhumation logic where applicable.
