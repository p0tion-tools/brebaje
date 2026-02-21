import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for creating a contribution.
 *
 * @param circuitId - The ID of the circuit being contributed to
 * @param participantId - The ID of the participant making the contribution
 */
export class CreateContributionDto {
  @ApiProperty({ example: 1, description: 'ID of the circuit being contributed to' })
  @IsNumber()
  circuitId: number;

  @ApiProperty({ example: 1, description: 'ID of the participant making the contribution' })
  @IsNumber()
  participantId: number;

  @ApiProperty({
    example: 120,
    required: false,
    description: 'Time spent computing the contribution (ms)',
  })
  @IsOptional()
  @IsNumber()
  contributionComputationTime?: number;

  @ApiProperty({ example: 180, required: false, description: 'Total contribution time (ms)' })
  @IsOptional()
  @IsNumber()
  fullContributionTime?: number;

  @ApiProperty({
    example: 60,
    required: false,
    description: 'Time spent verifying the contribution (ms)',
  })
  @IsOptional()
  @IsNumber()
  verifyContributionTime?: number;

  @ApiProperty({ example: 1, required: false, description: 'Index of the zKey file' })
  @IsOptional()
  @IsNumber()
  zkeyIndex?: number;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Whether the contribution passed verification',
  })
  @IsOptional()
  @IsBoolean()
  valid?: boolean;

  @ApiProperty({
    example: 1675209600,
    required: false,
    description: 'Timestamp of the last update',
  })
  @IsOptional()
  @IsNumber()
  lastUpdated?: number;

  @ApiProperty({ example: {}, required: false, description: 'Contribution file references' })
  @IsOptional()
  @IsObject()
  files?: object;

  @ApiProperty({ example: {}, required: false, description: 'Verification software metadata' })
  @IsOptional()
  @IsObject()
  verificationSoftware?: object;

  @ApiProperty({ example: {}, required: false, description: 'Beacon data for finalization' })
  @IsOptional()
  @IsObject()
  beacon?: object;
}
