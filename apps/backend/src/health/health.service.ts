import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { getS3Client } from '../utils';

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

  async checkS3Connection(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const s3 = getS3Client();
      await s3.send(new ListBucketsCommand({}));
      return { status: 'ok' };
    } catch {
      return {
        status: 'error',
        message: 'S3/MinIO connection failed',
      };
    }
  }

  checkEnvironmentVariables(): { status: 'ok' | 'error'; message?: string } {
    const requiredEnvVars = [
      'DB_SQLITE_STORAGE_PATH',
      'DB_SQLITE_SYNCHRONIZE',
      'PORT',
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_PRESIGNED_URL_EXPIRATION',
    ];

    const missingVars = requiredEnvVars.filter((varName) => {
      const value = process.env[varName];
      return value === undefined || value === '';
    });

    if (missingVars.length > 0) {
      return {
        status: 'error',
        message: `Missing required environment variables: ${missingVars.join(', ')}`,
      };
    }

    return { status: 'ok' };
  }

  async getHealthStatus() {
    const dbCheck = await this.checkDatabaseConnection();
    const s3Check = await this.checkS3Connection();
    const envCheck = this.checkEnvironmentVariables();

    const isHealthy =
      dbCheck.status === 'ok' && s3Check.status === 'ok' && envCheck.status === 'ok';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        s3: s3Check,
        environment: envCheck,
      },
    };
  }
}
