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
