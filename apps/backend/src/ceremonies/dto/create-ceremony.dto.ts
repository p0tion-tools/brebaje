import { ApiProperty } from '@nestjs/swagger';
import { CeremonyState, CeremonyType } from 'src/types/enums';

export class CreateCeremonyDto {
  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 'This is a test ceremony.', required: false })
  description?: string;

  @ApiProperty({ enum: CeremonyType, example: CeremonyType.PHASE2, required: false })
  type: CeremonyType;

  @ApiProperty({ enum: CeremonyState, example: CeremonyState.SCHEDULED, required: false })
  state: CeremonyState;

  @ApiProperty({ example: 1672531200 })
  start_date: number;

  @ApiProperty({ example: 1675209600 })
  end_date: number;

  @ApiProperty({ example: 100 })
  penalty: number;

  @ApiProperty({ example: { github: true, eth: false } })
  authProviders: object;
}
