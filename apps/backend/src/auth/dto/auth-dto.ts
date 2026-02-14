import { Allow, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.model';
import { DataSignature } from '@meshsdk/core';

export class JWTDto {
  @IsNumber()
  exp: number;

  @IsString()
  sub: string;

  @Allow()
  user: User;
}

export class DeviceFlowTokenDto {
  @IsString()
  access_token: string;

  @IsString()
  token_type: string;
}

export interface AuthResponseDto {
  user: User;
  jwt: string;
}

export class GenerateNonceDto {
  @ApiProperty({
    description: 'Cardano wallet address',
    example:
      'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a3s2rw5tkqqpyr0x8',
  })
  @IsString()
  userAddress: string;
}

export class VerifySignatureDto {
  @ApiProperty({
    description: 'Cardano wallet address',
    example:
      'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a3s2rw5tkqqpyr0x8',
  })
  @IsString()
  userAddress: string;

  @ApiProperty({
    description: 'Cryptographic signature from wallet',
    example: '{"signature":"a4010103...", "key":"a4010103..."}',
  })
  @Allow()
  signature: DataSignature; // DataSignature type from MeshSDK
}

export class TestLoginDto {
  @ApiProperty({
    description: 'ID of the user to authenticate',
    example: 1,
  })
  @IsNumber()
  userId: number;
}

/**
 * DTO for requesting a SIWE nonce for Ethereum authentication
 */
export class GenerateEthNonceDto {
  @ApiProperty({
    description: 'Ethereum wallet address (0x prefixed)',
    example: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  })
  @IsString()
  address: string;
}

/**
 * DTO for verifying SIWE signature
 */
export class VerifyEthSignatureDto {
  @ApiProperty({
    description: 'The SIWE message that was signed',
    example:
      'example.com wants you to sign in with your Ethereum account:\n0x71C7656EC7ab88b098defB751B7401B5f6d8976F\n\nSign in to Brebaje\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: abc123\nIssued At: 2023-01-01T00:00:00.000Z',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The cryptographic signature from the wallet',
    example:
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
  })
  @IsString()
  signature: string;
}
