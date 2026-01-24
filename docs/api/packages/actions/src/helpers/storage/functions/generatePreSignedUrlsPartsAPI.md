[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / generatePreSignedUrlsPartsAPI

# Function: generatePreSignedUrlsPartsAPI()

> **generatePreSignedUrlsPartsAPI**(`objectKey`, `uploadId`, `numberOfParts`, `ceremonyId`, `userId`, `token`): `Promise`&lt;\{ `parts`: `string`[]; \}&gt;

Defined in: [packages/actions/src/helpers/storage.ts:235](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L235)

Generate a new pre-signed url for each chunk related to a started multi-part upload.

## Parameters

### objectKey

`string`

the storage path that locates the artifact to be downloaded in the bucket.

### uploadId

`string`

the unique identifier of the multi-part upload.

### numberOfParts

`number`

### ceremonyId

`number`

the unique identifier of the ceremony.

### userId

`number`

the unique identifier of the user.

### token

`string`

## Returns

`Promise`&lt;\{ `parts`: `string`[]; \}&gt;

- the set of pre-signed urls (one for each chunk).
