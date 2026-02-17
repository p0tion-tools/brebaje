import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Contribution } from './contribution.model';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@ApiTags('contributions')
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contribution' })
  @ApiResponse({
    status: 201,
    description: 'The contribution has been successfully created.',
    type: Contribution,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionsService.create(createContributionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all contributions' })
  @ApiResponse({ status: 200, description: 'Return all contributions.', type: [Contribution] })
  findAll() {
    return this.contributionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a contribution by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the contribution.', type: Contribution })
  @ApiResponse({ status: 404, description: 'Contribution not found.' })
  findOne(@Param('id') id: string) {
    return this.contributionsService.findOne(+id);
  }
}
