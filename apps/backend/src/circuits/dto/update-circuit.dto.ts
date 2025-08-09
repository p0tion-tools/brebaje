import { PartialType } from '@nestjs/swagger';
import { CreateCircuitDto } from './create-circuit.dto';

export class UpdateCircuitDto extends PartialType(CreateCircuitDto) {}
