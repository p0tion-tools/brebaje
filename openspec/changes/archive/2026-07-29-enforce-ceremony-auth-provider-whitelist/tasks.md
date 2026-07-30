## 1. Define the `authProviders` contract

- [x] 1.1 Change `CeremonyAttributes.authProviders` and the corresponding `@Column` in `apps/backend/src/ceremonies/ceremony.model.ts` from `object` to `UserProvider[]`, keeping the column type as `DataType.JSON`, and replace the `'check auth providers classes'` comment with a description of the enum-array contract
- [x] 1.2 Replace `@IsObject()` on `CreateCeremonyDto.authProviders` in `apps/backend/src/ceremonies/dto/create-ceremony.dto.ts` with `@IsArray()`, `@ArrayNotEmpty()`, and `@IsEnum(UserProvider, { each: true })`, and update the `@ApiProperty` to `enum: UserProvider`, `isArray: true` with an example such as `[UserProvider.GITHUB]`
- [x] 1.3 Confirm no change is needed in `apps/backend/src/ceremonies/ceremonies.service.ts` beyond types — the field is a straight passthrough on create and update
- [x] 1.4 Update the `authProviders` note in `apps/backend/src/database/diagram.dbml` and the matching column comment in `apps/backend/src/database/diagram.sql` to document the array-of-`UserProvider` contract
- [x] 1.5 Verify no DDL change is produced: the column stays JSON, so Sequelize `synchronize` is a no-op for it

## 2. Migrate existing backend fixtures to the new shape

- [x] 2.1 Update `authProviders` in `apps/backend/test/constants.ts` from `{ github: true }` to `[UserProvider.GITHUB]`
- [x] 2.2 Update the `authProviders` assertions in `apps/backend/test/coordinator.e2e-spec.ts` for the array shape
- [x] 2.3 Update `authProviders` in the fixtures and expectations in `apps/backend/src/ceremonies/ceremonies.service.spec.ts` and `apps/backend/src/ceremonies/ceremonies.controller.spec.ts`
- [x] 2.4 Run the ceremonies unit tests and confirm they pass against the new contract

## 3. Cover the whitelist validation rules

- [x] 3.1 Add DTO validation tests for `POST /ceremonies` covering: valid single provider, valid multiple providers, empty array rejected, unknown identifier rejected, mixed known/unknown rejected, legacy `{ github: true }` object rejected, and field omitted entirely rejected
- [x] 3.2 Add tests confirming the same rules apply to `PATCH /ceremonies/:id` when `authProviders` is present, and that omitting the field leaves the stored whitelist untouched

## 4. Wire the enrollment dependencies

- [x] 4.1 Add `UsersModule` to the `imports` of `apps/backend/src/participants/participants.module.ts` (use `forwardRef` only if a circular import appears)
- [x] 4.2 Inject `CeremoniesService` and `UsersService` into `ParticipantsService`, matching the existing `forwardRef`/`Inject` style used for `CircuitsService` and `ContributionsService`
- [x] 4.3 Confirm the backend still boots with the new dependency graph before adding logic

## 5. Enforce the gates at enrollment

- [x] 5.1 In `ParticipantsService.create()`, load the ceremony via `CeremoniesService` before creating the participant, and surface a not-found error when it does not exist
- [x] 5.2 Determine whether the enrolling user is the ceremony's coordinator using the existing `CeremoniesService.findCoordinatorOfCeremony` / `isCoordinator` path
- [x] 5.3 Apply the state gate: allow `OPENED` for everyone, additionally allow `CLOSED` for the coordinator, and reject `SCHEDULED`, `PAUSED`, `CANCELED`, and `FINALIZED` with a `BadRequestException`
- [x] 5.4 Apply the provider gate for non-coordinators: read the enrolling user's `provider` from the user record (not from the JWT-embedded user), and reject with a `ForbiddenException` when it is absent from `ceremony.authProviders`
- [x] 5.5 Make the provider gate fail closed when `authProviders` is not an interpretable array of known providers, so ceremonies persisted in the legacy format deny rather than admit
- [x] 5.6 Keep the existing `handleErrors` behaviour intact: the new `ForbiddenException` and `BadRequestException` must propagate as thrown rather than being remapped to a generic 500
- [x] 5.7 Add TSDoc to `create()` describing the two gates and the coordinator exemption

