[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/health/health.controller](../index.md) / HealthController

# Class: HealthController

Defined in: [apps/backend/src/health/health.controller.ts:7](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.controller.ts#L7)

## Constructors

### Constructor

> **new HealthController**(`healthService`): `HealthController`

Defined in: [apps/backend/src/health/health.controller.ts:8](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.controller.ts#L8)

#### Parameters

##### healthService

[`HealthService`](../../health.service/classes/HealthService.md)

#### Returns

`HealthController`

## Methods

### getHealth()

> **getHealth**(): `Promise`&lt;\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `environment`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `s3`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}&gt;

Defined in: [apps/backend/src/health/health.controller.ts:49](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/health/health.controller.ts#L49)

#### Returns

`Promise`&lt;\{ `checks`: \{ `database`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `environment`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; `s3`: \{ `message?`: `string`; `status`: `"ok"` \| `"error"`; \}; \}; `status`: `string`; `timestamp`: `string`; \} \| \{ `checks`: \{ `database`: \{ `message`: `string`; `status`: `string`; \}; `environment`: \{ `message`: `string`; `status`: `string`; \}; `s3`: \{ `message`: `string`; `status`: `string`; \}; \}; `status`: `string`; `timestamp`: `string`; \}&gt;
