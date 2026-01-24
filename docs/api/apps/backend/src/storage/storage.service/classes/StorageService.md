[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/storage/storage.service](../index.md) / StorageService

# Class: StorageService

Defined in: [apps/backend/src/storage/storage.service.ts:52](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L52)

## Constructors

### Constructor

> **new StorageService**(`ceremoniesService`, `participantsService`): `StorageService`

Defined in: [apps/backend/src/storage/storage.service.ts:55](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L55)

#### Parameters

##### ceremoniesService

[`CeremoniesService`](../../../ceremonies/ceremonies.service/classes/CeremoniesService.md)

##### participantsService

[`ParticipantsService`](../../../participants/participants.service/classes/ParticipantsService.md)

#### Returns

`StorageService`

## Methods

### checkIfObjectExists()

> **checkIfObjectExists**(`data`, `ceremonyId`): `Promise`&lt;\{ `result`: `boolean`; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:393](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L393)

#### Parameters

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

#### Returns

`Promise`&lt;\{ `result`: `boolean`; \}&gt;

---

### completeMultipartUpload()

> **completeMultipartUpload**(`data`, `ceremonyId`, `userId`): `Promise`&lt;\{ `location`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:351](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L351)

#### Parameters

##### data

[`CompleteMultiPartUploadData`](../../dto/storage-dto/classes/CompleteMultiPartUploadData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`&lt;\{ `location`: `string`; \}&gt;

---

### createAndSetupBucket()

> **createAndSetupBucket**(`ceremonyId`): `Promise`&lt;\{ `bucketName`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:149](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L149)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;\{ `bucketName`: `string`; \}&gt;

---

### createBucket()

> **createBucket**(`s3`, `bucketName`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:72](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L72)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### deleteBucket()

> **deleteBucket**(`s3`, `bucketName`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:131](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L131)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### deleteCeremonyBucket()

> **deleteCeremonyBucket**(`ceremonyId`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:160](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L160)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;`void`&gt;

---

### deleteObject()

> **deleteObject**(`bucketName`, `objectKey`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:438](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L438)

#### Parameters

##### bucketName

`string`

##### objectKey

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### downloadObject()

> **downloadObject**(`bucketName`, `objectKey`): `Promise`&lt;`string`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:453](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L453)

#### Parameters

##### bucketName

`string`

##### objectKey

`string`

#### Returns

`Promise`&lt;`string`&gt;

---

### generateGetObjectPreSignedUrl()

> **generateGetObjectPreSignedUrl**(`data`, `ceremonyId`): `Promise`&lt;\{ `url`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:417](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L417)

#### Parameters

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

#### Returns

`Promise`&lt;\{ `url`: `string`; \}&gt;

---

### generatePreSignedUrlsParts()

> **generatePreSignedUrlsParts**(`data`, `ceremonyId`, `userId`): `Promise`&lt;\{ `parts`: `string`[]; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:307](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L307)

#### Parameters

##### data

[`GeneratePreSignedUrlsPartsData`](../../dto/storage-dto/classes/GeneratePreSignedUrlsPartsData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`&lt;\{ `parts`: `string`[]; \}&gt;

---

### getCeremonyBucketName()

> **getCeremonyBucketName**(`ceremonyId`): `Promise`&lt;`string`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:140](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L140)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;`string`&gt;

---

### getS3Client()

> **getS3Client**(): `S3Client`

Defined in: [apps/backend/src/storage/storage.service.ts:62](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L62)

#### Returns

`S3Client`

---

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/storage/storage.service.ts:481](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L481)

#### Parameters

##### error

`Error`

#### Returns

`never`

---

### setBucketCors()

> **setBucketCors**(`s3`, `bucketName`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:107](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L107)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### setPublicAccessBlock()

> **setPublicAccessBlock**(`s3`, `bucketName`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L90)

#### Parameters

##### s3

`S3Client`

##### bucketName

`string`

#### Returns

`Promise`&lt;`void`&gt;

---

### startMultipartUpload()

> **startMultipartUpload**(`data`, `ceremonyId`, `userId`): `Promise`&lt;\{ `uploadId`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:167](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L167)

#### Parameters

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`&lt;\{ `uploadId`: `string`; \}&gt;

---

### temporaryStoreCurrentContributionMultiPartUploadId()

> **temporaryStoreCurrentContributionMultiPartUploadId**(`data`, `ceremonyId`, `userId`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:204](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L204)

#### Parameters

##### data

[`UploadIdDto`](../../dto/storage-dto/classes/UploadIdDto.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`&lt;`void`&gt;

---

### temporaryStoreCurrentContributionUploadedChunkData()

> **temporaryStoreCurrentContributionUploadedChunkData**(`data`, `ceremonyId`, `userId`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:236](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L236)

#### Parameters

##### data

[`TemporaryStoreCurrentContributionUploadedChunkData`](../../dto/storage-dto/classes/TemporaryStoreCurrentContributionUploadedChunkData.md)

##### ceremonyId

`number`

##### userId

`number`

#### Returns

`Promise`&lt;`void`&gt;

---

### uploadObject()

> **uploadObject**(`bucketName`, `objectKey`, `data`, `isPublic`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.service.ts:276](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.service.ts#L276)

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

`Promise`&lt;`void`&gt;
