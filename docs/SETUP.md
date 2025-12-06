# Setup Guide

Complete setup instructions for the Brebaje development environment.

## Prerequisites

### Required Software

- **Node.js**: Version >=22.17.1
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **pnpm**: Version >=10.0.0
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **Git**: Latest version
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Recommended Tools

- **VS Code**: Code editor with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - TSDoc Comments

- **Docker** (optional): For local database setup

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd brebaje
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all workspaces in the monorepo.

### 3. Set Up Git Hooks

```bash
pnpm prepare
```

This initializes Husky for pre-commit hooks.

### 4. Environment Configuration

#### Backend Environment

Create `apps/backend/.env`:

```env
# Database
DATABASE_URL=sqlite:./database.sqlite

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# GitHub OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret

# Server
PORT=8067
NODE_ENV=development
```

#### Frontend Environment

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8067
```

#### CLI Environment

Create `apps/cli/.env`:

```env
BREBAJE_API_URL=http://localhost:8067
BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

### 5. Database Setup (Backend)

```bash
cd apps/backend

# Generate models from DBML schema
pnpm generate-models

# Run migrations (if applicable)
# pnpm migrate
```

### 6. Verify Installation

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Check TypeScript compilation
cd apps/backend && npx tsc --noEmit
cd ../frontend && npx tsc --noEmit
```

## Development Workflow

### Starting Development Servers

#### Backend

```bash
cd apps/backend
pnpm start:dev
```

Server runs on `http://localhost:8067`

#### Frontend

```bash
cd apps/frontend
pnpm dev
```

Frontend runs on `http://localhost:3000`

#### CLI

```bash
cd apps/cli
pnpm build
node build/index.js --help
```

### Running Commands

All commands from root:

```bash
# Linting
pnpm lint              # Check for linting errors
pnpm lint:fix          # Fix linting errors

# Formatting
pnpm prettier          # Check formatting
pnpm prettier:fix      # Fix formatting

# Testing
pnpm test              # Run all tests

# Building
pnpm build             # Build all packages

# Documentation
pnpm docs              # Generate TypeDoc documentation
pnpm docs:watch        # Watch mode for documentation
```

## Project Structure

```
brebaje/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/          # Source code
│   │   ├── test/         # E2E tests
│   │   └── .env          # Environment variables
│   ├── frontend/         # Next.js app
│   │   ├── app/          # App router pages
│   │   └── .env.local    # Environment variables
│   └── cli/              # CLI tool
│       ├── src/          # Source code
│       └── .env          # Environment variables
├── packages/
│   ├── actions/          # Shared utilities
│   └── scripts/          # Build scripts
├── docs/                 # Generated documentation
├── .husky/               # Git hooks
├── eslint.config.mjs     # ESLint configuration
├── typedoc.json          # TypeDoc configuration
└── package.json          # Root package config
```

## IDE Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true
  }
}
```

### Recommended Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- TSDoc Comments
- GitLens

## Troubleshooting

### Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port Already in Use

```bash
# Find process using port
lsof -i :8067  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

### TypeScript Errors

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### ESLint Configuration Issues

Ensure you're using ESLint v9 flat config. Check `eslint.config.mjs` exists.

### Pre-commit Hook Issues

```bash
# Reinstall hooks
pnpm prepare

# Run hooks manually
pnpm exec lint-staged
```

### Database Connection Issues

- Verify database file exists
- Check DATABASE_URL in `.env`
- Ensure SQLite is properly installed

## Next Steps

1. Read the [Developer Guide](./DEVELOPER_GUIDE.md)
2. Review [TSDoc Guide](./TSDOC_GUIDE.md)
3. Check [Contributing Guide](./CONTRIBUTING.md)
4. Explore the codebase
5. Start contributing!

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)

## Getting Help

If you encounter issues:

1. Check this guide
2. Search existing issues
3. Ask in team chat
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details
   - Expected vs actual behavior

