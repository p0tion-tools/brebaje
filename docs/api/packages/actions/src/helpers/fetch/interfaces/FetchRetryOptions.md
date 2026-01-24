[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [packages/actions/src/helpers/fetch](../index.md) / FetchRetryOptions

# Interface: FetchRetryOptions

Defined in: [packages/actions/src/helpers/fetch.ts:4](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L4)

Options for configuring fetch retry behavior

## Properties

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/actions/src/helpers/fetch.ts:12](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L12)

Maximum number of retry attempts (default: unlimited within retryMaxDuration)

---

### retryInitialDelay?

> `optional` **retryInitialDelay**: `number`

Defined in: [packages/actions/src/helpers/fetch.ts:6](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L6)

Initial delay before first retry in milliseconds

---

### retryMaxDuration?

> `optional` **retryMaxDuration**: `number`

Defined in: [packages/actions/src/helpers/fetch.ts:8](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L8)

Maximum time to keep retrying in milliseconds

---

### socketTimeout?

> `optional` **socketTimeout**: `number`

Defined in: [packages/actions/src/helpers/fetch.ts:10](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/packages/actions/src/helpers/fetch.ts#L10)

Socket timeout in milliseconds
