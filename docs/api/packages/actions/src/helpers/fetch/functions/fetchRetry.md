[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/fetch](../index.md) / fetchRetry

# Function: fetchRetry()

> **fetchRetry**(`url`, `options?`): `Promise`&lt;`Response`&gt;

Defined in: [packages/actions/src/helpers/fetch.ts:21](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L21)

Fetch with automatic retry on failure

## Parameters

### url

`string`

The URL to fetch

### options?

`RequestInit` & `object`

Fetch options including retry configuration

## Returns

`Promise`&lt;`Response`&gt;

Promise resolving to the Response
