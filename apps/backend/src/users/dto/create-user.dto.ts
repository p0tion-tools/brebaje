import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserProvider } from 'src/types/enums';
import { UserAttributes } from '../user.model';

export class CreateUserDto implements UserAttributes {
  @ApiProperty({
    description: 'The id of the user',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

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
    description: 'The last sign time of the user in milliseconds since epoch',
    example: 1633072800000,
  })
  @IsOptional()
  @IsNumber()
  lastSignInTime: number;

  @ApiProperty({
    description: 'The last profile update time of the user in milliseconds since epoch',
    example: 1633072800000,
  })
  @IsOptional()
  @IsNumber()
  lastUpdated: number;

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
    example: UserProvider.GITHUB,
  })
  @IsEnum(UserProvider)
  provider: UserProvider;

  @ApiProperty({
    description: 'The GitHub user ID',
    example: 123456,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  githubId?: number;
}
