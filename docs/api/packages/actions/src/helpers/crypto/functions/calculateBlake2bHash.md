[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/crypto](../index.md) / calculateBlake2bHash

# Function: calculateBlake2bHash()

> **calculateBlake2bHash**(`input`): `Promise`&lt;`string`&gt;

Defined in: [packages/actions/src/helpers/crypto.ts:24](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/crypto.ts#L24)

Calculate the Blake2b hash of a file or byte array.

## Parameters

### input

[`Blake2bInput`](../-internal-/type-aliases/Blake2bInput.md)

The file path (Node.js) or byte array (Node.js/Browser) to hash.

## Returns

`Promise`&lt;`string`&gt;

The hex-encoded Blake2b hash.
