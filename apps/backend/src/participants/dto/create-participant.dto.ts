import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * Data Transfer Object for creating a participant.
 * @param ceremonyId - The ID of the ceremony the participant is associated with
 * userId is obtained from the authenticated request context
 * Status and steps are set to default values upon creation
 */
export class CreateParticipantDto {
  @ApiProperty({
    example: 1,
    description:
      'ID of the ceremony the participant is associated with. The userId is obtained from the authenticated request context and must not be provided in the request body.',
  })
  @IsNumber()
  ceremonyId: number;
}
