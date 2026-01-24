[**Brebaje Backend API v0.0.1**](../../../../README.md)

***

[Brebaje Backend API](../../../../README.md) / [projects/guards/is-project-coordinator.guard](../README.md) / IsProjectCoordinatorGuard

# Class: IsProjectCoordinatorGuard

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:19](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L19)

Guard to verify that the authenticated user is the coordinator of the project
specified in the request body.

This guard should be used after JwtAuthGuard to ensure the user is authenticated.
It checks if the user's ID matches the coordinatorId of the project.

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new IsProjectCoordinatorGuard**(`projectsService`): `IsProjectCoordinatorGuard`

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:20](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L20)

#### Parameters

##### projectsService

[`ProjectsService`](../../../projects.service/classes/ProjectsService.md)

#### Returns

`IsProjectCoordinatorGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`\<`boolean`\>

Defined in: [apps/backend/src/projects/guards/is-project-coordinator.guard.ts:22](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/guards/is-project-coordinator.guard.ts#L22)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`Promise`\<`boolean`\>

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
