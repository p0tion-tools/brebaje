import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Ceremony } from './ceremony.model';
import { CeremoniesService } from './ceremonies.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsProjectCoordinatorGuard } from '../projects/guards/is-project-coordinator.guard';
import { IsCeremonyCoordinatorGuard } from './guards/is-ceremony-coordinator.guard';

@ApiTags('ceremonies')
@Controller('ceremonies')
export class CeremoniesController {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, IsProjectCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new ceremony' })
  @ApiResponse({
    status: 201,
    description: 'The ceremony has been successfully created.',
    type: Ceremony,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the project coordinator.' })
  create(@Body() createCeremonyDto: CreateCeremonyDto) {
    return this.ceremoniesService.create(createCeremonyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all ceremonies' })
  @ApiResponse({ status: 200, description: 'Return all ceremonies.', type: [Ceremony] })
  findAll() {
    return this.ceremoniesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a ceremony by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the ceremony.', type: Ceremony })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  findOne(@Param('id') id: string) {
    return this.ceremoniesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsCeremonyCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a ceremony' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The ceremony has been successfully updated.',
    type: Ceremony,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the project coordinator.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  update(@Param('id') id: string, @Body() updateCeremonyDto: UpdateCeremonyDto) {
    return this.ceremoniesService.update(+id, updateCeremonyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IsCeremonyCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a ceremony' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The ceremony has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the project coordinator.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  remove(@Param('id') id: string) {
    return this.ceremoniesService.remove(+id);
  }
}
