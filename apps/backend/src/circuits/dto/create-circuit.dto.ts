import { ApiProperty } from '@nestjs/swagger';
import { CircuitTimeoutType } from 'src/types/enums';

export class CreateCircuitDto {
  @ApiProperty({ example: 1 })
  ceremonyId: number;

  @ApiProperty({ example: 'My Circuit' })
  name: string;

  @ApiProperty({ enum: CircuitTimeoutType, example: CircuitTimeoutType.FIXED, required: false })
  timeoutMechanismType: CircuitTimeoutType;

  @ApiProperty({ example: 10, required: false })
  dynamicThreshold?: number;

  @ApiProperty({ example: 3600, required: false })
  fixedTimeWindow?: number;

  @ApiProperty({ example: 1 })
  sequencePosition: number;

  @ApiProperty({ example: 1024, required: false })
  zKeySizeInBytes?: number;

  @ApiProperty({ example: 1000, required: false })
  constraints?: number;

  @ApiProperty({ example: 12, required: false })
  pot?: number;

  @ApiProperty({ example: 120, required: false })
  averageContributionComputationTime?: number;

  @ApiProperty({ example: 180, required: false })
  averageFullContributionTime?: number;

  @ApiProperty({ example: 60, required: false })
  averageVerifyContributionTime?: number;

  @ApiProperty({ example: {}, required: false })
  compiler?: object;

  @ApiProperty({ example: {}, required: false })
  template?: object;

  @ApiProperty({ example: {}, required: false })
  verification?: object;

  @ApiProperty({ example: {}, required: false })
  artifacts?: object;

  @ApiProperty({ example: {}, required: false })
  metadata?: object;

  @ApiProperty({ example: {}, required: false })
  files?: object;
}
