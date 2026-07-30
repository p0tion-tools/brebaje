# ceremony-auth-providers Specification

## Purpose

Defines the per-ceremony auth provider whitelist as an explicit contract: which values it may hold, and what the system accepts or rejects when a coordinator sets it while creating or updating a ceremony. Enrollment enforcement of the whitelist is specified separately under `ceremony-enrollment`.

## Requirements

### Requirement: Whitelist value shape

A ceremony's auth provider whitelist SHALL be a list of auth provider identifiers, where each identifier is one of the auth providers the platform supports for user authentication. The identifiers SHALL be the same values used to record a user's own auth provider, so that a user's provider can be compared to the whitelist without translation.

#### Scenario: Whitelist naming a single provider

- **WHEN** a coordinator creates a ceremony with a whitelist naming only the GitHub provider
- **THEN** the ceremony is created and its whitelist reads back as a list containing exactly the GitHub provider identifier

#### Scenario: Whitelist naming several providers

- **WHEN** a coordinator creates a ceremony with a whitelist naming the GitHub and Ethereum providers
- **THEN** the ceremony is created and its whitelist reads back as a list containing exactly those two provider identifiers, and Cardano is absent

#### Scenario: Whitelist value is not a list

- **WHEN** a coordinator submits a ceremony whose whitelist is an object rather than a list, such as the legacy keyed-boolean form
- **THEN** the request is rejected with a validation error and no ceremony is created

### Requirement: Unknown providers are rejected

The system SHALL reject a ceremony whose whitelist contains any identifier that is not a supported auth provider. A whitelist SHALL NOT be persisted with entries the enrollment gate cannot interpret.

#### Scenario: Whitelist contains an unrecognized identifier

- **WHEN** a coordinator submits a ceremony whose whitelist contains an identifier that does not correspond to a supported auth provider
- **THEN** the request is rejected with a validation error naming the offending value and no ceremony is created

#### Scenario: Whitelist mixes known and unknown identifiers

- **WHEN** a coordinator submits a ceremony whose whitelist contains one supported provider and one unrecognized identifier
- **THEN** the request is rejected with a validation error and no ceremony is created, rather than silently keeping only the recognized entry

### Requirement: Whitelist must not be empty

Because enrollment fails closed against the whitelist, an empty whitelist would produce a ceremony that nobody can join. The system SHALL reject an empty whitelist at the point where a coordinator sets it, so the coordinator learns of the mistake immediately rather than discovering it when participants are turned away.

#### Scenario: Ceremony created with an empty whitelist

- **WHEN** a coordinator submits a ceremony whose whitelist is an empty list
- **THEN** the request is rejected with a validation error and no ceremony is created

#### Scenario: Ceremony created with no whitelist at all

- **WHEN** a coordinator submits a ceremony that omits the whitelist entirely
- **THEN** the request is rejected with a validation error, because the whitelist is required and has no default

### Requirement: Whitelist rules apply to updates

The same shape, known-provider, and non-empty rules SHALL apply when a coordinator updates an existing ceremony's whitelist. A ceremony that was created with a valid whitelist SHALL NOT be reducible to an invalid one through an update.

#### Scenario: Update narrows the whitelist to a valid subset

- **WHEN** a coordinator updates a ceremony's whitelist from two providers to one supported provider
- **THEN** the update succeeds and the ceremony's whitelist reads back as the single named provider

#### Scenario: Update sets an empty whitelist

- **WHEN** a coordinator updates a ceremony's whitelist to an empty list
- **THEN** the request is rejected with a validation error and the ceremony's existing whitelist is left unchanged

#### Scenario: Update introduces an unknown provider

- **WHEN** a coordinator updates a ceremony's whitelist to include an unrecognized identifier
- **THEN** the request is rejected with a validation error and the ceremony's existing whitelist is left unchanged

#### Scenario: Update leaves the whitelist untouched

- **WHEN** a coordinator updates a ceremony's description without mentioning the whitelist
- **THEN** the update succeeds and the ceremony's existing whitelist is preserved
