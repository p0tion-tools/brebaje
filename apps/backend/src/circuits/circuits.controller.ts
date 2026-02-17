import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { Circuit } from './circuit.model';
import { CircuitsService } from './circuits.service';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { UpdateCircuitDto } from './dto/update-circuit.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsCircuitCoordinatorGuard } from './guards/is-circuit-coordinator.guard';

@ApiTags('circuits')
@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new circuit' })
  @ApiResponse({
    status: 201,
    description: 'The circuit has been successfully created.',
    type: Circuit,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCircuitDto: CreateCircuitDto) {
    return this.circuitsService.create(createCircuitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all circuits' })
  @ApiResponse({ status: 200, description: 'Return all circuits.', type: [Circuit] })
  findAll() {
    return this.circuitsService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Find all circuits of a specific ceremony' })
  @ApiQuery({ name: 'ceremonyId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return all circuits.', type: [Circuit] })
  findAllByCeremonyId(@Query('ceremonyId') ceremonyId: number) {
    return this.circuitsService.findAllByCeremonyId(ceremonyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a circuit by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return the circuit.', type: Circuit })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  findOne(@Param('id') id: string) {
    return this.circuitsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsCircuitCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a circuit' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The circuit has been successfully updated.',
    type: Circuit,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the project coordinator or ceremony is not SCHEDULED.',
  })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  update(@Param('id') id: string, @Body() updateCircuitDto: UpdateCircuitDto) {
    return this.circuitsService.update(+id, updateCircuitDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IsCircuitCoordinatorGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a circuit' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'The circuit has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the project coordinator or ceremony is not SCHEDULED.',
  })
  @ApiResponse({ status: 404, description: 'Circuit not found.' })
  remove(@Param('id') id: string) {
    return this.circuitsService.remove(+id);
  }
}
