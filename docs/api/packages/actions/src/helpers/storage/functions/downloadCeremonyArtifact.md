[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / downloadCeremonyArtifact

# Function: downloadCeremonyArtifact()

> **downloadCeremonyArtifact**(`accessToken`, `ceremonyId`, `storagePath`, `localPath`): `Promise`&lt;`void`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:504](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L504)

Download an artifact from S3 (only for authorized users)

## Parameters

### accessToken

`string`

the access token for authentication.

### ceremonyId

`number`

the unique identifier of the ceremony.

### storagePath

`string`

Path to the artifact in the bucket.

### localPath

`string`

Path to the local file where the artifact will be saved.

## Returns

`Promise`&lt;`void`&gt;
