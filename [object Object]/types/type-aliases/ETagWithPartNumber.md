[**Brebaje Backend API v0.0.1**](../../README.md)

***

[Brebaje Backend API](../../README.md) / [types](../README.md) / ETagWithPartNumber

# Type Alias: ETagWithPartNumber

> **ETagWithPartNumber** = `object`

Defined in: [apps/backend/src/types/index.ts:20](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/types/index.ts#L20)

Group a pre-signed url chunk core information.

## Properties

### ETag

> **ETag**: `string` \| `undefined`

Defined in: [apps/backend/src/types/index.ts:22](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/types/index.ts#L22)

A unique reference to this chunk associated to a pre-signed url

***

### PartNumber

> **PartNumber**: `number`

Defined in: [apps/backend/src/types/index.ts:24](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/types/index.ts#L24)

Indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download
