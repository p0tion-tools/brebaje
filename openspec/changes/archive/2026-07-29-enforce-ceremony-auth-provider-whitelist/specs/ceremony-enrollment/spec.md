## Purpose

Governs who may become a participant in a ceremony: the auth provider whitelist a candidate must satisfy, the ceremony states in which enrollment is accepted, the coordinator's exemption, and the errors returned when enrollment is refused.

## ADDED Requirements

### Requirement: Enrollment is the sole entry point

Becoming a participant in a ceremony SHALL be possible only through the enrollment request. Every rule in this capability therefore governs the complete set of ways a participant record can come into existence, and no other operation — queue assignment, contribution, upload, or timeout recovery — SHALL create a participant that has not passed these checks.

#### Scenario: Queue assignment does not create participants

- **WHEN** the system assigns participants to circuit queues or recovers a timed-out participant
- **THEN** it operates only on participants that already exist, and no new participant is created

### Requirement: Enrolling user's provider must be whitelisted

A user SHALL be permitted to enroll in a ceremony only if the auth provider recorded on their account appears in that ceremony's auth provider whitelist. Enrollment SHALL fail closed: if the provider is absent from the whitelist, or the whitelist cannot be interpreted as a list of known providers, the request is refused.

The provider used for this comparison SHALL be read from the authoritative user record rather than from a copy carried in the caller's session credentials, so that the decision cannot be made from a stale provider value.

#### Scenario: Provider is whitelisted

- **WHEN** a user whose account provider is GitHub enrolls in an open ceremony whose whitelist includes GitHub
- **THEN** the participant is created with the initial participant status and contribution step

#### Scenario: Provider is not whitelisted

- **WHEN** a user whose account provider is Ethereum enrolls in an open ceremony whose whitelist names only GitHub
- **THEN** the request is refused with a forbidden error explaining that the ceremony does not accept that auth provider, and no participant is created

#### Scenario: Whitelist holds a legacy or uninterpretable value

- **WHEN** a user enrolls in an open ceremony whose stored whitelist is not a list of known providers, such as a ceremony persisted under the previous keyed-boolean format
- **THEN** the request is refused rather than allowed, and no participant is created

#### Scenario: User record is the source of the provider

- **WHEN** a user enrolls in a ceremony
- **THEN** the provider compared against the whitelist is the one currently stored on the user record, not the one embedded in the caller's session credentials

### Requirement: Ceremony must be open to accept enrollments

A user SHALL be permitted to enroll only while the ceremony is in the open state. Enrollment into a ceremony that has not yet started, is temporarily paused, has stopped accepting contributions, was abandoned, or has already been finalized SHALL be refused.

#### Scenario: Ceremony is open

- **WHEN** a user with a whitelisted provider enrolls in a ceremony that is open
- **THEN** the participant is created

#### Scenario: Ceremony has not started

- **WHEN** a user enrolls in a ceremony that is still scheduled
- **THEN** the request is refused with an error stating the ceremony is not accepting enrollments, and no participant is created

#### Scenario: Ceremony is paused

- **WHEN** a user enrolls in a ceremony that is paused
- **THEN** the request is refused and no participant is created

#### Scenario: Ceremony no longer accepts contributions

- **WHEN** a user enrolls in a ceremony that is closed, canceled, or finalized
- **THEN** the request is refused and no participant is created

#### Scenario: Ceremony does not exist

- **WHEN** a user enrolls with a ceremony identifier that matches no ceremony
- **THEN** the request is refused with a not-found error, and the response does not reveal internal error detail

### Requirement: Coordinator is exempt from the provider whitelist

The coordinator who owns the ceremony SHALL be able to enroll regardless of the ceremony's auth provider whitelist. Coordinators require a participant record to carry out finalization, so enforcing the whitelist against them would let a coordinator configure a whitelist that locks them out of finalizing their own ceremony.

Because finalization takes place after the ceremony stops accepting contributions, the coordinator SHALL also be able to enroll while the ceremony is closed, in addition to while it is open. The coordinator SHALL NOT be able to enroll into a canceled or finalized ceremony, where enrollment serves no purpose.

#### Scenario: Coordinator's provider is not whitelisted

- **WHEN** the ceremony's coordinator, whose account provider is GitHub, enrolls in their own open ceremony whose whitelist names only Ethereum
- **THEN** the participant is created, because the whitelist does not apply to the coordinator

#### Scenario: Coordinator enrolls to finalize a closed ceremony

- **WHEN** the ceremony's coordinator enrolls in their own ceremony that is closed
- **THEN** the participant is created, so that finalization can proceed

#### Scenario: Non-coordinator cannot use the exemption

- **WHEN** a user who coordinates a different ceremony enrolls in this ceremony with a provider that is not whitelisted
- **THEN** the request is refused, because the exemption applies only to the coordinator of the ceremony being joined

#### Scenario: Coordinator enrolls in a finalized ceremony

- **WHEN** the ceremony's coordinator enrolls in their own ceremony that is already finalized or was canceled
- **THEN** the request is refused and no participant is created

### Requirement: Refusals are distinguishable

Enrollment refusals SHALL be reported so that a client can tell the reasons apart: a provider that is not permitted is reported as a forbidden request, a ceremony whose state does not accept enrollments is reported as a bad request, a missing ceremony is reported as not found, and an already-enrolled user is reported as a conflict. Error messages SHALL NOT leak internal error detail or stack traces.

#### Scenario: Provider refusal versus state refusal

- **WHEN** enrollment is refused because the user's provider is not whitelisted, and separately because the ceremony is not open
- **THEN** the two refusals carry different status codes and messages, so the client can present the correct explanation

#### Scenario: Duplicate enrollment

- **WHEN** a user who is already a participant in a ceremony enrolls in it again
- **THEN** the request is refused as a conflict and no second participant record is created
