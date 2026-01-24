[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/cli/src/auth/token](../index.md) / storeToken

# Function: storeToken()

> **storeToken**(`jwt`, `tokenPath`): `void`

Defined in: [apps/cli/src/auth/token.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/cli/src/auth/token.ts#L19)

Stores JWT token to file
Note: File is created with 0600 permissions (read/write for owner only).
Ensure the parent directory also has secure permissions via umask or manual setting.

## Parameters

### jwt

`string`

### tokenPath

`string`

## Returns

`void`
