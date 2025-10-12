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
│   │   └── logger.ts              # ScriptLogger for consistent logging
│   ├── auth/
│   │   ├── index.ts               # setUpAuthCommands()
│   │   └── github.ts              # GitHub OAuth implementation
│   ├── ceremonies/
│   │   ├── index.ts               # setUpCeremonyCommands()
│   │   ├── list.ts                # List ceremonies
│   │   ├── create.ts              # Create ceremonies (coordinators)
│   │   ├── contribute.ts          # Contribute to ceremonies
│   │   └── finalize.ts            # Finalize ceremonies (coordinators)
│   ├── participants/
│   │   ├── index.ts               # setUpParticipantCommands()
│   │   └── list.ts                # List participants
│   ├── perpetual-powers-of-tau/
│   │   ├── index.ts               # setUpPerpetualPowersOfTauCommands()
│   │   ├── auto-contribute.ts     # Automated contribution flow
│   │   ├── beacon.ts              # Beacon randomness generation
│   │   ├── contribute.ts          # Manual contribution
│   │   ├── download.ts            # Download challenge files
│   │   ├── generate-download-url.ts # Generate download URLs
│   │   ├── generate-upload-url.ts # Generate upload URLs
│   │   ├── generate-urls.ts       # Generate both URLs
│   │   ├── new.ts                 # Start new ceremony
│   │   ├── post-record.ts         # Post contribution records
│   │   ├── upload.ts              # Upload contribution files
│   │   └── verify.ts              # Verify contributions
│   └── setup/
│       ├── index.ts               # setUpSetupCommands()
│       └── token.ts               # GitHub token configuration
├── build/                         # Compiled JavaScript
├── images/                        # Documentation images
├── output/                        # Generated ceremony files
├── package.json                   # Dependencies (Commander.js)
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

#### Setup Commands

```bash
brebaje-cli setup gh-token <github_classic_token> # Configure GitHub token for contribution records
```

#### Perpetual Powers of Tau Commands

```bash
# Basic ceremony operations
brebaje-cli ppot new                         # Initialize new ceremony
brebaje-cli ppot download <url>              # Download challenge file from URL
brebaje-cli ppot contribute                  # Make contribution manually
brebaje-cli ppot upload <uploadUrl>          # Upload contribution file
brebaje-cli ppot verify <ptauFile>           # Verify Powers of Tau file
brebaje-cli ppot post-record [-t <token>]    # Post contribution record to GitHub Gist

# Automated contribution flow
brebaje-cli ppot auto-contribute [jsonPath]  # Complete flow: download → contribute → upload → post-record

# Coordinator tools
brebaje-cli ppot generate-upload-url <filename> [-e <minutes>]     # Generate upload URL
brebaje-cli ppot generate-download-url <filename> [-e <minutes>]   # Generate download URL
brebaje-cli ppot generate-urls <downloadFilename> [options]        # Generate both URLs with JSON output
brebaje-cli ppot beacon <inputFile> <beacon> <iterations> <name>   # Apply beacon to finalize ceremony
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

# Generate documentation
pnpm docs:generate

# Serve documentation with live reload
pnpm docs:serve
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
5. **Documentation**: All public TypeScript exports must have TSDoc comments (enforced by pre-commit hooks)

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

### Documentation

- **TypeDoc**: Automated TypeScript documentation generation
- **TSDoc**: Standardized documentation comments with ESLint enforcement
- **ESLint TSDoc Plugin**: Pre-commit validation of documentation syntax

## TSDoc Documentation Standards

All public TypeScript exports must include TSDoc comments. The pre-commit hook enforces this automatically.

### Basic TSDoc Format

```typescript
/**
 * Brief description of the function/class.
 * 
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 * @throws {ErrorType} When this error occurs
 * @example
 * ```typescript
 * const result = myFunction('example');
 * console.log(result); // 'Hello example!'
 * ```
 */
export function myFunction(paramName: string): string {
  return `Hello ${paramName}!`;
}
```

### Class Documentation

```typescript
/**
 * A service for managing user authentication.
 * 
 * @example
 * ```typescript
 * const authService = new AuthService();
 * const user = await authService.login('username', 'password');
 * ```
 */
