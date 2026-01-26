# Introduction

Welcome to the Brebaje documentation!

Brebaje is a zero-knowledge proof ceremony management platform built with modern web technologies. It provides a complete solution for coordinating trusted setup ceremonies for zkSNARK circuits.

## What is Brebaje?

Brebaje manages the entire lifecycle of zero-knowledge proof ceremonies:

- **User Authentication**: Secure authentication via GitHub OAuth
- **Project Management**: Organize ceremonies into projects
- **Ceremony Coordination**: Handle ceremony phases from scheduled to finalized
- **Circuit Management**: Support multiple circuits within ceremonies
- **Participant Enrollment**: Track and manage participant contributions
- **Contribution Verification**: Cryptographic verification of contributions

## Key Features

- 🔐 **Secure Authentication** - GitHub OAuth device flow
- 📊 **Real-time Monitoring** - Track ceremony progress and contributions
- 🔄 **Phase Management** - Automated ceremony lifecycle
- 🧪 **Multiple Circuits** - Support for complex multi-circuit ceremonies
- ✅ **Cryptographic Verification** - Ensure contribution integrity
- 🖥️ **CLI Tool** - Complete command-line interface for all operations
- 📡 **RESTful API** - Well-documented backend API
- 🎨 **Modern UI** - Next.js frontend with TailwindCSS

## Architecture

Brebaje is built as a monorepo with three main applications:

- **Backend** (`apps/backend/`) - NestJS API with SQLite database
- **Frontend** (`apps/frontend/`) - Next.js application with React Query
- **CLI** (`apps/cli/`) - Command-line interface with Commander.js

## Technology Stack

### Backend

- NestJS - TypeScript framework
- Sequelize ORM - Database management
- SQLite - Development database
- JWT - Authentication tokens

### Frontend

- Next.js 14 - React framework with App Router
- TanStack Query - Server state management
- TailwindCSS - Utility-first styling
- Lucide React - Icon library

### CLI

- Commander.js - Command framework
- TypeScript - Type-safe development
- ES Modules - Modern JavaScript

## Quick Links

- [Setup Guide](/setup) - Get started with development
- [Developer Guide](/developer-guide) - Development best practices
- [Contributing](/contributing) - How to contribute
- [TSDoc Guide](/tsdoc-guide) - Documentation standards
- [API Reference](/api) - Complete API documentation

## Getting Started

Follow the [Setup Guide](/setup) to get Brebaje running on your local machine.

For API documentation, see the [API Reference](/api).

## Support

For questions and support:

- GitHub Issues: [github.com/zkpservices/brebaje/issues](https://github.com/zkpservices/brebaje/issues)
- Documentation: [brebaje.io](https://brebaje.io)
