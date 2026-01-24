[**Brebaje Backend API v0.0.1**](../../README.md)

***

[Brebaje Backend API](../../README.md) / [utils](../README.md) / fetchWithTimeout

# Function: fetchWithTimeout()

> **fetchWithTimeout**(`url`, `options`, `timeoutMs`): `Promise`&lt;`Response`&gt;

Defined in: [apps/backend/src/utils/index.ts:45](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/utils/index.ts#L45)

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

`Promise`&lt;`Response`&gt;

Promise&lt;Response&gt;
