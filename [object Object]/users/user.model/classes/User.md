[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [users/user.model](../README.md) / User

# Class: User

Defined in: [apps/backend/src/users/user.model.ts:30](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L30)

## Extends

- `Model`

## Implements

- [`UserAttributes`](../interfaces/UserAttributes.md)

## Constructors

### Constructor

> **new User**(`values?`, `options?`): `User`

Defined in: node\_modules/.pnpm/sequelize-typescript@2.1.6\_@types+node@22.17.0\_@types+validator@13.15.2\_reflect-metadat\_42e6ffcf5a25cd82a83d7c1ace0b3b03/node\_modules/sequelize-typescript/dist/model/model/model.d.ts:21

#### Parameters

##### values?

`Optional`\<`any`, `string`\>

##### options?

`BuildOptions`

#### Returns

`User`

#### Inherited from

`Model.constructor`

## Properties

### avatarUrl?

> `optional` **avatarUrl**: `string`

Defined in: [apps/backend/src/users/user.model.ts:68](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L68)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`avatarUrl`](../interfaces/UserAttributes.md#avatarurl)

***

### creationTime

> **creationTime**: `number`

Defined in: [apps/backend/src/users/user.model.ts:50](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L50)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`creationTime`](../interfaces/UserAttributes.md#creationtime)

***

### displayName

> **displayName**: `string`

Defined in: [apps/backend/src/users/user.model.ts:44](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L44)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`displayName`](../interfaces/UserAttributes.md#displayname)

***

### id?

> `optional` **id**: `number`

Defined in: [apps/backend/src/users/user.model.ts:37](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L37)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`id`](../interfaces/UserAttributes.md#id)

#### Overrides

`Model.id`

***

### lastSignInTime?

> `optional` **lastSignInTime**: `number`

Defined in: [apps/backend/src/users/user.model.ts:56](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L56)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`lastSignInTime`](../interfaces/UserAttributes.md#lastsignintime)

***

### lastUpdated?

> `optional` **lastUpdated**: `number`

Defined in: [apps/backend/src/users/user.model.ts:62](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L62)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`lastUpdated`](../interfaces/UserAttributes.md#lastupdated)

***

### participants

> **participants**: [`Participant`](../../../participants/participant.model/classes/Participant.md)[]

Defined in: [apps/backend/src/users/user.model.ts:87](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L87)

***

### projects

> **projects**: [`Project`](../../../projects/project.model/classes/Project.md)[]

Defined in: [apps/backend/src/users/user.model.ts:84](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L84)

***

### provider

> **provider**: [`UserProvider`](../../../types/enums/enumerations/UserProvider.md)

Defined in: [apps/backend/src/users/user.model.ts:81](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L81)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`provider`](../interfaces/UserAttributes.md#provider)

***

### walletAddress?

> `optional` **walletAddress**: `string`

Defined in: [apps/backend/src/users/user.model.ts:74](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/user.model.ts#L74)

#### Implementation of

[`UserAttributes`](../interfaces/UserAttributes.md).[`walletAddress`](../interfaces/UserAttributes.md#walletaddress)
