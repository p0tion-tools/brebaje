# Error Handling Standards

## Core Principles

- **Fail Fast:** Validate inputs early (e.g. Zod at API boundary).
- **Graceful Degradation:** Return meaningful error responses, not generic 500s.
- **No Silent Failures:** Always catch, log, and re-throw or return typed errors.

## Node.js (Backend)

- **Centralized Error Middleware:** Use a single error-handling middleware that maps thrown errors to HTTP status and a consistent JSON shape (e.g. `{ error: string, code?: string }`).
- **Typed Error Responses:** Define response types for errors; use Zod or a small set of error classes for consistency.
- **Validation Errors:** Use Zod's `.parse()` or `.safeParse()`; return 400 with validation details.

## React (Frontend)

- **Error Boundaries:** Use React Error Boundaries for component-tree failures; avoid full-app white screens.
- **API Errors:** Surface user-friendly messages; log full details for debugging.

## Logging

- **Structured Logging:** Use pino or winston with JSON formatting.
- **Context:** Include request IDs and user IDs in logs for traceability.
- **Levels:** `INFO` for milestones, `WARN` for recoverable issues, `ERROR` for failures that need attention.
