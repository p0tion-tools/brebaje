[**Brebaje Backend API v0.0.1**](../../../index.md)

***

[Brebaje Backend API](../../../index.md) / [health/health.service](../index.md) / HealthService

# Class: HealthService

Defined in: [apps/backend/src/health/health.service.ts:9](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L9)

## Constructors

### Constructor

> **new HealthService**(`sequelize`, `storageService`): `HealthService`

Defined in: [apps/backend/src/health/health.service.ts:12](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L12)

#### Parameters

##### sequelize

`Sequelize`

##### storageService

[`StorageService`](../../../storage/storage.service/classes/StorageService.md)

#### Returns

`HealthService`

## Methods

### checkDatabaseConnection()

> **checkDatabaseConnection**(): `Promise`\<\{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}\>

Defined in: [apps/backend/src/health/health.service.ts:17](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L17)

#### Returns

`Promise`\<\{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}\>

***

### checkEnvironmentVariables()

> **checkEnvironmentVariables**(): `object`

Defined in: [apps/backend/src/health/health.service.ts:34](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L34)

#### Returns

`object`

##### message?

> `optional` **message**: `string`

##### status

> **status**: `"error"` \| `"ok"`

***

### checkS3Connection()

> **checkS3Connection**(): `Promise`\<\{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}\>

Defined in: [apps/backend/src/health/health.service.ts:55](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L55)

#### Returns

`Promise`\<\{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}\>

***

### getHealthStatus()

> **getHealthStatus**(): `Promise`\<\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `environment`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `s3`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}\>

Defined in: [apps/backend/src/health/health.service.ts:114](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/health/health.service.ts#L114)

#### Returns

`Promise`\<\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `environment`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `s3`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}\>
