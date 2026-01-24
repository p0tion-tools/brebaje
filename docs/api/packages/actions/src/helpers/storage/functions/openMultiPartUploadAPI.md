[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / openMultiPartUploadAPI

# Function: openMultiPartUploadAPI()

> **openMultiPartUploadAPI**(`objectKey`, `ceremonyId`, `userId`, `token`): `Promise`&lt;\{ `uploadId`: `string`; \}&gt;

Defined in: [packages/actions/src/helpers/storage.ts:272](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L272)

Start a new multi-part upload for a specific object in the given AWS S3 bucket.

## Parameters

### objectKey

`string`

the storage path that locates the artifact to be downloaded in the bucket.

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### token

`string`

## Returns

`Promise`&lt;\{ `uploadId`: `string`; \}&gt;

- the multi-part upload id.
