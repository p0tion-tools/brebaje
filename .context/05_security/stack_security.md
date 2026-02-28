# Security Standards: Node.js & React

## Authentication & Authorization

- **JWT:** Short-lived access tokens (e.g. 15–30 min); long-lived refresh tokens stored in httpOnly cookies.
- **Password Hashing:** Always use bcrypt (e.g. `bcryptjs`) with a suitable cost factor.

## API Security

- **CORS:** Explicitly set allowed origins in the Node app; avoid `*` in production.
- **SQL Injection:** Use parameterized queries only (Prisma/Drizzle handle this).
- **Rate Limiting:** Use `express-rate-limit` or equivalent to limit brute-force and abuse.

## Data Protection

- **Environment Variables:** Never hardcode secrets; use `.env` and validate with Zod at startup.
- **Validation:** Validate all inputs with Zod; do not expose internal errors or stack traces to the client.

## Frontend (React)

- **No Secrets in Client:** Do not embed API keys or secrets in the bundle; use backend proxies if needed.
- **Cookies:** Use `Secure`, `HttpOnly`, and `SameSite` for auth cookies.

## Transport

- **HTTPS:** Use TLS in production.
- **Security Headers:** Set headers such as `X-Content-Type-Options`, `X-Frame-Options` where appropriate.
