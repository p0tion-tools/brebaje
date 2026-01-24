#!/bin/bash
# Post-process TypeDoc generated markdown files to escape angle brackets
# that conflict with MDX/JSX parsing

echo "Fixing TypeScript generic syntax in API documentation..."

# Find all markdown files in docs/api
find docs/api -name "*.md" -type f | while read file; do
  # Escape TypeScript generics like Promise<Type>, Array<Type>, etc.
  # But avoid double-escaping and don't touch already escaped ones
  sed -i 's/\([A-Za-z][A-Za-z0-9_]*\)<\([^>]*\)>/\1\&lt;\2\&gt;/g' "$file"
  
  # Also fix patterns in code blocks with backticks
  sed -i 's/`\([A-Za-z][A-Za-z0-9_]*\)<\([^>]*\)>`/`\1\&lt;\2\&gt;`/g' "$file"
done

echo "✅ Fixed TypeScript generic syntax in API documentation"
