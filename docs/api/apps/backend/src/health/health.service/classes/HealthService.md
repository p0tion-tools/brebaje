[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/health/health.service](../index.md) / HealthService

# Class: HealthService

Defined in: [apps/backend/src/health/health.service.ts:9](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L9)

## Constructors

### Constructor

> **new HealthService**(`sequelize`, `storageService`): `HealthService`

Defined in: [apps/backend/src/health/health.service.ts:12](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L12)

#### Parameters

##### sequelize

`Sequelize`

##### storageService

[`StorageService`](../../../storage/storage.service/classes/StorageService.md)

#### Returns

`HealthService`

## Methods

### checkDatabaseConnection()

> **checkDatabaseConnection**(): `Promise`&lt;\{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}&gt;

Defined in: [apps/backend/src/health/health.service.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L17)

#### Returns

`Promise`&lt;\{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}&gt;

---

### checkEnvironmentVariables()

> **checkEnvironmentVariables**(): `object`

Defined in: [apps/backend/src/health/health.service.ts:34](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L34)

#### Returns

`object`

##### message?

> `optional` **message**: `string`

##### status

> **status**: `"ok"` \| `"error"`

---

### checkS3Connection()

> **checkS3Connection**(): `Promise`&lt;\{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}&gt;

Defined in: [apps/backend/src/health/health.service.ts:55](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L55)

#### Returns

`Promise`&lt;\{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}&gt;

---

### getHealthStatus()

> **getHealthStatus**(): `Promise`&lt;\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `environment`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `s3`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}&gt;

Defined in: [apps/backend/src/health/health.service.ts:114](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.service.ts#L114)

#### Returns

`Promise`&lt;\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `environment`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `s3`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}&gt;
