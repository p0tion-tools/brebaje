import { Module } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
