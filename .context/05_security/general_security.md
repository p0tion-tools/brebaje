# Security Best Practices

## Input Validation

- Never trust user input.
- Validate all DTOs using Zod at the API boundary.
- Sanitize inputs to prevent XSS and SQL injection.

## Authentication & Authorization

- Use Role-Based Access Control (RBAC).
- JWTs must have short expiration times.
- Never commit secrets to Git (use `.env` and validated config).

## Stack-Specific Risks

- **Web2:** Check for CSRF and CORS misconfiguration; secure cookies (HttpOnly, SameSite).
- **React:** Do not store secrets or tokens in client-accessible globals; use httpOnly cookies or secure storage for refresh tokens.

## Ceremony / Verification

- Contributions must be **cryptographically verified** before acceptance; invalid contributions are rejected and the queue is updated (e.g. failed count incremented).
- Artifact integrity: use **BLAKE2b** hashes for zKey, transcript, R1CS, PoT; store **beacon value** and its **SHA-256** hash for the final contribution.
- The **beacon value** must be public and unpredictable (e.g. from a future block hash); do not trust unverified contribution artifacts.
