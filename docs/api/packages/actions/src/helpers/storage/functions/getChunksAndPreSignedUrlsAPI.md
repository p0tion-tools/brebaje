[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / getChunksAndPreSignedUrlsAPI

# Function: getChunksAndPreSignedUrlsAPI()

> **getChunksAndPreSignedUrlsAPI**(`accessToken`, `ceremonyId`, `userId`, `objectKey`, `localFilePath`, `uploadId`, `configStreamChunkSize`): `Promise`&lt;[`ChunkWithUrl`](../../../types/type-aliases/ChunkWithUrl.md)[]&gt;

Defined in: [packages/actions/src/helpers/storage.ts:32](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L32)

Get chunks and signed urls related to an object that must be uploaded using a multi-part upload.

## Parameters

### accessToken

`string`

the access token for authentication.

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### objectKey

`string`

the unique key to identify the object inside the given AWS S3 bucket.

### localFilePath

`string`

the local path where the artifact will be downloaded.

### uploadId

`string`

the unique identifier of the multi-part upload.

### configStreamChunkSize

`number`

size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).

## Returns

`Promise`&lt;[`ChunkWithUrl`](../../../types/type-aliases/ChunkWithUrl.md)[]&gt;

- the chunks with related pre-signed url.
