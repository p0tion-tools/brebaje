[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/users/users.service](../index.md) / UsersService

# Class: UsersService

Defined in: [apps/backend/src/users/users.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L19)

## Constructors

### Constructor

> **new UsersService**(`userModel`): `UsersService`

Defined in: [apps/backend/src/users/users.service.ts:20](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L20)

#### Parameters

##### userModel

_typeof_ [`User`](../../user.model/classes/User.md)

#### Returns

`UsersService`

## Methods

### create()

> **create**(`createUserDto`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L25)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

Defined in: [apps/backend/src/users/users.service.ts:42](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L42)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

---

### findByDisplayName()

> **findByDisplayName**(`displayName`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:62](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L62)

#### Parameters

##### displayName

`string`

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findById()

> **findById**(`id`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:50](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L50)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findByIds()

> **findByIds**(`ids`): `Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

Defined in: [apps/backend/src/users/users.service.ts:104](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L104)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

---

### findByProviderAndDisplayName()

> **findByProviderAndDisplayName**(`displayName`, `provider`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:76](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L76)

#### Parameters

##### displayName

`string`

##### provider

[`UserProvider`](../../../types/enums/enumerations/UserProvider.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findByWalletAddressAndProvider()

> **findByWalletAddressAndProvider**(`walletAddress`, `provider`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L90)

#### Parameters

##### walletAddress

`string`

##### provider

[`UserProvider`](../../../types/enums/enumerations/UserProvider.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/users/users.service.ts:141](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L141)

#### Parameters

##### error

`Error`

#### Returns

`never`

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/users/users.service.ts:128](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L128)

#### Parameters

##### id

`number`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateUserDto`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.service.ts:115](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.service.ts#L115)

#### Parameters

##### id

`number`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;
