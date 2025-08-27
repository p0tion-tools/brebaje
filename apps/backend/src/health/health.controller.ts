import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Health status of the application',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['healthy', 'unhealthy'] },
        timestamp: { type: 'string', format: 'date-time' },
        checks: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'] },
                message: { type: 'string' },
              },
            },
            s3: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'] },
                message: { type: 'string' },
              },
            },
            environment: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['ok', 'error'] },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async getHealth() {
    return await this.healthService.getHealthStatus();
  }

  @Get('s3')
  @ApiOperation({ summary: 'Check S3/MinIO connection status' })
  @ApiResponse({
    status: 200,
    description: 'S3/MinIO connection status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ok', 'error'] },
        message: { type: 'string' },
      },
    },
  })
  async getS3Health() {
    return await this.healthService.checkS3Connection();
  }
}
