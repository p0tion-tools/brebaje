# Brebaje Project Constitution

**Version**: 1.0
**Last Updated**: December 29, 2025

## Mission Statement

Brebaje is a monorepo project that facilitates zero-knowledge proof development by managing zkSNARK circuit trusted setup ceremonies. We provide a comprehensive platform for ceremony coordination, participant management, and cryptographic contribution handling.

## Project Structure

### Applications

- **apps/backend**: NestJS API managing users, ceremonies, participants, circuits, and contributions
  - Database: SQLite3
  - Storage: AWS S3 for circuit and contribution files

- **apps/cli**: Command-line interface for ceremony interaction
  - Create and manage ceremonies
  - Submit and verify contributions
  - List ceremonies, participants, and circuits

- **apps/frontend**: Next.js web application
  - Data visualization and ceremony management UI
  - In-browser contribution support for circuits with <1M constraints
  - User-friendly interface to backend API

### Packages

- **packages/actions**: Shared utilities library (work in progress)
  - Single source of truth for data representations
  - Common functions used across CLI, frontend, and backend
  - Type definitions and business logic

- **packages/scripts**: Standalone ceremony management scripts
  - Temporary/experimental files
  - Ceremony-specific utilities

## Core Principles

### 1. Comprehensive Testing

**All code must be thoroughly tested to enable reliable CI/CD pipelines.**

- **Coverage**: Unit tests are required for most written functions
- **Test Types**:
  - Unit tests for individual functions and methods
  - Integration tests for API endpoints
  - E2E tests for critical user flows
- **Test Location**: Tests should live alongside the code they test (`.spec.ts` files)
- **Quality Gates**: CI/CD pipelines must enforce test passage before deployment
- **Testing Tools**:
  - Backend: Jest for unit and E2E tests
  - Frontend: Jest and React Testing Library
  - CLI: Jest for command validation

**Guidelines**:

- Write tests before or alongside feature implementation (TDD encouraged)
- Aim for meaningful test coverage, not just high percentages
- Test edge cases and error conditions
- Mock external dependencies appropriately
- Keep tests maintainable and readable

### 2. Code Simplicity & Minimal Dependencies

**Favor simplicity and reduce external library dependencies.**

- **Dependency Evaluation**:
  - Only add dependencies that solve significant problems
  - Prefer well-maintained, widely-adopted libraries
  - Consider bundle size impact, especially for frontend
  - Evaluate security implications and maintenance burden

- **Code Philosophy**:
  - Simple solutions over clever ones
  - Explicit over implicit
  - Readable over concise
  - Standard library over external packages when practical

- **Dependency Review**:
  - Regularly audit and update dependencies
  - Remove unused dependencies
  - Document why each major dependency is needed

**Before Adding a Dependency, Ask**:

1. Can this be implemented in-house with reasonable effort?
2. Is this library actively maintained?
3. Does it have a large dependency tree itself?
4. Is it well-tested and secure?
5. Are there lighter alternatives?

### 3. TypeScript Best Practices & Code Readability

**Follow TypeScript best practices and prioritize code readability.**

- **Type Safety**:
  - Use strict TypeScript configuration
  - Avoid `any` type; use `unknown` when type is truly unknown
  - Define explicit interfaces and types
  - Leverage TypeScript's type inference where it improves clarity

- **Code Organization**:
  - Feature-based module structure
  - Clear separation of concerns
  - Consistent naming conventions (see project guidelines)
  - Logical file and folder hierarchy

- **Readability Standards**:
  - Self-documenting code with descriptive names
  - Clear function signatures with JSDoc for public APIs
  - Comments explain "why", not "what"
  - Keep functions small and focused (single responsibility)
  - Use meaningful variable names over abbreviations

- **Code Style**:
  - Use ESLint configuration consistently
  - Follow conventional commit message format
  - Use Prettier or similar for consistent formatting
  - Maintain consistent error handling patterns

**Specific TypeScript Practices**:

- Prefer `interface` over `type` for object shapes (unless union/intersection needed)
- Use `enum` for finite sets of related constants
- Leverage utility types (`Partial`, `Pick`, `Omit`, etc.)
- Use `readonly` for immutable data
- Prefer composition over inheritance

## Development Workflow

### Code Review Standards

- All changes require review before merging
- Reviewers verify:
  - Test coverage meets standards
  - No unnecessary dependencies added
  - Code follows TypeScript best practices
  - Changes align with architecture patterns

### Quality Assurance

**Before committing:**

- Run `pnpm lint` to check code style
- Run `pnpm test` to verify all tests pass
- Run `pnpm build` to ensure successful compilation

**CI/CD Requirements:**

- All tests must pass
- No linting errors
- Successful build across all packages
- Type checking passes with no errors

## Architecture Patterns

### Backend (NestJS)

- Dependency injection for all services
- Feature-based module organization
- DTOs for request/response validation
- RESTful API conventions
- Consistent error handling with exception filters

### Frontend (Next.js)

- App Router architecture (Next.js 14)
- React Query for server state management
- Component-based organization by feature
- TailwindCSS utility-first styling
- Type-safe API calls

### CLI

- Command-based structure
- Shared utilities with backend via `packages/actions`
- User-friendly output formatting
- Proper error handling and user feedback

## Security Principles

- Use environment variables for sensitive configuration
- JWT-based authentication with secure token handling
- Input validation on all API endpoints
- Secure file upload handling
- Regular security audits of dependencies

## Documentation Standards

- Maintain README files in each package/app
- Document architectural decisions (ADRs when appropriate)
- Keep API documentation up-to-date
- Provide clear setup instructions
- Document breaking changes in commit messages

## Versioning & Releases

- Use semantic versioning (semver)
- Maintain changelog for user-facing changes
- Tag releases consistently
- Document migration paths for breaking changes

## Community & Contribution

- Welcome contributions that align with core principles
- Maintain clear contribution guidelines (CONTRIBUTING.md)
- Provide developer setup guide (DEVELOPER_GUIDE.md)
- Encourage discussion before major architectural changes

---

## Rationale

These principles ensure that Brebaje remains:

- **Reliable**: Through comprehensive testing and CI/CD
- **Maintainable**: Through simplicity and minimal dependencies
- **Professional**: Through TypeScript best practices and readability
- **Secure**: Through careful dependency management and code review
- **Collaborative**: Through clear standards and documentation

By adhering to this constitution, we create a codebase that is easy to understand, modify, and extend while maintaining high quality standards for zero-knowledge ceremony management.

---

**Amendments**: This constitution may be amended through project maintainer consensus. All amendments should be documented with rationale and effective date.
