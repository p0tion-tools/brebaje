[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / completeMultiPartUploadAPI

# Function: completeMultiPartUploadAPI()

> **completeMultiPartUploadAPI**(`ceremonyId`, `userId`, `token`, `objectKey`, `uploadId`, `parts`): `Promise`&lt;\{ `location`: `string`; \}&gt;

Defined in: [packages/actions/src/helpers/storage.ts:160](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L160)

Complete a multi-part upload for a specific object in the given AWS S3 bucket.

## Parameters

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### token

`string`

### objectKey

`string`

the storage path that locates the artifact to be downloaded in the bucket.

### uploadId

`string`

the unique identifier of the multi-part upload.

### parts

[`ETagWithPartNumber`](../../../types/type-aliases/ETagWithPartNumber.md)[]

the completed .

## Returns

`Promise`&lt;\{ `location`: `string`; \}&gt;

- the location of the uploaded ceremony artifact.
