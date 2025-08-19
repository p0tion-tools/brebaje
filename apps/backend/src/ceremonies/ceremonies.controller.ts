import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Ceremony } from './ceremony.model';
import { CeremoniesService } from './ceremonies.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@ApiTags('ceremonies')
@Controller('ceremonies')
export class CeremoniesController {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ceremony' })
  @ApiResponse({
    status: 201,
    description: 'The ceremony has been successfully created.',
    type: Ceremony,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Update a ceremony' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The ceremony has been successfully updated.',
    type: Ceremony,
  })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  update(@Param('id') id: string, @Body() updateCeremonyDto: UpdateCeremonyDto) {
    return this.ceremoniesService.update(+id, updateCeremonyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ceremony' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The ceremony has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Ceremony not found.' })
  remove(@Param('id') id: string) {
    return this.ceremoniesService.remove(+id);
  }
}
