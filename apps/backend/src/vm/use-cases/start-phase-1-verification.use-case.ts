import { Injectable } from '@nestjs/common';
import { VMManagerService } from '../domain/ports/vm-manager.service';
import { VerificationMonitoringService } from '../verification-monitoring.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class StartPhase1VerificationUseCase {
  constructor(
    private readonly vmManagerService: VMManagerService,
    private readonly storageService: StorageService,
    private verificationMonitoringService: VerificationMonitoringService,
  ) {}

  async execute(context: {
    instanceId: string;
    ceremonyId: number;
    lastPtauStoragePath: string;
    coordinatorEmail?: string;
    webhookUrl?: string;
    autoStop?: boolean;
  }) {
    const { ceremonyId, instanceId, lastPtauStoragePath, coordinatorEmail, webhookUrl, autoStop } =
      context;

    // Start verification (don't wait for completion)
    const commandId = await this.vmManagerService.startPhase1Verification(
      instanceId,
      ceremonyId,
      lastPtauStoragePath,
    );

    const { hasNotificationConfig } = this.startMonitoring({
      instanceId,
      autoStop,
      commandId,
      lastPtauStoragePath,
      coordinatorEmail,
      webhookUrl,
    });

    // Return immediately with command tracking info
    return {
      commandId,
      instanceId: instanceId,
      message: 'Phase 1 verification started',
      statusUrl: `/vm/verify/status/${commandId}?instanceId=${instanceId}`,
      monitoring: hasNotificationConfig
        ? 'Notifications will be sent when verification completes'
        : 'No notifications configured',
      autoStop: autoStop
        ? 'Instance will be automatically stopped when verification completes'
        : 'Instance will remain running after verification',
    };
  }

  private startMonitoring(context: {
    instanceId: string;
    autoStop?: boolean;
    commandId: string;
    lastPtauStoragePath: string;
    coordinatorEmail?: string;
    webhookUrl?: string;
  }) {
    const { instanceId, autoStop, commandId, lastPtauStoragePath, coordinatorEmail, webhookUrl } =
      context;

    // Extract filename from storage path for notifications
    const ptauFilename = lastPtauStoragePath.split('/').pop() || 'unknown.ptau';

    const { notificationConfig, hasNotificationConfig } = this.buildNotificationConfig(
      coordinatorEmail,
      webhookUrl,
    );

    this.verificationMonitoringService.startMonitoring(
      commandId,
      instanceId,
      notificationConfig,
      autoStop,
      ptauFilename,
    );

    return {
      hasNotificationConfig,
    };
  }

  private buildNotificationConfig(coordinatorEmail?: string, webhookUrl?: string) {
    // Start monitoring for completion notifications
    const notificationConfig = {
      coordinatorEmail: coordinatorEmail,
      webhookUrl: webhookUrl,
    };

    const hasNotificationConfig = !!(coordinatorEmail || webhookUrl);

    return {
      notificationConfig,
      hasNotificationConfig,
    };
  }
}
