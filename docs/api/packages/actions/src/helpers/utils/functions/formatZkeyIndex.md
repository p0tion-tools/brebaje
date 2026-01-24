[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/utils](../index.md) / formatZkeyIndex

# Function: formatZkeyIndex()

> **formatZkeyIndex**(`progress`): `string`

Defined in: [packages/actions/src/helpers/utils.ts:45](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/utils.ts#L45)

Transform a number in a zKey index format.

## Parameters

### progress

`number`

The progression in zKey index.

## Returns

`string`

The progression in a zKey index format (`XYZAB`).

## Remarks

This method is aligned with the number of characters of the genesis zKey index (which is a constant).
