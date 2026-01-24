[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [ceremonies/ceremonies.controller](../README.md) / CeremoniesController

# Class: CeremoniesController

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L12)

## Constructors

### Constructor

> **new CeremoniesController**(`ceremoniesService`): `CeremoniesController`

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L13)

#### Parameters

##### ceremoniesService

[`CeremoniesService`](../../ceremonies.service/classes/CeremoniesService.md)

#### Returns

`CeremoniesController`

## Methods

### create()

> **create**(`createCeremonyDto`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:26](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L26)

#### Parameters

##### createCeremonyDto

[`CreateCeremonyDto`](../../dto/create-ceremony.dto/classes/CreateCeremonyDto.md)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]\>

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:33](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L33)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L42)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:64](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L64)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateCeremonyDto`): `Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:55](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/ceremonies/ceremonies.controller.ts#L55)

#### Parameters

##### id

`string`

##### updateCeremonyDto

[`UpdateCeremonyDto`](../../dto/update-ceremony.dto/classes/UpdateCeremonyDto.md)

#### Returns

`Promise`\<[`Ceremony`](../../ceremony.model/classes/Ceremony.md)\>
