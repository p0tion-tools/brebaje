[**Brebaje Documentation**](../../../../../index.md)

---

[Brebaje Documentation](../../../../../index.md) / [packages/actions/src/types](../index.md) / TemporaryParticipantContributionData

# Type Alias: TemporaryParticipantContributionData

> **TemporaryParticipantContributionData** = `object`

Defined in: [packages/actions/src/types/index.d.ts:30](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L30)

Auxiliary data needed for resumption in an intermediate step of contribution.

## Remarks

The data is used when the current contributor interrupts during the download, contribute, upload steps
to prevent it from having to start over but can pick up where it left off.
This restart operation does NOT interact with the timeout mechanism (which remains unchanged).

## Properties

### chunks

> **chunks**: [`ETagWithPartNumber`](ETagWithPartNumber.md)[]

Defined in: [packages/actions/src/types/index.d.ts:36](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L36)

The list of ETags and PartNumbers that make up the chunks

---

### contributionComputationTime

> **contributionComputationTime**: `number`

Defined in: [packages/actions/src/types/index.d.ts:32](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L32)

The time spent since the contribution start

---

### uploadId

> **uploadId**: `string`

Defined in: [packages/actions/src/types/index.d.ts:34](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L34)

The unique identifier of the pre-signed url PUT request to upload the newest contribution
