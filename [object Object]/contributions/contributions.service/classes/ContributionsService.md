[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [contributions/contributions.service](../README.md) / ContributionsService

# Class: ContributionsService

Defined in: [apps/backend/src/contributions/contributions.service.ts:8](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L8)

## Constructors

### Constructor

> **new ContributionsService**(`contributionModel`): `ContributionsService`

Defined in: [apps/backend/src/contributions/contributions.service.ts:9](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L9)

#### Parameters

##### contributionModel

*typeof* [`Contribution`](../../contribution.model/classes/Contribution.md)

#### Returns

`ContributionsService`

## Methods

### create()

> **create**(`_createContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:14](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L14)

#### Parameters

##### \_createContributionDto

[`CreateContributionDto`](../../dto/create-contribution.dto/classes/CreateContributionDto.md)

#### Returns

`string`

***

### findAll()

> **findAll**(): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:18](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L18)

#### Returns

`string`

***

### findOne()

> **findOne**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:22](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L22)

#### Parameters

##### id

`number`

#### Returns

`string`

***

### findValidOneByCircuitIdAndParticipantId()

> **findValidOneByCircuitIdAndParticipantId**(`circuitId`, `participantId`): `Promise`\<[`Contribution`](../../contribution.model/classes/Contribution.md) \| `null`\>

Defined in: [apps/backend/src/contributions/contributions.service.ts:26](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L26)

#### Parameters

##### circuitId

`number`

##### participantId

`number`

#### Returns

`Promise`\<[`Contribution`](../../contribution.model/classes/Contribution.md) \| `null`\>

***

### remove()

> **remove**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:40](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L40)

#### Parameters

##### id

`number`

#### Returns

`string`

***

### update()

> **update**(`id`, `_updateContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.service.ts:36](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.service.ts#L36)

#### Parameters

##### id

`number`

##### \_updateContributionDto

[`UpdateContributionDto`](../../dto/update-contribution.dto/classes/UpdateContributionDto.md)

#### Returns

`string`
