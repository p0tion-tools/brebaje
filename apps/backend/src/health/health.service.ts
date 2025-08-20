import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async checkDatabaseConnection(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.sequelize.authenticate();
      return { status: 'ok' };
    } catch {
      return {
        status: 'error',
        message: 'Database connection failed',
      };
    }
  }

  checkEnvironmentVariables(): { status: 'ok' | 'error'; message?: string } {
    const requiredEnvVars = ['DB_SQLITE_STORAGE_PATH', 'DB_SQLITE_SYNCHRONIZE', 'PORT'];

    const missingVars = requiredEnvVars.filter((varName) => {
      const value = process.env[varName];
      return value === undefined || value === '';
    });

    if (missingVars.length > 0) {
      return {
        status: 'error',
        message: `Missing required environment variables: ${missingVars.length} variables not configured`,
      };
    }

    return { status: 'ok' };
  }

  async getHealthStatus() {
    const dbCheck = await this.checkDatabaseConnection();
    const envCheck = this.checkEnvironmentVariables();

    const isHealthy = dbCheck.status === 'ok' && envCheck.status === 'ok';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        environment: envCheck,
      },
    };
  }
}
