import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private static s3Client: S3Client;

  static getS3Client(): S3Client {
    if (!this.s3Client) {
      const config: S3ClientConfig = {
        region: process.env.AWS_REGION || 'us-east-1',
        forcePathStyle: true, // Necesario para MinIO
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      };

      // Solo agregar endpoint si está definido (para MinIO)
      if (process.env.S3_ENDPOINT) {
        config.endpoint = process.env.S3_ENDPOINT;
      }

      this.s3Client = new S3Client(config);
    }
    return this.s3Client;
  }
}

export const getS3Client = () => S3Service.getS3Client();
