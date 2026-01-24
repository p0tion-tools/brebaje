[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [utils/logger](../index.md) / ScriptLogger

# Class: ScriptLogger

Defined in: [apps/backend/src/utils/logger.ts:5](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L5)

Centralized logger utility for scripts and services
Uses consistent formatting across the application

## Constructors

### Constructor

> **new ScriptLogger**(`context`): `ScriptLogger`

Defined in: [apps/backend/src/utils/logger.ts:8](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L8)

#### Parameters

##### context

`string`

#### Returns

`ScriptLogger`

## Methods

### error()

> **error**(`message`, `error?`): `void`

Defined in: [apps/backend/src/utils/logger.ts:16](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L16)

#### Parameters

##### message

`string`

##### error?

`Error`

#### Returns

`void`

***

### failure()

> **failure**(`message`): `void`

Defined in: [apps/backend/src/utils/logger.ts:31](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L31)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### log()

> **log**(`message`): `void`

Defined in: [apps/backend/src/utils/logger.ts:12](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L12)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### success()

> **success**(`message`): `void`

Defined in: [apps/backend/src/utils/logger.ts:27](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L27)

#### Parameters

##### message

`string`

#### Returns

`void`

***

### warn()

> **warn**(`message`): `void`

Defined in: [apps/backend/src/utils/logger.ts:23](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/logger.ts#L23)

#### Parameters

##### message

`string`

#### Returns

`void`
