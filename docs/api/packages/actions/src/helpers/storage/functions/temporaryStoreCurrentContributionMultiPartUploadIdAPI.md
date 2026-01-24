[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / temporaryStoreCurrentContributionMultiPartUploadIdAPI

# Function: temporaryStoreCurrentContributionMultiPartUploadIdAPI()

> **temporaryStoreCurrentContributionMultiPartUploadIdAPI**(`ceremonyId`, `userId`, `uploadId`, `token`): `Promise`&lt;`void`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:320](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L320)

Write temporary information about the unique identifier about the opened multi-part upload to eventually resume the contribution.

## Parameters

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### uploadId

`string`

the unique identifier of the multi-part upload.

### token

`string`

## Returns

`Promise`&lt;`void`&gt;
