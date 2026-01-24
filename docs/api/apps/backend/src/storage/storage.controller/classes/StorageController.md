[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/storage/storage.controller](../index.md) / StorageController

# Class: StorageController

Defined in: [apps/backend/src/storage/storage.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L12)

## Constructors

### Constructor

> **new StorageController**(`storageService`): `StorageController`

Defined in: [apps/backend/src/storage/storage.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L13)

#### Parameters

##### storageService

[`StorageService`](../../storage.service/classes/StorageService.md)

#### Returns

`StorageController`

## Methods

### checkIfObjectExists()

> **checkIfObjectExists**(`ceremonyId`, `data`): `Promise`&lt;\{ `result`: `boolean`; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:48](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L48)

#### Parameters

##### ceremonyId

`number`

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

#### Returns

`Promise`&lt;\{ `result`: `boolean`; \}&gt;

---

### completeMultipartUpload()

> **completeMultipartUpload**(`ceremonyId`, `userId`, `data`): `Promise`&lt;\{ `location`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:103](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L103)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`CompleteMultiPartUploadData`](../../dto/storage-dto/classes/CompleteMultiPartUploadData.md)

#### Returns

`Promise`&lt;\{ `location`: `string`; \}&gt;

---

### createAndSetupBucket()

> **createAndSetupBucket**(`ceremonyId`): `Promise`&lt;\{ `bucketName`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:26](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L26)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;\{ `bucketName`: `string`; \}&gt;

---

### deleteCeremonyBucket()

> **deleteCeremonyBucket**(`ceremonyId`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:36](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L36)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;`void`&gt;

---

### generateGetObjectPreSignedUrl()

> **generateGetObjectPreSignedUrl**(`ceremonyId`, `data`): `Promise`&lt;\{ `url`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:59](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L59)

#### Parameters

##### ceremonyId

`number`

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

#### Returns

`Promise`&lt;\{ `url`: `string`; \}&gt;

---

### generatePreSignedUrlsParts()

> **generatePreSignedUrlsParts**(`ceremonyId`, `userId`, `data`): `Promise`&lt;\{ `parts`: `string`[]; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:87](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L87)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`GeneratePreSignedUrlsPartsData`](../../dto/storage-dto/classes/GeneratePreSignedUrlsPartsData.md)

#### Returns

`Promise`&lt;\{ `parts`: `string`[]; \}&gt;

---

### startMultipartUpload()

> **startMultipartUpload**(`ceremonyId`, `userId`, `data`): `Promise`&lt;\{ `uploadId`: `string`; \}&gt;

Defined in: [apps/backend/src/storage/storage.controller.ts:71](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/storage/storage.controller.ts#L71)

#### Parameters

##### ceremonyId

`number`

##### userId

`number`

##### data

[`ObjectKeyDto`](../../dto/storage-dto/classes/ObjectKeyDto.md)

#### Returns

`Promise`&lt;\{ `uploadId`: `string`; \}&gt;
