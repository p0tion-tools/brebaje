[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/projects/projects.service](../index.md) / ProjectsService

# Class: ProjectsService

Defined in: [apps/backend/src/projects/projects.service.ts:18](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L18)

## Constructors

### Constructor

> **new ProjectsService**(`projectModel`): `ProjectsService`

Defined in: [apps/backend/src/projects/projects.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L19)

#### Parameters

##### projectModel

_typeof_ [`Project`](../../project.model/classes/Project.md)

#### Returns

`ProjectsService`

## Methods

### create()

> **create**(`createProjectDto`, `coordinatorId`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.service.ts:31](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L31)

Creates a new project.

#### Parameters

##### createProjectDto

[`CreateProjectDto`](../../dto/create-project.dto/classes/CreateProjectDto.md)

The project data

##### coordinatorId

`number`

The ID of the authenticated user creating the project

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

The created project

---

### findAll()

> **findAll**(): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)[]&gt;

Defined in: [apps/backend/src/projects/projects.service.ts:44](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L44)

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.service.ts:52](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L52)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

---

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/projects/projects.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L90)

#### Parameters

##### error

`Error`

#### Returns

`never`

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/projects/projects.service.ts:77](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L77)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateProjectDto`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.service.ts:64](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.service.ts#L64)

#### Parameters

##### id

`number`

##### updateProjectDto

[`UpdateProjectDto`](../../dto/update-project.dto/classes/UpdateProjectDto.md)

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;
