import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contact@example.com' })
  @IsString()
  contact: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  coordinatorId: number;
}
