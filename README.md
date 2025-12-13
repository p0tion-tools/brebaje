# Brebaje

<div align="center">
  <strong>Zero-Knowledge Proof Ceremony Management Platform</strong>
</div>

<div align="center">
  A comprehensive platform for managing trusted setup ceremonies for zkSNARK circuits, built with modern web technologies and extensive CLI tooling.
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Node-%3E%3D22.17.1-green.svg" alt="Node.js Version" />
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange.svg" alt="pnpm Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-blue.svg" alt="TypeScript" />
</div>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [CLI Documentation](#cli-documentation)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Overview

Brebaje is a sophisticated platform designed to manage **trusted setup ceremonies** for zkSNARK circuits. It provides a complete ecosystem for coordinating zero-knowledge proof ceremonies, handling user authentication, participant coordination, and cryptographic contribution verification.

### What are Trusted Setup Ceremonies?

Trusted setup ceremonies are critical processes in zero-knowledge proof systems that generate the initial parameters required for zkSNARK circuits. These ceremonies ensure that the cryptographic parameters are generated in a trustless manner, requiring multiple participants to contribute randomness to the process.

## Features

### 🔐 **Authentication & Authorization**

- **GitHub OAuth Integration** - Seamless authentication via GitHub device flow
- **JWT Token Management** - Secure session handling
- **Role-based Access Control** - Coordinators vs participants

### 🎯 **Ceremony Management**

- **Multi-phase Ceremonies** - Support for Phase 1 and Phase 2 ceremonies
- **Ceremony Lifecycle** - Complete state management (SCHEDULED → OPENED → CLOSED → FINALIZED)
- **Real-time Monitoring** - Live ceremony statistics and progress tracking
- **Automated Workflows** - Streamlined contribution processes

### 💻 **Multiple Interfaces**

- **Web Application** - Modern React-based frontend with TailwindCSS
- **REST API** - Comprehensive RESTful API with OpenAPI documentation
- **CLI Tool** - Extensive command-line interface with 30+ commands

### 🔧 **Perpetual Powers of Tau (PPot)**

- **Complete Workflow Management** - Download, contribute, upload, verify
- **Automated Contributions** - End-to-end automated contribution flow
- **Coordinator Tools** - URL generation, beacon application
- **Social Integration** - Twitter/X sharing capabilities

### 📊 **Advanced Features**

- **Circuit Management** - Individual zkSNARK circuit handling within ceremonies
- **Participant Tracking** - Detailed contribution status and progress
- **File Management** - Secure upload/download with pre-signed URLs
- **Verification System** - Cryptographic verification of contributions

## Architecture

Brebaje is built as a **monorepo** using **pnpm workspaces** with three main applications:

```
brebaje/
├── apps/
│   ├── backend/          # NestJS API Server
│   ├── frontend/         # Next.js Web Application
│   └── cli/              # Command-line Interface
├── packages/             # Shared packages
└── docs/                 # Documentation
```

### Architecture Components

- **Backend (`apps/backend/`)**: NestJS API with SQLite database using Sequelize ORM
- **Frontend (`apps/frontend/`)**: Next.js 14 application with TailwindCSS and React Query
- **CLI (`apps/cli/`)**: TypeScript CLI using Commander.js with complete ceremony management

### Key Domain Models

- **Users**: GitHub OAuth authenticated users with provider info
- **Projects**: Containers for related ceremonies, managed by coordinators
- **Ceremonies**: Time-bounded events with phases and state management
- **Circuits**: Individual zkSNARK circuits requiring trusted setup
- **Participants**: Users enrolled in ceremonies with contribution tracking
- **Contributions**: Cryptographic contributions to circuit trusted setup

## Quick Start

### Prerequisites

- **Node.js**: >= 22.17.1
- **pnpm**: >= 9.0.0
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/NicoSerranoP/brebaje.git
cd brebaje

# Install dependencies
pnpm install

# Setup environment variables (see Installation section for details)
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Build all applications
pnpm build
```

### Running the Applications

```bash
# Terminal 1: Start the backend
cd apps/backend
pnpm start:dev

# Terminal 2: Start the frontend
cd apps/frontend
pnpm dev

# Terminal 3: Install CLI globally
cd apps/cli
pnpm build
pnpm link --global
brebaje-cli --help
```

## Installation

### Backend Setup

```bash
cd apps/backend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate database models from schema
pnpm generate-models

# Start development server
pnpm start:dev

# The backend will be available at http://localhost:8067
```

#### Backend Environment Variables

```env
# Database Configuration
DATABASE_URL=sqlite:./database.sqlite

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AWS Configuration (for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_s3_bucket
```

### Frontend Setup

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev

# The frontend will be available at http://localhost:3000
```

#### Frontend Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8067

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

### CLI Setup

```bash
cd apps/cli

# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Install globally
pnpm link --global

# Verify installation
brebaje-cli --help

# Configure CLI
brebaje-cli auth login
```

#### CLI Configuration

```bash
# Environment variables for CLI (.env in apps/cli/)
BREBAJE_API_URL=http://localhost:8067
BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

## Usage

### Web Application

1. Navigate to `http://localhost:3000`
2. Click "Login with GitHub" to authenticate
3. Browse available ceremonies or create new ones (if you're a coordinator)
4. Participate in ceremonies by contributing randomness

### API Usage

```bash
# Get all ceremonies
curl http://localhost:8067/ceremonies

# Authenticate (requires GitHub OAuth token)
curl -X POST http://localhost:8067/auth/github \
  -H "Content-Type: application/json" \
  -d '{"accessToken": "your_github_token"}'
```

### CLI Usage

```bash
# Authenticate
brebaje-cli auth login

# List ceremonies
brebaje-cli ceremonies list

# Participate in a ceremony
brebaje-cli ceremonies contribute <ceremony-id>

# Perpetual Powers of Tau workflow
brebaje-cli ppot auto-contribute

# View user profile
brebaje-cli user profile
```

## CLI Documentation

The Brebaje CLI provides comprehensive command-line access to all platform functionality.

### Authentication Commands

```bash
brebaje-cli auth login               # GitHub OAuth device flow
brebaje-cli auth logout              # Clear stored authentication
brebaje-cli auth status              # Check login status
brebaje-cli auth whoami              # Show current user info
```

### User Management

```bash
brebaje-cli user profile             # Show user profile
brebaje-cli user ceremonies          # List user's ceremonies
brebaje-cli user contributions       # List user's contributions
```

### Project Management

```bash
brebaje-cli projects list            # List all projects
brebaje-cli projects create [options] # Create new project
brebaje-cli projects show <id>       # Show project details
```

### Ceremony Management

```bash
brebaje-cli ceremonies list          # List all ceremonies
brebaje-cli ceremonies show <id>     # Show ceremony details
brebaje-cli ceremonies create [opts] # Create ceremony (coordinators)
brebaje-cli ceremonies contribute <id> # Contribute to ceremony
brebaje-cli ceremonies finalize <id> # Finalize ceremony (coordinators)
```

### Perpetual Powers of Tau (PPot)

```bash
# Basic operations
brebaje-cli ppot new                 # Initialize new ceremony
brebaje-cli ppot download <url>      # Download challenge file
brebaje-cli ppot contribute          # Make contribution
brebaje-cli ppot upload <uploadUrl>  # Upload contribution
brebaje-cli ppot verify <ptauFile>   # Verify Powers of Tau file
brebaje-cli ppot post-record         # Post contribution record

# Automated workflow
brebaje-cli ppot auto-contribute [jsonPath] # Complete automated flow

# Coordinator tools
brebaje-cli ppot generate-urls <downloadFile> [options] # Generate upload/download URLs
brebaje-cli ppot beacon <inputFile> <beacon> <iterations> <name> # Apply beacon
```

### Setup Commands

```bash
brebaje-cli setup gh-token <token>   # Configure GitHub token
```

For detailed CLI documentation, see `apps/cli/README.md`.

## API Documentation

### Authentication Endpoints

- `POST /auth/github` - GitHub OAuth authentication
- `GET /auth/me` - Get current user info

### Core Endpoints

**Projects:**

- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/:id` - Project details

**Ceremonies:**

- `GET /ceremonies` - List ceremonies
- `POST /ceremonies` - Create ceremony
- `GET /ceremonies/:id` - Ceremony details
- `PATCH /ceremonies/:id` - Update ceremony

**Participants:**

- `GET /ceremonies/:id/participants` - List participants
- `POST /ceremonies/:id/participants` - Add participant

**Contributions:**

- `GET /contributions` - List contributions
- `POST /contributions` - Create contribution
- `GET /contributions/:id/verify` - Verify contribution

### API Documentation

When the backend is running, visit `http://localhost:8067/api` for interactive OpenAPI documentation.

## Development

### Monorepo Commands

```bash
# Install all dependencies
pnpm install

# Run linting across all packages
pnpm lint

# Run tests across all packages
pnpm test

# Format code across all packages
pnpm prettier:fix

# Build all applications
pnpm build
```

### Backend Development

```bash
cd apps/backend

# Start development server with hot reload
pnpm start:dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run E2E tests
pnpm test:e2e

# Database operations
pnpm generate-models    # Generate models from DBML schema
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

# Lint and format
pnpm lint
pnpm format
```

### CLI Development

```bash
cd apps/cli

# Build CLI
pnpm build

# Test locally without global install
node ./build/index.js --help

# Install globally for system-wide access
pnpm link --global
```

### Development Workflow

1. **Database Changes**: Update `apps/backend/src/database/diagram.dbml`, then run `pnpm generate-models`
2. **API Development**: Follow NestJS module pattern with controllers, services, DTOs, and tests
3. **Frontend Features**: Use React Query for API calls, TailwindCSS for styling
4. **CLI Features**: Use Commander.js with TypeScript ES modules
5. **Testing**: Write unit tests alongside features, run E2E tests for critical flows

## Tech Stack

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT + GitHub OAuth
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest + Supertest
- **Cloud**: AWS S3 for file storage

### Frontend

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + Tailwind Typography
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom components with Lucide React icons
- **Authentication**: GitHub OAuth integration

### CLI

- **Framework**: Commander.js
- **Language**: TypeScript with ES Modules
- **Cryptography**: SnarkJS for ceremony operations
- **HTTP Client**: Custom implementation
- **Logging**: Custom ScriptLogger

### Shared

- **Package Manager**: pnpm with workspaces
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Monorepo**: Lerna for package management

## Contributing

We welcome contributions to Brebaje! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `pnpm install`
4. Make your changes
5. Run tests: `pnpm test`
6. Run linting: `pnpm lint`
7. Commit changes: `git commit -m 'Add amazing feature'`
8. Push to branch: `git push origin feature/amazing-feature`
9. Submit a Pull Request

### Code Standards

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests and linting pass

### Areas for Contribution

- Additional ceremony types and configurations
- Enhanced CLI commands and features
- Frontend UI/UX improvements
- API endpoint enhancements
- Documentation improvements
- Test coverage expansion

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ by the Brebaje team</strong>
  <br />
  <sub>Empowering secure zero-knowledge proof ceremonies</sub>
</div>
