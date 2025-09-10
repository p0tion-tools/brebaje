# Brebaje - GitHub Copilot Instructions

## Project Overview

Brebaje is a zero-knowledge proof ceremony management platform with a NestJS backend and Next.js frontend. The platform manages trusted setup ceremonies for zkSNARK circuits, handling user authentication, ceremony coordination, and participant contributions.

## Architecture

Monorepo using pnpm workspaces with two main applications:

- Backend: NestJS API with SQLite database using Sequelize ORM
- Frontend: Next.js application with TailwindCSS and React Query

## Key Domain Models

- **Users**: GitHub OAuth authentication
- **Projects**: Container for ceremonies managed by coordinators
- **Ceremonies**: Time-bounded events with phases (SCHEDULED → OPENED → CLOSED → FINALIZED)
- **Circuits**: Individual zkSNARK circuits requiring trusted setup
- **Participants**: Users enrolled in ceremonies with contribution tracking
- **Contributions**: Cryptographic contributions to circuit trusted setup

## Folder Structure

```
apps/
├── backend/           # NestJS API application
│   ├── src/
│   │   ├── auth/      # GitHub OAuth authentication
│   │   ├── ceremonies/ # Ceremony management
│   │   ├── circuits/  # Circuit handling
│   │   ├── contributions/ # User contributions
│   │   ├── database/  # DBML schema and models
│   │   ├── participants/ # Ceremony participants
│   │   ├── projects/  # Project management
│   │   ├── storage/   # File storage (S3)
│   │   ├── types/     # Shared TypeScript types
│   │   └── users/     # User management
│   └── test/          # E2E tests
└── frontend/          # Next.js application
    ├── app/           # Next.js app router
    │   ├── ceremonies/ # Ceremony pages
    │   ├── components/ # Reusable components
    │   ├── hooks/     # React Query hooks
    │   └── sections/  # Page sections
    └── public/        # Static assets
```

## Coding Standards

### Backend (NestJS)

- Use NestJS decorators and dependency injection
- Follow feature-based module structure
- Database models are auto-generated from DBML schema in `src/database/diagram.dbml`
- Use Sequelize with TypeScript decorators
- Write unit tests alongside services and controllers
- Use DTOs for request/response validation
- Follow RESTful API conventions

### Frontend (Next.js)

- Use Next.js 14 app router
- Components use TypeScript with strict typing
- TailwindCSS for styling with utility classes
- React Query hooks for API state management
- Organize components by feature in `app/components/`
- Use Lucide React for icons

## Key Dependencies

### Backend

- NestJS framework with TypeScript
- Sequelize ORM with sequelize-typescript
- JWT for authentication
- SQLite database
- AWS SDK for S3 storage

### Frontend

- Next.js 14 with app router
- TanStack Query (React Query) for server state
- TailwindCSS for styling
- Lucide React for icons

## Database Schema Management

- Schema defined in `apps/backend/src/database/diagram.dbml`
- Run `pnpm convert` to generate SQL from DBML
- Run `pnpm setup-dml-to-database` to generate TypeScript models and enums
- Models are auto-generated - do not edit manually

## Authentication Flow

GitHub device flow OAuth implementation:

1. Frontend requests GitHub client ID from backend
2. User completes GitHub OAuth device flow
3. Backend exchanges token for user info
4. JWT token issued for session management

## Testing

- Backend: Jest unit tests and E2E tests
- Use `pnpm test` for unit tests, `pnpm test:e2e` for integration tests
- Test files use `.spec.ts` suffix
- E2E tests in `test/` directory

## Build and Validation

- Use `pnpm lint` for linting across monorepo
- Backend: `pnpm start:dev` for development
- Frontend: `pnpm dev` for development server
- Use `pnpm build` to build applications

## Important Patterns

### Error Handling

- Use NestJS exception filters and custom exceptions
- Frontend uses React Query error boundaries
- Consistent error response format across API endpoints

### File Naming Conventions

- Backend: kebab-case for files, PascalCase for classes
- Frontend: PascalCase for React components, camelCase for utilities
- Test files use `.spec.ts` suffix
- DTOs use descriptive names like `create-ceremony.dto.ts`

### Code Organization

- Backend modules follow NestJS pattern: controller, service, module, DTOs
- Frontend hooks are prefixed with `use` and located in `app/hooks/`
- Shared types are centralized in `apps/backend/src/types/`
- Components are organized by feature, not by type

### Development Workflow

- Database changes require updating `diagram.dbml` first
- Always run database generation commands after schema changes
- Follow conventional commit messages
- Write tests for new features before implementation
