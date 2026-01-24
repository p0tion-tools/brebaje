[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [projects/projects.controller](../index.md) / ProjectsController

# Class: ProjectsController

Defined in: [apps/backend/src/projects/projects.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L21)

## Constructors

### Constructor

> **new ProjectsController**(`projectsService`): `ProjectsController`

Defined in: [apps/backend/src/projects/projects.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L22)

#### Parameters

##### projectsService

[`ProjectsService`](../../projects.service/classes/ProjectsService.md)

#### Returns

`ProjectsController`

## Methods

### create()

> **create**(`req`, `createProjectDto`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.controller.ts:35](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L35)

#### Parameters

##### req

[`AuthenticatedRequest`](../../../auth/guards/jwt-auth.guard/interfaces/AuthenticatedRequest.md)

##### createProjectDto

[`CreateProjectDto`](../../dto/create-project.dto/classes/CreateProjectDto.md)

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`Project`](../../project.model/classes/Project.md)[]\>

Defined in: [apps/backend/src/projects/projects.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L42)

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.controller.ts:51](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L51)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/projects/projects.controller.ts:73](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L73)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateProjectDto`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.controller.ts:64](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/projects/projects.controller.ts#L64)

#### Parameters

##### id

`string`

##### updateProjectDto

[`UpdateProjectDto`](../../dto/update-project.dto/classes/UpdateProjectDto.md)

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>
