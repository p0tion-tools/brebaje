import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getBucketName } from '@brebaje/actions';
import { CeremoniesService } from 'src/ceremonies/ceremonies.service';
import {
  CreateBucketCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
  S3Client,
  S3ServiceException,
  BucketAlreadyExists,
  waitUntilBucketExists,
  BucketAlreadyOwnedByYou,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3';
import {
  AWS_ACCESS_KEY_ID,
  AWS_CEREMONY_BUCKET_POSTFIX,
  AWS_REGION,
  AWS_S3_CORS_ORIGINS,
  AWS_SECRET_ACCESS_KEY,
  AWS_WAIT_TIME,
} from 'src/utils/constants';

@Injectable()
export class StorageService {
  constructor(private readonly ceremoniesService: CeremoniesService) {}

  getS3Client() {
    return new S3Client({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  async createBucket(s3: S3Client, bucketName: string) {
    try {
      const { Location } = await s3.send(
        new CreateBucketCommand({ Bucket: bucketName, ObjectOwnership: 'BucketOwnerPreferred' }),
      );
      await waitUntilBucketExists(
        { client: s3, maxWaitTime: AWS_WAIT_TIME },
        { Bucket: bucketName },
      );
      console.log(`Bucket created with location ${Location}`);
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async setPublicAccessBlock(s3: S3Client, bucketName: string) {
    try {
      await s3.send(
        new PutPublicAccessBlockCommand({
          Bucket: bucketName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            BlockPublicPolicy: false,
          },
        }),
      );
      console.log(`Successfully set public access block for bucket: ${bucketName}`);
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async setBucketCors(s3: S3Client, bucketName: string) {
    try {
      await s3.send(
        new PutBucketCorsCommand({
          Bucket: bucketName,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT'],
                AllowedOrigins: AWS_S3_CORS_ORIGINS,
                ExposeHeaders: ['ETag', 'Content-Length'],
                MaxAgeSeconds: 3600,
              },
            ],
          },
        }),
      );
      console.log(`Successfully set CORS rules for bucket: ${bucketName}`);
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async deleteBucket(s3: S3Client, bucketName: string) {
    try {
      await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
      console.log(`Successfully deleted bucket: ${bucketName}`);
    } catch (error) {
      this.handleErrors(error as Error);
    }
  }

  async createAndSetupBucket(ceremonyId: number) {
    const ceremony = await this.ceremoniesService.findOne(ceremonyId);
    if (!ceremony) {
      throw new InternalServerErrorException(`Ceremony with ID ${ceremonyId} not found`);
    }

    const s3 = this.getS3Client();
    const bucketName = getBucketName(
      AWS_CEREMONY_BUCKET_POSTFIX,
      ceremony.project.name,
      ceremony.description,
    );

    await this.createBucket(s3, bucketName);
    await this.setPublicAccessBlock(s3, bucketName);
    await this.setBucketCors(s3, bucketName);

    return bucketName;
  }

  handleErrors(error: Error): never {
    if (error instanceof BucketAlreadyExists) {
      throw new ConflictException(
        'Bucket name already exists in another AWS account. Bucket names must be globally unique.',
      );
    } else if (error instanceof BucketAlreadyOwnedByYou) {
      throw new ConflictException(
        'Bucket name already exists in this AWS account. Bucket names must be unique within an account.',
      );
    } else if (error instanceof S3ServiceException && error.name === 'NoSuchBucket') {
      throw new InternalServerErrorException(
        `Bucket does not exist. Please check the bucket name: ${error.message}`,
      );
    } else if (error instanceof S3ServiceException) {
      throw new InternalServerErrorException(`S3 service error: ${error.name} - ${error.message}`);
    } else {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
