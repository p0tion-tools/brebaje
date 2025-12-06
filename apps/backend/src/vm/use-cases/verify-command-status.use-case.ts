import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';

@Injectable()
export class VerifyCommandStatusUseCase {
  constructor(private readonly vmManagerService: VMManagerService) {}

  async execute(instanceId: string, commandId: string) {
    const status = await this.vmManagerService.getCommandStatus(instanceId, commandId);

    const commandIsStillRunning = !['Success', 'Failed', 'Cancelled', 'TimedOut'].includes(status);

    if (commandIsStillRunning) {
      return {
        commandId,
        status: 'running',
        message: 'Verification in progress',
      };
    }
    const resultCode = await this.evaluateCommandResult(instanceId, commandId, status);

    return {
      commandId,
      status: 'completed',
      result: resultCode === 200 ? 'success' : 'failed',
      httpStatus: resultCode,
      completedAt: new Date().toISOString(),
    };
  }

  private async evaluateCommandResult(instanceId: string, commandId: string, status: string) {
    const output = await this.vmManagerService.getCommandOutput(instanceId, commandId);

    // Check if SSM command executed successfully
    if (status !== 'Success') {
      return 400; // Bad Request - command execution failed
    }

    // Check for snarkjs error patterns in output
    if (output.includes('[ERROR]')) {
      return 400; // Bad Request - verification failed
    }

    // If command succeeded and no errors found, verification passed
    return 200; // OK - verification successful
  }
}
