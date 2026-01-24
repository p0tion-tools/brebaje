#!/usr/bin/env node
/**
 * Post-process TypeDoc generated markdown files to rename README.md to index.md
 * and add frontmatter with meaningful titles
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function filterReadmeFiles() {
  // Find all README.md files in docs/api (except the root one)
  const readmeFiles = await glob('docs/api/**/README.md', {
    ignore: ['docs/api/README.md']
  });
  
  for (const readmeFile of readmeFiles) {
    const dir = path.dirname(readmeFile);
    const indexFile = path.join(dir, 'index.md');
    
    // Read the README content
    let content = fs.readFileSync(readmeFile, 'utf8');
    
    // Extract a meaningful title from the path
    // e.g., "auth/auth.controller" -> "Auth Controller"
    const pathParts = dir.replace('docs/api/', '').split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // Convert kebab-case or camelCase to Title Case
    const title = lastPart
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
      .replace(/[-_]/g, ' ') // kebab-case -> kebab case
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Add frontmatter with title
    const frontmatter = `---
title: ${title}
---

`;
    
    // Only add frontmatter if it doesn't already exist
    if (!content.startsWith('---')) {
      content = frontmatter + content;
    }
    
    // Write to index.md
    fs.writeFileSync(indexFile, content, 'utf8');
    
    // Remove README.md
    fs.unlinkSync(readmeFile);
    
    console.log(`Converted ${readmeFile} -> ${indexFile} (title: ${title})`);
  }
}

filterReadmeFiles().catch(console.error);
