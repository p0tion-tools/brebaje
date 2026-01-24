[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/projects/project.model](../index.md) / Project

# Class: Project

Defined in: [apps/backend/src/projects/project.model.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L19)

## Extends

- `Model`

## Implements

- [`ProjectAttributes`](../interfaces/ProjectAttributes.md)

## Constructors

### Constructor

> **new Project**(`values?`, `options?`): `Project`

Defined in: node*modules/.pnpm/sequelize-typescript@2.1.6*@types+node@22.17.0_@types+validator@13.15.2_reflect-metadat_42e6ffcf5a25cd82a83d7c1ace0b3b03/node_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`&lt;`any`&gt;

##### options?

`BuildOptions`

#### Returns

`Project`

#### Inherited from

`Model.constructor`

## Properties

### ceremonies

> **ceremonies**: [`Ceremony`](../../../ceremonies/ceremony.model/classes/Ceremony.md)[]

Defined in: [apps/backend/src/projects/project.model.ts:52](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L52)

---

### contact

> **contact**: `string`

Defined in: [apps/backend/src/projects/project.model.ts:40](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L40)

#### Implementation of

[`ProjectAttributes`](../interfaces/ProjectAttributes.md).[`contact`](../interfaces/ProjectAttributes.md#contact)

---

### coordinatorId

> **coordinatorId**: `number`

Defined in: [apps/backend/src/projects/project.model.ts:46](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L46)

#### Implementation of

[`ProjectAttributes`](../interfaces/ProjectAttributes.md).[`coordinatorId`](../interfaces/ProjectAttributes.md#coordinatorid)

---

### id?

> `optional` **id**: `number`

Defined in: [apps/backend/src/projects/project.model.ts:26](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L26)

#### Implementation of

[`ProjectAttributes`](../interfaces/ProjectAttributes.md).[`id`](../interfaces/ProjectAttributes.md#id)

#### Overrides

`Model.id`

---

### name

> **name**: `string`

Defined in: [apps/backend/src/projects/project.model.ts:33](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L33)

#### Implementation of

[`ProjectAttributes`](../interfaces/ProjectAttributes.md).[`name`](../interfaces/ProjectAttributes.md#name)

---

### user

> **user**: [`User`](../../../users/user.model/classes/User.md)

Defined in: [apps/backend/src/projects/project.model.ts:49](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/projects/project.model.ts#L49)
