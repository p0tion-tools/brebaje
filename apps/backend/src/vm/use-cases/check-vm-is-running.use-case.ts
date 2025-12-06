import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class CheckVMIsRunningUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async execute(instanceId: string) {
    const isRunning = await this.vmManagerService.getIsRunning(instanceId);

    return {
      instanceId,
      isRunning,
      status: isRunning ? 'running' : 'not running',
      timestamp: new Date().toISOString(),
    };
  }
}
