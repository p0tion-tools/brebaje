import { Module } from '@nestjs/common';
import { CeremoniesService } from './ceremonies.service';
import { CeremoniesController } from './ceremonies.controller';

@Module({
  controllers: [CeremoniesController],
  providers: [CeremoniesService],
})
export class CeremoniesModule {}
