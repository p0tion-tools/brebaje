export abstract class VMManagerService {
  abstract getIsRunning(vmId: string): Promise<boolean>;
  abstract terminateVm(vmId: string): Promise<void>;
  abstract stopVm(vmId: string): Promise<void>;
  abstract startVm(vmId: string): Promise<void>;
  abstract getCommandStatus(vmId: string, commandId: string): Promise<string>;
  abstract getCommandOutput(vmId: string, commandId: string): Promise<string>;
  abstract setupVM(vmId: string, potPath: string, zKeyPath: string): Promise<string>;
  abstract startPhase1Verification(
    instanceId: string,
    ceremonyId: number,
    lastPtauStoragePath: string,
  ): Promise<string>;
}
