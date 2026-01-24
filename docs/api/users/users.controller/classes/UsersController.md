[**Brebaje Backend API v0.0.1**](../../../README.md)

***

[Brebaje Backend API](../../../README.md) / [users/users.controller](../README.md) / UsersController

# Class: UsersController

Defined in: [apps/backend/src/users/users.controller.ts:10](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L10)

## Constructors

### Constructor

> **new UsersController**(`usersService`): `UsersController`

Defined in: [apps/backend/src/users/users.controller.ts:11](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L11)

#### Parameters

##### usersService

[`UsersService`](../../users.service/classes/UsersService.md)

#### Returns

`UsersController`

## Methods

### create()

> **create**(`createUserDto`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.controller.ts:17](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L17)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`User`](../../user.model/classes/User.md)[]\>

Defined in: [apps/backend/src/users/users.controller.ts:24](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L24)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)[]\>

***

### findByDisplayName()

> **findByDisplayName**(`displayName`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L42)

#### Parameters

##### displayName

`string`

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findById()

> **findById**(`id`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.controller.ts:33](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L33)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>

***

### findByIds()

> **findByIds**(`ids`): `Promise`\<[`User`](../../user.model/classes/User.md)[]\>

Defined in: [apps/backend/src/users/users.controller.ts:50](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L50)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)[]\>

***

### remove()

> **remove**(`id`): `Promise`\<\{ `message`: `string`; \}\>

Defined in: [apps/backend/src/users/users.controller.ts:68](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L68)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `message`: `string`; \}\>

***

### update()

> **update**(`id`, `updateUserDto`): `Promise`\<[`User`](../../user.model/classes/User.md)\>

Defined in: [apps/backend/src/users/users.controller.ts:59](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/users.controller.ts#L59)

#### Parameters

##### id

`string`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`\<[`User`](../../user.model/classes/User.md)\>
