import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class StopVmUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async execute(instanceId: string) {
    await this.vmManagerService.stopVm(instanceId);

    return {
      instanceId: instanceId,
      action: 'stop',
      status: 'success',
      message: 'Instance stop command sent. It may take 1-2 minutes to shut down.',
    };
  }
}
