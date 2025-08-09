import { PartialType } from '@nestjs/mapped-types';
import { CreateCircuitDto } from './create-circuit.dto';

export class UpdateCircuitDto extends PartialType(CreateCircuitDto) {}
