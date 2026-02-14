import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';
import { VmModule } from 'src/vm/vm.module';
import { StorageModule } from 'src/storage/storage.module';
import { ParticipantsModule } from 'src/participants/participants.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Circuit]),
    VmModule,
    forwardRef(() => StorageModule),
    forwardRef(() => ParticipantsModule),
  ],
  controllers: [CircuitsController],
  providers: [CircuitsService],
  exports: [CircuitsService],
})
export class CircuitsModule {}
