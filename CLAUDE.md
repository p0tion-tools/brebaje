# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brebaje is a zero-knowledge proof ceremony management platform built with a NestJS backend and Next.js frontend. The project manages trusted setup ceremonies for zkSNARK circuits, handling user authentication, ceremony coordination, and participant contributions.

## Architecture

This is a monorepo using pnpm workspaces with three main applications:

- **Backend (`apps/backend/`)**: NestJS API with SQLite database using Sequelize ORM
- **Frontend (`apps/frontend/`)**: Next.js application with TailwindCSS and React Query
- **CLI (`apps/cli/`)**: Command-line interface for complete ceremony management using Commander.js

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

## CLI Tool

### Overview

The CLI provides complete command-line access to Brebaje functionality including authentication, user management, projects, ceremonies, and contributions. It communicates with the backend via HTTP API calls and handles GitHub OAuth authentication.

### Structure

```
apps/cli/
├── src/
│   ├── index.ts                    # Entry point with Commander.js
│   ├── utils/
│   │   ├── logger.ts              # ScriptLogger for consistent logging
│   │   ├── api.ts                 # API client for backend communication
│   │   └── auth.ts                # Authentication token management
│   ├── auth/
│   │   ├── index.ts               # setUpAuthCommands()
│   │   ├── login.ts               # GitHub OAuth login flow
│   │   ├── logout.ts              # Clear stored tokens
│   │   ├── status.ts              # Check authentication status
│   │   └── whoami.ts              # Show current user info
│   ├── user/
│   │   ├── index.ts               # setUpUserCommands()
│   │   ├── profile.ts             # Show user profile
│   │   ├── ceremonies.ts          # User's ceremonies
│   │   └── contributions.ts       # User's contributions
│   ├── projects/
│   │   ├── index.ts               # setUpProjectCommands()
│   │   ├── list.ts                # List all projects
│   │   ├── create.ts              # Create new project
│   │   └── show.ts                # Project details
│   ├── ceremonies/
│   │   ├── index.ts               # setUpCeremonyCommands()
│   │   ├── list.ts                # List ceremonies
│   │   ├── show.ts                # Ceremony details
│   │   ├── create.ts              # Create ceremonies (coordinators)
│   │   ├── contribute.ts          # Contribute to ceremonies
│   │   └── finalize.ts            # Finalize ceremonies (coordinators)
│   ├── participants/
│   │   ├── index.ts               # setUpParticipantCommands()
│   │   ├── list.ts                # List participants
│   │   └── add.ts                 # Add participants to ceremony
│   └── contributions/
│       ├── index.ts               # setUpContributionCommands()
│       ├── list.ts                # List contributions
│       └── verify.ts              # Verify contributions
├── build/                         # Compiled JavaScript
├── package.json                   # Dependencies (Commander.js, axios)
└── tsconfig.json                  # TypeScript ES modules config
```

### Available Commands

#### Authentication Commands

```bash
brebaje-cli auth login              # GitHub OAuth device flow
brebaje-cli auth logout             # Clear stored authentication
brebaje-cli auth status             # Check if logged in
brebaje-cli auth whoami             # Show current user info
```

#### User Management Commands

```bash
brebaje-cli user profile            # Show user profile details
brebaje-cli user ceremonies         # List user's ceremonies
brebaje-cli user contributions      # List user's contributions
```

#### Project Management Commands

```bash
brebaje-cli projects list           # List all projects
brebaje-cli projects create [options] # Create new project
brebaje-cli projects show <id>      # Show project details
```

#### Ceremony Management Commands

```bash
brebaje-cli ceremonies list         # List all ceremonies
brebaje-cli ceremonies show <id>    # Show ceremony details
brebaje-cli ceremonies create [options] # Create ceremony (coordinators)
brebaje-cli ceremonies contribute <id> # Contribute to ceremony
brebaje-cli ceremonies finalize <id> # Finalize ceremony (coordinators)
```

#### Participant Management Commands

```bash
brebaje-cli participants list <ceremony-id> # List ceremony participants
brebaje-cli participants add <ceremony-id> <user-id> # Add participant
```

#### Contribution Management Commands

```bash
brebaje-cli contributions list [ceremony-id] # List contributions
brebaje-cli contributions verify <id>        # Verify contribution
```

### CLI Development

```bash
cd apps/cli

# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Test locally (without global install)
node ./build/index.js --help
node ./build/index.js auth status
node ./build/index.js ceremonies list

# Install globally for system-wide access
pnpm link --global
brebaje-cli --help
```

### Authentication Flow

The CLI implements GitHub OAuth device flow:

1. `brebaje-cli auth login` starts device flow
2. User visits GitHub URL and enters device code
3. CLI polls for authorization completion
4. JWT token stored locally for subsequent commands
5. All API calls include `Authorization: Bearer <token>` header

