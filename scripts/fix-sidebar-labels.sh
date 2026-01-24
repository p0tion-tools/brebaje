#!/bin/bash
# Post-process TypeDoc generated markdown files to:
# 1. Convert README.md files to index.md with meaningful titles
# 2. Add frontmatter with proper titles

echo "Fixing sidebar labels in API documentation..."

# Find all README.md files except the root one
find docs/api -name "README.md" -type f ! -path "docs/api/README.md" | while read readme_file; do
  dir=$(dirname "$readme_file")
  index_file="$dir/index.md"
  
  # Extract meaningful title from directory name
  # e.g., "auth/auth.controller" -> "Auth Controller"
  relative_path="${dir#docs/api/}"
  last_part=$(basename "$relative_path")
  
  # Get parent category name (e.g., "projects" from "projects/projects.controller")
  parent_category=$(echo "$relative_path" | cut -d'/' -f1)
  
  # Detect component type
  component_type=""
  if echo "$last_part" | grep -q "\.controller$"; then
    component_type="Controller"
    clean_part=$(echo "$last_part" | sed 's/\.controller$//')
  elif echo "$last_part" | grep -q "\.service$"; then
    component_type="Service"
    clean_part=$(echo "$last_part" | sed 's/\.service$//')
  elif echo "$last_part" | grep -q "\.module$"; then
    component_type="Module"
    clean_part=$(echo "$last_part" | sed 's/\.module$//')
  elif echo "$last_part" | grep -q "\.model$"; then
    component_type="Model"
    clean_part=$(echo "$last_part" | sed 's/\.model$//')
  elif echo "$last_part" | grep -q "\.dto$"; then
    component_type=""  # DTOs don't need "DTO" suffix
    clean_part=$(echo "$last_part" | sed 's/\.dto$//')
  elif echo "$last_part" | grep -q "\.guard$"; then
    component_type="Guard"
    clean_part=$(echo "$last_part" | sed 's/\.guard$//')
  elif [ "$last_part" = "-internal-" ]; then
    title="Internal"
    clean_part=""
  else
    clean_part="$last_part"
  fi
  
  # Convert parent category to title case for comparison
  parent_title=$(echo "$parent_category" | \
    sed 's/\([a-z]\)\([A-Z]\)/\1 \2/g' | \
    sed 's/[-_]/ /g' | \
    awk '{for(i=1;i<=NF;i++){sub(/./,toupper(substr($i,1,1)),$i)};print}')
  
  # Also create singular version for comparison (e.g., "Projects" -> "Project")
  parent_title_singular=$(echo "$parent_title" | sed 's/s$//')
  
  # Convert to Title Case
  # Handle camelCase: authController -> Auth Controller
  # Handle kebab-case: auth-controller -> Auth Controller
  if [ -n "$clean_part" ]; then
    title=$(echo "$clean_part" | \
      sed 's/\([a-z]\)\([A-Z]\)/\1 \2/g' | \
      sed 's/[-_]/ /g' | \
      awk '{for(i=1;i<=NF;i++){sub(/./,toupper(substr($i,1,1)),$i)};print}')
    
    # Special cases for better readability
    title=$(echo "$title" | \
      sed 's/ Vm / VM /' | \
      sed 's/^Vm /VM /' | \
      sed 's/ Vm$/ VM/')
    
    # Check if title starts with parent category name (case-insensitive)
    # Handle both plural and singular forms
    # e.g., "Projects" matches "Projects" or "Project"
    title_lower=$(echo "$title" | tr '[:upper:]' '[:lower:]')
    parent_lower=$(echo "$parent_title" | tr '[:upper:]' '[:lower:]')
    parent_singular_lower=$(echo "$parent_title_singular" | tr '[:upper:]' '[:lower:]')
    
    # Remove parent category name from title if it matches
    if echo "$title_lower" | grep -qE "^($parent_lower|$parent_singular_lower)( |$)"; then
      title=$(echo "$title" | sed -E "s/^($parent_title|$parent_title_singular) +//i" | sed -E "s/^($parent_title|$parent_title_singular)$//i")
    fi
    
    # Add component type if we have one and it's not redundant
    if [ -n "$component_type" ]; then
      # If title is empty or just the component type, use component type only
      if [ -z "$title" ] || [ "$title" = "$component_type" ]; then
        title="$component_type"
      elif ! echo "$title" | grep -qi "$component_type"; then
        title="$title $component_type"
      fi
    fi
  elif [ -n "$component_type" ]; then
    # If we only have a component type, use it
    title="$component_type"
  fi
  
  # Ensure title is not empty - use fallback if needed
  if [ -z "$title" ] || [ "$title" = "null" ] || [ "$title" = "" ]; then
    # Fallback: use directory name as title
    title=$(basename "$dir" | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++){sub(/./,toupper(substr($i,1,1)),$i)};print}')
    if [ -z "$title" ] || [ "$title" = "" ]; then
      # Final fallback
      title="API Reference"
    fi
  fi
  
  # Read content
  content=$(cat "$readme_file")
  
  # Add or update frontmatter
  if ! echo "$content" | grep -q "^---"; then
    # No frontmatter - add it
    content="---
title: $title
---

$content"
  else
    # Frontmatter exists - update title if it's null or empty
    if echo "$content" | grep -q "title: null" || echo "$content" | grep -q "^title: $"; then
      content=$(echo "$content" | sed "s/^title:.*/title: $title/")
    fi
  fi
  
  # Write to index.md
  echo "$content" > "$index_file"
  
  # Remove README.md
  rm "$readme_file"
  
  echo "Converted: $readme_file -> $index_file (title: $title)"
done

# Fix all README.md references to point to index.md instead
echo "Fixing README.md references..."
find docs/api -name "*.md" -type f -exec sed -i 's|README\.md|index.md|g' {} \;

echo "✅ Fixed sidebar labels in API documentation"
