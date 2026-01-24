# Brebaje Documentation Website

This directory contains the Docusaurus website for Brebaje documentation.

## Structure

- `docusaurus.config.js` - Main Docusaurus configuration
- `sidebars.js` - Sidebar navigation configuration
- `src/` - React components and pages
- `static/` - Static assets (images, favicons, etc.)
- `blog/` - Blog posts (optional)

## Development

### Prerequisites

- Node.js >= 22.17.1
- pnpm >= 10.0.0

### Local Development

```bash
# From the root directory
pnpm install

# Generate API documentation
pnpm docs

# Start Docusaurus dev server
pnpm docs:start
```

The site will be available at `http://localhost:3000`

### Building

```bash
# Generate API docs and build the site
pnpm docs:build

# Serve the built site locally
pnpm docs:serve
```

## Documentation Structure

The documentation follows the Diataxis model:

- **Get Started** (`docs/get-started/`) - Conceptual and architecture documentation
- **Tutorials** (`docs/tutorials/`) - Operational guides
- **API Reference** (`docs/api/`) - Auto-generated from TypeDoc
- **Security & Operations** (`docs/security/`) - Audit, KMS, and governance docs

## API Documentation

API documentation is automatically generated from the backend source code using TypeDoc. The generated markdown files are placed in `docs/api/` and are automatically included in the sidebar.

To regenerate API docs:

```bash
pnpm docs
```

## Deployment

The documentation is automatically built and deployed via GitHub Actions when changes are pushed to the `main` branch. The workflow:

1. Generates TypeDoc API documentation
2. Builds the Docusaurus static site
3. Triggers deployment to Read the Docs via webhook

## Configuration

### KaTeX Support

Mathematical notation is supported via KaTeX for rendering formulas related to:
- Zero-knowledge proofs
- Groth16 protocol
- Bilinear maps

Use LaTeX syntax in markdown files:

```markdown
Inline math: $e(g_1, g_2) = g_T$

Block math:
$$
\mathbb{G}_1 \times \mathbb{G}_2 \rightarrow \mathbb{G}_T
$$
```
