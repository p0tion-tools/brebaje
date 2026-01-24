[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [participants/participants.controller](../README.md) / ParticipantsController

# Class: ParticipantsController

Defined in: [apps/backend/src/participants/participants.controller.ts:21](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L21)

## Constructors

### Constructor

> **new ParticipantsController**(`participantsService`): `ParticipantsController`

Defined in: [apps/backend/src/participants/participants.controller.ts:22](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L22)

#### Parameters

##### participantsService

[`ParticipantsService`](../../participants.service/classes/ParticipantsService.md)

#### Returns

`ParticipantsController`

## Methods

### create()

> **create**(`req`, `createParticipantDto`): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

Defined in: [apps/backend/src/participants/participants.controller.ts:34](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L34)

#### Parameters

##### req

[`AuthenticatedRequest`](../../../auth/guards/jwt-auth.guard/interfaces/AuthenticatedRequest.md)

##### createParticipantDto

[`CreateParticipantDto`](../../dto/create-participant.dto/classes/CreateParticipantDto.md)

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

Defined in: [apps/backend/src/participants/participants.controller.ts:41](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L41)

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md) \| `null`\>

Defined in: [apps/backend/src/participants/participants.controller.ts:50](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L50)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md) \| `null`\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/participants/participants.controller.ts:72](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L72)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateParticipantDto`): `string`

Defined in: [apps/backend/src/participants/participants.controller.ts:63](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/participants/participants.controller.ts#L63)

#### Parameters

##### id

`number`

##### updateParticipantDto

[`UpdateParticipantDto`](../../dto/update-participant.dto/classes/UpdateParticipantDto.md)

#### Returns

`string`
