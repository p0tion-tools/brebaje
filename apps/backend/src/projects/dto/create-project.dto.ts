import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for creating a new project.
 *
 * Note: coordinatorId is automatically set from the authenticated user
 * and should not be included in the request body.
 */
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
}
