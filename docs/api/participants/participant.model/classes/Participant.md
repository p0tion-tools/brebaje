[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [participants/participant.model](../index.md) / Participant

# Class: Participant

Defined in: [apps/backend/src/participants/participant.model.ts:47](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L47)

## Extends

- `Model`

## Implements

- [`ParticipantAttributes`](../interfaces/ParticipantAttributes.md)

## Constructors

### Constructor

> **new Participant**(`values?`, `options?`): `Participant`

Defined in: node\_modules/.pnpm/sequelize-typescript@2.1.6\_@types+node@22.17.0\_@types+validator@13.15.2\_reflect-metadat\_42e6ffcf5a25cd82a83d7c1ace0b3b03/node\_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`\<`any`, `string`\>

##### options?

`BuildOptions`

#### Returns

`Participant`

#### Inherited from

`Model.constructor`

## Properties

### ceremony

> **ceremony**: [`Ceremony`](../../../ceremonies/ceremony.model/classes/Ceremony.md)

Defined in: [apps/backend/src/participants/participant.model.ts:118](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L118)

***

### ceremonyId

> **ceremonyId**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:61](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L61)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`ceremonyId`](../interfaces/ParticipantAttributes.md#ceremonyid)

***

### contributionProgress?

> `optional` **contributionProgress**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:87](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L87)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`contributionProgress`](../interfaces/ParticipantAttributes.md#contributionprogress)

***

### contributions

> **contributions**: [`Contribution`](../../../contributions/contribution.model/classes/Contribution.md)[]

Defined in: [apps/backend/src/participants/participant.model.ts:121](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L121)

***

### contributionStartedAt?

> `optional` **contributionStartedAt**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:93](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L93)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`contributionStartedAt`](../interfaces/ParticipantAttributes.md#contributionstartedat)

***

### contributionStep

> **contributionStep**: [`ParticipantContributionStep`](../../../types/enums/enumerations/ParticipantContributionStep.md)

Defined in: [apps/backend/src/participants/participant.model.ts:81](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L81)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`contributionStep`](../interfaces/ParticipantAttributes.md#contributionstep)

***

### createdAt

> **createdAt**: `Date`

Defined in: [apps/backend/src/participants/participant.model.ts:48](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L48)

#### Overrides

`Model.createdAt`

***

### id

> **id**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:68](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L68)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`id`](../interfaces/ParticipantAttributes.md#id)

#### Overrides

`Model.id`

***

### status

> **status**: [`ParticipantStatus`](../../../types/enums/enumerations/ParticipantStatus.md)

Defined in: [apps/backend/src/participants/participant.model.ts:75](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L75)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`status`](../interfaces/ParticipantAttributes.md#status)

***

### tempContributionData?

> `optional` **tempContributionData**: [`TemporaryParticipantContributionData`](../../../types/type-aliases/TemporaryParticipantContributionData.md)

Defined in: [apps/backend/src/participants/participant.model.ts:105](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L105)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`tempContributionData`](../interfaces/ParticipantAttributes.md#tempcontributiondata)

***

### timeout?

> `optional` **timeout**: [`ParticipantTimeout`](../../../types/declarations/type-aliases/ParticipantTimeout.md)[]

Defined in: [apps/backend/src/participants/participant.model.ts:112](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L112)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`timeout`](../interfaces/ParticipantAttributes.md#timeout)

***

### updatedAt

> **updatedAt**: `Date`

Defined in: [apps/backend/src/participants/participant.model.ts:49](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L49)

#### Overrides

`Model.updatedAt`

***

### user

> **user**: [`User`](../../../users/user.model/classes/User.md)

Defined in: [apps/backend/src/participants/participant.model.ts:115](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L115)

***

### userId

> **userId**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:55](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L55)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`userId`](../interfaces/ParticipantAttributes.md#userid)

***

### verificationStartedAt?

> `optional` **verificationStartedAt**: `number`

Defined in: [apps/backend/src/participants/participant.model.ts:99](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participant.model.ts#L99)

#### Implementation of

[`ParticipantAttributes`](../interfaces/ParticipantAttributes.md).[`verificationStartedAt`](../interfaces/ParticipantAttributes.md#verificationstartedat)
