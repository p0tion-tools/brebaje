[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [health/health.controller](../README.md) / HealthController

# Class: HealthController

Defined in: [apps/backend/src/health/health.controller.ts:7](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/health/health.controller.ts#L7)

## Constructors

### Constructor

> **new HealthController**(`healthService`): `HealthController`

Defined in: [apps/backend/src/health/health.controller.ts:8](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/health/health.controller.ts#L8)

#### Parameters

##### healthService

[`HealthService`](../../health.service/classes/HealthService.md)

#### Returns

`HealthController`

## Methods

### getHealth()

> **getHealth**(): `Promise`\<\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `environment`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `s3`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}\>

Defined in: [apps/backend/src/health/health.controller.ts:49](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/health/health.controller.ts#L49)

#### Returns

`Promise`\<\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `environment`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; `s3`: \{ `message?`: `string`; `status`: `"error"` \| `"ok"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}\>
