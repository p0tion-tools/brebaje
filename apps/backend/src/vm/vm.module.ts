import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { VerificationMonitoringService } from './verification-monitoring.service';
import { StorageModule } from '../storage/storage.module';
import { GetMonitoringStatusUseCase } from './use-cases/get-monitoring-status.use-case';
import { VMInfrastructureModule } from './infrastructure/vm.infrastructure.module';
import { CheckVMIsRunningUseCase } from './use-cases/check-vm-is-running.use-case';
import { TerminateVmUseCase } from './use-cases/terminate-vm.use-case';
import { StopVmUseCase } from './use-cases/stop-vm.use-case';
import { StartVmUseCase } from './use-cases/start-vm.use-case';
import { GetCommandStatusAndOutputUseCase } from './use-cases/get-command-status-and-output.use-case';

@Module({
  imports: [ScheduleModule.forRoot(), StorageModule, VMInfrastructureModule],
  controllers: [VmController],
  providers: [
    VmService,
    VerificationMonitoringService,
    GetMonitoringStatusUseCase,
    CheckVMIsRunningUseCase,
    TerminateVmUseCase,
    StopVmUseCase,
    StartVmUseCase,
    GetCommandStatusAndOutputUseCase,
  ],
  exports: [VmService, VerificationMonitoringService],
})
export class VmModule {}
