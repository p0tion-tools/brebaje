[**Brebaje Backend API v0.0.1**](../../../../README.md)

***

[Brebaje Backend API](../../../../README.md) / [participants/dto/create-participant.dto](../README.md) / CreateParticipantDto

# Class: CreateParticipantDto

Defined in: [apps/backend/src/participants/dto/create-participant.dto.ts:10](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/dto/create-participant.dto.ts#L10)

Data Transfer Object for creating a participant.

## Param

The ID of the ceremony the participant is associated with
userId is obtained from the authenticated request context
Status and steps are set to default values upon creation

## Constructors

### Constructor

> **new CreateParticipantDto**(): `CreateParticipantDto`

#### Returns

`CreateParticipantDto`

## Properties

### ceremonyId

> **ceremonyId**: `number`

Defined in: [apps/backend/src/participants/dto/create-participant.dto.ts:17](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/participants/dto/create-participant.dto.ts#L17)
