[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [participants/participants.service](../README.md) / ParticipantsService

# Class: ParticipantsService

Defined in: [apps/backend/src/participants/participants.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L25)

## Constructors

### Constructor

> **new ParticipantsService**(`participantModel`, `circuitsService`, `contributionsService`): `ParticipantsService`

Defined in: [apps/backend/src/participants/participants.service.ts:26](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L26)

#### Parameters

##### participantModel

*typeof* [`Participant`](../../participant.model/classes/Participant.md)

##### circuitsService

[`CircuitsService`](../../../circuits/circuits.service/classes/CircuitsService.md)

##### contributionsService

[`ContributionsService`](../../../contributions/contributions.service/classes/ContributionsService.md)

#### Returns

`ParticipantsService`

## Methods

### addParticipantToCircuitsQueues()

> **addParticipantToCircuitsQueues**(`participant`): `Promise`\<`void`\>

Defined in: [apps/backend/src/participants/participants.service.ts:196](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L196)

#### Parameters

##### participant

[`Participant`](../../participant.model/classes/Participant.md)

#### Returns

`Promise`\<`void`\>

***

### checkPreConditionForCurrentContributorToInteractWithMultiPartUpload()

> **checkPreConditionForCurrentContributorToInteractWithMultiPartUpload**(`userId`, `ceremonyId`): `Promise`\<`void`\>

Defined in: [apps/backend/src/participants/participants.service.ts:134](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L134)

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

`Promise`\<`void`\>

#### Throws

BadRequestException if the participant is not in CONTRIBUTING status or not in UPLOADING step.

***

### checkUploadingFileValidity()

> **checkUploadingFileValidity**(`userId`, `ceremonyId`, `objectKey`): `Promise`\<`void`\>

Defined in: [apps/backend/src/participants/participants.service.ts:161](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L161)

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

`Promise`\<`void`\>

***

### create()

> **create**(`createParticipantDto`, `userId`): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

Defined in: [apps/backend/src/participants/participants.service.ts:42](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L42)

Creates a new participant.

#### Parameters

##### createParticipantDto

[`CreateParticipantDto`](../../dto/create-participant.dto/classes/CreateParticipantDto.md)

The DTO containing participant creation data

##### userId

`number`

The ID of the authenticated user creating the participant

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

The created participant

***

### findAll()

> **findAll**(): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

Defined in: [apps/backend/src/participants/participants.service.ts:57](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L57)

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

***

### findByUserIdAndCeremonyId()

> **findByUserIdAndCeremonyId**(`userId`, `ceremonyId`): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

Defined in: [apps/backend/src/participants/participants.service.ts:65](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L65)

#### Parameters

##### userId

`number`

##### ceremonyId

`number`

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md) \| `null`\>

Defined in: [apps/backend/src/participants/participants.service.ts:61](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L61)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md) \| `null`\>

***

### findTimedOutParticipantsOfOpenCeremonies()

> **findTimedOutParticipantsOfOpenCeremonies**(): `Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

Defined in: [apps/backend/src/participants/participants.service.ts:81](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L81)

#### Returns

`Promise`\<[`Participant`](../../participant.model/classes/Participant.md)[]\>

***

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/participants/participants.service.ts:245](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L245)

#### Parameters

##### error

`Error`

#### Returns

`never`

***

### monitorTimedOutParticipants()

> **monitorTimedOutParticipants**(): `Promise`\<`void`\>

Defined in: [apps/backend/src/participants/participants.service.ts:230](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L230)

#### Returns

`Promise`\<`void`\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/participants/participants.service.ts:112](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L112)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `_updateParticipantDto`): `string`

Defined in: [apps/backend/src/participants/participants.service.ts:108](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/participants.service.ts#L108)

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
