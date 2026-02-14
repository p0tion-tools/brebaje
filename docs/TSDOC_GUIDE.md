# TSDoc Writing Guide

This guide explains how to write proper TSDoc comments for the Brebaje project.

## Overview

TSDoc is a standardized documentation format for TypeScript. All public APIs in Brebaje must be documented with TSDoc comments.

## Why TSDoc?

- **Consistency**: Standardized format across the codebase
- **Tooling**: Works with TypeDoc for automatic documentation generation
- **IDE Support**: Better IntelliSense and autocomplete
- **Validation**: ESLint plugin enforces syntax correctness

## Basic Syntax

### Function Documentation

```typescript
/**
 * Calculates the sum of two numbers.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
function add(a: number, b: number): number {
  return a + b;
}
```

### Class Documentation

```typescript
/**
 * Manages user authentication and authorization.
 *
 * @remarks
 * This service handles OAuth flows, token management, and user sessions.
 * It integrates with GitHub OAuth for authentication.
 */
export class AuthService {
  // ...
}
```

### Interface Documentation

```typescript
/**
 * Represents a user in the system.
 */
export interface User {
  /** The unique identifier for the user */
  id: number;

  /** The user's display name */
  name: string;

  /** The user's email address */
  email: string;
}
```

## Common Tags

### @param

Documents function parameters.

```typescript
/**
 * @param userId - The unique identifier of the user
 * @param options - Optional configuration for the query
 */
function getUser(userId: number, options?: QueryOptions): User {
  // ...
}
```

### @returns / @returns

Documents return values.

```typescript
/**
 * @returns A promise that resolves to the user object
 * @returns The user object, or null if not found
 */
async findUser(id: number): Promise<User | null> {
  // ...
}
```

### @throws

Documents exceptions that may be thrown.

```typescript
/**
 * @throws {NotFoundError} When the user does not exist
 * @throws {ValidationError} When the input is invalid
 */
function getUser(id: number): User {
  if (!id) {
    throw new ValidationError("ID is required");
  }
  // ...
}
```

### @example

Provides usage examples.

````typescript
/**
 * Formats a date to a readable string.
 *
 * @param date - The date to format
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date());
 * console.log(formatted); // "January 1, 2024"
 * ```
 */
function formatDate(date: Date): string {
  // ...
}
````

### @remarks

Additional notes or important information.

```typescript
/**
 * Processes a ceremony contribution.
 *
 * @remarks
 * This method performs cryptographic validation and stores the contribution.
 * It should only be called by authenticated coordinators.
 */
async processContribution(contribution: Contribution): Promise<void> {
  // ...
}
```

### @see

References related documentation.

```typescript
/**
 * Creates a new ceremony.
 *
 * @see {@link CeremonyService} for ceremony management
 * @see {@link https://example.com/docs} for external documentation
 */
async createCeremony(data: CreateCeremonyDto): Promise<Ceremony> {
  // ...
}
```

### @deprecated

Marks APIs as deprecated.

```typescript
/**
 * @deprecated Use {@link newMethod} instead. This will be removed in v2.0.
 */
function oldMethod(): void {
  // ...
}
```

### @internal

Marks APIs as internal (not part of public API).

```typescript
/**
 * @internal
 * Internal helper method for processing contributions.
 */
function processContributionInternal(data: unknown): void {
  // ...
}
```

### @public / @private / @protected

Access modifiers (usually inferred from TypeScript, but can be explicit).

```typescript
/**
 * @public
 * Public method that can be called by external code.
 */
public processData(): void {
  // ...
}
```

## Advanced Patterns

### Generic Types

```typescript
/**
 * Retrieves an entity by its identifier.
 *
 * @typeParam T - The type of entity to retrieve
 * @param id - The unique identifier
 * @returns A promise resolving to the entity
 */
async findById<T extends Entity>(id: number): Promise<T> {
  // ...
}
```

### Complex Parameters

```typescript
/**
 * Updates user preferences.
 *
 * @param userId - The user's unique identifier
 * @param preferences - The preferences object
 * @param preferences.theme - The UI theme preference
 * @param preferences.notifications - Notification settings
 */
function updatePreferences(
  userId: number,
  preferences: {
    theme: string;
    notifications: boolean;
  },
): void {
  // ...
}
```

### Async Functions

