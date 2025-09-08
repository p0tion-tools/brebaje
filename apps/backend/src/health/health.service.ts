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

  checkS3Connection(): { status: 'ok' | 'error'; message?: string } {
    // TODO: Implement actual S3 or MinIO connection test
    // This should test real connectivity to the storage service
    // For MinIO: use MinIO client with endpoint configuration
    // For AWS S3: use AWS SDK S3 client with HeadBucket command

    const requiredS3EnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'];

    const missingS3Vars = requiredS3EnvVars.filter((varName) => {
      const value = process.env[varName];
      return value === undefined || value === '';
    });

    if (missingS3Vars.length > 0) {
      return {
        status: 'error',
        message: 'S3 not configured - missing AWS credentials',
      };
    }

    return {
      status: 'ok',
      message: 'S3 credentials configured (connection not tested yet)',
    };
  }

  async getHealthStatus() {
    try {
      const dbCheck = await this.checkDatabaseConnection();
      const envCheck = this.checkEnvironmentVariables();
      const s3Check = this.checkS3Connection();

      const isHealthy =
        dbCheck.status === 'ok' && envCheck.status === 'ok' && s3Check.status === 'ok';

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: dbCheck,
          environment: envCheck,
          s3: s3Check,
        },
      };
    } catch {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: 'error',
            message: 'Health check failed',
          },
          environment: {
            status: 'error',
            message: 'Health check failed',
          },
          s3: {
            status: 'error',
            message: 'Health check failed',
          },
        },
      };
    }
  }
}