## 6. Document the new responses

- [x] 6.1 Add `@ApiResponse` entries for 403 (auth provider not permitted), 404 (ceremony not found), and 409 (already enrolled) to the `create` handler in `apps/backend/src/participants/participants.controller.ts`, and clarify the existing 400 description to mention ceremony state
- [x] 6.2 Update the `CreateParticipantDto` TSDoc to note that enrollment is subject to the ceremony's auth provider whitelist and state

## 7. Test the enrollment gates

- [x] 7.1 Add `apps/backend/src/participants/participants.service.spec.ts` cases for a whitelisted provider enrolling successfully into an `OPENED` ceremony
- [x] 7.2 Add cases for a non-whitelisted provider rejected with 403, and for a legacy/uninterpretable whitelist rejected rather than allowed
- [x] 7.3 Add cases for each non-enrollable state (`SCHEDULED`, `PAUSED`, `CLOSED`, `CANCELED`, `FINALIZED`) rejected for a non-coordinator, and for a missing ceremony rejected as not found
- [x] 7.4 Add coordinator cases: bypasses a whitelist that excludes their provider, may enroll while `CLOSED`, and is still rejected for `CANCELED` and `FINALIZED`
- [x] 7.5 Add a case proving the exemption is scoped to the ceremony being joined — a coordinator of a different ceremony with a non-whitelisted provider is rejected
- [x] 7.6 Add a case asserting the provider is read from the user record, so a stale provider in the session credentials cannot influence the decision
- [x] 7.7 Extend the e2e coverage so a participant enrolls into an `OPENED` ceremony whose whitelist includes their provider, and is refused when it does not

## 8. Update the CLI to the new template format

- [x] 8.1 Add a `UserProvider` enum to `apps/cli/src/ceremonies/declarations.ts`, mirroring the backend enum as `CeremonyType` and `CeremonyState` already are
- [x] 8.2 Change `authProviders` on `CeremonyTemplate`, `CeremonyUpdate`, and `Ceremony` in `apps/cli/src/ceremonies/declarations.ts` from `Record<string, boolean>` to `UserProvider[]`
- [x] 8.3 Add an `isValidUserProvider` helper to `apps/cli/src/ceremonies/utils.ts` alongside the existing `isValidCeremonyType` / `isValidCeremonyState` helpers
- [x] 8.4 Replace the `authProviders` check in `validateCreateTemplate` with a non-empty-array-of-valid-providers check whose error message lists the accepted values
- [x] 8.5 Apply the same check in `validateUpdateTemplate`, keeping it conditional on the field being present
- [x] 8.6 Update the `authProviders` fixtures in `apps/cli/src/ceremonies/create.spec.ts` and add validator tests for empty array, unknown provider, and the rejected legacy object form

## 9. Refresh the documentation

- [x] 9.1 Check off the auth provider whitelist enforcement item in `docs/PRD.md` and remove its ⚠️ risk marker
- [x] 9.2 Update the Ceremony model row in `docs/ARCHITECTURE.md` to describe `authProviders` as an array of `UserProvider` values
- [x] 9.3 Rewrite the provider-whitelist paragraph in `docs/ARCHITECTURE.md` to state that enrollment enforcement is implemented, describe the fail-closed behaviour and coordinator exemption, and note that the whitelist remains mutable mid-ceremony with already-enrolled participants grandfathered

## 10. Verify

- [x] 10.1 Run the backend unit tests and the CLI tests
- [x] 10.2 Run the backend e2e suite against the test database
- [x] 10.3 Run `pnpm lint` and `pnpm prettier:fix` at the root and resolve any findings
- [x] 10.4 Manually confirm the coordinator finalization path still works end to end: coordinator enrolls, reaches `FINALIZING`, and retains storage upload access
