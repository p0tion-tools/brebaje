import {
  Controller,
  Get,
  Post,
  Patch,
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
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a participant by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The participant has been successfully updated.',
    type: Participant,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  update(@Param('id') id: number, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantsService.update(id, updateParticipantDto);
  }
}
