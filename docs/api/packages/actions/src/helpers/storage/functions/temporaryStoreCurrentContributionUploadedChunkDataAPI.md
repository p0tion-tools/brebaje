[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / temporaryStoreCurrentContributionUploadedChunkDataAPI

# Function: temporaryStoreCurrentContributionUploadedChunkDataAPI()

> **temporaryStoreCurrentContributionUploadedChunkDataAPI**(`ceremonyId`, `userId`, `token`, `chunk`): `Promise`&lt;`boolean`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:195](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L195)

Write temporary information about the etags and part numbers for each uploaded chunk in order to make the upload resumable from last chunk.

## Parameters

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### token

`string`

### chunk

[`ETagWithPartNumber`](../../../types/type-aliases/ETagWithPartNumber.md)

the information about the already uploaded chunk.

## Returns

`Promise`&lt;`boolean`&gt;
