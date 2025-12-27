import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class TerminateVmUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async execute(instanceId: string) {
    await this.vmManagerService.terminateVm(instanceId);

    return {
      instanceId: instanceId,
      action: 'terminate',
      status: 'success',
      message: 'Instance terminate command sent. This action is PERMANENT and cannot be undone.',
      warning: 'All data on the instance will be lost permanently.',
    };
  }
}
