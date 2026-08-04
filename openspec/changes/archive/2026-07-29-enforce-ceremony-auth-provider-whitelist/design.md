## Context

See proposal.md — Why. The design-relevant constraints:

- `ParticipantsService.create()` spreads the DTO straight into `participantModel.create()` and never loads the ceremony, so there is no existing hook to hang either gate on.
- `ParticipantsModule` already imports `CeremoniesModule` through `forwardRef`, and `CeremoniesModule` exports `CeremoniesService`. The ceremony lookup needs no new module wiring; only `UsersModule` has to be added.
- `authProviders` is a `DataType.JSON` column typed as bare `object`, validated with `@IsObject()` alone. The de-facto format is `{ github: true, eth: false }`, whose keys match no `UserProvider` value (`GITHUB`, `ETHEREUM`, `CARDANO`).
- There is no migration framework. Schema changes are applied by Sequelize `synchronize`, gated on `DB_SQLITE_SYNCHRONIZE`.
- `JwtAuthGuard` assigns `request.user = payload.user`, embedding the whole `User` record in the token. The controller passes only `req.user!.id!` to the service today.
- Coordinator finalization depends on a participant record: `storage.service.ts` grants upload access when `isCoordinator` or when the participant's status is `ParticipantStatus.FINALIZING`. That record can only originate from `POST /participants`.

## Goals / Non-Goals

**Goals:**

- Make `authProviders` a typed, validated contract so the whitelist is enforceable at all.
- Close the enrollment hole with a single ceremony lookup that covers both the provider and state gates.
- Keep the coordinator's finalization path working.

**Non-Goals:**

- Normalizing `authProviders` out of a JSON column into a relational shape (join table, or one boolean column per provider). JSON with enum-array validation is sufficient for a small closed set and avoids schema churn.
- Linking multiple provider identities to one account. `ARCHITECTURE.md` records one-provider-per-user as intentional-but-temporary; provider binding is a separate future change.
- Re-checking the whitelist on any operation after enrollment. Enrollment is the only gate, and already-enrolled participants are grandfathered if the whitelist is later narrowed.
- Sharing the `UserProvider` enum between backend and CLI through a package. See Decisions.

## Decisions

### Enum array over keyed boolean map

`authProviders` becomes `UserProvider[]` (`["GITHUB", "ETHEREUM"]`).

The alternative — keeping `{ github: true, eth: false }` and adding a key-to-enum mapping — avoids touching CLI templates and fixtures, but it carries two defects into the enforcement path. First, it needs a hand-maintained mapping table (`eth` → `ETHEREUM`) that will drift the moment a provider is added. Second, `false` and absent are indistinguishable in intent, so "not permitted" and "not configured" collapse into the same value, which is exactly the ambiguity a security gate should not have to interpret.

The enum array removes both. It validates declaratively with `@IsArray()`, `@ArrayNotEmpty()`, and `@IsEnum(UserProvider, { each: true })`, and membership is a plain `includes()` against the value already stored on the user.

The column type is unchanged (`DataType.JSON`), so the cost is confined to producers of the value, not to the schema.

### Validate the whitelist where the coordinator sets it

Enrollment fails closed, so an empty or unparseable whitelist yields a ceremony nobody can join. Rejecting only at enrollment would surface that as participants being turned away — far from the mistake, and invisible to the coordinator until someone complains. Validating at ceremony write time puts the error in front of the person who can fix it.

`UpdateCeremonyDto extends PartialType(CreateCeremonyDto)`, so the create-side decorators apply to `PATCH /ceremonies/:id` whenever the field is present, and are skipped when it is absent. Non-empty-on-create and non-empty-on-update therefore come from one set of decorators with no additional code.

Enrollment still fails closed independently, because ceremony rows written before this change are not revalidated.

### Enforce in the service, not in a guard

A dedicated guard would match the `guards/` convention used for the coordinator checks, and it has access to everything it needs (`req.user`, `req.body.ceremonyId`).

