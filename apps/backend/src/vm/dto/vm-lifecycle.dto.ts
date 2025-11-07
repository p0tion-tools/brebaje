import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VmLifecycleDto {
  @ApiProperty({
    description: 'EC2 Instance ID to manage',
    example: 'i-1234567890abcdef0',
  })
  @IsString()
  @IsNotEmpty()
  instanceId: string;
}
