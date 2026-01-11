import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Participant } from './participant.model';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new participant' })
  @ApiResponse({
    status: 201,
    description: 'The participant has been successfully created.',
    type: Participant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Request() req: AuthenticatedRequest, @Body() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.create(createParticipantDto, req.user!.id!);
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
  findOne(@Param('id') id: number) {
    return this.participantsService.findOne(id);
  }
}
