[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/cli/src/auth/token](../index.md) / decodeToken

# Function: decodeToken()

> **decodeToken**(`token`): [`JWTPayload`](../../declarations/interfaces/JWTPayload.md)

Defined in: [apps/cli/src/auth/token.ts:64](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/cli/src/auth/token.ts#L64)

Decodes JWT token without verification
Note: Client-side verification is not performed as we don't have access to the secret.
The backend verifies the token signature when making authenticated requests.
This function is only used to extract payload information for display purposes.

## Parameters

### token

`string`

## Returns

[`JWTPayload`](../../declarations/interfaces/JWTPayload.md)
