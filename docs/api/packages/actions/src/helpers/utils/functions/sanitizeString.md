[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/utils](../index.md) / sanitizeString

# Function: sanitizeString()

> **sanitizeString**(`str`): `string`

Defined in: [packages/actions/src/helpers/utils.ts:90](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/utils.ts#L90)

Sanitize a string by replacing all special symbols and whitespaces with a hyphen ('-') and converting all uppercase characters to lowercase.

## Parameters

### str

`string`

The arbitrary string to sanitize.

## Returns

`string`

The sanitized string.

## Remarks

Useful for normalizing filenames or artifact names.

## Example

```ts
str = "Multiplier-2!2.4.zkey";
output = "multiplier-2-2-4-zkey";
```
