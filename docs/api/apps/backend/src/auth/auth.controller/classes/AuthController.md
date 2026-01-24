[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/auth/auth.controller](../index.md) / AuthController

# Class: AuthController

Defined in: [apps/backend/src/auth/auth.controller.ts:16](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L16)

## Constructors

### Constructor

> **new AuthController**(`authService`): `AuthController`

Defined in: [apps/backend/src/auth/auth.controller.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L17)

#### Parameters

##### authService

[`AuthService`](../../auth.service/classes/AuthService.md)

#### Returns

`AuthController`

## Methods

### authorizeLogin()

> **authorizeLogin**(`code`, `res`, `state?`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/auth/auth.controller.ts:58](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L58)

#### Parameters

##### code

`string`

##### res

`Response`

##### state?

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### generateAuth()

> **generateAuth**(): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:47](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L47)

#### Returns

`object`

##### authUrl

> **authUrl**: `string`

##### state

> **state**: `string`

---

### generateCardanoNonce()

> **generateCardanoNonce**(`generateNonceDto`): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:92](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L92)

#### Parameters

##### generateNonceDto

[`GenerateNonceDto`](../../dto/auth-dto/classes/GenerateNonceDto.md)

#### Returns

`object`

##### nonce

> **nonce**: `string`

---

### generateEthNonce()

> **generateEthNonce**(`generateEthNonceDto`): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:149](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L149)

#### Parameters

##### generateEthNonceDto

[`GenerateEthNonceDto`](../../dto/auth-dto/classes/GenerateEthNonceDto.md)

#### Returns

`object`

##### nonce

> **nonce**: `string`

---

### getGithubClientId()

> **getGithubClientId**(): `object`

Defined in: [apps/backend/src/auth/auth.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L22)

#### Returns

`object`

##### client_id

> **client_id**: `string` = `process.env.GITHUB_CLIENT_ID`

---

### githubUser()

> **githubUser**(`deviceFlowTokenDto`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

Defined in: [apps/backend/src/auth/auth.controller.ts:30](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L30)

#### Parameters

##### deviceFlowTokenDto

[`DeviceFlowTokenDto`](../../dto/auth-dto/classes/DeviceFlowTokenDto.md)

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

---

### testLogin()

> **testLogin**(`body`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

Defined in: [apps/backend/src/auth/auth.controller.ts:132](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L132)

#### Parameters

##### body

[`TestLoginDto`](../../dto/auth-dto/classes/TestLoginDto.md)

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

---

### verifyCardanoSignature()

> **verifyCardanoSignature**(`verifySignatureDto`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

Defined in: [apps/backend/src/auth/auth.controller.ts:111](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L111)

#### Parameters

##### verifySignatureDto

[`VerifySignatureDto`](../../dto/auth-dto/classes/VerifySignatureDto.md)

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

---

### verifyEthSignature()

> **verifyEthSignature**(`verifyEthSignatureDto`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

Defined in: [apps/backend/src/auth/auth.controller.ts:167](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.controller.ts#L167)

#### Parameters

##### verifyEthSignatureDto

[`VerifyEthSignatureDto`](../../dto/auth-dto/classes/VerifyEthSignatureDto.md)

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;
