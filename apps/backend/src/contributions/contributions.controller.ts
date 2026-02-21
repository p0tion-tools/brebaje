import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Contribution } from './contribution.model';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsContributionParticipantOrCoordinatorGuard } from './guards/is-contribution-participant-or-coordinator.guard';
import { IsContributionCoordinatorGuard } from './guards/is-contribution-coordinator.guard';

@ApiTags('contributions')
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsContributionParticipantOrCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new contribution' })
  @ApiResponse({
    status: 201,
    description: 'The contribution has been successfully created.',
    type: Contribution,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the contributing participant or coordinator.',
  })
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionsService.create(createContributionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all contributions' })
  @ApiResponse({
    status: 200,
    description: 'Return all contributions.',
    type: [Contribution],
  })
  @ApiQuery({
    name: 'circuitId',
    required: false,
    type: Number,
    description: 'Filter by circuit ID',
  })
  @ApiQuery({
    name: 'participantId',
    required: false,
    type: Number,
    description: 'Filter by participant ID',
  })
  findAll(@Query('circuitId') circuitId?: string, @Query('participantId') participantId?: string) {
    return this.contributionsService.findAll(
      circuitId ? +circuitId : undefined,
      participantId ? +participantId : undefined,
    );
  }

  @Get('valid')
  @ApiOperation({
    summary: 'Find a valid contribution by circuit and participant',
  })
  @ApiQuery({
    name: 'circuitId',
    required: true,
    type: Number,
    description: 'Circuit ID',
  })
  @ApiQuery({
    name: 'participantId',
    required: true,
    type: Number,
    description: 'Participant ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the valid contribution.',
    type: Contribution,
  })
  @ApiResponse({
    status: 404,
    description: 'No valid contribution found.',
  })
  async findValid(
    @Query('circuitId') circuitId: string,
    @Query('participantId') participantId: string,
  ) {
    const contribution = await this.contributionsService.findValidOneByCircuitIdAndParticipantId(
      +circuitId,
      +participantId,
    );
    if (!contribution) {
      throw new NotFoundException('No valid contribution found for this circuit and participant');
    }
    return contribution;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a contribution by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return the contribution.',
    type: Contribution,
  })
  @ApiResponse({ status: 404, description: 'Contribution not found.' })
  findOne(@Param('id') id: string) {
    return this.contributionsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsContributionParticipantOrCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a contribution' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The contribution has been successfully updated.',
    type: Contribution,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the contributing participant or coordinator.',
  })
  @ApiResponse({ status: 404, description: 'Contribution not found.' })
  update(@Param('id') id: string, @Body() updateContributionDto: UpdateContributionDto) {
    return this.contributionsService.update(+id, updateContributionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IsContributionCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a contribution' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The contribution has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the ceremony coordinator.',
  })
  @ApiResponse({ status: 404, description: 'Contribution not found.' })
  remove(@Param('id') id: string) {
    return this.contributionsService.remove(+id);
  }
}
