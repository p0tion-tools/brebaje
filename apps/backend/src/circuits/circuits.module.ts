import { Module } from '@nestjs/common';
import { CircuitsService } from './circuits.service';
import { CircuitsController } from './circuits.controller';

@Module({
  controllers: [CircuitsController],
  providers: [CircuitsService],
})
export class CircuitsModule {}
