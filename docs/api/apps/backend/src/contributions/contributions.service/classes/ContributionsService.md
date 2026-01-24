[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/contributions/contributions.service](../index.md) / ContributionsService

# Class: ContributionsService

Defined in: [apps/backend/src/contributions/contributions.service.ts:8](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L8)

## Constructors

### Constructor

> **new ContributionsService**(`contributionModel`): `ContributionsService`

Defined in: [apps/backend/src/contributions/contributions.service.ts:9](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L9)

#### Parameters

##### contributionModel

_typeof_ [`Contribution`](../../contribution.model/classes/Contribution.md)

#### Returns

`ContributionsService`

## Methods

### create()

> **create**(`_createContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:14](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L14)

#### Parameters

##### \_createContributionDto

[`CreateContributionDto`](../../dto/create-contribution.dto/classes/CreateContributionDto.md)

#### Returns

`string`

---

### findAll()

> **findAll**(): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:18](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L18)

#### Returns

`string`

---

### findOne()

> **findOne**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:22](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L22)

#### Parameters

##### id

`number`

#### Returns

`string`

---

### findValidOneByCircuitIdAndParticipantId()

> **findValidOneByCircuitIdAndParticipantId**(`circuitId`, `participantId`): `Promise`&lt;[`Contribution`](../../contribution.model/classes/Contribution.md)&gt;

Defined in: [apps/backend/src/contributions/contributions.service.ts:26](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L26)

#### Parameters

##### circuitId

`number`

##### participantId

`number`

#### Returns

`Promise`&lt;[`Contribution`](../../contribution.model/classes/Contribution.md)&gt;

---

### remove()

> **remove**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:40](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L40)

#### Parameters

##### id

`number`

#### Returns

`string`

---

### update()

> **update**(`id`, `_updateContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:36](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/contributions/contributions.service.ts#L36)

#### Parameters

##### id

`number`

##### \_updateContributionDto

[`UpdateContributionDto`](../../dto/update-contribution.dto/classes/UpdateContributionDto.md)

#### Returns

`string`
