import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project' })
  name: string;

  @ApiProperty({ example: 'contact@example.com' })
  contact: string;

  @ApiProperty({ example: 1 })
  coordinatorId: number;
}
