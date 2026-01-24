[**Brebaje Backend API v0.0.1**](../../index.md)

***

[Brebaje Backend API](../../index.md) / [utils](../index.md) / fetchWithTimeout

# Function: fetchWithTimeout()

> **fetchWithTimeout**(`url`, `options`, `timeoutMs`): `Promise`\<`Response`\>

Defined in: [apps/backend/src/utils/index.ts:45](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/utils/index.ts#L45)

Fetch with timeout and proper error handling

## Parameters

### url

`string`

The URL to fetch

### options

`RequestInit` = `{}`

Fetch options

### timeoutMs

`number` = `10000`

Timeout in milliseconds (default: 10000)

## Returns

`Promise`\<`Response`\>

Promise&lt;Response&gt;
