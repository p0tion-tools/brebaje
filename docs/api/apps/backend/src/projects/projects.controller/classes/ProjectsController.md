[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/projects/projects.controller](../index.md) / ProjectsController

# Class: ProjectsController

Defined in: [apps/backend/src/projects/projects.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L21)

## Constructors

### Constructor

> **new ProjectsController**(`projectsService`): `ProjectsController`

Defined in: [apps/backend/src/projects/projects.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L22)

#### Parameters

##### projectsService

[`ProjectsService`](../../projects.service/classes/ProjectsService.md)

#### Returns

`ProjectsController`

## Methods

### create()

> **create**(`req`, `createProjectDto`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.controller.ts:35](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L35)

#### Parameters

##### req

[`AuthenticatedRequest`](../../../auth/guards/jwt-auth.guard/interfaces/AuthenticatedRequest.md)

##### createProjectDto

[`CreateProjectDto`](../../dto/create-project.dto/classes/CreateProjectDto.md)

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)[]&gt;

Defined in: [apps/backend/src/projects/projects.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L42)

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.controller.ts:51](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L51)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/projects/projects.controller.ts:73](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L73)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateProjectDto`): `Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;

Defined in: [apps/backend/src/projects/projects.controller.ts:64](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/projects.controller.ts#L64)

#### Parameters

##### id

`string`

##### updateProjectDto

[`UpdateProjectDto`](../../dto/update-project.dto/classes/UpdateProjectDto.md)

#### Returns

`Promise`&lt;[`Project`](../../project.model/classes/Project.md)&gt;
