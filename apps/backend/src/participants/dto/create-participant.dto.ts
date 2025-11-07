import { ApiProperty } from '@nestjs/swagger';
import { ParticipantContributionStep, ParticipantStatus } from 'src/types/enums';

export class CreateParticipantDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  ceremonyId: number;

  @ApiProperty({ enum: ParticipantStatus, example: ParticipantStatus.CREATED, required: false })
  status: ParticipantStatus;

  @ApiProperty({
    enum: ParticipantContributionStep,
    example: ParticipantContributionStep.DOWNLOADING,
    required: false,
  })
  contributionStep?: ParticipantContributionStep;

  @ApiProperty({ example: 0, required: false })
  contributionProgress?: number;

  @ApiProperty({ example: 1675209600, required: false })
  contributionStartedAt?: number;

  @ApiProperty({ example: 1675209600, required: false })
  verificationStartedAt?: number;

  @ApiProperty({ example: {}, required: false })
  tempContributionData?: object;

  @ApiProperty({ example: {}, required: false })
  timeout?: object;
}
