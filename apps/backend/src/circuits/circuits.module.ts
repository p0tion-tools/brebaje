import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';

@Module({
  imports: [SequelizeModule.forFeature([Circuit])],
  controllers: [CircuitsController],
  providers: [CircuitsService],
  exports: [CircuitsService],
})
export class CircuitsModule {}
