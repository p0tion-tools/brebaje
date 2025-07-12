import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CeremoniesService } from './ceremonies.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Controller('ceremonies')
export class CeremoniesController {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  @Post()
  create(@Body() createCeremonyDto: CreateCeremonyDto) {
    return this.ceremoniesService.create(createCeremonyDto);
  }

  @Get()
  findAll() {
    return this.ceremoniesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ceremoniesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCeremonyDto: UpdateCeremonyDto) {
    return this.ceremoniesService.update(+id, updateCeremonyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ceremoniesService.remove(+id);
  }
}
