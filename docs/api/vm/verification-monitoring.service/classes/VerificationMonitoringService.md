[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [vm/verification-monitoring.service](../README.md) / VerificationMonitoringService

# Class: VerificationMonitoringService

Defined in: [apps/backend/src/vm/verification-monitoring.service.ts:9](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/verification-monitoring.service.ts#L9)

## Constructors

### Constructor

> **new VerificationMonitoringService**(`vmService`): `VerificationMonitoringService`

Defined in: [apps/backend/src/vm/verification-monitoring.service.ts:21](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/verification-monitoring.service.ts#L21)

#### Parameters

##### vmService

[`VmService`](../../vm.service/classes/VmService.md)

#### Returns

`VerificationMonitoringService`

## Methods

### checkVerificationStatus()

> **checkVerificationStatus**(): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/vm/verification-monitoring.service.ts:51](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/verification-monitoring.service.ts#L51)

CRON job to check verification status every 5 minutes.

#### Returns

`Promise`&lt;`void`&gt;

***

### getMonitoringStatus()

> **getMonitoringStatus**(): `object`

Defined in: [apps/backend/src/vm/verification-monitoring.service.ts:198](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/verification-monitoring.service.ts#L198)

Get current monitoring status.

#### Returns

`object`

Object with monitoring statistics.

##### activeVerifications

> **activeVerifications**: `number`

##### verifications

> **verifications**: `object`[]

***

### startMonitoring()

> **startMonitoring**(`commandId`, `instanceId`, `notificationConfig?`, `autoStop?`, `ptauFilename?`): `void`

Defined in: [apps/backend/src/vm/verification-monitoring.service.ts:31](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/verification-monitoring.service.ts#L31)

Start monitoring a verification job.

#### Parameters

##### commandId

`string`

SSM command ID to monitor.

##### instanceId

`string`

EC2 instance ID.

##### notificationConfig?

[`NotificationConfig`](../../../types/declarations/type-aliases/NotificationConfig.md)

Optional notification configuration.

##### autoStop?

`boolean`

Whether to automatically stop instance when verification completes.

##### ptauFilename?

`string`

Optional ptau filename being verified.

#### Returns

`void`
