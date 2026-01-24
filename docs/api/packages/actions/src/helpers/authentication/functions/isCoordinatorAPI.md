[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/authentication](../index.md) / isCoordinatorAPI

# Function: isCoordinatorAPI()

> **isCoordinatorAPI**(`accessToken`, `ceremonyId`): `Promise`&lt;`boolean`&gt;

Defined in: [packages/actions/src/helpers/authentication.ts:7](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/authentication.ts#L7)

Checks if the user is a coordinator for a specific ceremony.

## Parameters

### accessToken

`string`

The authentication token.

### ceremonyId

`number`

The ID of the ceremony.

## Returns

`Promise`&lt;`boolean`&gt;

A promise that resolves to a boolean indicating if the user is a coordinator.
