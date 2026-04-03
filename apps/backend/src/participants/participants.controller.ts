import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Participant } from './participant.model';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsParticipantOwnerOrCoordinatorGuard } from './guards/is-participant-owner-or-coordinator.guard';
import { ParticipantStatus } from 'src/types/enums';

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
  @ApiQuery({ name: 'ceremonyId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ParticipantStatus })
  @ApiResponse({ status: 200, description: 'Return all participants.', type: [Participant] })
  findAll(@Query('ceremonyId') ceremonyId?: number, @Query('status') status?: ParticipantStatus) {
    return this.participantsService.findAll({ ceremonyId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a participant by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the participant.', type: Participant })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  findOne(@Param('id') id: number) {
    return this.participantsService.findOne(id);
  }

  @Post(':id/start-contribution')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Transition participant from READY to CONTRIBUTING' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'Participant is now CONTRIBUTING with step DOWNLOADING.',
    type: Participant,
  })
  @ApiResponse({ status: 400, description: 'Participant is not in READY status.' })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  startContribution(@Param('id') id: number) {
    return this.participantsService.startContribution(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IsParticipantOwnerOrCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a participant by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The participant has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  remove(@Param('id') id: number) {
    return this.participantsService.remove(id);
  }
}
