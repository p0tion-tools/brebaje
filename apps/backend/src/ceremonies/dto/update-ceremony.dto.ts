import { PartialType } from '@nestjs/mapped-types';
import { CreateCeremonyDto } from './create-ceremony.dto';

export class UpdateCeremonyDto extends PartialType(CreateCeremonyDto) {}
