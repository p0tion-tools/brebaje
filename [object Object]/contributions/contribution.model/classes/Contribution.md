[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [contributions/contribution.model](../README.md) / Contribution

# Class: Contribution

Defined in: [apps/backend/src/contributions/contribution.model.ts:40](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L40)

## Extends

- `Model`

## Implements

- [`ContributionAttributes`](../interfaces/ContributionAttributes.md)

## Constructors

### Constructor

> **new Contribution**(`values?`, `options?`): `Contribution`

Defined in: node\_modules/.pnpm/sequelize-typescript@2.1.6\_@types+node@22.17.0\_@types+validator@13.15.2\_reflect-metadat\_42e6ffcf5a25cd82a83d7c1ace0b3b03/node\_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`\<`any`, `string`\>

##### options?

`BuildOptions`

#### Returns

`Contribution`

#### Inherited from

`Model.constructor`

## Properties

### beacon?

> `optional` **beacon**: `object`

Defined in: [apps/backend/src/contributions/contribution.model.ts:113](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L113)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`beacon`](../interfaces/ContributionAttributes.md#beacon)

***

### circuit

> **circuit**: [`Circuit`](../../../circuits/circuit.model/classes/Circuit.md)

Defined in: [apps/backend/src/contributions/contribution.model.ts:116](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L116)

***

### circuitId

> **circuitId**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:45](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L45)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`circuitId`](../interfaces/ContributionAttributes.md#circuitid)

***

### contributionComputationTime?

> `optional` **contributionComputationTime**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:65](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L65)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`contributionComputationTime`](../interfaces/ContributionAttributes.md#contributioncomputationtime)

***

### files?

> `optional` **files**: `object`

Defined in: [apps/backend/src/contributions/contribution.model.ts:101](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L101)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`files`](../interfaces/ContributionAttributes.md#files)

***

### fullContributionTime?

> `optional` **fullContributionTime**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:71](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L71)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`fullContributionTime`](../interfaces/ContributionAttributes.md#fullcontributiontime)

***

### id?

> `optional` **id**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:59](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L59)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`id`](../interfaces/ContributionAttributes.md#id)

#### Overrides

`Model.id`

***

### lastUpdated?

> `optional` **lastUpdated**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:95](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L95)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`lastUpdated`](../interfaces/ContributionAttributes.md#lastupdated)

***

### participant

> **participant**: [`Participant`](../../../participants/participant.model/classes/Participant.md)

Defined in: [apps/backend/src/contributions/contribution.model.ts:119](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L119)

***

### participantId

> **participantId**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:51](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L51)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`participantId`](../interfaces/ContributionAttributes.md#participantid)

***

### valid?

> `optional` **valid**: `boolean`

Defined in: [apps/backend/src/contributions/contribution.model.ts:89](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L89)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`valid`](../interfaces/ContributionAttributes.md#valid)

***

### verificationSoftware?

> `optional` **verificationSoftware**: `object`

Defined in: [apps/backend/src/contributions/contribution.model.ts:107](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L107)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`verificationSoftware`](../interfaces/ContributionAttributes.md#verificationsoftware)

***

### verifyContributionTime?

> `optional` **verifyContributionTime**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:77](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L77)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`verifyContributionTime`](../interfaces/ContributionAttributes.md#verifycontributiontime)

***

### zkeyIndex?

> `optional` **zkeyIndex**: `number`

Defined in: [apps/backend/src/contributions/contribution.model.ts:83](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/contributions/contribution.model.ts#L83)

#### Implementation of

[`ContributionAttributes`](../interfaces/ContributionAttributes.md).[`zkeyIndex`](../interfaces/ContributionAttributes.md#zkeyindex)
