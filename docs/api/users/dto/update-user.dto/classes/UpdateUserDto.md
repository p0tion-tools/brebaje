[**Brebaje Backend API v0.0.1**](../../../../README.md)

***

[Brebaje Backend API](../../../../README.md) / [users/dto/update-user.dto](../README.md) / UpdateUserDto

# Class: UpdateUserDto

Defined in: [apps/backend/src/users/dto/update-user.dto.ts:4](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/dto/update-user.dto.ts#L4)

## Extends

- `Partial`\<[`CreateUserDto`](../../create-user.dto/classes/CreateUserDto.md)\>

## Constructors

### Constructor

> **new UpdateUserDto**(): `UpdateUserDto`

Defined in: node\_modules/.pnpm/@nestjs+mapped-types@2.1.0\_@nestjs+common@11.1.5\_class-transformer@0.5.1\_class-validato\_b97692f934298cef4f4faf7219579491/node\_modules/@nestjs/mapped-types/dist/mapped-type.interface.d.ts:3

#### Returns

`UpdateUserDto`

#### Inherited from

`PartialType(CreateUserDto).constructor`

### Constructor

> **new UpdateUserDto**(...`args`): `UpdateUserDto`

Defined in: node\_modules/.pnpm/@nestjs+mapped-types@2.1.0\_@nestjs+common@11.1.5\_class-transformer@0.5.1\_class-validato\_b97692f934298cef4f4faf7219579491/node\_modules/@nestjs/mapped-types/dist/mapped-type.interface.d.ts:3

#### Parameters

##### args

...`any`[]

#### Returns

`UpdateUserDto`

#### Inherited from

`PartialType(CreateUserDto).constructor`

## Properties

### avatarUrl?

> `optional` **avatarUrl**: `string`

Defined in: [apps/backend/src/users/dto/create-user.dto.ts:31](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/dto/create-user.dto.ts#L31)

#### Inherited from

[`CreateUserDto`](../../create-user.dto/classes/CreateUserDto.md).[`avatarUrl`](../../create-user.dto/classes/CreateUserDto.md#avatarurl)

***

### displayName?

> `optional` **displayName**: `string`

Defined in: [apps/backend/src/users/dto/create-user.dto.ts:12](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/dto/create-user.dto.ts#L12)

#### Inherited from

[`CreateUserDto`](../../create-user.dto/classes/CreateUserDto.md).[`displayName`](../../create-user.dto/classes/CreateUserDto.md#displayname)

***

### provider?

> `optional` **provider**: [`UserProvider`](../../../../types/enums/enumerations/UserProvider.md)

Defined in: [apps/backend/src/users/dto/create-user.dto.ts:38](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/dto/create-user.dto.ts#L38)

#### Inherited from

[`CreateUserDto`](../../create-user.dto/classes/CreateUserDto.md).[`provider`](../../create-user.dto/classes/CreateUserDto.md#provider)

***

### walletAddress?

> `optional` **walletAddress**: `string`

Defined in: [apps/backend/src/users/dto/create-user.dto.ts:22](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/users/dto/create-user.dto.ts#L22)

#### Inherited from

[`CreateUserDto`](../../create-user.dto/classes/CreateUserDto.md).[`walletAddress`](../../create-user.dto/classes/CreateUserDto.md#walletaddress)
