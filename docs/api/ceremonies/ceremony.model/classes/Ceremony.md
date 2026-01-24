[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [ceremonies/ceremony.model](../index.md) / Ceremony

# Class: Ceremony

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:26](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L26)

## Extends

- `Model`

## Implements

- [`CeremonyAttributes`](../interfaces/CeremonyAttributes.md)

## Constructors

### Constructor

> **new Ceremony**(`values?`, `options?`): `Ceremony`

Defined in: node\_modules/.pnpm/sequelize-typescript@2.1.6\_@types+node@22.17.0\_@types+validator@13.15.2\_reflect-metadat\_42e6ffcf5a25cd82a83d7c1ace0b3b03/node\_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`\<`any`, `string`\>

##### options?

`BuildOptions`

#### Returns

`Ceremony`

#### Inherited from

`Model.constructor`

## Properties

### authProviders

> **authProviders**: `object`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:85](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L85)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`authProviders`](../interfaces/CeremonyAttributes.md#authproviders)

***

### circuits

> **circuits**: [`Circuit`](../../../circuits/circuit.model/classes/Circuit.md)[]

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:91](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L91)

***

### description?

> `optional` **description**: `string`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:46](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L46)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`description`](../interfaces/CeremonyAttributes.md#description)

***

### end\_date

> **end\_date**: `number`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:72](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L72)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`end_date`](../interfaces/CeremonyAttributes.md#end_date)

***

### id?

> `optional` **id**: `number`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:39](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L39)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`id`](../interfaces/CeremonyAttributes.md#id)

#### Overrides

`Model.id`

***

### participants

> **participants**: [`Participant`](../../../participants/participant.model/classes/Participant.md)[]

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:94](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L94)

***

### penalty

> **penalty**: `number`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:78](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L78)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`penalty`](../interfaces/CeremonyAttributes.md#penalty)

***

### project

> **project**: [`Project`](../../../projects/project.model/classes/Project.md)

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:88](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L88)

***

### projectId

> **projectId**: `number`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:31](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L31)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`projectId`](../interfaces/CeremonyAttributes.md#projectid)

***

### start\_date

> **start\_date**: `number`

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:66](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L66)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`start_date`](../interfaces/CeremonyAttributes.md#start_date)

***

### state

> **state**: [`CeremonyState`](../../../types/enums/enumerations/CeremonyState.md)

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:60](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L60)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`state`](../interfaces/CeremonyAttributes.md#state)

***

### type

> **type**: [`CeremonyType`](../../../types/enums/enumerations/CeremonyType.md)

Defined in: [apps/backend/src/ceremonies/ceremony.model.ts:53](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremony.model.ts#L53)

#### Implementation of

[`CeremonyAttributes`](../interfaces/CeremonyAttributes.md).[`type`](../interfaces/CeremonyAttributes.md#type)
