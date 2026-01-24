[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/cli/src/utils/file_handling](../index.md) / getUrlsJson

# Function: getUrlsJson()

> **getUrlsJson**(`inputDir`, `providedPath?`): `string`

Defined in: [apps/cli/src/utils/file_handling.ts:55](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/cli/src/utils/file_handling.ts#L55)

Gets ceremony URLs JSON file from input directory with comprehensive validation

## Parameters

### inputDir

`string` = `"input"`

Input directory path (default: "input")

### providedPath?

`string`

Optional specific file path to use instead of searching

## Returns

`string`

Full path to the valid ceremony URLs JSON file

## Throws

Error with specific user guidance if file not found or invalid
