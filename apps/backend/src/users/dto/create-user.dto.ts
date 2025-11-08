import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserProvider } from 'src/types/enums';
import { UserAttributes } from '../user.model';

export class CreateUserDto implements Partial<UserAttributes> {
  @ApiProperty({
    description: 'The display name of the user (provider-specific stable username)',
    example: 'NicoSerranoP',
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    description: 'The wallet address of the user (for Cardano authentication)',
    example:
      'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a3s2rw5tkqqpyr0x8',
    required: false,
  })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'The OAuth provider of the user',
    example: UserProvider.GITHUB,
  })
  @IsEnum(UserProvider)
  provider: UserProvider;
}
