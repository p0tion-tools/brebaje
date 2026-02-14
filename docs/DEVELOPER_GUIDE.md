# Brebaje Developer Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Documentation](#documentation)
6. [Testing](#testing)
7. [Building and Deployment](#building-and-deployment)

## Getting Started

### Prerequisites

- **Node.js**: >=22.17.1
- **pnpm**: >=10.0.0
- **Git**: Latest version

### Initial Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd brebaje
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` files in each app directory
   - Configure necessary environment variables

4. Initialize Husky hooks:
   ```bash
   pnpm prepare
   ```

### Running the Project

#### Backend

```bash
cd apps/backend
pnpm start:dev
```

#### Frontend

```bash
cd apps/frontend
pnpm dev
```

#### CLI

```bash
cd apps/cli
pnpm build
node build/index.js --help
```

## Project Structure

Brebaje is a monorepo using pnpm workspaces with the following structure:

```
brebaje/
├── apps/
│   ├── backend/          # NestJS API application
│   ├── frontend/         # Next.js application
│   └── cli/              # Command-line interface
├── packages/
│   ├── actions/          # Shared actions and utilities
│   └── scripts/          # Build and utility scripts
├── docs/                 # Generated documentation
├── .husky/               # Git hooks
└── package.json          # Root package configuration
```

### Key Directories

- **apps/backend/src/**: NestJS modules, controllers, services, and DTOs
- **apps/frontend/app/**: Next.js app router pages and components
- **apps/cli/src/**: CLI command implementations
- **packages/actions/src/**: Shared utilities and actions

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `fix/*`: Bug fix branches

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pre-commit Hooks

Before each commit, the following validations run automatically:

1. **ESLint**: Lints TypeScript/JavaScript files
2. **TSDoc Validation**: Ensures TSDoc comments follow syntax rules
3. **Prettier**: Formats code consistently

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

### Code Review Process

1. Create a feature branch from `main`
2. Make changes and commit following conventions
3. Push branch and create a Pull Request
4. Address review feedback
5. Merge after approval

## Code Standards

### TypeScript

- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use type aliases for unions and intersections
- Enable all strict compiler options

### ESLint Configuration

We use ESLint v9 with flat config format. The configuration includes:

- TypeScript ESLint rules
- Prettier integration
- TSDoc syntax validation

Configuration file: `eslint.config.mjs`

### Code Formatting

We use Prettier with the following standards:

- Single quotes for strings
- Semicolons required
- 2-space indentation
- Trailing commas in multi-line structures
- 80 character line width (where practical)

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Interfaces/Types**: PascalCase (e.g., `UserProfile`)

### Import Organization

1. External dependencies
2. Internal modules (from `@brebaje/` packages)
3. Relative imports
4. Type-only imports (use `import type`)

Example:

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { User } from "../types";
import { UserService } from "./user.service";
```

## Documentation

### TSDoc Comments

All public APIs must have TSDoc comments. See [TSDoc Guide](./TSDOC_GUIDE.md) for details.

#### Required Documentation

- All exported functions, classes, interfaces, and types
- Public methods and properties
- Complex algorithms or business logic
- Configuration options

#### Example

````typescript
/**
 * Authenticates a user using GitHub OAuth.
 *
 * @param code - The OAuth authorization code from GitHub
 * @returns A promise that resolves to the authenticated user
 * @throws {AuthenticationError} If the OAuth code is invalid
 *
 * @example
 * ```typescript
 * const user = await authService.authenticate(code);
 * console.log(`Welcome, ${user.name}!`);
 * ```
 */
async authenticate(code: string): Promise<User> {
  // Implementation
}
````

### Generating Documentation

Generate TypeDoc documentation:

```bash
pnpm docs
```

Documentation is generated in the `docs/` directory.

### README Files

Each package and app should have a README.md covering:

- Purpose and overview
- Installation instructions
- Usage examples
- API documentation (or link to generated docs)
- Contributing guidelines

## Testing

### Running Tests

```bash
# All tests
pnpm test

# Specific package
cd apps/backend
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

### Test Structure

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `test/` directory
- Test utilities: Shared in `test/utils/`

### Writing Tests

- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases and error conditions

Example:

```typescript
describe("UserService", () => {
  describe("findById", () => {
    it("should return user when found", async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { id: 1, name: "Test User" };
      jest.spyOn(userRepository, "findOne").mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith(userId);
    });

    it("should throw error when user not found", async () => {
      // Arrange
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      // Act & Assert
      await expect(userService.findById(999)).rejects.toThrow("User not found");
    });
  });
});
```

## Building and Deployment

### Building

```bash
# Build all packages
pnpm build

# Build specific package
cd apps/backend
pnpm build
```

### Environment Configuration

- Development: `.env` files in each app
- Production: Environment variables set in deployment platform
- Never commit `.env` files with secrets

### Deployment Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations applied (if applicable)
- [ ] Build succeeds without errors
- [ ] Linting passes
- [ ] Type checking passes

## Troubleshooting

### Common Issues

#### Dependency Installation Issues

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### ESLint Configuration Issues

Ensure you're using ESLint v9 flat config format. Check `eslint.config.mjs`.

#### TypeScript Errors

```bash
# Check TypeScript configuration
cd <package>
npx tsc --noEmit
```

#### Pre-commit Hook Failures

```bash
# Run linting manually
pnpm lint:fix
pnpm prettier:fix
```

## Additional Resources

- [TSDoc Guide](./TSDOC_GUIDE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Documentation](../docs/index.html) (generated)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## Getting Help

- Check existing documentation
- Search existing issues
- Ask in team chat
- Create a new issue with detailed information
