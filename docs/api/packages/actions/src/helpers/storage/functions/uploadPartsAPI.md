[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / uploadPartsAPI

# Function: uploadPartsAPI()

> **uploadPartsAPI**(`accessToken`, `chunksWithUrls`, `contentType`, `ceremonyId`, `userId`, `creatingCeremony?`, `alreadyUploadedChunks?`, `logger?`): `Promise`&lt;[`ETagWithPartNumber`](../../../types/type-aliases/ETagWithPartNumber.md)[]&gt;

Defined in: [packages/actions/src/helpers/storage.ts:82](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L82)

Forward the request to upload each single chunk of the related ceremony artifact.

## Parameters

### accessToken

`string`

### chunksWithUrls

[`ChunkWithUrl`](../../../types/type-aliases/ChunkWithUrl.md)[]

the array containing each chunk mapped with the corresponding pre-signed urls.

### contentType

the content type of the ceremony artifact.

`string` | `false`

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### creatingCeremony?

`boolean`

### alreadyUploadedChunks?

[`ETagWithPartNumber`](../../../types/type-aliases/ETagWithPartNumber.md)[]

the temporary information about the already uploaded chunks.

### logger?

`GenericBar`

an optional logger to show progress.

## Returns

`Promise`&lt;[`ETagWithPartNumber`](../../../types/type-aliases/ETagWithPartNumber.md)[]&gt;

- the completed (uploaded) chunks information.
