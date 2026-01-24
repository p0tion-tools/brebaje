[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/participants/participants.controller](../index.md) / ParticipantsController

# Class: ParticipantsController

Defined in: [apps/backend/src/participants/participants.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L21)

## Constructors

### Constructor

> **new ParticipantsController**(`participantsService`): `ParticipantsController`

Defined in: [apps/backend/src/participants/participants.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L22)

#### Parameters

##### participantsService

[`ParticipantsService`](../../participants.service/classes/ParticipantsService.md)

#### Returns

`ParticipantsController`

## Methods

### create()

> **create**(`req`, `createParticipantDto`): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

Defined in: [apps/backend/src/participants/participants.controller.ts:34](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L34)

#### Parameters

##### req

[`AuthenticatedRequest`](../../../auth/guards/jwt-auth.guard/interfaces/AuthenticatedRequest.md)

##### createParticipantDto

[`CreateParticipantDto`](../../dto/create-participant.dto/classes/CreateParticipantDto.md)

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

Defined in: [apps/backend/src/participants/participants.controller.ts:41](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L41)

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

Defined in: [apps/backend/src/participants/participants.controller.ts:50](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L50)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/participants/participants.controller.ts:72](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L72)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateParticipantDto`): `string`

Defined in: [apps/backend/src/participants/participants.controller.ts:63](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.controller.ts#L63)

#### Parameters

##### id

`number`

##### updateParticipantDto

[`UpdateParticipantDto`](../../dto/update-participant.dto/classes/UpdateParticipantDto.md)

#### Returns

`string`
