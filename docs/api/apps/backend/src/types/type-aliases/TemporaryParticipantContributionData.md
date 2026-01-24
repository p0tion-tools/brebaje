[**Brebaje Documentation**](../../../../../index.md)

---

[Brebaje Documentation](../../../../../index.md) / [apps/backend/src/types](../index.md) / TemporaryParticipantContributionData

# Type Alias: TemporaryParticipantContributionData

> **TemporaryParticipantContributionData** = `object`

Defined in: [apps/backend/src/types/index.ts:33](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/types/index.ts#L33)

Auxiliary data needed for resumption in an intermediate step of contribution.

## Remarks

The data is used when the current contributor interrupts during the download, contribute, upload steps
to prevent it from having to start over but can pick up where it left off.
This restart operation does NOT interact with the timeout mechanism (which remains unchanged).

## Properties

### chunks

> **chunks**: [`ETagWithPartNumber`](ETagWithPartNumber.md)[]

Defined in: [apps/backend/src/types/index.ts:39](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/types/index.ts#L39)

The list of ETags and PartNumbers that make up the chunks

---

### contributionComputationTime

> **contributionComputationTime**: `number`

Defined in: [apps/backend/src/types/index.ts:35](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/types/index.ts#L35)

The time spent since the contribution start

---

### uploadId

> **uploadId**: `string`

Defined in: [apps/backend/src/types/index.ts:37](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/types/index.ts#L37)

The unique identifier of the pre-signed url PUT request to upload the newest contribution
