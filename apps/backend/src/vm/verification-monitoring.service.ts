import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { VmService } from './vm.service';

@Injectable()
export class VerificationMonitoringService {
  private activeVerifications = new Map<
    string,
    {
      instanceId: string;
      notificationConfig?: any;
      startTime: Date;
    }
  >();

  constructor(private readonly vmService: VmService) {}

  /**
   * Start monitoring a verification job.
   * @param commandId <string> - SSM command ID to monitor.
   * @param instanceId <string> - EC2 instance ID.
   * @param notificationConfig <any> - Optional notification configuration.
   */
  startMonitoring(commandId: string, instanceId: string, notificationConfig?: any) {
    this.activeVerifications.set(commandId, {
      instanceId,
      notificationConfig,
      startTime: new Date(),
    });
  }

  /**
   * CRON job to check verification status every 10 minutes.
   */
  @Cron('*/10 * * * *') // Every 10 minutes
  async checkVerificationStatus() {
    if (this.activeVerifications.size === 0) {
      return; // No active verifications to check
    }

    console.log(
      `[VerificationMonitor] Checking ${this.activeVerifications.size} active verifications`,
    );

    for (const [commandId, config] of this.activeVerifications) {
      try {
        const status = await this.vmService.retrieveCommandStatus(config.instanceId, commandId);

        if (
          status === 'Success' ||
          status === 'Failed' ||
          status === 'Cancelled' ||
          status === 'TimedOut'
        ) {
          const output = await this.vmService.retrieveCommandOutput(config.instanceId, commandId);
          const result = this.vmService.evaluateVerificationResult(output, status);

          console.log(
            `[VerificationMonitor] Verification ${commandId} completed with status: ${status}, result: ${result}`,
          );

          // Send notifications if configured
          if (config.notificationConfig) {
            await this.sendNotification(config.notificationConfig, result, commandId, status);
          }

          // Remove from monitoring
          this.activeVerifications.delete(commandId);
        } else {
          const elapsed = Date.now() - config.startTime.getTime();
          console.log(
            `[VerificationMonitor] Verification ${commandId} still ${status}, elapsed: ${Math.round(elapsed / 60000)}min`,
          );
        }
      } catch (error) {
        console.error(`[VerificationMonitor] Error checking verification ${commandId}:`, error);
        // Keep monitoring - error might be temporary
      }
    }
  }

  /**
   * Send notification when verification completes.
   * @param notificationConfig <any> - Notification configuration.
   * @param result <number> - HTTP status code (200/400).
   * @param commandId <string> - Command ID for reference.
   * @param status <string> - SSM command status.
   */
  private async sendNotification(
    notificationConfig: any,
    result: number,
    commandId: string,
    status: string,
  ) {
    try {
      // TODO: Implement notification logic (email, webhook, etc.)
      const success = result === 200;
      const message = `Verification ${commandId} ${success ? 'succeeded' : 'failed'} (${status})`;

      console.log(`[VerificationMonitor] Notification: ${message}`, notificationConfig);

      // Future notification implementations:
      // - Email via AWS SES or SMTP
      // - Webhook POST to coordinatorUrl
      // - Discord/Slack webhook
      // - SNS topic publication
    } catch (error) {
      console.error(`[VerificationMonitor] Failed to send notification for ${commandId}:`, error);
    }
  }

  /**
   * Get current monitoring status.
   * @returns Object with monitoring statistics.
   */
  getMonitoringStatus() {
    return {
      activeVerifications: this.activeVerifications.size,
      verifications: Array.from(this.activeVerifications.entries()).map(([commandId, config]) => ({
        commandId,
        instanceId: config.instanceId,
        startTime: config.startTime,
        elapsed: Date.now() - config.startTime.getTime(),
      })),
    };
  }
}

// NOTE: For production scale and robustness, consider upgrading to Redis-based
// job queues (Bull/BullMQ) which provide:
// - Persistent job storage (survives server restarts)
// - Intelligent retry logic with exponential backoff
// - Better resource efficiency (event-driven vs polling)
// - Built-in concurrency control and priority queues
// - Production monitoring tools (Bull Dashboard)
// - Clustering support for multiple server instances
// - Smart scheduling based on estimated completion times
// Redis approach would be more suitable for:
// - High-volume verification workloads
// - Multi-server deployments
// - Critical production environments requiring maximum reliability
