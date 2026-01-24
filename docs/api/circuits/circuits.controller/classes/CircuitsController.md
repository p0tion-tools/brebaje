[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [circuits/circuits.controller](../README.md) / CircuitsController

# Class: CircuitsController

Defined in: [apps/backend/src/circuits/circuits.controller.ts:10](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L10)

## Constructors

### Constructor

> **new CircuitsController**(`circuitsService`): `CircuitsController`

Defined in: [apps/backend/src/circuits/circuits.controller.ts:11](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L11)

#### Parameters

##### circuitsService

[`CircuitsService`](../../circuits.service/classes/CircuitsService.md)

#### Returns

`CircuitsController`

## Methods

### create()

> **create**(`createCircuitDto`): `Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)\>

Defined in: [apps/backend/src/circuits/circuits.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L21)

#### Parameters

##### createCircuitDto

[`CreateCircuitDto`](../../dto/create-circuit.dto/classes/CreateCircuitDto.md)

#### Returns

`Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)[]\>

Defined in: [apps/backend/src/circuits/circuits.controller.ts:28](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L28)

#### Returns

`Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)[]\>

***

### findAllByCeremonyId()

> **findAllByCeremonyId**(`ceremonyId`): `Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)[]\>

Defined in: [apps/backend/src/circuits/circuits.controller.ts:36](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L36)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md) \| `null`\>

Defined in: [apps/backend/src/circuits/circuits.controller.ts:45](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L45)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Circuit`](../../circuit.model/classes/Circuit.md) \| `null`\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/circuits/circuits.controller.ts:67](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L67)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateCircuitDto`): `string`

Defined in: [apps/backend/src/circuits/circuits.controller.ts:58](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/circuits/circuits.controller.ts#L58)

#### Parameters

##### id

`string`

##### updateCircuitDto

[`UpdateCircuitDto`](../../dto/update-circuit.dto/classes/UpdateCircuitDto.md)

#### Returns

`string`
