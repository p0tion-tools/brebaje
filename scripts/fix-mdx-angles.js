#!/usr/bin/env node
/**
 * Post-process TypeDoc generated markdown files to escape angle brackets
 * that conflict with MDX/JSX parsing
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function fixAngleBrackets() {
  const files = await glob('docs/api/**/*.md');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Fix Promise<Type> patterns (but not already escaped ones)
    const promisePattern = /Promise<([^>]+)>/g;
    if (promisePattern.test(content)) {
      content = content.replace(promisePattern, (match, type) => {
        // Skip if already escaped
        if (content.includes(`Promise&lt;${type}&gt;`)) {
          return match;
        }
        modified = true;
        return `Promise&lt;${type}&gt;`;
      });
    }
    
    // Fix other generic type patterns like Array<Type>, Map<Key, Value>
    const genericPattern = /(\w+)<([^>]+)>/g;
    content = content.replace(genericPattern, (match, typeName, params) => {
      // Skip if it's in a code block or already escaped
      if (match.includes('&lt;') || match.includes('&gt;')) {
        return match;
      }
      // Only fix if it looks like a TypeScript generic
      if (typeName.match(/^[A-Z][a-zA-Z0-9]*$/)) {
        modified = true;
        return `${typeName}&lt;${params}&gt;`;
      }
      return match;
    });
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  }
}

fixAngleBrackets().catch(console.error);
