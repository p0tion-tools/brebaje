import { Injectable } from '@nestjs/common';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { UpdateCircuitDto } from './dto/update-circuit.dto';

@Injectable()
export class CircuitsService {
  create(createCircuitDto: CreateCircuitDto) {
    return 'This action adds a new circuit';
  }

  findAll() {
    return `This action returns all circuits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} circuit`;
  }

  update(id: number, updateCircuitDto: UpdateCircuitDto) {
    return `This action updates a #${id} circuit`;
  }

  remove(id: number) {
    return `This action removes a #${id} circuit`;
  }
}
