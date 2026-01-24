[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [vm/vm.controller](../README.md) / VmController

# Class: VmController

Defined in: [apps/backend/src/vm/vm.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L12)

## Constructors

### Constructor

> **new VmController**(`vmService`, `verificationMonitoringService`, `storageService`): `VmController`

Defined in: [apps/backend/src/vm/vm.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L13)

#### Parameters

##### vmService

[`VmService`](../../vm.service/classes/VmService.md)

##### verificationMonitoringService

[`VerificationMonitoringService`](../../verification-monitoring.service/classes/VerificationMonitoringService.md)

##### storageService

[`StorageService`](../../../storage/storage.service/classes/StorageService.md)

#### Returns

`VmController`

## Methods

### getCommandOutput()

> **getCommandOutput**(`commandId`, `instanceId`): `Promise`\<\{ `commandId`: `string`; `error?`: `undefined`; `instanceId`: `string`; `note`: `string`; `output`: \{ `stdout`: `string`; `timestamp`: `string`; \}; `status`: `string`; \} \| \{ `commandId`: `string`; `error`: `string`; `instanceId`: `string`; `note`: `string`; `output?`: `undefined`; `status?`: `undefined`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:153](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L153)

#### Parameters

##### commandId

`string`

##### instanceId

`string`

#### Returns

`Promise`\<\{ `commandId`: `string`; `error?`: `undefined`; `instanceId`: `string`; `note`: `string`; `output`: \{ `stdout`: `string`; `timestamp`: `string`; \}; `status`: `string`; \} \| \{ `commandId`: `string`; `error`: `string`; `instanceId`: `string`; `note`: `string`; `output?`: `undefined`; `status?`: `undefined`; \}\>

***

### getInstanceStatus()

> **getInstanceStatus**(`instanceId`): `Promise`\<\{ `instanceId`: `string`; `isRunning`: `boolean`; `message?`: `undefined`; `status`: `string`; `timestamp`: `string`; \} \| \{ `instanceId`: `string`; `isRunning?`: `undefined`; `message`: `string`; `status`: `string`; `timestamp`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:262](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L262)

#### Parameters

##### instanceId

`string`

#### Returns

`Promise`\<\{ `instanceId`: `string`; `isRunning`: `boolean`; `message?`: `undefined`; `status`: `string`; `timestamp`: `string`; \} \| \{ `instanceId`: `string`; `isRunning?`: `undefined`; `message`: `string`; `status`: `string`; `timestamp`: `string`; \}\>

***

### getMonitoringStatus()

> **getMonitoringStatus**(): `object`

Defined in: [apps/backend/src/vm/vm.controller.ts:285](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L285)

#### Returns

`object`

##### activeVerifications

> **activeVerifications**: `number`

##### verifications

> **verifications**: `object`[]

***

### getVerificationStatus()

> **getVerificationStatus**(`commandId`, `instanceId`): `Promise`\<\{ `commandId`: `string`; `completedAt`: `string`; `httpStatus`: `number`; `message?`: `undefined`; `result`: `string`; `status`: `string`; \} \| \{ `commandId`: `string`; `completedAt?`: `undefined`; `httpStatus?`: `undefined`; `message`: `string`; `result?`: `undefined`; `status`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:116](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L116)

#### Parameters

##### commandId

`string`

##### instanceId

`string`

#### Returns

`Promise`\<\{ `commandId`: `string`; `completedAt`: `string`; `httpStatus`: `number`; `message?`: `undefined`; `result`: `string`; `status`: `string`; \} \| \{ `commandId`: `string`; `completedAt?`: `undefined`; `httpStatus?`: `undefined`; `message`: `string`; `result?`: `undefined`; `status`: `string`; \}\>

***

### setupVm()

> **setupVm**(`setupDto`): `Promise`\<\{ `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `note`: `string`; `statusUrl`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:92](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L92)

#### Parameters

##### setupDto

[`SetupVmDto`](../../dto/setup-vm.dto/classes/SetupVmDto.md)

#### Returns

`Promise`\<\{ `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `note`: `string`; `statusUrl`: `string`; \}\>

***

### startInstance()

> **startInstance**(`lifecycleDto`): `Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:189](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L189)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}\>

***

### startVerification()

> **startVerification**(`verifyDto`): `Promise`\<\{ `autoStop`: `string`; `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `monitoring`: `string`; `statusUrl`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:23](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L23)

#### Parameters

##### verifyDto

[`VerifyPhase1Dto`](../../dto/verify-phase1.dto/classes/VerifyPhase1Dto.md)

#### Returns

`Promise`\<\{ `autoStop`: `string`; `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `monitoring`: `string`; `statusUrl`: `string`; \}\>

***

### stopInstance()

> **stopInstance**(`lifecycleDto`): `Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:213](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L213)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}\>

***

### terminateInstance()

> **terminateInstance**(`lifecycleDto`): `Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning`: `string`; \} \| \{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning?`: `undefined`; \}\>

Defined in: [apps/backend/src/vm/vm.controller.ts:237](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/vm/vm.controller.ts#L237)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`\<\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning`: `string`; \} \| \{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning?`: `undefined`; \}\>
