[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/auth/auth.service](../index.md) / AuthService

# Class: AuthService

Defined in: [apps/backend/src/auth/auth.service.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L17)

## Constructors

### Constructor

> **new AuthService**(`jwtService`, `usersService`): `AuthService`

Defined in: [apps/backend/src/auth/auth.service.ts:23](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L23)

#### Parameters

##### jwtService

`JwtService`

##### usersService

[`UsersService`](../../../users/users.service/classes/UsersService.md)

#### Returns

`AuthService`

## Methods

### authenticateWithGithubCode()

> **authenticateWithGithubCode**(`code`, `state?`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

Defined in: [apps/backend/src/auth/auth.service.ts:218](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L218)

GitHub OAuth 2.0 Authorization Code Flow
Step 2: Exchange authorization code for access token and authenticate user

#### Parameters

##### code

`string`

##### state?

`string`

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

---

### authWithGithub()

> **authWithGithub**(`deviceFlowTokenDto`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

Defined in: [apps/backend/src/auth/auth.service.ts:124](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L124)

#### Parameters

##### deviceFlowTokenDto

[`DeviceFlowTokenDto`](../../dto/auth-dto/classes/DeviceFlowTokenDto.md)

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

---

### generateCardanoNonce()

> **generateCardanoNonce**(`userAddress`): `object`

Defined in: [apps/backend/src/auth/auth.service.ts:293](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L293)

#### Parameters

##### userAddress

`string`

#### Returns

`object`

##### nonce

> **nonce**: `string`

---

### generateEthNonce()

> **generateEthNonce**(`address`): `object`

Defined in: [apps/backend/src/auth/auth.service.ts:402](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L402)

Generates a nonce for SIWE (Sign-In with Ethereum) authentication
The nonce is stored with a timestamp and expires after 5 minutes

#### Parameters

##### address

`string`

The Ethereum wallet address (0x prefixed)

#### Returns

`object`

Object containing the generated nonce

##### nonce

> **nonce**: `string`

---

### getGithubAuthUrl()

> **getGithubAuthUrl**(): `object`

Defined in: [apps/backend/src/auth/auth.service.ts:182](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L182)

GitHub OAuth 2.0 Authorization Code Flow
Step 1: Generate authorization URL for frontend redirect

#### Returns

`object`

##### authUrl

> **authUrl**: `string`

##### state

> **state**: `string`

---

### getGithubClientId()

> **getGithubClientId**(): `object`

Defined in: [apps/backend/src/auth/auth.service.ts:28](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L28)

#### Returns

`object`

##### client_id

> **client_id**: `string` = `process.env.GITHUB_CLIENT_ID`

---

### testAuthWithUserId()

> **testAuthWithUserId**(`userId`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

Defined in: [apps/backend/src/auth/auth.service.ts:157](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L157)

Test-only authentication method
Generates JWT token for existing user without OAuth flow
Only available in test/development environments

#### Parameters

##### userId

`number`

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

---

### verifyCardanoNonce()

> **verifyCardanoNonce**(`userAddress`, `signature`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

Defined in: [apps/backend/src/auth/auth.service.ts:322](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L322)

#### Parameters

##### userAddress

`string`

##### signature

`DataSignature`

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md) \| `Error`&gt;

---

### verifyEthSignature()

> **verifyEthSignature**(`message`, `signature`): `Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

Defined in: [apps/backend/src/auth/auth.service.ts:447](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/auth/auth.service.ts#L447)

Verifies a SIWE (Sign-In with Ethereum) signature and authenticates the user
Following EIP-4361 standard

#### Parameters

##### message

`string`

The SIWE message that was signed

##### signature

`string`

The cryptographic signature from the wallet

#### Returns

`Promise`&lt;[`AuthResponseDto`](../../dto/auth-dto/interfaces/AuthResponseDto.md)&gt;

AuthResponseDto with user and JWT token
