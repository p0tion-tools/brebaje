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
}
