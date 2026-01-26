# Quick Start Guide

## Overview

The Brebaje documentation website is now fully configured with automatic API documentation generation via TypeDoc.

## What Was Implemented ✅

### 1. Complete Docusaurus Setup

- ✅ Package configuration with all dependencies
- ✅ Docusaurus config with TypeDoc plugin
- ✅ Mermaid diagram support
- ✅ Dark/light mode theme
- ✅ Navigation and sidebar structure

### 2. TypeDoc Integration

- ✅ Auto-generates API docs from backend source code
- ✅ 67 markdown files generated covering all modules:
  - Auth, Ceremonies, Circuits, Contributions
  - Health, Participants, Projects, Storage
  - Users, VM, Types, Utils
- ✅ Excludes test files (_.spec.ts, _.test.ts)
- ✅ Strict validation for quality assurance

### 3. Documentation Content

- ✅ Introduction page
- ✅ Setup guide
- ✅ Contributing guide
- ✅ Developer guide
- ✅ TSDoc guide
- ✅ Auto-generated API reference

### 4. CI/CD Pipeline

- ✅ GitHub Actions workflow for deployment
- ✅ Automatic build on push to main
- ✅ GitHub Pages deployment

### 5. Build Verification

- ✅ Production build successful
- ✅ TypeDoc generation working
- ✅ MDX compilation fixed (format: 'detect')
- ✅ All documentation files generated

## Quick Commands

### Development

```bash
# Start dev server (http://localhost:3000)
cd apps/website
pnpm start
```

### Production Build

```bash
# Build the website
cd apps/website
pnpm build
```

### Serve Locally

```bash
# Serve production build
cd apps/website
pnpm serve
```

## File Structure

```
apps/website/
├── docusaurus.config.js          # Main configuration
├── sidebars.js                    # Sidebar structure
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
│
├── docs/
│   ├── intro.md                   # Introduction
│   ├── setup.md                   # Setup guide
│   ├── contributing.md            # Contributing guide
│   ├── developer-guide.md         # Developer guide
│   ├── tsdoc-guide.md             # TSDoc guide
│   └── api/                       # Generated API docs (67 files)
│       ├── index.md               # API overview
│       ├── app.controller.md      # App controller
│       ├── app.module.md          # App module
│       ├── app.service.md         # App service
│       ├── main.md                # Main entry point
│       ├── types.md               # Type definitions
│       ├── utils.md               # Utilities
│       ├── auth/                  # Auth module docs
│       ├── ceremonies/            # Ceremonies module docs
│       ├── circuits/              # Circuits module docs
│       ├── contributions/         # Contributions module docs
│       ├── health/                # Health module docs
│       ├── participants/          # Participants module docs
│       ├── projects/              # Projects module docs
│       ├── storage/               # Storage module docs
│       ├── users/                 # Users module docs
│       └── vm/                    # VM module docs
│
├── src/
│   ├── css/
│   │   └── custom.css             # Custom styles
│   └── pages/
│       └── index.tsx              # Homepage
│
└── static/
    └── img/
        ├── favicon.ico            # Favicon
        └── logo.svg               # Logo
```

## Key Features

### 1. Automatic API Documentation

- TypeDoc reads backend source code
- Generates markdown for all modules
- Updates automatically on rebuild
- No manual documentation needed

### 2. Strict Validation

- Build fails on invalid links
- Ensures documentation quality
- TypeScript type checking
- TSDoc syntax validation

### 3. Development Workflow

- Hot reload in dev mode
- Watch mode for TypeDoc
- Fast refresh on code changes
- Live preview

### 4. Production Ready

- Optimized static site
- GitHub Pages deployment
- CI/CD automation
- SEO friendly

## Configuration Highlights

### TypeDoc Plugin (docusaurus.config.js)

```javascript
{
  // Entry points - all backend modules
  entryPoints: [
    '../backend/src/auth/**/*.ts',
    '../backend/src/ceremonies/**/*.ts',
    '../backend/src/circuits/**/*.ts',
    // ... more modules
  ],

  // Exclude test files
  exclude: ['**/*.spec.ts', '**/*.test.ts'],

  // Output to docs/api
  out: 'docs/api',

  // Watch mode in development
  watch: process.env.NODE_ENV !== 'production',

  // Auto-generate sidebar
  sidebar: {
    autoConfiguration: true,
    pretty: true,
  },
}
```

### MDX Format Detection

```javascript
markdown: {
  mermaid: true,
  format: 'detect', // Fixes MDX issues with TypeDoc-generated markdown
}
```

## Build Output

```
✅ 67 API documentation files generated
✅ All backend modules documented
✅ Static site built successfully
✅ Ready for deployment
```

## Next Steps

### 1. Test Locally

```bash
cd apps/website
pnpm start
# Visit http://localhost:3000
```

### 2. Review Documentation

- Check all pages load correctly
- Verify API documentation is complete
- Test navigation and search
- Review mobile responsiveness

### 3. Deploy

```bash
# Push to main branch
git add .
git commit -m "docs: add TypeDoc and Docusaurus integration"
git push origin main

# GitHub Actions will automatically build and deploy
```

### 4. Customize (Optional)

- Update logo and favicon in `static/img/`
- Customize colors in `src/css/custom.css`
- Add more documentation pages in `docs/`
- Configure Algolia search
- Add internationalization

## Troubleshooting

### Build Fails

```bash
# Clear cache
cd apps/website
pnpm clear

# Rebuild
pnpm build
```

### Dev Server Issues

```bash
# Stop server (Ctrl+C)
# Clear cache
pnpm clear

# Restart
pnpm start
```

### TypeDoc Generation Issues

```bash
# Check backend compiles
cd ../backend
pnpm build

# Check TypeDoc config
cat ../website/docusaurus.config.js | grep -A 20 "docusaurus-plugin-typedoc"
```

## Important Notes

1. **API docs are auto-generated** - Don't edit files in `docs/api/` manually
2. **MDX format detection** is enabled to handle TypeDoc output
3. **Test files excluded** - _.spec.ts and _.test.ts are not documented
4. **Watch mode** automatically regenerates docs during development
5. **Build validation** ensures documentation quality

## Resources

- **Full Documentation**: See `README.md` in this directory
- **Implementation Notes**: See `IMPLEMENTATION_NOTES.md`
- **Docusaurus Docs**: https://docusaurus.io
- **TypeDoc Docs**: https://typedoc.org

## Status

🎉 **Implementation Complete!**

- ✅ Docusaurus configured
- ✅ TypeDoc integrated
- ✅ API docs generated
- ✅ Build successful
- ✅ Ready for deployment

---

**Last Updated**: January 26, 2026  
**TypeDoc Version**: 0.28.15  
**Docusaurus Version**: 3.7.0  
**API Files Generated**: 67
