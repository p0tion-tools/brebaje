export abstract class VMManagerService {
  abstract getIsRunning(vmId: string): Promise<boolean>;
  abstract terminateVm(vmId: string): Promise<void>;
}
