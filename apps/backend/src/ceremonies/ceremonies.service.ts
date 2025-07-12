import { Injectable } from '@nestjs/common';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Injectable()
export class CeremoniesService {
  create(createCeremonyDto: CreateCeremonyDto) {
    return 'This action adds a new ceremony';
  }

  findAll() {
    return `This action returns all ceremonies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ceremony`;
  }

  update(id: number, updateCeremonyDto: UpdateCeremonyDto) {
    return `This action updates a #${id} ceremony`;
  }

  remove(id: number) {
    return `This action removes a #${id} ceremony`;
  }
}
