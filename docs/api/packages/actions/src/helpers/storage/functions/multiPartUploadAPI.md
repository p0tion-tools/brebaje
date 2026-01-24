[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/storage](../index.md) / multiPartUploadAPI

# Function: multiPartUploadAPI()

> **multiPartUploadAPI**(`accessToken`, `ceremonyId`, `userId`, `objectKey`, `localFilePath`, `configStreamChunkSize`, `creatingCeremony?`, `temporaryDataToResumeMultiPartUpload?`, `logger?`): `Promise`&lt;`void`&gt;

Defined in: [packages/actions/src/helpers/storage.ts:368](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/storage.ts#L368)

Upload a ceremony artifact to the corresponding bucket.
this method implements the multi-part upload using pre-signed urls, optimal for large files.
Steps: 0) Check if current contributor could resume a multi-part upload.
0.A) If yes, continue from last uploaded chunk using the already opened multi-part upload.
0.B) Otherwise, start creating a new multi-part upload.

1. Generate a pre-signed url for each (remaining) chunk of the ceremony artifact.
2. Consume the pre-signed urls to upload chunks.
3. Complete the multi-part upload.

## Parameters

### accessToken

`string`

### ceremonyId

`number`

the unique identifier of the ceremony (used as a double-edge sword - as identifier and as a check if current contributor is the coordinator finalizing the ceremony).

### userId

`number`

the unique identifier of the user.

### objectKey

`string`

the unique key to identify the object inside the given AWS S3 bucket.

### localFilePath

`string`

### configStreamChunkSize

`number`

size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).

### creatingCeremony?

`boolean`

### temporaryDataToResumeMultiPartUpload?

[`TemporaryParticipantContributionData`](../../../types/type-aliases/TemporaryParticipantContributionData.md)

the temporary information necessary to resume an already started multi-part upload.

### logger?

`GenericBar`

an optional logger to show progress.

## Returns

`Promise`&lt;`void`&gt;
