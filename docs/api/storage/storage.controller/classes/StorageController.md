[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [storage/storage.controller](../index.md) / StorageController

# Class: StorageController

Defined in: [apps/backend/src/storage/storage.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L12)

## Constructors

### Constructor

> **new StorageController**(`storageService`): `StorageController`

Defined in: [apps/backend/src/storage/storage.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L13)

#### Parameters

##### storageService

[`StorageService`](../../storage.service/classes/StorageService.md)

#### Returns

`StorageController`

## Methods

### checkIfObjectExists()

> **checkIfObjectExists**(`ceremonyId`, `data`): `Promise`\<\{ `result`: `boolean`; \}\>

Defined in: [apps/backend/src/storage/storage.controller.ts:48](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L48)

#### Parameters

##### ceremonyId

`number`

##### data

[`ObjectKeyDto`](../../storage.service/-internal-/classes/ObjectKeyDto.md)

#### Returns

`Promise`\<\{ `result`: `boolean`; \}\>

***

### completeMultipartUpload()

> **completeMultipartUpload**(`ceremonyId`, `userId`, `data`): `Promise`\<\{ `location`: `string`; \}\>

Defined in: [apps/backend/src/storage/storage.controller.ts:103](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L103)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`CompleteMultiPartUploadData`](../../storage.service/-internal-/classes/CompleteMultiPartUploadData.md)

#### Returns

`Promise`\<\{ `location`: `string`; \}\>

***

### createAndSetupBucket()

> **createAndSetupBucket**(`ceremonyId`): `Promise`\<\{ `bucketName`: `string`; \}\>

Defined in: [apps/backend/src/storage/storage.controller.ts:26](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L26)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<\{ `bucketName`: `string`; \}\>

***

### deleteCeremonyBucket()

> **deleteCeremonyBucket**(`ceremonyId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/storage/storage.controller.ts:36](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L36)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`\<`void`\>

***

### generateGetObjectPreSignedUrl()

> **generateGetObjectPreSignedUrl**(`ceremonyId`, `data`): `Promise`\<\{ `url`: `string`; \} \| `undefined`\>

Defined in: [apps/backend/src/storage/storage.controller.ts:59](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L59)

#### Parameters

##### ceremonyId

`number`

##### data

[`ObjectKeyDto`](../../storage.service/-internal-/classes/ObjectKeyDto.md)

#### Returns

`Promise`\<\{ `url`: `string`; \} \| `undefined`\>

***

### generatePreSignedUrlsParts()

> **generatePreSignedUrlsParts**(`ceremonyId`, `userId`, `data`): `Promise`\<\{ `parts`: `string`[]; \}\>

Defined in: [apps/backend/src/storage/storage.controller.ts:87](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L87)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`GeneratePreSignedUrlsPartsData`](../../storage.service/-internal-/classes/GeneratePreSignedUrlsPartsData.md)

#### Returns

`Promise`\<\{ `parts`: `string`[]; \}\>

***

### startMultipartUpload()

> **startMultipartUpload**(`ceremonyId`, `userId`, `data`): `Promise`\<\{ `uploadId`: `string`; \} \| `undefined`\>

Defined in: [apps/backend/src/storage/storage.controller.ts:71](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/storage/storage.controller.ts#L71)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`ObjectKeyDto`](../../storage.service/-internal-/classes/ObjectKeyDto.md)

#### Returns

`Promise`\<\{ `uploadId`: `string`; \} \| `undefined`\>
