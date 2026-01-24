[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/cli/src/auth/token](../index.md) / validateToken

# Function: validateToken()

> **validateToken**(`tokenPath`): `object`

Defined in: [apps/cli/src/auth/token.ts:92](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/cli/src/auth/token.ts#L92)

Validates token (exists and not expired)
Returns valid boolean, jwt, and the payload user fields like displayName and provider

## Parameters

### tokenPath

`string`

## Returns

`object`

### error?

> `optional` **error**: `string`

### payload

> **payload**: [`JWTPayload`](../../declarations/interfaces/JWTPayload.md)

### token

> **token**: `string`

### valid

> **valid**: `boolean`
