import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { VerificationMonitoringService } from './verification-monitoring.service';
import { StorageModule } from '../storage/storage.module';
import { GetMonitoringStatusUseCase } from './use-cases/get-monitoring-status.use-case';

@Module({
  imports: [ScheduleModule.forRoot(), StorageModule],
  controllers: [VmController],
  providers: [VmService, VerificationMonitoringService, GetMonitoringStatusUseCase],
  exports: [VmService, VerificationMonitoringService],
})
export class VmModule {}
