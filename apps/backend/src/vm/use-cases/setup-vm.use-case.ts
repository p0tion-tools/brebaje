import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class SetupVMUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async execute(instanceId: string, potPath: string = '', zKeyPath: string = '') {
    const commandId = await this.vmManagerService.setupVM(instanceId, potPath, zKeyPath);

    return {
      commandId,
      instanceId: instanceId,
      message: 'VM setup started',
      statusUrl: `/vm/verify/status/${commandId}?instanceId=${instanceId}`,
      note: 'This will install Node.js v22.17.1, snarkjs, and cache any provided artifacts',
    };
  }
}
