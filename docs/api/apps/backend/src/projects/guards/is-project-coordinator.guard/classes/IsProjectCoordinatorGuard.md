[**Brebaje Documentation**](../../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../../index.md) / [apps/backend/src/projects/guards/is-project-coordinator.guard](../index.md) / IsProjectCoordinatorGuard

# Class: IsProjectCoordinatorGuard

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L19)

Guard to verify that the authenticated user is the coordinator of the project
specified in the request body.

This guard should be used after JwtAuthGuard to ensure the user is authenticated.
It checks if the user's ID matches the coordinatorId of the project.

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new IsProjectCoordinatorGuard**(`projectsService`): `IsProjectCoordinatorGuard`

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:20](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L20)

#### Parameters

##### projectsService

[`ProjectsService`](../../../projects.service/classes/ProjectsService.md)

#### Returns

`IsProjectCoordinatorGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`&lt;`boolean`&gt;

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:22](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L22)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`Promise`&lt;`boolean`&gt;

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
