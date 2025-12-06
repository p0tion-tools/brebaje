import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class StartVmUseCase {
  constructor(private readonly vmManager: VMManagerService) {}

  async execute(instanceId: string) {
    await this.vmManager.startVm(instanceId);
    return {
      instanceId: instanceId,
      action: 'start',
      status: 'success',
      message: 'Instance start command sent. It may take 1-2 minutes to boot.',
    };
  }
}
