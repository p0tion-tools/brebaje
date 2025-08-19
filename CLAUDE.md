# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brebaje is a zero-knowledge proof ceremony management platform built with a NestJS backend and Next.js frontend. The project manages trusted setup ceremonies for zkSNARK circuits, handling user authentication, ceremony coordination, and participant contributions.

## Architecture

This is a monorepo using pnpm workspaces with two main applications:

- **Backend (`apps/backend/`)**: NestJS API with SQLite database using Sequelize ORM
- **Frontend (`apps/frontend/`)**: Next.js application with TailwindCSS and React Query

### Key Domain Models

The system revolves around zero-knowledge proof ceremonies:

- **Users**: Authenticated via GitHub OAuth, stored with provider info
- **Projects**: Container for related ceremonies, managed by coordinators
- **Ceremonies**: Time-bounded events with phases (SCHEDULED → OPENED → CLOSED → FINALIZED)
- **Circuits**: Individual zkSNARK circuits within ceremonies requiring trusted setup
- **Participants**: Users enrolled in ceremonies with contribution tracking
- **Contributions**: Cryptographic contributions to circuit trusted setup

### Database Schema

The database schema is defined in `apps/backend/src/database/diagram.dbml` and automatically generates:

- TypeScript enums (`src/types/enums.ts`)
- Sequelize models
- Database migration SQL

### Authentication Flow

Uses GitHub device flow OAuth:

1. Frontend gets GitHub client ID from backend
2. User completes GitHub OAuth device flow
3. Backend exchanges token for user info, creates/finds user record
4. JWT token issued for session management

## Common Commands

### Root Level (Monorepo)

```bash
# Install dependencies
pnpm install

# Run linting across all packages
pnpm lint

# Run tests across all packages
pnpm test

# Format code across all packages
pnpm prettier:fix
```

### Backend Development

```bash
cd apps/backend

# Start development server with hot reload
pnpm start:dev

# Build the application
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run E2E tests
pnpm test:e2e

# Lint TypeScript files
pnpm lint

# Database schema operations
pnpm convert              # Convert DBML to SQL
pnpm setup-dml-to-database  # Generate models from schema
```

### Frontend Development

```bash
cd apps/frontend

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## Development Workflow

1. **Database Changes**: Update `apps/backend/src/database/diagram.dbml` then run `pnpm convert` and `pnpm setup-dml-to-database`
2. **API Development**: Follow NestJS module pattern - create controller, service, DTOs, and tests
3. **Frontend Features**: Use React Query hooks for API calls, TailwindCSS for styling
4. **Testing**: Write unit tests alongside new features, run E2E tests for critical flows

## Key Dependencies

### Backend

- **NestJS**: Main framework with decorators and dependency injection
- **Sequelize**: ORM with TypeScript support via sequelize-typescript
- **JWT**: Authentication tokens via @nestjs/jwt
- **SQLite**: Development database (sqlite3)

### Frontend

- **Next.js 14**: React framework with app router
- **TanStack Query**: Server state management and caching
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Project Structure Notes

- Backend follows standard NestJS module structure with feature-based organization
- Frontend uses Next.js app router with components organized by feature
- Database models are auto-generated from DBML schema
- Shared types are centralized in `apps/backend/src/types/`
- API routes follow RESTful conventions with OpenAPI documentation
