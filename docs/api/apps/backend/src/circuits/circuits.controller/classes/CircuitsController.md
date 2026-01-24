[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/circuits/circuits.controller](../index.md) / CircuitsController

# Class: CircuitsController

Defined in: [apps/backend/src/circuits/circuits.controller.ts:10](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L10)

## Constructors

### Constructor

> **new CircuitsController**(`circuitsService`): `CircuitsController`

Defined in: [apps/backend/src/circuits/circuits.controller.ts:11](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L11)

#### Parameters

##### circuitsService

[`CircuitsService`](../../circuits.service/classes/CircuitsService.md)

#### Returns

`CircuitsController`

## Methods

### create()

> **create**(`createCircuitDto`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

Defined in: [apps/backend/src/circuits/circuits.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L21)

#### Parameters

##### createCircuitDto

[`CreateCircuitDto`](../../dto/create-circuit.dto/classes/CreateCircuitDto.md)

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

Defined in: [apps/backend/src/circuits/circuits.controller.ts:28](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L28)

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

---

### findAllByCeremonyId()

> **findAllByCeremonyId**(`ceremonyId`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

Defined in: [apps/backend/src/circuits/circuits.controller.ts:36](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L36)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

Defined in: [apps/backend/src/circuits/circuits.controller.ts:45](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L45)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/circuits/circuits.controller.ts:67](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L67)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateCircuitDto`): `string`

Defined in: [apps/backend/src/circuits/circuits.controller.ts:58](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.controller.ts#L58)

#### Parameters

##### id

`string`

##### updateCircuitDto

[`UpdateCircuitDto`](../../dto/update-circuit.dto/classes/UpdateCircuitDto.md)

#### Returns

`string`
