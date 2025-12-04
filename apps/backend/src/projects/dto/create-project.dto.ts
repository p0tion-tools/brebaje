import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My ZK Project', description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'discord: myusername#1234', description: 'Contact information' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  contact: string;

  @ApiProperty({ example: 1, description: 'Coordinator user ID', required: false })
  @IsNumber()
  @IsOptional()
  coordinatorId?: number;
}
