import { Injectable } from '@nestjs/common';
import { VerificationMonitoringService } from '../verification-monitoring.service';

@Injectable()
export class GetMonitoringStatusUseCase {
  constructor(private readonly verificationMonitoringService: VerificationMonitoringService) {}

  execute() {
    return this.verificationMonitoringService.getMonitoringStatus();
  }
}
