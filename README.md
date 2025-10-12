# Brebaje

A zero-knowledge proof ceremony management platform built with NestJS and Next.js.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Run linting (includes TSDoc validation)
pnpm lint

# Run tests
pnpm test
```

## Documentation Standards

This project enforces TSDoc documentation for all public TypeScript exports:

- **Pre-commit validation**: TSDoc syntax is checked before commits
- **ESLint integration**: Run `pnpm lint` to validate documentation
- **TypeDoc generation**: Automated documentation site generation (Phase 2)

### Example TSDoc

```typescript
/**
 * Authenticates a user with GitHub OAuth.
 * 
 * @param code - GitHub OAuth authorization code
 * @returns Promise resolving to user data
 * @throws {AuthenticationError} When OAuth fails
 * @example
 * ```typescript
 * const user = await authService.authenticate(code);
 * ```
 */
export async function authenticate(code: string): Promise<User> {
  // Implementation...
}
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and project structure.
