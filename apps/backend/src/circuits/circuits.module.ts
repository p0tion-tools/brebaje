import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';
import { VmModule } from 'src/vm/vm.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [SequelizeModule.forFeature([Circuit]), VmModule, StorageModule],
  controllers: [CircuitsController],
  providers: [CircuitsService],
  exports: [CircuitsService],
})
export class CircuitsModule {}
