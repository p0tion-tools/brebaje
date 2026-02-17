import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Circuit } from './circuit.model';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';
import { VmModule } from 'src/vm/vm.module';
import { StorageModule } from 'src/storage/storage.module';
import { ParticipantsModule } from 'src/participants/participants.module';
import { AuthModule } from 'src/auth/auth.module';
import { CeremoniesModule } from 'src/ceremonies/ceremonies.module';
import { IsCircuitCoordinatorGuard } from './guards/is-circuit-coordinator.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Circuit]),
    VmModule,
    forwardRef(() => StorageModule),
    forwardRef(() => ParticipantsModule),
    CeremoniesModule,
    AuthModule,
  ],
  controllers: [CircuitsController],
  providers: [CircuitsService, IsCircuitCoordinatorGuard],
  exports: [CircuitsService],
})
export class CircuitsModule {}
