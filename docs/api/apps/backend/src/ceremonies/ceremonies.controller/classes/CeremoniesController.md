[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/ceremonies/ceremonies.controller](../index.md) / CeremoniesController

# Class: CeremoniesController

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L12)

## Constructors

### Constructor

> **new CeremoniesController**(`ceremoniesService`): `CeremoniesController`

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L13)

#### Parameters

##### ceremoniesService

[`CeremoniesService`](../../ceremonies.service/classes/CeremoniesService.md)

#### Returns

`CeremoniesController`

## Methods

### create()

> **create**(`createCeremonyDto`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:26](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L26)

#### Parameters

##### createCeremonyDto

[`CreateCeremonyDto`](../../dto/create-ceremony.dto/classes/CreateCeremonyDto.md)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:33](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L33)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L42)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:64](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L64)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateCeremonyDto`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.controller.ts:55](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.controller.ts#L55)

#### Parameters

##### id

`string`

##### updateCeremonyDto

[`UpdateCeremonyDto`](../../dto/update-ceremony.dto/classes/UpdateCeremonyDto.md)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;
