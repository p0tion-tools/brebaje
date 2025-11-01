import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SetupVmDto {
  @ApiProperty({
    description: 'EC2 Instance ID to setup',
    example: 'i-1234567890abcdef0',
  })
  @IsString()
  @IsNotEmpty()
  instanceId: string;

  @ApiProperty({
    description: 'S3 bucket name for downloading dependencies',
    example: 'cardano-trusted-setup-test',
  })
  @IsString()
  @IsNotEmpty()
  bucketName: string;

  @ApiProperty({
    description: 'Path to zKey file in S3 for caching',
    example: 'circuits/genesis.zkey',
    required: false,
  })
  @IsString()
  zKeyPath?: string;

  @ApiProperty({
    description: 'Path to Powers of Tau file in S3 for caching',
    example: 'powers-of-tau/pot12.ptau',
    required: false,
  })
  potPath?: string;
}
