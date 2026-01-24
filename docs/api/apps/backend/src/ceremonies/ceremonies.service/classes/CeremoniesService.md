[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/ceremonies/ceremonies.service](../index.md) / CeremoniesService

# Class: CeremoniesService

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L19)

## Constructors

### Constructor

> **new CeremoniesService**(`ceremonyModel`): `CeremoniesService`

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:20](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L20)

#### Parameters

##### ceremonyModel

_typeof_ [`Ceremony`](../../ceremony.model/classes/Ceremony.md)

#### Returns

`CeremoniesService`

## Methods

### create()

> **create**(`createCeremonyDto`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L25)

#### Parameters

##### createCeremonyDto

[`CreateCeremonyDto`](../../dto/create-ceremony.dto/classes/CreateCeremonyDto.md)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:43](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L43)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)[]&gt;

---

### findCoordinatorOfCeremony()

> **findCoordinatorOfCeremony**(`userId`, `ceremonyId`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:63](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L63)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:51](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L51)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

---

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:107](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L107)

#### Parameters

##### error

`Error`

#### Returns

`never`

---

### isCoordinator()

> **isCoordinator**(`userId`, `ceremonyId`): `Promise`&lt;\{ `isCoordinator`: `boolean`; \}&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:76](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L76)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`&lt;\{ `isCoordinator`: `boolean`; \}&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:94](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L94)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateCeremonyDto`): `Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;

Defined in: [apps/backend/src/ceremonies/ceremonies.service.ts:81](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/ceremonies/ceremonies.service.ts#L81)

#### Parameters

##### id

`number`

##### updateCeremonyDto

[`UpdateCeremonyDto`](../../dto/update-ceremony.dto/classes/UpdateCeremonyDto.md)

#### Returns

`Promise`&lt;[`Ceremony`](../../ceremony.model/classes/Ceremony.md)&gt;
