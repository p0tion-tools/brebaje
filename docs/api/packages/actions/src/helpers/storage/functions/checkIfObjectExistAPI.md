[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / checkIfObjectExistAPI

# Function: checkIfObjectExistAPI()

> **checkIfObjectExistAPI**(`accessToken`, `ceremonyId`, `objectKey`): `Promise`&lt;`boolean`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:477](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L477)

Check if a specified object exist in a given AWS S3 bucket.

## Parameters

### accessToken

`string`

the access token for authentication.

### ceremonyId

`number`

the unique identifier of the ceremony.

### objectKey

`string`

the storage path that locates the artifact to be downloaded in the bucket.

## Returns

`Promise`&lt;`boolean`&gt;

- true if and only if the object exists, otherwise false.
