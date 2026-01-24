[**Brebaje Documentation**](../../../../../../index.md)

---

[Brebaje Documentation](../../../../../../index.md) / [apps/backend/src/users/users.controller](../index.md) / UsersController

# Class: UsersController

Defined in: [apps/backend/src/users/users.controller.ts:10](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L10)

## Constructors

### Constructor

> **new UsersController**(`usersService`): `UsersController`

Defined in: [apps/backend/src/users/users.controller.ts:11](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L11)

#### Parameters

##### usersService

[`UsersService`](../../users.service/classes/UsersService.md)

#### Returns

`UsersController`

## Methods

### create()

> **create**(`createUserDto`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.controller.ts:17](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L17)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findAll()

> **findAll**(): `Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

Defined in: [apps/backend/src/users/users.controller.ts:24](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L24)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

---

### findByDisplayName()

> **findByDisplayName**(`displayName`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.controller.ts:42](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L42)

#### Parameters

##### displayName

`string`

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findById()

> **findById**(`id`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.controller.ts:33](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L33)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

---

### findByIds()

> **findByIds**(`ids`): `Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

Defined in: [apps/backend/src/users/users.controller.ts:50](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L50)

#### Parameters

##### ids

`number`[]

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)[]&gt;

---

### remove()

> **remove**(`id`): `Promise`&lt;\{ `message`: `string`; \}&gt;

Defined in: [apps/backend/src/users/users.controller.ts:68](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L68)

#### Parameters

##### id

`string`

#### Returns

`Promise`&lt;\{ `message`: `string`; \}&gt;

---

### update()

> **update**(`id`, `updateUserDto`): `Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;

Defined in: [apps/backend/src/users/users.controller.ts:59](https://github.com/p0tion-tools/brebaje/blob/d46df74e1ac0040aa4be8ad632f25004641f167b/apps/backend/src/users/users.controller.ts#L59)

#### Parameters

##### id

`string`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`&lt;[`User`](../../user.model/classes/User.md)&gt;