### Logger Implementation

Each command uses `ScriptLogger` for consistent output:

```typescript
import { ScriptLogger } from "../utils/logger.js";

const logger = new ScriptLogger("CLI:CommandName");

// Available log types:
logger.log("Info message");
logger.success("Success message ✅");
logger.error("Error message", error);
logger.warn("Warning message");
logger.failure("Failure message ❌");
```

**Output format:**

```
[2025-09-23T00:06:42.675Z] [CLI:Auth] Starting GitHub OAuth flow...
[2025-09-23T00:06:42.677Z] [CLI:Auth] ✅ Authentication successful!
```

### Technical Configuration

**TypeScript (ES Modules):**

```json
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "node",
    "target": "ES2022",
    "outDir": "./build",
    "rootDir": "./src"
  }
}
```

**Package.json:**

```json
{
  "type": "module",
  "bin": {
    "brebaje-cli": "./build/index.js"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "axios": "^1.0.0",
    "dotenv": "^16.0.0"
  }
}
```

### Environment Configuration

```bash
# .env file in apps/cli/
BREBAJE_API_URL=http://localhost:8067
BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

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
- CLI uses modular command structure with Commander.js and TypeScript ES modules
- Database models are auto-generated from DBML schema
- Shared types are centralized in `apps/backend/src/types/`
- API routes follow RESTful conventions with OpenAPI documentation

## CLI Integration Roadmap

### Completed ✅

- CLI basic structure implemented with ceremonies and participants commands
- Logger system with consistent formatting
- TypeScript compilation with ES modules
- Command placeholders functional
- Global installation capability
- Auth command structure added with login, logout, status, whoami placeholders
- Auth directory structure created with index.ts and github.ts files

### Next Steps (Pending Implementation)

#### 1. Complete Command Structure

- [ ] Implement auth commands (login, logout, status, whoami)
- [ ] Implement user commands (profile, ceremonies, contributions)
- [ ] Implement projects commands (list, create, show)
- [ ] Expand ceremonies commands (show, better create/finalize)
- [ ] Implement contributions commands (list, verify)

#### 2. HTTP Client Integration

- [ ] Add axios and dotenv dependencies
- [ ] Create comprehensive API client (`src/utils/api.ts`)
- [ ] Implement authentication token management (`src/utils/auth.ts`)
- [ ] Configure environment variables for backend URL

#### 3. Authentication System

- [ ] Implement GitHub OAuth device flow in CLI
- [ ] Add secure token storage (file-based)
- [ ] Implement automatic token refresh
- [ ] Add authentication middleware for protected commands

#### 4. API Connectivity

- [ ] Connect all commands to their respective backend endpoints
- [ ] Implement proper error handling for network requests
- [ ] Add request/response validation
- [ ] Handle authentication errors gracefully

#### 5. Testing & Validation

- [ ] Test complete authentication flow
- [ ] Test all commands with running backend (port 8067)
- [ ] Validate data persistence in SQLite database
- [ ] Add comprehensive command-line argument validation

#### 6. Advanced Features

- [ ] Add interactive command modes
- [ ] Implement ceremony status monitoring
- [ ] Add batch operation capabilities
- [ ] Create ceremony template system
- [ ] Add contribution verification tools

### Backend API Endpoints (Available)

**Authentication:**

- `POST /auth/github` - GitHub OAuth authentication
- `GET /auth/me` - Get current user info

**Users:**

- `GET /users/profile` - User profile
- `GET /users/ceremonies` - User's ceremonies
- `GET /users/contributions` - User's contributions

**Projects:**

- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/:id` - Project details

**Ceremonies:**

- `GET /ceremonies` - List ceremonies
- `POST /ceremonies` - Create ceremony
- `GET /ceremonies/:id` - Ceremony details
- `PATCH /ceremonies/:id` - Update ceremony
- `DELETE /ceremonies/:id` - Delete ceremony

**Participants:**

- `GET /ceremonies/:id/participants` - List participants
- `POST /ceremonies/:id/participants` - Add participant

**Contributions:**

- `GET /contributions` - List contributions
- `POST /contributions` - Create contribution
- `GET /contributions/:id/verify` - Verify contribution

### Complete Usage Example (Once Implemented)

```bash
# Start backend
cd apps/backend && pnpm start:dev

# Authentication flow
brebaje-cli auth login              # Complete GitHub OAuth
brebaje-cli auth whoami             # Verify login

# Project management
brebaje-cli projects create --name "My ZK Project"
brebaje-cli projects list

# Ceremony management
brebaje-cli ceremonies create --project-id 1 --name "Test Ceremony"
brebaje-cli ceremonies list
brebaje-cli ceremonies contribute 1 --entropy "my-secret"

# User activities
brebaje-cli user ceremonies
brebaje-cli user contributions
```
