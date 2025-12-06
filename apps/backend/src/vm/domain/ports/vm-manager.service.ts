export abstract class VMManagerService {
  abstract getIsRunning(vmId: string): Promise<boolean>;
}
