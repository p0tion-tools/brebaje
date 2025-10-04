import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

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

  @ApiProperty({
    example: 'coordinator@example.com',
    description: 'Email address for verification completion notifications',
    required: false,
  })
  coordinatorEmail?: string;

  @ApiProperty({
    example: 'https://api.myapp.com/webhooks/verification-complete',
    description: 'Webhook URL to POST verification results',
    required: false,
  })
  webhookUrl?: string;

  @ApiProperty({
    description: 'Automatically stop the instance when verification completes',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  autoStop?: boolean;
}