export class AuthService {
  /**
   * Authenticates a user with credentials.
   * 
   * @param username - The user's username
   * @param password - The user's password
   * @returns Promise resolving to user data
   * @throws {AuthenticationError} When credentials are invalid
   */
  async login(username: string, password: string): Promise<User> {
    // Implementation...
  }
}
```

### Common TSDoc Tags

- `@param` - Function parameters
- `@returns` - Return value description
- `@throws` - Possible exceptions
- `@example` - Usage examples
- `@deprecated` - Mark as deprecated
- `@since` - Version when added
- `@see` - Related documentation

### Validation

- **Pre-commit**: TSDoc syntax is validated before commits
- **ESLint**: Run `pnpm lint` to check documentation compliance
- **Auto-fix**: Use `pnpm lint:fix` to fix formatting issues

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
- Logger system with consistent formatting (`ScriptLogger`)
- TypeScript compilation with ES modules
- Global installation capability via `pnpm link --global`
- Auth command structure with GitHub OAuth implementation
- **Perpetual Powers of Tau full implementation** with 12 commands:
  - Complete ceremony workflow (new, download, contribute, upload, verify, post-record)
  - Automated contribution flow (`auto-contribute`)
  - Coordinator tools (generate URLs, beacon application)
  - Social media integration (Twitter/X sharing)
- **Setup commands** for GitHub token configuration
- **File organization** with proper module separation
- **Documentation images** and output directories

### Next Steps (Pending Implementation)

#### 1. Backend Integration Commands

- [ ] Implement auth commands (login, logout, status, whoami)
- [ ] Implement user commands (profile, ceremonies, contributions)
- [ ] Implement projects commands (list, create, show)
- [ ] Expand ceremonies commands (show, better create/finalize)
- [ ] Implement contributions commands (list, verify)

#### 2. HTTP Client Integration

- [ ] dotenv dependency to package.json
- [ ] Create comprehensive API client (`src/utils/api.ts`)
- [ ] Implement authentication token management (`src/utils/auth.ts`)
- [ ] Configure environment variables for backend URL

#### 3. Authentication System

- [ ] Implement GitHub OAuth device flow in CLI
- [ ] Add secure token storage (file-based)
- [ ] Implement automatic token refresh
- [ ] Add authentication middleware for protected commands

#### 4. API Connectivity

- [ ] Connect backend integration commands to their respective endpoints
- [ ] Implement proper error handling for network requests
- [ ] Add request/response validation
- [ ] Handle authentication errors gracefully

#### 5. Testing & Validation

- [ ] Test complete authentication flow with backend
- [ ] Test all backend integration commands with running backend (port 8067)
- [ ] Validate data persistence in SQLite database
- [ ] Add comprehensive command-line argument validation

#### 6. Advanced Features

- [ ] Add interactive command modes
- [ ] Implement ceremony status monitoring
- [ ] Add batch operation capabilities
- [ ] Create ceremony template system

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

## CLI Critical Issues & Improvement Plan

### 🚨 **Critical Security & Reliability Issues Found:**

#### 1. **Token Storage Security**

- GitHub tokens stored in plain text files without encryption
- No secure credential management system
- Risk: Token exposure in filesystem, logs, or process memory

#### 2. **Error Handling Gaps**

- Inconsistent error handling across commands
- Network operations lack proper timeout/retry logic
- File operations missing validation and cleanup

#### 3. **File Management Issues**

- No proper cleanup of temporary files
- Large file operations could exhaust disk space
- Missing file lock mechanisms for concurrent operations

#### 4. **Environment Configuration**

- Hardcoded default values scattered across files
- No centralized configuration validation
- Missing environment variable documentation

#### 5. **Network & Upload Reliability**

- No upload progress tracking for large files
- Missing retry logic for failed uploads
- No validation of pre-signed URL expiration

### 🔧 **Recommended Fixes:**

#### **High Priority (Security & Reliability)**

1. **Secure token storage** using OS keychain/credential manager
2. **Comprehensive error handling** with retry logic and user-friendly messages
3. **File cleanup mechanisms** and disk space checks
4. **Upload progress tracking** and resume capability
5. **Configuration validation** and centralized env management

#### **Medium Priority (UX & Robustness)**

1. **Command input validation** and sanitization
2. **Concurrent operation safety** with file locking
3. **Better logging** with different verbosity levels
4. **Health checks** for external dependencies (snarkjs, network)

#### **Low Priority (Features)**

1. **Interactive prompts** for better UX
2. **Command aliases** and shortcuts
3. **Configuration wizard** for first-time setup
