# TSDoc Documentation Guide

This guide explains how to write proper TSDoc comments for the Brebaje project.

## Why TSDoc?

- **Consistency**: Standardized documentation format across the entire codebase
- **Automation**: Pre-commit hooks ensure all public exports are documented
- **Quality**: ESLint validation catches syntax errors and missing documentation
- **Generation**: TypeDoc automatically creates documentation websites

## Basic Syntax

### Function Documentation

```typescript
/**
 * Calculates the hash of a contribution for verification.
 * 
 * @param contribution - The contribution data to hash
 * @param algorithm - Hash algorithm to use (default: 'sha256')
 * @returns Promise resolving to the calculated hash
 * @throws {InvalidContributionError} When contribution data is invalid
 * @example
 * ```typescript
 * const hash = await calculateContributionHash(contribution);
 * console.log('Hash:', hash);
 * ```
 */
export async function calculateContributionHash(
  contribution: Contribution,
  algorithm: string = 'sha256'
): Promise<string> {
  // Implementation...
}
```

### Class Documentation

```typescript
/**
 * Manages ceremony lifecycle and participant coordination.
 * 
 * @example
 * ```typescript
 * const ceremonyService = new CeremonyService();
 * await ceremonyService.createCeremony(ceremonyData);
 * ```
 */
export class CeremonyService {
  /**
   * Creates a new ceremony with the specified configuration.
   * 
   * @param ceremonyData - Configuration for the new ceremony
   * @returns Promise resolving to the created ceremony
   * @throws {ValidationError} When ceremony data is invalid
   * @throws {PermissionError} When user lacks creation permissions
   */
  async createCeremony(ceremonyData: CreateCeremonyDto): Promise<Ceremony> {
    // Implementation...
  }
}
```

### Interface Documentation

```typescript
/**
 * Configuration options for ceremony creation.
 * 
 * @example
 * ```typescript
 * const config: CeremonyConfig = {
 *   name: 'My Ceremony',
 *   maxParticipants: 100,
 *   duration: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
 * };
 * ```
 */
export interface CeremonyConfig {
  /** The display name of the ceremony */
  name: string;
  
  /** Maximum number of participants allowed */
  maxParticipants: number;
  
  /** Duration in milliseconds */
  duration: number;
  
  /** Optional description of the ceremony */
  description?: string;
}
```

## Common TSDoc Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@param` | Document function parameters | `@param name - The user's name` |
| `@returns` | Document return value | `@returns Promise resolving to user data` |
| `@throws` | Document possible exceptions | `@throws {Error} When validation fails` |
| `@example` | Provide usage examples | `@example \`\`\`typescript\nconst result = func();\n\`\`\`` |
| `@deprecated` | Mark as deprecated | `@deprecated Use newFunction() instead` |
| `@since` | Version when added | `@since 1.2.0` |
| `@see` | Reference related docs | `@see {@link OtherClass} for related functionality` |

## Validation Commands

```bash
# Check TSDoc syntax across entire project
pnpm lint

# Fix formatting issues automatically
pnpm lint:fix

# Check specific file
npx eslint path/to/file.ts
```

## Common Mistakes to Avoid

### ❌ Wrong
```typescript
/**
 * @param name -Missing hyphen
 * @return Missing 's'
 * @param - Missing parameter name
 */
```

### ✅ Correct
```typescript
/**
 * @param name - The user's name
 * @returns The greeting message
 * @param age - The user's age
 */
```

## Pre-commit Enforcement

The pre-commit hook automatically runs TSDoc validation. If you have syntax errors:

1. Fix the TSDoc comments
2. Run `pnpm lint:fix` to auto-fix formatting
3. Try committing again

## Next Steps

- **Phase 2**: Automated documentation generation with TypeDoc
- **Phase 3**: CI/CD integration for documentation deployment