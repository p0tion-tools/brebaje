import { ApiProperty } from '@nestjs/swagger';

export class CreateContributionDto {
  @ApiProperty({ example: 1 })
  circuitId: number;

  @ApiProperty({ example: 1 })
  participantId: number;

  @ApiProperty({ example: 120, required: false })
  contributionComputationTime?: number;

  @ApiProperty({ example: 180, required: false })
  fullContributionTime?: number;

  @ApiProperty({ example: 60, required: false })
  verifyContributionTime?: number;

  @ApiProperty({ example: 1, required: false })
  zkeyIndex?: number;

  @ApiProperty({ example: true, required: false })
  valid?: boolean;

  @ApiProperty({ example: 1675209600, required: false })
  lastUpdated?: number;

  @ApiProperty({ example: {}, required: false })
  files?: object;

  @ApiProperty({ example: {}, required: false })
  verificationSoftware?: object;

  @ApiProperty({ example: {}, required: false })
  beacon?: object;
}
