[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/utils](../index.md) / convertBytesOrKbToGb

# Function: convertBytesOrKbToGb()

> **convertBytesOrKbToGb**(`bytesOrKb`, `isBytes`): `number`

Defined in: [packages/actions/src/helpers/utils.ts:36](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/utils.ts#L36)

Convert bytes or chilobytes into gigabytes with customizable precision.

## Parameters

### bytesOrKb

`number`

The amount of bytes or chilobytes to be converted.

### isBytes

`boolean`

True when the amount to be converted is in bytes; otherwise false (= Chilobytes).

## Returns

`number`

The converted amount in GBs.
