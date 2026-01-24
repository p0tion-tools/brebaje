[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [projects/projects.service](../README.md) / ProjectsService

# Class: ProjectsService

Defined in: [apps/backend/src/projects/projects.service.ts:18](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L18)

## Constructors

### Constructor

> **new ProjectsService**(`projectModel`): `ProjectsService`

Defined in: [apps/backend/src/projects/projects.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L19)

#### Parameters

##### projectModel

*typeof* [`Project`](../../project.model/classes/Project.md)

#### Returns

`ProjectsService`

## Methods

### create()

> **create**(`createProjectDto`, `coordinatorId`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.service.ts:31](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L31)

Creates a new project.

#### Parameters

##### createProjectDto

[`CreateProjectDto`](../../dto/create-project.dto/classes/CreateProjectDto.md)

The project data

##### coordinatorId

`number`

The ID of the authenticated user creating the project

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>

The created project

***

### findAll()

> **findAll**(): `Promise`\<[`Project`](../../project.model/classes/Project.md)[]\>

Defined in: [apps/backend/src/projects/projects.service.ts:44](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L44)

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.service.ts:52](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L52)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>

***

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/projects/projects.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L90)

#### Parameters

##### error

`Error`

#### Returns

`never`

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/projects/projects.service.ts:77](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L77)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateProjectDto`): `Promise`\<[`Project`](../../project.model/classes/Project.md)\>

Defined in: [apps/backend/src/projects/projects.service.ts:64](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/projects/projects.service.ts#L64)

#### Parameters

##### id

`number`

##### updateProjectDto

[`UpdateProjectDto`](../../dto/update-project.dto/classes/UpdateProjectDto.md)

#### Returns

`Promise`\<[`Project`](../../project.model/classes/Project.md)\>
