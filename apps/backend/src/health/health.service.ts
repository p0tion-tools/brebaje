import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { StorageService } from 'src/storage/storage.service';
import { AWSError } from 'src/types/declarations';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly storageService: StorageService,
  ) {}

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
    // Are there important env vars to check for?
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

  async checkS3Connection(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const s3 = this.storageService.getS3Client();

      // Test S3 connection by listing buckets (lightweight operation)
      // Using a simple operation that doesn't require a specific bucket name
      const command = new HeadBucketCommand({
        Bucket: 'non-existent-bucket-test-connection',
      });

      try {
        await s3.send(command);
        return {
          status: 'ok',
          message: 'S3 connection successful',
        };
      } catch (error) {
        // HeadBucket will fail for non-existent bucket, but if we get a proper AWS error
        // (not a network/auth error), it means the connection to S3 is working
        const awsError = error as AWSError;
        if (
          awsError &&
          typeof awsError === 'object' &&
          awsError.$metadata &&
          awsError.$metadata.httpStatusCode
        ) {
          // AWS responded with an HTTP status, so connection is working
          // 404 (NotFound)
          if (awsError.$metadata.httpStatusCode === 404) {
            return {
              status: 'ok',
              message: 'S3 connection successful (AWS credentials validated)',
            };
          }
          if (awsError.$metadata.httpStatusCode === 403) {
            return {
              status: 'ok',
              message:
                'S3 responded with 403 (Access forbidden). Credentials are invalid or the bucket "non-existent-bucket-test-connection" exists but you do not have access (improbable)',
            };
          }
        }

        // If it's a network error, authentication error, or other connection issue
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          status: 'error',
          message: `S3 connection failed: ${errorMessage}`,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        status: 'error',
        message: `S3 client initialization failed: ${errorMessage}`,
      };
    }
  }

  async getHealthStatus() {
    try {
      const dbCheck = await this.checkDatabaseConnection();
      const envCheck = this.checkEnvironmentVariables();
      const s3Check = await this.checkS3Connection();

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
