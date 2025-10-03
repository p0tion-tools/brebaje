import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { VmService } from './vm.service';
import { VerifyPhase1Dto } from './dto/verify-phase1.dto';

@ApiTags('vm')
@Controller('vm')
export class VmController {
  constructor(private readonly vmService: VmService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Start Phase 1 verification (Powers of Tau) on VM' })
  @ApiResponse({ status: 201, description: 'Verification started successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async startVerification(@Body() verifyDto: VerifyPhase1Dto) {
    // Generate Phase 1 verification commands
    const commands = this.vmService.vmVerificationPhase1Command(
      verifyDto.bucketName,
      verifyDto.lastPtauStoragePath,
    );

    // Start verification (don't wait for completion)
    const commandId = await this.vmService.runCommandUsingSSM(verifyDto.instanceId, commands);

    // Return immediately with command tracking info
    return {
      commandId,
      instanceId: verifyDto.instanceId,
      message: 'Phase 1 verification started',
      statusUrl: `/vm/verify/status/${commandId}?instanceId=${verifyDto.instanceId}`,
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
}
