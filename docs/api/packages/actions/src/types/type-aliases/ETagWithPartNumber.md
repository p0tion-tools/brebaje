[**Brebaje Documentation**](../../../../../index.md)

---

[Brebaje Documentation](../../../../../index.md) / [packages/actions/src/types](../index.md) / ETagWithPartNumber

# Type Alias: ETagWithPartNumber

> **ETagWithPartNumber** = `object`

Defined in: [packages/actions/src/types/index.d.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L17)

Group a pre-signed url chunk core information.

## Properties

### ETag

> **ETag**: `string` \| `undefined`

Defined in: [packages/actions/src/types/index.d.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L19)

A unique reference to this chunk associated to a pre-signed url

---

### PartNumber

> **PartNumber**: `number`

Defined in: [packages/actions/src/types/index.d.ts:21](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L21)

Indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download
