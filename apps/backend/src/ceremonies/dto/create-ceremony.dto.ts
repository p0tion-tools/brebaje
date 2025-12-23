import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import { CeremonyState, CeremonyType } from 'src/types/enums';

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

  @ApiProperty({ example: { github: true, eth: false } })
  @IsObject()
  authProviders: object;
}
