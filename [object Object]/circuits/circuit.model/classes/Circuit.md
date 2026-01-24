[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [circuits/circuit.model](../README.md) / Circuit

# Class: Circuit

Defined in: [apps/backend/src/circuits/circuit.model.ts:53](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L53)

## Extends

- `Model`

## Implements

- [`CircuitAttributes`](../interfaces/CircuitAttributes.md)

## Constructors

### Constructor

> **new Circuit**(`values?`, `options?`): `Circuit`

Defined in: node\_modules/.pnpm/sequelize-typescript@2.1.6\_@types+node@22.17.0\_@types+validator@13.15.2\_reflect-metadat\_42e6ffcf5a25cd82a83d7c1ace0b3b03/node\_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`\<`any`, `string`\>

##### options?

`BuildOptions`

#### Returns

`Circuit`

#### Inherited from

`Model.constructor`

## Properties

### artifacts

> **artifacts**: [`CircuitArtifactsType`](../../../types/declarations/type-aliases/CircuitArtifactsType.md)

Defined in: [apps/backend/src/circuits/circuit.model.ts:187](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L187)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`artifacts`](../interfaces/CircuitAttributes.md#artifacts)

***

### averageContributionComputationTime?

> `optional` **averageContributionComputationTime**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:124](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L124)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`averageContributionComputationTime`](../interfaces/CircuitAttributes.md#averagecontributioncomputationtime)

***

### averageFullContributionTime?

> `optional` **averageFullContributionTime**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:130](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L130)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`averageFullContributionTime`](../interfaces/CircuitAttributes.md#averagefullcontributiontime)

***

### averageVerifyContributionTime?

> `optional` **averageVerifyContributionTime**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:136](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L136)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`averageVerifyContributionTime`](../interfaces/CircuitAttributes.md#averageverifycontributiontime)

***

### ceremony

> **ceremony**: [`Ceremony`](../../../ceremonies/ceremony.model/classes/Ceremony.md)

Defined in: [apps/backend/src/circuits/circuit.model.ts:202](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L202)

***

### ceremonyId

> **ceremonyId**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:61](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L61)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`ceremonyId`](../interfaces/CircuitAttributes.md#ceremonyid)

***

### compiler?

> `optional` **compiler**: `object`

Defined in: [apps/backend/src/circuits/circuit.model.ts:169](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L169)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`compiler`](../interfaces/CircuitAttributes.md#compiler)

***

### completedContributions

> **completedContributions**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:143](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L143)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`completedContributions`](../interfaces/CircuitAttributes.md#completedcontributions)

***

### constraints?

> `optional` **constraints**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:112](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L112)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`constraints`](../interfaces/CircuitAttributes.md#constraints)

***

### contributions

> **contributions**: [`Contribution`](../../../contributions/contribution.model/classes/Contribution.md)[]

Defined in: [apps/backend/src/circuits/circuit.model.ts:205](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L205)

***

### contributors?

> `optional` **contributors**: `number`[]

Defined in: [apps/backend/src/circuits/circuit.model.ts:163](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L163)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`contributors`](../interfaces/CircuitAttributes.md#contributors)

***

### createdAt

> **createdAt**: `Date`

Defined in: [apps/backend/src/circuits/circuit.model.ts:54](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L54)

#### Overrides

`Model.createdAt`

***

### currentContributor?

> `optional` **currentContributor**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:156](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L156)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`currentContributor`](../interfaces/CircuitAttributes.md#currentcontributor)

***

### dynamicThreshold?

> `optional` **dynamicThreshold**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:88](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L88)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`dynamicThreshold`](../interfaces/CircuitAttributes.md#dynamicthreshold)

***

### failedContributions

> **failedContributions**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:150](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L150)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`failedContributions`](../interfaces/CircuitAttributes.md#failedcontributions)

***

### files?

> `optional` **files**: `object`

Defined in: [apps/backend/src/circuits/circuit.model.ts:199](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L199)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`files`](../interfaces/CircuitAttributes.md#files)

***

### fixedTimeWindow?

> `optional` **fixedTimeWindow**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:94](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L94)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`fixedTimeWindow`](../interfaces/CircuitAttributes.md#fixedtimewindow)

***

### id

> **id**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:69](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L69)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`id`](../interfaces/CircuitAttributes.md#id)

#### Overrides

`Model.id`

***

### metadata?

> `optional` **metadata**: `object`

Defined in: [apps/backend/src/circuits/circuit.model.ts:193](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L193)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`metadata`](../interfaces/CircuitAttributes.md#metadata)

***

### name

> **name**: `string`

Defined in: [apps/backend/src/circuits/circuit.model.ts:75](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L75)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`name`](../interfaces/CircuitAttributes.md#name)

***

### pot?

> `optional` **pot**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:118](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L118)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`pot`](../interfaces/CircuitAttributes.md#pot)

***

### sequencePosition

> **sequencePosition**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:100](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L100)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`sequencePosition`](../interfaces/CircuitAttributes.md#sequenceposition)

***

### template?

> `optional` **template**: `object`

Defined in: [apps/backend/src/circuits/circuit.model.ts:175](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L175)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`template`](../interfaces/CircuitAttributes.md#template)

***

### timeoutMechanismType

> **timeoutMechanismType**: [`CircuitTimeoutType`](../../../types/enums/enumerations/CircuitTimeoutType.md)

Defined in: [apps/backend/src/circuits/circuit.model.ts:82](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L82)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`timeoutMechanismType`](../interfaces/CircuitAttributes.md#timeoutmechanismtype)

***

### updatedAt

> **updatedAt**: `Date`

Defined in: [apps/backend/src/circuits/circuit.model.ts:55](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L55)

#### Overrides

`Model.updatedAt`

***

### verification

> **verification**: [`CircuitVerificationType`](../../../types/declarations/type-aliases/CircuitVerificationType.md)

Defined in: [apps/backend/src/circuits/circuit.model.ts:181](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L181)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`verification`](../interfaces/CircuitAttributes.md#verification)

***

### zKeySizeInBytes?

> `optional` **zKeySizeInBytes**: `number`

Defined in: [apps/backend/src/circuits/circuit.model.ts:106](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/circuits/circuit.model.ts#L106)

#### Implementation of

[`CircuitAttributes`](../interfaces/CircuitAttributes.md).[`zKeySizeInBytes`](../interfaces/CircuitAttributes.md#zkeysizeinbytes)
