import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class GetCommandStatusAndOutputUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async exec(instanceId: string, commandId: string) {
    const [status, output] = await Promise.all([
      this.getStatus(instanceId, commandId),
      this.getOutput(instanceId, commandId),
    ]);

    return {
      commandId,
      instanceId,
      status,
      output: {
        stdout: output,
        timestamp: new Date().toISOString(),
      },
      note:
        status === 'InProgress'
          ? 'Command is still running, output may be partial'
          : 'Command completed',
    };
  }

  private async getStatus(instanceId: string, commandId: string) {
    return await this.vmManagerService.getCommandStatus(instanceId, commandId);
  }

  private async getOutput(instanceId: string, commandId: string) {
    return await this.vmManagerService.getCommandOutput(instanceId, commandId);
  }
}
