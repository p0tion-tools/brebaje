[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/circuits/circuits.service](../index.md) / CircuitsService

# Class: CircuitsService

Defined in: [apps/backend/src/circuits/circuits.service.ts:31](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L31)

## Constructors

### Constructor

> **new CircuitsService**(`circuitModel`, `vmService`, `storageService`, `participantsService`): `CircuitsService`

Defined in: [apps/backend/src/circuits/circuits.service.ts:32](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L32)

#### Parameters

##### circuitModel

_typeof_ [`Circuit`](../../circuit.model/classes/Circuit.md)

##### vmService

[`VmService`](../../../vm/vm.service/classes/VmService.md)

##### storageService

[`StorageService`](../../../storage/storage.service/classes/StorageService.md)

##### participantsService

[`ParticipantsService`](../../../participants/participants.service/classes/ParticipantsService.md)

#### Returns

`CircuitsService`

## Methods

### addTimeOut()

> **addTimeOut**(`participant`, `circuit`, `type`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:221](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L221)

#### Parameters

##### participant

[`Participant`](../../../participants/participant.model/classes/Participant.md)

##### circuit

[`Circuit`](../../circuit.model/classes/Circuit.md)

##### type

[`ParticipantTimeoutType`](../../../types/enums/enumerations/ParticipantTimeoutType.md)

#### Returns

`Promise`&lt;`void`&gt;

---

### checkAndAddTimeout()

> **checkAndAddTimeout**(`participant`, `circuit`, `type`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:243](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L243)

#### Parameters

##### participant

[`Participant`](../../../participants/participant.model/classes/Participant.md)

##### circuit

[`Circuit`](../../circuit.model/classes/Circuit.md)

##### type

[`ParticipantTimeoutType`](../../../types/enums/enumerations/ParticipantTimeoutType.md)

#### Returns

`Promise`&lt;`void`&gt;

---

### coordinate()

> **coordinate**(): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:296](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L296)

Coordinates the ceremony contribution process by managing participant status transitions
and circuit queue progression for all circuits in opened ceremonies.

#### Returns

`Promise`&lt;`void`&gt;

#### Remarks

**Participant Status Flow:**

1. **WAITING → READY**
   - Occurs when current contributor is set to READY
   - Indicates the participant is now eligible to start contributing (user should download previous participant's contribution)

2. **READY or CONTRIBUTING → TIMEDOUT**
   - Triggered when participant exceeds the allowed time window for contribution

3. **CONTRIBUTED or FINALIZED → DONE or WAITING**
   - **If in VERIFYING step:**
     - Check for verification timeout (server or vm should move participant from verifying to completed if successful verification)

   - **If in COMPLETED step:**
     - **All circuits completed:** Status changes to `DONE`
     - **More circuits pending:** Status changes to `WAITING` (participant waits for next circuit)

4. **TIMEDOUT**
   - Participant was manually timedout so kick him out of current contributor
   - Queue shifts to next contributor

**Queue Management:**

- If `currentContributor` is `undefined`, the function attempts to shift to the next contributor
- If the current participant document doesn't exist, shifts to next contributor
- Each status check may trigger `shiftToNextContributor()` to advance the queue

#### See

- [ParticipantStatus](../../../types/enums/enumerations/ParticipantStatus.md) for all possible participant statuses
- [ParticipantTimeoutType](../../../types/enums/enumerations/ParticipantTimeoutType.md) for timeout types
- [shiftToNextContributor](#shifttonextcontributor) for queue advancement logic
- [checkAndAddTimeout](#checkandaddtimeout) for timeout checking and application

---

### create()

> **create**(`createCircuitDto`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:44](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L44)

#### Parameters

##### createCircuitDto

[`CreateCircuitDto`](../../dto/create-circuit.dto/classes/CreateCircuitDto.md)

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:103](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L103)

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

---

### findAllByCeremonyId()

> **findAllByCeremonyId**(`ceremonyId`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:119](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L119)

#### Parameters

##### ceremonyId

`number`

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

---

### findAllFromOpenedCeremonies()

> **findAllFromOpenedCeremonies**(): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:107](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L107)

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:123](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L123)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

---

### findOneByCeremonyIdAndProgress()

> **findOneByCeremonyIdAndProgress**(`ceremonyId`, `progress`): `Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:127](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L127)

#### Parameters

##### ceremonyId

`number`

##### progress

`number`

#### Returns

`Promise`&lt;[`Circuit`](../../circuit.model/classes/Circuit.md)&gt;

---

### isParticipantTimedOutOnCircuit()

> **isParticipantTimedOutOnCircuit**(`participant`, `circuit`): `boolean`

Defined in: [apps/backend/src/circuits/circuits.service.ts:193](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L193)

#### Parameters

##### participant

[`Participant`](../../../participants/participant.model/classes/Participant.md)

##### circuit

[`Circuit`](../../circuit.model/classes/Circuit.md)

#### Returns

`boolean`

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:152](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L152)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### shiftToNextContributor()

> **shiftToNextContributor**(`circuit`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/circuits/circuits.service.ts:179](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L179)

#### Parameters

##### circuit

[`Circuit`](../../circuit.model/classes/Circuit.md)

#### Returns

`Promise`&lt;`void`&gt;

---

### update()

> **update**(`id`, `_updateCircuitDto`): `string`

Defined in: [apps/backend/src/circuits/circuits.service.ts:148](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/circuits/circuits.service.ts#L148)

#### Parameters

##### id

`number`

##### \_updateCircuitDto

[`UpdateCircuitDto`](../../dto/update-circuit.dto/classes/UpdateCircuitDto.md)

#### Returns

`string`
