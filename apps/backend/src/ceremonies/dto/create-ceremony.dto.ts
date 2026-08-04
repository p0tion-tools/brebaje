import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { CeremonyState, CeremonyType, UserProvider } from 'src/types/enums';

export class CreateCeremonyDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;

  @ApiProperty({ example: 'This is a test ceremony.', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ enum: CeremonyType, example: CeremonyType.PHASE2, required: false })
  @IsEnum(CeremonyType)
  type: CeremonyType;

  @ApiProperty({ enum: CeremonyState, example: CeremonyState.SCHEDULED, required: false })
  @IsEnum(CeremonyState)
  state: CeremonyState;

  @ApiProperty({ example: 1672531200 })
  @IsNumber()
  start_date: number;

  @ApiProperty({ example: 1675209600 })
  @IsNumber()
  end_date: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  penalty: number;

  @ApiProperty({
    enum: UserProvider,
    isArray: true,
    example: [UserProvider.GITHUB],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserProvider, { each: true })
  authProviders: UserProvider[];
}
