[**Brebaje Documentation**](../../../../../index.md)

---

[Brebaje Documentation](../../../../../index.md) / [apps/backend/src/utils](../index.md) / fetchWithTimeout

# Function: fetchWithTimeout()

> **fetchWithTimeout**(`url`, `options`, `timeoutMs`): `Promise`&lt;`Response`&gt;

Defined in: [apps/backend/src/utils/index.ts:45](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/utils/index.ts#L45)

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

Promise of Response
