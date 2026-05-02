import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { TemporaryParticipantContributionData } from 'src/types';

export class UpdateParticipantDto {
  @ApiPropertyOptional({
    description: 'Temporary contribution data used for resuming an interrupted contribution.',
  })
  @IsOptional()
  @IsObject()
  tempContributionData?: TemporaryParticipantContributionData;
}
