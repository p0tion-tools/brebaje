[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [auth/auth.controller](../README.md) / AuthController

# Class: AuthController

Defined in: [apps/backend/src/auth/auth.controller.ts:16](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L16)

## Constructors

### Constructor

> **new AuthController**(`authService`): `AuthController`

Defined in: [apps/backend/src/auth/auth.controller.ts:17](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L17)

#### Parameters

##### authService

[`AuthService`](../../auth.service/classes/AuthService.md)

#### Returns

`AuthController`

## Methods

### authorizeLogin()

> **authorizeLogin**(`code`, `res`, `state?`): `Promise`\<`void`\>

Defined in: [apps/backend/src/auth/auth.controller.ts:58](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L58)

#### Parameters

##### code

`string`

##### res

`Response`

##### state?

`string`

#### Returns

`Promise`\<`void`\>

***

### generateAuth()

> **generateAuth**(): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:47](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L47)

#### Returns

`object`

##### authUrl

> **authUrl**: `string`

##### state

> **state**: `string`

***

### generateCardanoNonce()

> **generateCardanoNonce**(`generateNonceDto`): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:92](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L92)

#### Parameters

##### generateNonceDto

[`GenerateNonceDto`](../-internal-/classes/GenerateNonceDto.md)

#### Returns

`object`

##### nonce

> **nonce**: `string`

***

### generateEthNonce()

> **generateEthNonce**(`generateEthNonceDto`): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:149](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L149)

#### Parameters

##### generateEthNonceDto

[`GenerateEthNonceDto`](../-internal-/classes/GenerateEthNonceDto.md)

#### Returns

`object`

##### nonce

> **nonce**: `string`

***

### getGithubClientId()

> **getGithubClientId**(): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L22)

#### Returns

`object`

##### client\_id

> **client\_id**: `string` \| `undefined` = `process.env.GITHUB_CLIENT_ID`

***

### githubUser()

> **githubUser**(`deviceFlowTokenDto`): `Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md) \| `Error`\>

Defined in: [apps/backend/src/auth/auth.controller.ts:30](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L30)

#### Parameters

##### deviceFlowTokenDto

[`DeviceFlowTokenDto`](../../auth.service/-internal-/classes/DeviceFlowTokenDto.md)

#### Returns

`Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md) \| `Error`\>

***

### testLogin()

> **testLogin**(`body`): `Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md)\>

Defined in: [apps/backend/src/auth/auth.controller.ts:132](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L132)

#### Parameters

##### body

[`TestLoginDto`](../-internal-/classes/TestLoginDto.md)

#### Returns

`Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md)\>

***

### verifyCardanoSignature()

> **verifyCardanoSignature**(`verifySignatureDto`): `Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md) \| `Error`\>

Defined in: [apps/backend/src/auth/auth.controller.ts:111](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L111)

#### Parameters

##### verifySignatureDto

[`VerifySignatureDto`](../-internal-/classes/VerifySignatureDto.md)

#### Returns

`Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md) \| `Error`\>

***

### verifyEthSignature()

> **verifyEthSignature**(`verifyEthSignatureDto`): `Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md)\>

Defined in: [apps/backend/src/auth/auth.controller.ts:167](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/auth/auth.controller.ts#L167)

#### Parameters

##### verifyEthSignatureDto

[`VerifyEthSignatureDto`](../-internal-/classes/VerifyEthSignatureDto.md)

#### Returns

`Promise`\<[`AuthResponseDto`](../../auth.service/-internal-/interfaces/AuthResponseDto.md)\>
