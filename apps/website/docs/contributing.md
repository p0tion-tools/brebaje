# Contributing to Brebaje

Thank you for your interest in contributing to Brebaje! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Documentation](#documentation)
6. [Testing](#testing)
7. [Submitting Changes](#submitting-changes)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js >=22.17.1
- pnpm >=10.0.0
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/brebaje.git
   cd brebaje
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/brebaje.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Set up Git hooks**:

   ```bash
   pnpm prepare
   ```

6. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Making Changes

1. **Create a feature branch** from `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:

   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit your changes** using conventional commits:

   ```bash
   git add .
   git commit -m "feat: add new authentication method"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` type - use `unknown` or proper types
- Use interfaces for object shapes
- Prefer type inference where clear
- Use const assertions for literal types

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting (auto-formatted on save)
- Maximum line length: 80 characters (where practical)
- Use meaningful variable and function names

### File Organization

- One class/interface per file (when possible)
- Group related functionality together
- Use index files for public API exports
- Keep files focused and small (< 300 lines when possible)

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Example

```typescript
// ✅ Good
export class UserService {
  private readonly userRepository: UserRepository;

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne(userId);
  }
}

// ❌ Bad
export class userService {
  private repo: any;

  async get(id: any): Promise<any> {
    return this.repo.find(id);
  }
}
```

## Documentation

### TSDoc Comments

All public APIs must have TSDoc comments. See [TSDoc Guide](/tsdoc-guide) for details.

**Required for:**

- Exported functions
- Exported classes and their public methods
- Exported interfaces and types
- Complex internal functions

**Example:**

```typescript
/**
 * Authenticates a user using GitHub OAuth.
 *
 * @param code - The OAuth authorization code
 * @returns A promise resolving to the authenticated user
 * @throws {AuthenticationError} If authentication fails
 */
async authenticate(code: string): Promise<User> {
  // ...
}
```

### README Updates

Update README files when:

- Adding new features
- Changing setup instructions
- Modifying API usage
- Adding new dependencies

## Testing

### Writing Tests

- Write tests for all new features
- Maintain or improve test coverage
- Test edge cases and error conditions
- Use descriptive test names

### Test Structure

```typescript
describe("UserService", () => {
  describe("findById", () => {
    it("should return user when found", async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { id: 1, name: "Test" };
      jest.spyOn(repository, "findOne").mockResolvedValue(expectedUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
    });

    it("should throw error when user not found", async () => {
      // Test error case
    });
  });
});
```

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# Specific file
pnpm test path/to/file.spec.ts
```

## Submitting Changes

### Pull Request Process

1. **Ensure your code is ready**:
   - [ ] All tests pass
   - [ ] Linting passes (`pnpm lint`)
   - [ ] Type checking passes
   - [ ] Documentation is updated
   - [ ] Code follows style guidelines

2. **Update your branch**:

   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   ```

3. **Push your changes**:

   ```bash
   git push origin feature/your-feature
   ```

4. **Create Pull Request**:
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues
   - Request reviews from maintainers

### PR Title Format

Follow conventional commits format:

- `feat: add user authentication`
- `fix: resolve memory leak in service`
- `docs: update API documentation`
- `refactor: simplify ceremony logic`

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe how you tested your changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

- Address all review comments
- Make requested changes in new commits
- Respond to questions and feedback
- Keep the PR updated with main branch

### After Approval

- Maintainers will merge your PR
- Your changes will be included in the next release
- Thank you for contributing! 🎉

## Common Issues

### Pre-commit Hook Failures

If hooks fail:

```bash
# Run linting manually
pnpm lint:fix
pnpm prettier:fix

# Then commit again
git add .
git commit -m "your message"
```

### Merge Conflicts

```bash
# Update from upstream
git fetch upstream
git rebase upstream/main

# Resolve conflicts, then
git add .
git rebase --continue
```

### Type Errors

```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix errors and try again
```

## Getting Help

- Check existing documentation
- Search existing issues
- Ask in discussions
- Create an issue with detailed information

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Credited in release notes
- Appreciated by the community

Thank you for contributing to Brebaje! 🚀
