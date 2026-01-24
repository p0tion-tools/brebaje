[**Brebaje Documentation**](../../../../../index.md)

---

[Brebaje Documentation](../../../../../index.md) / [packages/actions/src/types](../index.md) / ChunkWithUrl

# Type Alias: ChunkWithUrl

> **ChunkWithUrl** = `object`

Defined in: [packages/actions/src/types/index.d.ts:5](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L5)

Define a custom file data chunk associated with a pre-signed url.

## Remarks

Useful when interacting with AWS S3 buckets using pre-signed urls for multi-part upload or download storing temporary information on the database.

## Properties

### chunk

> **chunk**: `Buffer`

Defined in: [packages/actions/src/types/index.d.ts:9](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L9)

The piece of information in bytes

---

### partNumber

> **partNumber**: `number`

Defined in: [packages/actions/src/types/index.d.ts:7](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L7)

Indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download

---

### preSignedUrl

> **preSignedUrl**: `string`

Defined in: [packages/actions/src/types/index.d.ts:11](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/types/index.d.ts#L11)

The unique reference to the pre-signed url to which this chunk is linked too
