## Why

Every ceremony carries an `authProviders` whitelist, but `ParticipantsService.create()` never loads the ceremony — so any authenticated user can enroll in any ceremony regardless of which auth provider the coordinator allowed, and regardless of whether the ceremony is even open. `POST /participants` is the only path that creates a participant row, so this single unguarded call is the whole gap. It is tracked as a security gap in [docs/PRD.md](../../../docs/PRD.md) and [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md).

The check itself is small; the reason it has not been written is that `authProviders` has no defined shape. It is a bare `object` in the model, validated only with `@IsObject()`, and used as an ad-hoc lowercase boolean map (`{ github: true, eth: false }`) whose keys do not correspond to any `UserProvider` enum value. A whitelist cannot be enforced until it is a real contract.

## What Changes

- **BREAKING**: `authProviders` becomes an array of `UserProvider` enum values (`["GITHUB", "ETHEREUM"]`) instead of an untyped boolean map (`{ github: true, eth: false }`). The DB column stays JSON, so no DDL migration is required, but every producer of the field changes: the ceremony DTOs, the CLI ceremony templates and their validators, and all test fixtures.
- `CreateCeremonyDto.authProviders` gains real validation: a non-empty array of known `UserProvider` values. Because `UpdateCeremonyDto` extends `PartialType(CreateCeremonyDto)`, the same rule automatically applies to `PATCH /ceremonies/:id` whenever the field is present, so a coordinator can no longer save an empty or unrecognized whitelist through either endpoint.
- Participant enrollment gains two gates, both served by a single ceremony lookup: the enrolling user's provider must appear in `ceremony.authProviders` (403 otherwise), and the ceremony must be `OPENED` (400 otherwise).
- The ceremony's coordinator bypasses the provider whitelist at enrollment. Coordinators need a participant row to finalize their own ceremony (`storage.service.ts` grants them upload access via `ParticipantStatus.FINALIZING`), so a naive gate would let a coordinator lock themselves out of finalization by configuring a whitelist that excludes their own provider.
- The enrollment gate reads the user's `provider` from the database rather than from the JWT-embedded user object, so the decision cannot be made on a stale copy of the user record.

## Capabilities

### New Capabilities

- `ceremony-auth-providers`: the per-ceremony auth provider whitelist as a contract — its value shape, and the validation applied when a coordinator sets it on ceremony creation or update.
- `ceremony-enrollment`: the rules governing who may enroll as a participant in a ceremony — provider whitelist enforcement, ceremony state requirement, coordinator bypass, and the resulting error responses.

### Modified Capabilities

None. `openspec/specs/` currently has no specs, so both capabilities above are new.

## Impact

**Contract (backend)**

- `apps/backend/src/ceremonies/ceremony.model.ts` — `CeremonyAttributes.authProviders` and the `@Column` type change from `object` to `UserProvider[]`; the column stays `DataType.JSON`.
- `apps/backend/src/ceremonies/dto/create-ceremony.dto.ts` — `@IsObject()` replaced by array + enum validation; Swagger example updated. `UpdateCeremonyDto` inherits the rule.
- `apps/backend/src/database/diagram.dbml`, `diagram.sql` — replace the placeholder `'check auth providers classes'` note with the actual contract.

**Enforcement (backend)**

- `apps/backend/src/participants/participants.service.ts` — `create()` loads the ceremony and applies the state and provider gates. `ParticipantsModule` already imports `CeremoniesModule` via `forwardRef`, and `CeremoniesModule` exports `CeremoniesService`, so no new wiring is needed there; `UsersModule` must be added to read the enrolling user's provider.
- `apps/backend/src/participants/participants.controller.ts` — document the new 403 and 400 responses in Swagger.

**CLI**

- `apps/cli/src/ceremonies/declarations.ts` — `authProviders` type on `CeremonyTemplate`, `CeremonyUpdate`, and `Ceremony`; needs a `UserProvider` enum mirroring the backend.
- `apps/cli/src/ceremonies/utils.ts` — `validateCreateTemplate` and `validateUpdateTemplate` must check a non-empty array of valid providers instead of "must be an object".

**Tests**

- Fixtures in `apps/backend/test/constants.ts`, `apps/backend/test/coordinator.e2e-spec.ts`, `apps/backend/src/ceremonies/ceremonies.service.spec.ts`, `apps/backend/src/ceremonies/ceremonies.controller.spec.ts`, `apps/cli/src/ceremonies/create.spec.ts`.
- New coverage in `apps/backend/src/participants/participants.service.spec.ts` for allowed provider, denied provider, coordinator bypass, and non-`OPENED` ceremony state.

**Docs**

- `docs/PRD.md` — the flagged enrollment-enforcement item can be checked off.
- `docs/ARCHITECTURE.md` — the ceremony model row and the "Enforcement at enrollment is not yet implemented" paragraph both need updating.

**Data**

- No DDL migration: the column is JSON before and after, so Sequelize `synchronize` is unaffected. Existing rows still holding the old boolean-map value will be rejected by the fail-closed gate with a clear error rather than silently allowing enrollment; there is no production deployment, and development databases are recreated.

**Not affected**

- Frontend. No component reads `authProviders` and there is no enrollment UI yet.
