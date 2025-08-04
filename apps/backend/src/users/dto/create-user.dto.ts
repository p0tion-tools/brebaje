import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { USER_PROVIDER, UserAttributes } from '../user.model';

export class CreateUserDto implements UserAttributes {
  @ApiProperty({
    description: 'The display name of the user',
    example: 'NicoSerranoP',
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    description: 'The creation time of the user in milliseconds since epoch',
    example: 1633072800000,
  })
  @IsNumber()
  creationTime: number;

  @ApiProperty({
    description: 'The avatar URL of the user',
    example: 'https://example.com/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'The provider of the user',
    example: USER_PROVIDER.GITHUB,
  })
  @IsEnum(USER_PROVIDER)
  provider: USER_PROVIDER;
}
