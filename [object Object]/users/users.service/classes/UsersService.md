[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [users/users.service](../README.md) / UsersService

# Class: UsersService

Defined in: [apps/backend/src/users/users.service.ts:19](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L19)

## Constructors

### Constructor

> **new UsersService**(`userModel`): `UsersService`

Defined in: [apps/backend/src/users/users.service.ts:20](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L20)

#### Parameters

##### userModel

*typeof* [`User`](../../user.model/classes/User.md)

#### Returns

`UsersService`

## Methods

### create()

> **create**(`createUserDto`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:25](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L25)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`User`](../../user.model/classes/User.md)[]\>

Defined in: [apps/backend/src/users/users.service.ts:42](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L42)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)[]\>

***

### findByDisplayName()

> **findByDisplayName**(`displayName`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:62](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L62)

#### Parameters

##### displayName

`string`

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findById()

> **findById**(`id`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:50](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L50)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findByIds()

> **findByIds**(`ids`): `Promise`\<[`User`](../../user.model/classes/User.md)[]\>

Defined in: [apps/backend/src/users/users.service.ts:104](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L104)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)[]\>

***

### findByProviderAndDisplayName()

> **findByProviderAndDisplayName**(`displayName`, `provider`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:76](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L76)

#### Parameters

##### displayName

`string`

##### provider

[`UserProvider`](../../../types/enums/enumerations/UserProvider.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findByWalletAddressAndProvider()

> **findByWalletAddressAndProvider**(`walletAddress`, `provider`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:90](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L90)

#### Parameters

##### walletAddress

`string`

##### provider

[`UserProvider`](../../../types/enums/enumerations/UserProvider.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### handleErrors()

> **handleErrors**(`error`): `never`

Defined in: [apps/backend/src/users/users.service.ts:141](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L141)

#### Parameters

##### error

`Error`

#### Returns

`never`

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/users/users.service.ts:128](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L128)

#### Parameters

##### id

`number`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateUserDto`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.service.ts:115](https://github.com/p0tion-tools/brebaje/blob/904e9eb12c4f184407795877a8c70cca972bcb97/apps/backend/src/users/users.service.ts#L115)

#### Parameters

##### id

`number`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>
