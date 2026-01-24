[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [storage/storage.service](../README.md) / StorageService

# Class: StorageService

Defined in: [apps/backend/src/storage/storage.service.ts:52](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L52)

## Constructors

### Constructor

> **new StorageService**(`ceremoniesService`, `participantsService`): `StorageService`

Defined in: [apps/backend/src/storage/storage.service.ts:55](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L55)

#### Parameters

##### ceremoniesService

[`CeremoniesService`](../../../ceremonies/ceremonies.service/classes/CeremoniesService.md)

##### participantsService

[`ParticipantsService`](../../../participants/participants.service/classes/ParticipantsService.md)

#### Returns

`StorageService`

## Methods

### checkIfObjectExists()

> **checkIfObjectExists**(`data`, `ceremonyId`): `Promise`\<\{ `result`: `boolean`; \}\>

Defined in: [apps/backend/src/storage/storage.service.ts:393](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L393)

#### Parameters

##### data

[`ObjectKeyDto`](../-internal-/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

#### Returns

`Promise`\<\{ `result`: `boolean`; \}\>

***

### completeMultipartUpload()

> **completeMultipartUpload**(`data`, `ceremonyId`, `userId`): `Promise`\<\{ `location`: `string`; \}\>

Defined in: [apps/backend/src/storage/storage.service.ts:351](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L351)

#### Parameters

##### data

[`CompleteMultiPartUploadData`](../-internal-/classes/CompleteMultiPartUploadData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`\<\{ `location`: `string`; \}\>

***

### createAndSetupBucket()

> **createAndSetupBucket**(`ceremonyId`): `Promise`\<\{ `bucketName`: `string`; \}\>

Defined in: [apps/backend/src/storage/storage.service.ts:149](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L149)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<\{ `bucketName`: `string`; \}\>

***

### createBucket()

> **createBucket**(`s3`, `bucketName`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:72](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L72)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteBucket()

> **deleteBucket**(`s3`, `bucketName`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:131](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L131)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteCeremonyBucket()

> **deleteCeremonyBucket**(`ceremonyId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:160](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L160)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<`void`\>

***

### deleteObject()

> **deleteObject**(`bucketName`, `objectKey`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:438](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L438)

#### Parameters

##### bucketName

`string`

##### objectKey

`string`

#### Returns

`Promise`\<`void`\>

***

### downloadObject()

> **downloadObject**(`bucketName`, `objectKey`): `Promise`\<`string`\>

Defined in: [apps/backend/src/storage/storage.service.ts:453](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L453)

#### Parameters

##### bucketName

`string`

##### objectKey

`string`

#### Returns

`Promise`\<`string`\>

***

### generateGetObjectPreSignedUrl()

> **generateGetObjectPreSignedUrl**(`data`, `ceremonyId`): `Promise`\<\{ `url`: `string`; \} \| `undefined`\>

Defined in: [apps/backend/src/storage/storage.service.ts:417](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L417)

#### Parameters

##### data

[`ObjectKeyDto`](../-internal-/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

#### Returns

`Promise`\<\{ `url`: `string`; \} \| `undefined`\>

***

### generatePreSignedUrlsParts()

> **generatePreSignedUrlsParts**(`data`, `ceremonyId`, `userId`): `Promise`\<\{ `parts`: `string`[]; \}\>

Defined in: [apps/backend/src/storage/storage.service.ts:307](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L307)

#### Parameters

##### data

[`GeneratePreSignedUrlsPartsData`](../-internal-/classes/GeneratePreSignedUrlsPartsData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`\<\{ `parts`: `string`[]; \}\>

***

### getCeremonyBucketName()

> **getCeremonyBucketName**(`ceremonyId`): `Promise`\<`string`\>

Defined in: [apps/backend/src/storage/storage.service.ts:140](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L140)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<`string`\>

***

### getS3Client()

> **getS3Client**(): `S3Client`

Defined in: [apps/backend/src/storage/storage.service.ts:62](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L62)

#### Returns

`S3Client`

***

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/storage/storage.service.ts:481](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L481)

#### Parameters

##### error

`Error`

#### Returns

`never`

***

### setBucketCors()

> **setBucketCors**(`s3`, `bucketName`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:107](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L107)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`\<`void`\>

***

### setPublicAccessBlock()

> **setPublicAccessBlock**(`s3`, `bucketName`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L90)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`\<`void`\>

***

### startMultipartUpload()

> **startMultipartUpload**(`data`, `ceremonyId`, `userId`): `Promise`\<\{ `uploadId`: `string`; \} \| `undefined`\>

Defined in: [apps/backend/src/storage/storage.service.ts:167](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L167)

#### Parameters

##### data

[`ObjectKeyDto`](../-internal-/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`\<\{ `uploadId`: `string`; \} \| `undefined`\>

***

### temporaryStoreCurrentContributionMultiPartUploadId()

> **temporaryStoreCurrentContributionMultiPartUploadId**(`data`, `ceremonyId`, `userId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:204](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L204)

#### Parameters

##### data

[`UploadIdDto`](../-internal-/classes/UploadIdDto.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`\<`void`\>

***

### temporaryStoreCurrentContributionUploadedChunkData()

> **temporaryStoreCurrentContributionUploadedChunkData**(`data`, `ceremonyId`, `userId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:236](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L236)

#### Parameters

##### data

[`TemporaryStoreCurrentContributionUploadedChunkData`](../-internal-/classes/TemporaryStoreCurrentContributionUploadedChunkData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`\<`void`\>

***

### uploadObject()

> **uploadObject**(`bucketName`, `objectKey`, `data`, `isPublic`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.service.ts:276](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.service.ts#L276)

#### Parameters

##### bucketName

`string`

##### objectKey

`string`

##### data

`string`

##### isPublic

`boolean` = `false`

#### Returns

`Promise`\<`void`\>