The service is the better home here for two reasons. The project's architecture rules place domain invariants in the service layer, and "who may join a ceremony" is a ceremony invariant rather than a transport concern. More practically, the state gate needs the ceremony row anyway; putting the provider check in a guard would mean loading the same ceremony twice per request, in two places that must agree on the fail-closed semantics.

The existing coordinator guards stay as they are — this is not a rewrite of that pattern, just a decision about where a new check belongs.

### Read the provider from the database, not the JWT

The token is server-signed, so the embedded `provider` cannot be forged. It can, however, be stale: it reflects the user record as of sign-in, and `JWT_EXPIRES_IN` defaults to `1d`. Today `provider` never changes after account creation, so the two sources agree — but the planned provider-binding feature makes the JWT copy wrong for exactly the field this gate depends on, and the failure mode would be a silently bypassed whitelist.

One indexed primary-key read on a rare write path is a cheap way to never have that bug. Cost: `ParticipantsModule` imports `UsersModule`.

The controller keeps passing `userId`; the service resolves the user itself, so the trust boundary is visible in the layer that enforces it rather than spread across controller and service.

### Coordinator bypasses the state gate as well as the provider gate

The exemption was decided for the provider whitelist, but restricting the coordinator to `OPENED` would reintroduce the same lockout through the other gate. Finalization runs after the ceremony stops accepting contributions, so a coordinator who did not happen to enroll while the ceremony was open cannot create the participant record that `storage.service.ts` requires for finalization uploads, and the ceremony becomes unfinalizable.

Coordinators may therefore enroll while the ceremony is `OPENED` or `CLOSED`. `CANCELED` and `FINALIZED` remain closed to everyone, since enrollment there has no purpose. Everyone else is restricted to `OPENED`.

Ownership is determined with the existing `CeremoniesService.findCoordinatorOfCeremony` / `isCoordinator` path, which already joins through `Project.coordinatorId`, so no new ownership logic is introduced.

An alternative was to validate at ceremony-create time that the coordinator's own provider is in the whitelist. It was rejected because it couples ceremony creation to a user lookup, and it still leaves the state half of the problem unsolved.

### Duplicate the `UserProvider` enum in the CLI

The CLI already mirrors `CeremonyType` and `CeremonyState` locally in `ceremonies/declarations.ts` rather than importing them. Mirroring `UserProvider` the same way keeps the change consistent with the surrounding code.

Hoisting the shared enums into `@brebaje/actions` would be the DRY move, but the project's stated principle is WET-first and extract on evidence. One more mirrored enum is the evidence accumulating, not yet the trigger; it is worth doing as its own change covering all three enums rather than smuggling a package-boundary change into a security fix.

## Risks / Trade-offs

- **Breaking format change: any ceremony template or fixture still using the boolean map fails validation.** → The blast radius is fully enumerated in proposal.md — Impact, and every occurrence lives in this repo (CLI validators and declarations, backend and CLI fixtures, e2e constants). The fail-closed enrollment gate means a missed producer surfaces as a rejected request, not as an unguarded enrollment.
- **Ceremony rows already persisted with the boolean map become unjoinable.** → Intended, and safe by construction: fail-closed denies rather than admits. There is no production deployment, and development databases are recreated. No backfill is written; if one is ever needed it is a standalone script, not part of this change.
- **`authProviders` remains mutable at any ceremony state, so a coordinator can narrow it mid-ceremony.** → Accepted for now. Already-enrolled participants are unaffected because the gate is only at enrollment, so narrowing cannot invalidate work in progress; it only stops new joins. Constraining whitelist mutation by ceremony state is a separate change.
- **The coordinator exemption widens what a coordinator can do relative to their own whitelist.** → Bounded to the coordinator of that specific ceremony, resolved through the existing project-ownership join. It grants a participant record, not any contribution privilege: the contribution and upload preconditions in `contributions` and `storage` are unchanged.
- **One extra ceremony read and one extra user read per enrollment.** → Both are primary-key lookups on a once-per-user-per-ceremony operation, well inside the API latency target.
