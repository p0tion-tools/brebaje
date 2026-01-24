[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [contributions/contributions.controller](../README.md) / ContributionsController

# Class: ContributionsController

Defined in: [apps/backend/src/contributions/contributions.controller.ts:10](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L10)

## Constructors

### Constructor

> **new ContributionsController**(`contributionsService`): `ContributionsController`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:11](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L11)

#### Parameters

##### contributionsService

[`ContributionsService`](../../contributions.service/classes/ContributionsService.md)

#### Returns

`ContributionsController`

## Methods

### create()

> **create**(`createContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L21)

#### Parameters

##### createContributionDto

[`CreateContributionDto`](../../dto/create-contribution.dto/classes/CreateContributionDto.md)

#### Returns

`string`

***

### findAll()

> **findAll**(): `string`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:28](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L28)

#### Returns

`string`

***

### findOne()

> **findOne**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:37](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L37)

#### Parameters

##### id

`string`

#### Returns

`string`

***

### remove()

> **remove**(`id`): `string`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:59](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L59)

#### Parameters

##### id

`string`

#### Returns

`string`

***

### update()

> **update**(`id`, `updateContributionDto`): `string`

Defined in: [apps/backend/src/contributions/contributions.controller.ts:50](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/contributions/contributions.controller.ts#L50)

#### Parameters

##### id

`string`

##### updateContributionDto

[`UpdateContributionDto`](../../dto/update-contribution.dto/classes/UpdateContributionDto.md)

#### Returns

`string`
