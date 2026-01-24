[**Brebaje Backend API v0.0.1**](../../../../README.md)

***

[Brebaje Backend API](../../../../README.md) / [auth/guards/jwt-auth.guard](../README.md) / JwtAuthGuard

# Class: JwtAuthGuard

Defined in: [apps/backend/src/auth/guards/jwt-auth.guard.ts:30](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/auth/guards/jwt-auth.guard.ts#L30)

JWT authentication guard that validates JWT tokens and attaches user to request.

Extracts the JWT token from the Authorization header, verifies it,
and attaches the user object to the request for use in controllers.

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new JwtAuthGuard**(`jwtService`): `JwtAuthGuard`

Defined in: [apps/backend/src/auth/guards/jwt-auth.guard.ts:31](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/auth/guards/jwt-auth.guard.ts#L31)

#### Parameters

##### jwtService

`JwtService`

#### Returns

`JwtAuthGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`\<`boolean`\>

Defined in: [apps/backend/src/auth/guards/jwt-auth.guard.ts:40](https://github.com/p0tion-tools/brebaje/blob/adec25cb37dc5c3412576402afa3a4ca679730fd/apps/backend/src/auth/guards/jwt-auth.guard.ts#L40)

Validates the JWT token and attaches user to request.

#### Parameters

##### context

`ExecutionContext`

The execution context containing request information

#### Returns

`Promise`\<`boolean`\>

True if authentication is valid, throws UnauthorizedException otherwise

#### Throws

UnauthorizedException If token is missing or invalid

#### Implementation of

`CanActivate.canActivate`
