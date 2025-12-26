import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { CircuitArtifactsType, CircuitVerificationType } from 'src/types/declarations';
import { CircuitTimeoutType } from 'src/types/enums';
import { CircuitAttributes } from '../circuit.model';

export class CreateCircuitDto implements Partial<CircuitAttributes> {
  @ApiProperty({ example: 1 })
  @IsNumber()
  ceremonyId: number;

  @ApiProperty({ example: 'My Circuit' })
  @IsString()
  name: string;

  @ApiProperty({ enum: CircuitTimeoutType, example: CircuitTimeoutType.FIXED, required: false })
  @IsEnum(CircuitTimeoutType)
  timeoutMechanismType: CircuitTimeoutType;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @IsOptional()
  dynamicThreshold?: number;

  @ApiProperty({ example: 3600, required: false })
  @IsNumber()
  @IsOptional()
  fixedTimeWindow?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sequencePosition: number;

  @ApiProperty({ example: 1024, required: false })
  @IsNumber()
  @IsOptional()
  zKeySizeInBytes?: number;

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  constraints?: number;

  @ApiProperty({ example: 12, required: false })
  @IsNumber()
  @IsOptional()
  pot?: number;

  @ApiProperty({ example: 120, required: false })
  @IsNumber()
  @IsOptional()
  averageContributionComputationTime?: number;

  @ApiProperty({ example: 180, required: false })
  @IsNumber()
  @IsOptional()
  averageFullContributionTime?: number;

  @ApiProperty({ example: 60, required: false })
  @IsNumber()
  @IsOptional()
  averageVerifyContributionTime?: number;

  @ApiProperty({ example: {}, required: false })
  @IsObject()
  @IsOptional()
  compiler?: object;

  @ApiProperty({ example: {}, required: false })
  @IsObject()
  @IsOptional()
  template?: object;

  @ApiProperty({ example: {} })
  @IsObject()
  verification: CircuitVerificationType;

  @ApiProperty({ example: {} })
  @IsObject()
  artifacts: CircuitArtifactsType;

  @ApiProperty({ example: {}, required: false })
  @IsObject()
  @IsOptional()
  metadata?: object;

  @ApiProperty({ example: {}, required: false })
  @IsObject()
  @IsOptional()
  files?: object;
}
