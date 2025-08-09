import { PartialType } from '@nestjs/mapped-types';
import { CreateContributionDto } from './create-contribution.dto';

export class UpdateContributionDto extends PartialType(CreateContributionDto) {}
