import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Participant } from './participant.model';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new participant' })
  @ApiResponse({
    status: 201,
    description: 'The participant has been successfully created.',
    type: Participant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.create(createParticipantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all participants' })
  @ApiResponse({ status: 200, description: 'Return all participants.', type: [Participant] })
  findAll() {
    return this.participantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a participant by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the participant.', type: Participant })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a participant' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The participant has been successfully updated.',
    type: Participant,
  })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantsService.update(+id, updateParticipantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a participant' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The participant has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id);
  }
}
