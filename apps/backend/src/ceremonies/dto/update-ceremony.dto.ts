import { PartialType } from '@nestjs/swagger';
import { CreateCeremonyDto } from './create-ceremony.dto';

export class UpdateCeremonyDto extends PartialType(CreateCeremonyDto) {}
