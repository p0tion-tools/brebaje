[**Brebaje Documentation**](../../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../../index.md) / [apps/backend/src/participants/dto/create-participant.dto](../index.md) / CreateParticipantDto

# Class: CreateParticipantDto

Defined in: [apps/backend/src/participants/dto/create-participant.dto.ts:10](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/dto/create-participant.dto.ts#L10)

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

Defined in: [apps/backend/src/participants/dto/create-participant.dto.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/participants/dto/create-participant.dto.ts#L17)
