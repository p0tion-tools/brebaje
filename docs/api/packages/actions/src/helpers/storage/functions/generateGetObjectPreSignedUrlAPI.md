[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / generateGetObjectPreSignedUrlAPI

# Function: generateGetObjectPreSignedUrlAPI()

> **generateGetObjectPreSignedUrlAPI**(`accessToken`, `ceremonyId`, `objectKey`): `Promise`&lt;`string`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:448](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L448)

Return a pre-signed url for a given object contained inside the provided AWS S3 bucket in order to perform a GET request.

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

`Promise`&lt;`string`&gt;

- the pre-signed url w/ GET request permissions for specified object key.
