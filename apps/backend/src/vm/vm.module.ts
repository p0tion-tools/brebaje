import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VmService } from './vm.service';
import { VmController } from './vm.controller';
import { VerificationMonitoringService } from './verification-monitoring.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [VmController],
  providers: [VmService, VerificationMonitoringService],
  exports: [VmService, VerificationMonitoringService],
})
export class VmModule {}
