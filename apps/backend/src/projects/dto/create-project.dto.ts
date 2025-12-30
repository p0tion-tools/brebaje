import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO for creating a new project.
 *
 * Note: coordinatorId is automatically set from the authenticated user
 * and should not be included in the request body.
 */
export class CreateProjectDto {
  @ApiProperty({ example: 'My Project' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contact@example.com' })
  @IsString()
  contact: string;
}
