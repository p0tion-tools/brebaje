[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [ceremonies/ceremonies.service](../index.md) / CeremoniesService

# Class: CeremoniesService

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L19)

## Constructors

### Constructor

> **new CeremoniesService**(`ceremonyModel`): `CeremoniesService`

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:20](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L20)

#### Parameters

##### ceremonyModel

*typeof* [`Ceremony`](../../ceremony.model/classes/Ceremony.md)

#### Returns

`CeremoniesService`

## Methods

### create()

> **create**(`createCeremonyDto`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L25)

#### Parameters

##### createCeremonyDto

[`CreateCeremonyDto`](../../dto/create-ceremony.dto/classes/CreateCeremonyDto.md)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:43](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L43)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]\>

***

### findCoordinatorOfCeremony()

> **findCoordinatorOfCeremony**(`userId`, `ceremonyId`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md) \| `null`\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:63](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L63)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md) \| `null`\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:51](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L51)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

***

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:107](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L107)

#### Parameters

##### error

`Error`

#### Returns

`never`

***

### isCoordinator()

> **isCoordinator**(`userId`, `ceremonyId`): `Promise`\<\{ `isCoordinator`: `boolean`; \}\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:76](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L76)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`\<\{ `isCoordinator`: `boolean`; \}\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:94](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L94)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateCeremonyDto`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:81](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.service.ts#L81)

#### Parameters

##### id

`number`

##### updateCeremonyDto

[`UpdateCeremonyDto`](../../dto/update-ceremony.dto/classes/UpdateCeremonyDto.md)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>
