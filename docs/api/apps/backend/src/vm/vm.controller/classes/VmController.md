[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/vm/vm.controller](../index.md) / VmController

# Class: VmController

Defined in: [apps/backend/src/vm/vm.controller.ts:12](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L12)

## Constructors

### Constructor

> **new VmController**(`vmService`, `verificationMonitoringService`, `storageService`): `VmController`

Defined in: [apps/backend/src/vm/vm.controller.ts:13](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L13)

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

> **getCommandOutput**(`commandId`, `instanceId`): `Promise`&lt;\{ `commandId`: `string`; `error?`: `undefined`; `instanceId`: `string`; `note`: `string`; `output`: \{ `stdout`: `string`; `timestamp`: `string`; \}; `status`: `string`; \} \| \{ `commandId`: `string`; `error`: `string`; `instanceId`: `string`; `note`: `string`; `output?`: `undefined`; `status?`: `undefined`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:153](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L153)

#### Parameters

##### commandId

`string`

##### instanceId

`string`

#### Returns

`Promise`&lt;\{ `commandId`: `string`; `error?`: `undefined`; `instanceId`: `string`; `note`: `string`; `output`: \{ `stdout`: `string`; `timestamp`: `string`; \}; `status`: `string`; \} \| \{ `commandId`: `string`; `error`: `string`; `instanceId`: `string`; `note`: `string`; `output?`: `undefined`; `status?`: `undefined`; \}&gt;

---

### getInstanceStatus()

> **getInstanceStatus**(`instanceId`): `Promise`&lt;\{ `instanceId`: `string`; `isRunning`: `boolean`; `message?`: `undefined`; `status`: `string`; `timestamp`: `string`; \} \| \{ `instanceId`: `string`; `isRunning?`: `undefined`; `message`: `string`; `status`: `string`; `timestamp`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:262](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L262)

#### Parameters

##### instanceId

`string`

#### Returns

`Promise`&lt;\{ `instanceId`: `string`; `isRunning`: `boolean`; `message?`: `undefined`; `status`: `string`; `timestamp`: `string`; \} \| \{ `instanceId`: `string`; `isRunning?`: `undefined`; `message`: `string`; `status`: `string`; `timestamp`: `string`; \}&gt;

---

### getMonitoringStatus()

> **getMonitoringStatus**(): `object`

Defined in: [apps/backend/src/vm/vm.controller.ts:285](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L285)

#### Returns

`object`

##### activeVerifications

> **activeVerifications**: `number`

##### verifications

> **verifications**: `object`[]

---

### getVerificationStatus()

> **getVerificationStatus**(`commandId`, `instanceId`): `Promise`&lt;\{ `commandId`: `string`; `completedAt`: `string`; `httpStatus`: `number`; `message?`: `undefined`; `result`: `string`; `status`: `string`; \} \| \{ `commandId`: `string`; `completedAt?`: `undefined`; `httpStatus?`: `undefined`; `message`: `string`; `result?`: `undefined`; `status`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:116](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L116)

#### Parameters

##### commandId

`string`

##### instanceId

`string`

#### Returns

`Promise`&lt;\{ `commandId`: `string`; `completedAt`: `string`; `httpStatus`: `number`; `message?`: `undefined`; `result`: `string`; `status`: `string`; \} \| \{ `commandId`: `string`; `completedAt?`: `undefined`; `httpStatus?`: `undefined`; `message`: `string`; `result?`: `undefined`; `status`: `string`; \}&gt;

---

### setupVm()

> **setupVm**(`setupDto`): `Promise`&lt;\{ `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `note`: `string`; `statusUrl`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:92](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L92)

#### Parameters

##### setupDto

[`SetupVmDto`](../../dto/setup-vm.dto/classes/SetupVmDto.md)

#### Returns

`Promise`&lt;\{ `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `note`: `string`; `statusUrl`: `string`; \}&gt;

---

### startInstance()

> **startInstance**(`lifecycleDto`): `Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:189](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L189)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}&gt;

---

### startVerification()

> **startVerification**(`verifyDto`): `Promise`&lt;\{ `autoStop`: `string`; `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `monitoring`: `string`; `statusUrl`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:23](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L23)

#### Parameters

##### verifyDto

[`VerifyPhase1Dto`](../../dto/verify-phase1.dto/classes/VerifyPhase1Dto.md)

#### Returns

`Promise`&lt;\{ `autoStop`: `string`; `commandId`: `string`; `instanceId`: `string`; `message`: `string`; `monitoring`: `string`; `statusUrl`: `string`; \}&gt;

---

### stopInstance()

> **stopInstance**(`lifecycleDto`): `Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:213](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L213)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; \}&gt;

---

### terminateInstance()

> **terminateInstance**(`lifecycleDto`): `Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning`: `string`; \} \| \{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning?`: `undefined`; \}&gt;

Defined in: [apps/backend/src/vm/vm.controller.ts:237](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/vm/vm.controller.ts#L237)

#### Parameters

##### lifecycleDto

[`VmLifecycleDto`](../../dto/vm-lifecycle.dto/classes/VmLifecycleDto.md)

#### Returns

`Promise`&lt;\{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning`: `string`; \} \| \{ `action`: `string`; `instanceId`: `string`; `message`: `string`; `status`: `string`; `warning?`: `undefined`; \}&gt;
