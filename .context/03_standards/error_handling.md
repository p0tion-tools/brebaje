# Error Handling Standards

## Core Principles

- **Fail Fast:** Validate inputs early (e.g. class-validator at API boundary in backend).
- **Graceful Degradation:** Return meaningful error responses, not generic 500s.
- **No Silent Failures:** Always catch, log, and re-throw or return typed errors.
- **Consistent Format:** Use a uniform error response format across API endpoints so the frontend can handle errors predictably.

## Backend (NestJS)

- **Exception filters:** Use NestJS exception filters and custom exceptions to map thrown errors to HTTP status and a consistent JSON shape (e.g. `{ statusCode, message, error? }`).
- **Typed error responses:** Define response types for errors; use a small set of exception classes (e.g. `BadRequestException`, `UnauthorizedException`) for consistency.
- **Validation errors:** DTOs validated with class-validator via `ValidationPipe`; return 400 with validation details when validation fails.

## Frontend (Next.js / React)

- **Error boundaries:** Use React Error Boundaries for component-tree failures; avoid full-app white screens.
- **React Query:** Use React Query error handling (error boundaries or per-query error state) to surface API errors.
- **API errors:** Surface user-friendly messages to the user; log full details for debugging.

## Logging

- **Structured logging:** Use NestJS built-in logger or structured logging (e.g. JSON) where configured.
- **Context:** Include request IDs and user IDs in logs for traceability where available.
- **Levels:** `INFO` for milestones, `WARN` for recoverable issues, `ERROR` for failures that need attention.
