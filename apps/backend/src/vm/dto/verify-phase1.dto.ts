import { ApiProperty } from '@nestjs/swagger';

export class VerifyPhase1Dto {
  @ApiProperty({ example: 'i-1234567890abcdef0', description: 'EC2 Instance ID' })
  instanceId: string;

  @ApiProperty({ example: 'my-ceremony-bucket', description: 'S3 Bucket name' })
  bucketName: string;

  @ApiProperty({
    example: 'ceremonies/ceremony_01/powersoftau/final_28.ptau',
    description: 'Path to ptau file in S3 bucket',
  })
  lastPtauStoragePath: string;
}
