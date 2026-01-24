[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/utils](../index.md) / computeSmallestPowersOfTauForCircuit

# Function: computeSmallestPowersOfTauForCircuit()

> **computeSmallestPowersOfTauForCircuit**(`constraints`, `outputs`): `number`

Defined in: [packages/actions/src/helpers/utils.ts:10](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/utils.ts#L10)

Calculate the smallest amount of Powers of Tau needed for a circuit with a constraint size.

## Parameters

### constraints

`number`

The number of circuit constraints (extracted from metadata).

### outputs

`number`

The number of circuit outputs (extracted from metadata)

## Returns

`number`

The smallest amount of Powers of Tau for the given constraint size.
