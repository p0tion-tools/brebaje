import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ParticipantStatus, ParticipantContributionStep } from 'src/types/enums';
import { TemporaryParticipantContributionData } from 'src/types';

export class UpdateParticipantDto {
  @ApiPropertyOptional({
    enum: ParticipantStatus,
    description: 'The updated status of the participant.',
  })
  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;

  @ApiPropertyOptional({
    enum: ParticipantContributionStep,
    description: 'The updated contribution step of the participant.',
  })
  @IsOptional()
  @IsEnum(ParticipantContributionStep)
  contributionStep?: ParticipantContributionStep;

  @ApiPropertyOptional({
    description: 'Temporary contribution data used for resuming an interrupted contribution.',
  })
  @IsOptional()
  @IsObject()
  tempContributionData?: TemporaryParticipantContributionData;
}