````typescript
/**
 * Fetches data from the API.
 *
 * @param endpoint - The API endpoint URL
 * @returns A promise that resolves to the response data
 *
 * @example
 * ```typescript
 * const data = await fetchData('/api/users');
 * ```
 */
async function fetchData(endpoint: string): Promise<ApiResponse> {
  // ...
}
````

### Method Overloads

```typescript
/**
 * Finds a user by ID or email.
 *
 * @param identifier - The user ID (number) or email (string)
 * @returns The user object if found
 */
function findUser(identifier: number): User;
function findUser(identifier: string): User | null;
function findUser(identifier: number | string): User | null {
  // ...
}
```

## Best Practices

### 1. Be Descriptive

```typescript
// ❌ Bad
/**
 * Gets user.
 */
function getUser(id: number): User {
  // ...
}

// ✅ Good
/**
 * Retrieves a user by their unique identifier.
 *
 * @param id - The user's unique identifier
 * @returns The user object if found
 * @throws {NotFoundError} If the user does not exist
 */
function getUser(id: number): User {
  // ...
}
```

### 2. Document All Parameters

```typescript
// ❌ Bad
/**
 * Creates a ceremony.
 */
function createCeremony(name: string, startDate: Date): Ceremony {
  // ...
}

// ✅ Good
/**
 * Creates a new ceremony with the specified parameters.
 *
 * @param name - The name of the ceremony
 * @param startDate - The scheduled start date and time
 * @returns The newly created ceremony object
 */
function createCeremony(name: string, startDate: Date): Ceremony {
  // ...
}
```

### 3. Include Examples for Complex APIs

````typescript
/**
 * Validates a contribution file.
 *
 * @param file - The contribution file to validate
 * @param ceremonyId - The ID of the ceremony
 * @returns Validation result with details
 *
 * @example
 * ```typescript
 * const result = await validateContribution(file, ceremonyId);
 * if (result.valid) {
 *   console.log('Contribution is valid');
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
async function validateContribution(file: File, ceremonyId: number): Promise<ValidationResult> {
  // ...
}
````

### 4. Document Error Conditions

```typescript
/**
 * Processes a payment transaction.
 *
 * @param amount - The payment amount in cents
 * @param userId - The user making the payment
 * @returns Transaction ID
 * @throws {InsufficientFundsError} When user has insufficient funds
 * @throws {InvalidAmountError} When amount is invalid
 */
async function processPayment(amount: number, userId: number): Promise<string> {
  // ...
}
```

### 5. Use @remarks for Important Context

```typescript
/**
 * Finalizes a ceremony.
 *
 * @remarks
 * This operation is irreversible. Once a ceremony is finalized,
 * no further contributions can be accepted. Ensure all participants
 * have completed their contributions before calling this method.
 *
 * @param ceremonyId - The ID of the ceremony to finalize
 */
async function finalizeCeremony(ceremonyId: number): Promise<void> {
  // ...
}
```

## ESLint Validation

The project uses `eslint-plugin-tsdoc` to validate TSDoc syntax. Common errors:

### Missing @param

```typescript
// ❌ Error: Missing @param tag
/**
 * Gets user by ID.
 */
function getUser(id: number): User {
  // ...
}
```

### Invalid Tag Syntax

```typescript
// ❌ Error: Invalid tag syntax
/**
 * @param id The user ID
 */

// ✅ Correct
/**
 * @param id - The user ID
 */
```

### Missing Description

```typescript
// ❌ Error: Missing description
/**
 * @param id
 */

// ✅ Correct
/**
 * @param id - The user identifier
 */
```

## TypeDoc Integration

TSDoc comments are automatically processed by TypeDoc to generate documentation:

```bash
pnpm docs
```

The generated documentation includes:

- All exported APIs
- Parameter descriptions
- Return types
- Examples
- Related links

## Resources

- [TSDoc Official Documentation](https://tsdoc.org/)
- [TypeDoc Documentation](https://typedoc.org/)
- [ESLint TSDoc Plugin](https://github.com/microsoft/tsdoc/tree/master/eslint-plugin)

## Checklist

Before committing code, ensure:

- [ ] All exported functions have TSDoc comments
- [ ] All parameters are documented with @param
- [ ] Return values are documented with @returns
- [ ] Exceptions are documented with @throws
- [ ] Complex APIs have @example sections
- [ ] ESLint TSDoc validation passes
- [ ] Documentation generates without errors
