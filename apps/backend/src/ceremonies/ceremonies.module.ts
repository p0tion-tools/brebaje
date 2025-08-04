import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CeremoniesController } from './ceremonies.controller';
import { CeremoniesService } from './ceremonies.service';
import { Ceremony } from './ceremony.model';

@Module({
  imports: [SequelizeModule.forFeature([Ceremony])],
  controllers: [CeremoniesController],
  providers: [CeremoniesService],
  exports: [CeremoniesModule],
})
export class CeremoniesModule {}
