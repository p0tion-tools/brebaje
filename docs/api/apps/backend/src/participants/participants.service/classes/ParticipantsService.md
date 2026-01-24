[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/participants/participants.service](../index.md) / ParticipantsService

# Class: ParticipantsService

Defined in: [apps/backend/src/participants/participants.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L25)

## Constructors

### Constructor

> **new ParticipantsService**(`participantModel`, `circuitsService`, `contributionsService`): `ParticipantsService`

Defined in: [apps/backend/src/participants/participants.service.ts:26](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L26)

#### Parameters

##### participantModel

_typeof_ [`Participant`](../../participant.model/classes/Participant.md)

##### circuitsService

[`CircuitsService`](../../../circuits/circuits.service/classes/CircuitsService.md)

##### contributionsService

[`ContributionsService`](../../../contributions/contributions.service/classes/ContributionsService.md)

#### Returns

`ParticipantsService`

## Methods

### addParticipantToCircuitsQueues()

> **addParticipantToCircuitsQueues**(`participant`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:196](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L196)

#### Parameters

##### participant

[`Participant`](../../participant.model/classes/Participant.md)

#### Returns

`Promise`&lt;`void`&gt;

---

### checkPreConditionForCurrentContributorToInteractWithMultiPartUpload()

> **checkPreConditionForCurrentContributorToInteractWithMultiPartUpload**(`userId`, `ceremonyId`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:134](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L134)

Check if the pre-condition for interacting with a multi-part upload for an identified current contributor is valid.
The precondition is to be a current contributor (contributing status) in the uploading contribution step.

#### Parameters

##### userId

`number`

The user ID of the participant

##### ceremonyId

`number`

The ceremony ID

#### Returns

`Promise`&lt;`void`&gt;

#### Throws

BadRequestException if the participant is not in CONTRIBUTING status or not in UPLOADING step.

---

### checkUploadingFileValidity()

> **checkUploadingFileValidity**(`userId`, `ceremonyId`, `objectKey`): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:161](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L161)

Helper function to check whether a contributor is uploading a file related to its contribution.

#### Parameters

##### userId

`number`

The unique identifier of the contributor

##### ceremonyId

`number`

The unique identifier of the ceremony

##### objectKey

`string`

The object key of the file being uploaded

#### Returns

`Promise`&lt;`void`&gt;

---

### create()

> **create**(`createParticipantDto`, `userId`): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:42](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L42)

Creates a new participant.

#### Parameters

##### createParticipantDto

[`CreateParticipantDto`](../../dto/create-participant.dto/classes/CreateParticipantDto.md)

The DTO containing participant creation data

##### userId

`number`

The ID of the authenticated user creating the participant

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

The created participant

---

### findAll()

> **findAll**(): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:57](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L57)

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

---

### findByUserIdAndCeremonyId()

> **findByUserIdAndCeremonyId**(`userId`, `ceremonyId`): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:65](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L65)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

---

### findOne()

> **findOne**(`id`): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:61](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L61)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)&gt;

---

### findTimedOutParticipantsOfOpenCeremonies()

> **findTimedOutParticipantsOfOpenCeremonies**(): `Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:81](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L81)

#### Returns

`Promise`&lt;[`Participant`](../../participant.model/classes/Participant.md)[]&gt;

---

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/participants/participants.service.ts:245](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L245)

#### Parameters

##### error

`Error`

#### Returns

`never`

---

### monitorTimedOutParticipants()

> **monitorTimedOutParticipants**(): `Promise`&lt;`void`&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:230](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L230)

#### Returns

`Promise`&lt;`void`&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/participants/participants.service.ts:112](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L112)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `_updateParticipantDto`): `string`

Defined in: [apps/backend/src/participants/participants.service.ts:108](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/participants.service.ts#L108)

Updates a participant by ID.

#### Parameters

##### id

`number`

The participant's unique identifier

##### \_updateParticipantDto

[`UpdateParticipantDto`](../../dto/update-participant.dto/classes/UpdateParticipantDto.md)

The DTO containing the updated participant data

#### Returns

`string`

A message indicating the update action (not yet implemented)
