import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VmService } from './vm.service';
import { VerificationMonitoringService } from './verification-monitoring.service';
import { StorageService } from '../storage/storage.service';
import { VerifyPhase1Dto } from './dto/verify-phase1.dto';
import { SetupVmDto } from './dto/setup-vm.dto';
import { VmLifecycleDto } from './dto/vm-lifecycle.dto';
import { GetMonitoringStatusUseCase } from './use-cases/get-monitoring-status.use-case';
import { CheckVMIsRunningUseCase } from './use-cases/check-vm-is-running.use-case';
import { TerminateVmUseCase } from './use-cases/terminate-vm.use-case';

@ApiTags('vm')
@Controller('vm')
export class VmController {
  constructor(
    private readonly vmService: VmService,
    private readonly verificationMonitoringService: VerificationMonitoringService,
    private readonly storageService: StorageService,
    private readonly checkVMIsRunningUseCase: CheckVMIsRunningUseCase,
    private readonly getMonitoringStatusUseCase: GetMonitoringStatusUseCase,
    private readonly terminateVmUseCase: TerminateVmUseCase,
  ) {}

  @Post('verify')
  @ApiOperation({ summary: 'Start Phase 1 verification (Powers of Tau) on VM' })
  @ApiResponse({ status: 201, description: 'Verification started successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async startVerification(@Body() verifyDto: VerifyPhase1Dto) {
    // TODO: Implement auto-start functionality for complete lifecycle automation
    // if (verifyDto.autoStop) {
    //   const isRunning = await this.vmService.checkIfRunning(verifyDto.instanceId);
    //   if (!isRunning) {
    //     await this.vmService.startEC2Instance(verifyDto.instanceId);
    //     console.log(`Auto-started instance ${verifyDto.instanceId} for verification`);
    //   }
    // }

    // TODO: Handle boot time issues - implement retry logic for SSM commands
    // When instance is starting, SSM commands will fail for 2-3 minutes during boot.
    // Option B: Catch SSM failures and implement retry mechanism:
    // - Try SSM command immediately
    // - If fails due to instance not ready, add to pending verification queue
    // - Let existing CRON monitoring service retry verification once instance is ready
    // - This provides complete automation: auto-start → wait for ready → verify → auto-stop

    // Get bucket name from ceremony
    const bucketName = await this.storageService.getCeremonyBucketName(verifyDto.ceremonyId);

    // Generate Phase 1 verification commands
    const commands = this.vmService.vmVerificationPhase1Command(
      bucketName,
      verifyDto.lastPtauStoragePath,
    );

    // Extract filename from storage path for notifications
    const ptauFilename = verifyDto.lastPtauStoragePath.split('/').pop() || 'unknown.ptau';

    // Start verification (don't wait for completion)
    const commandId = await this.vmService.runCommandUsingSSM(verifyDto.instanceId, commands);

    // Check if notifications are configured
    const hasNotificationConfig = !!(verifyDto.coordinatorEmail || verifyDto.webhookUrl);

    // Start monitoring for completion notifications
    const notificationConfig = {
      coordinatorEmail: verifyDto.coordinatorEmail,
      webhookUrl: verifyDto.webhookUrl,
    };

    this.verificationMonitoringService.startMonitoring(
      commandId,
      verifyDto.instanceId,
      notificationConfig,
      verifyDto.autoStop,
      ptauFilename,
    );

    // Return immediately with command tracking info
    return {
      commandId,
      instanceId: verifyDto.instanceId,
      message: 'Phase 1 verification started',
      statusUrl: `/vm/verify/status/${commandId}?instanceId=${verifyDto.instanceId}`,
      monitoring: hasNotificationConfig
        ? 'Notifications will be sent when verification completes'
        : 'No notifications configured',
      autoStop: verifyDto.autoStop
        ? 'Instance will be automatically stopped when verification completes'
        : 'Instance will remain running after verification',
    };
  }

  @Post('setup')
  @ApiOperation({ summary: 'Setup VM with Node.js, snarkjs and cache dependencies' })
  @ApiResponse({ status: 201, description: 'VM setup started successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async setupVm(@Body() setupDto: SetupVmDto) {
    // Generate setup commands
    const commands = this.vmService.vmDependenciesAndCacheArtifactsCommand(
      setupDto.zKeyPath || '',
      setupDto.potPath || '',
    );

    // Start setup (don't wait for completion)
    const commandId = await this.vmService.runCommandUsingSSM(setupDto.instanceId, commands);

    // Return immediately with command tracking info
    return {
      commandId,
      instanceId: setupDto.instanceId,
      message: 'VM setup started',
      statusUrl: `/vm/verify/status/${commandId}?instanceId=${setupDto.instanceId}`,
      note: 'This will install Node.js v22.17.1, snarkjs, and cache any provided artifacts',
    };
  }

  @Get('verify/status/:commandId')
  @ApiOperation({ summary: 'Get verification status' })
  @ApiParam({ name: 'commandId', description: 'SSM Command ID' })
  @ApiQuery({ name: 'instanceId', description: 'EC2 Instance ID' })
  async getVerificationStatus(
    @Param('commandId') commandId: string,
    @Query('instanceId') instanceId: string,
  ) {
    const status = await this.vmService.retrieveCommandStatus(instanceId, commandId);

    if (
      status === 'Success' ||
      status === 'Failed' ||
      status === 'Cancelled' ||
      status === 'TimedOut'
    ) {
      const output = await this.vmService.retrieveCommandOutput(instanceId, commandId);
      const result = this.vmService.evaluateVerificationResult(output, status);

      return {
        commandId,
        status: 'completed',
        result: result === 200 ? 'success' : 'failed',
        httpStatus: result,
        completedAt: new Date().toISOString(),
      };
    }

    return {
      commandId,
      status: 'running',
      message: 'Verification in progress',
    };
  }

  @Get('command/output/:commandId')
  @ApiOperation({ summary: 'Get command output and logs' })
  @ApiParam({ name: 'commandId', description: 'SSM Command ID' })
  @ApiQuery({ name: 'instanceId', description: 'EC2 Instance ID' })
  @ApiResponse({ status: 200, description: 'Command output retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Command not found or still running' })
  async getCommandOutput(
    @Param('commandId') commandId: string,
    @Query('instanceId') instanceId: string,
  ) {
    try {
      const status = await this.vmService.retrieveCommandStatus(instanceId, commandId);
      const output = await this.vmService.retrieveCommandOutput(instanceId, commandId);

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
    } catch (error) {
      const e = error as Error;
      return {
        commandId,
        instanceId,
        error: e.message,
        note: 'Failed to retrieve command output. Command may not exist or be too old.',
      };
    }
  }

  @Post('start')
  @ApiOperation({ summary: 'Start an EC2 instance' })
  @ApiResponse({ status: 200, description: 'Instance start command sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to start instance' })
  async startInstance(@Body() lifecycleDto: VmLifecycleDto) {
    try {
      await this.vmService.startEC2Instance(lifecycleDto.instanceId);
      return {
        instanceId: lifecycleDto.instanceId,
        action: 'start',
        status: 'success',
        message: 'Instance start command sent. It may take 1-2 minutes to boot.',
      };
    } catch (error) {
      const e = error as Error;
      return {
        instanceId: lifecycleDto.instanceId,
        action: 'start',
        status: 'error',
        message: e.message,
      };
    }
  }

  @Post('stop')
  @ApiOperation({ summary: 'Stop an EC2 instance' })
  @ApiResponse({ status: 200, description: 'Instance stop command sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to stop instance' })
  async stopInstance(@Body() lifecycleDto: VmLifecycleDto) {
    try {
      await this.vmService.stopEC2Instance(lifecycleDto.instanceId);
      return {
        instanceId: lifecycleDto.instanceId,
        action: 'stop',
        status: 'success',
        message: 'Instance stop command sent. It may take 1-2 minutes to shut down.',
      };
    } catch (error) {
      const e = error as Error;
      return {
        instanceId: lifecycleDto.instanceId,
        action: 'stop',
        status: 'error',
        message: e.message,
      };
    }
  }

  @Post('terminate')
  @ApiOperation({ summary: 'Terminate an EC2 instance (PERMANENT)' })
  @ApiResponse({
    status: 200,
    description: 'Instance terminate command sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to terminate instance' })
  async terminateInstance(@Body() lifecycleDto: VmLifecycleDto) {
    try {
      const response = await this.terminateVmUseCase.execute(lifecycleDto.instanceId);
      return response;
    } catch (error) {
      const e = error as Error;
      return {
        instanceId: lifecycleDto.instanceId,
        action: 'terminate',
        status: 'error',
        message: e.message,
      };
    }
  }

  @Get('status/:instanceId')
  @ApiOperation({ summary: 'Check if an EC2 instance is running' })
  @ApiParam({ name: 'instanceId', description: 'EC2 Instance ID' })
  @ApiResponse({
    status: 200,
    description: 'Instance status retrieved successfully',
  })
  async getInstanceStatus(@Param('instanceId') instanceId: string) {
    try {
      const response = await this.checkVMIsRunningUseCase.execute(instanceId);
      return response;
    } catch (error) {
      const e = error as Error;
      return {
        instanceId,
        status: 'error',
        message: e.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('monitoring/status')
  @ApiOperation({ summary: 'Get monitoring service status' })
  @ApiResponse({ status: 200, description: 'Monitoring service status' })
  getMonitoringStatus() {
    return this.getMonitoringStatusUseCase.execute();
  }
}
