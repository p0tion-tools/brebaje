export abstract class VMManagerService {
  abstract getIsRunning(vmId: string): Promise<boolean>;
  abstract terminateVm(vmId: string): Promise<void>;
  abstract stopVm(vmId: string): Promise<void>;
  abstract startVm(vmId: string): Promise<void>;
}
