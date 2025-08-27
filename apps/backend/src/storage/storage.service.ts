import {
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import {
  COMMON_ERRORS,
  SPECIFIC_ERRORS,
  logAndThrowError,
  makeError,
  printLog,
  handleAWSError,
  isAWSError,
} from '../utils/errors';
import { getS3Client } from '../utils';
import {
  CompleteMultiPartUploadData,
  GeneratePreSignedUrlsPartsData,
  ObjectKeyDto,
  UploadIdDto,
  TemporaryStoreCurrentContributionUploadedChunkData,
} from './dto/storage-dto';

@Injectable()
export class StorageService {
  constructor() {}

  async createBucket(bucketName: string) {
    const S3 = getS3Client();
    try {
      // Try to get information about the bucket.
      await S3.send(new HeadBucketCommand({ Bucket: bucketName }));
      // If the command succeeded, the bucket exists, throw an error.
      logAndThrowError(SPECIFIC_ERRORS.SE_STORAGE_INVALID_BUCKET_NAME);
    } catch (error: unknown) {
      if (isAWSError(error) && error.name === 'NotFound') {
        // Prepare S3 command.
        const command = new CreateBucketCommand({
          Bucket: bucketName,
        });
        try {
          // Execute S3 command.
          const response = await S3.send(command);
          // Check response.
          if (response.$metadata.httpStatusCode === 200 && !!response.Location)
            printLog(`The AWS S3 bucket ${bucketName} has been created successfully`, 'LOG');

          // Skip additional configuration for MinIO compatibility
          return {
            bucketName,
          };
        } catch (error: unknown) {
          /** * {@link https://docs.aws.amazon.com/simspaceweaver/latest/userguide/troubeshooting_too-many-buckets.html | TooManyBuckets} */
          if (
            isAWSError(error) &&
            error.$metadata?.httpStatusCode === 400 &&
            error.Code === 'TooManyBuckets'
          )
            logAndThrowError(SPECIFIC_ERRORS.SE_STORAGE_TOO_MANY_BUCKETS);

          // @todo handle more errors here.
          const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
          const additionalDetails = handleAWSError(error);
          logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
        }
      } else if (isAWSError(error) && error.httpErrorCode?.canonicalName === 'ALREADY_EXISTS') {
        return {
          error: SPECIFIC_ERRORS.SE_STORAGE_INVALID_BUCKET_NAME.code,
          message: SPECIFIC_ERRORS.SE_STORAGE_INVALID_BUCKET_NAME.message,
        };
      } else {
        // If there was a different error, re-throw it.
        const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
        const additionalDetails = handleAWSError(error);

        logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
      }
    }
  }

  async startMultipartUpload(data: ObjectKeyDto, bucketName: string) {
    // Prepare data.
    const { objectKey } = data;

    // Connect to S3.
    const S3 = getS3Client();

    // Prepare S3 command.
    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: objectKey,
      ACL: 'private',
    });

    try {
      // Execute S3 command.
      const response = await S3.send(command);
      if (response.$metadata.httpStatusCode === 200 && !!response.UploadId) {
        printLog(`The multi-part upload identifier is ${response.UploadId}.`, 'DEBUG');

        return {
          uploadId: response.UploadId,
        };
      }
    } catch (error: unknown) {
      // @todo handle more errors here.
      if (isAWSError(error) && error.$metadata?.httpStatusCode !== 200) {
        const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
        const additionalDetails = handleAWSError(error);

        logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
      }
    }
  }

  temporaryStoreCurrentContributionMultiPartUploadId(data: UploadIdDto) {
    const { uploadId } = data;

    // For basic implementation, just return success
    // In a full implementation, you might store this in a database or cache
    printLog(`Temporary upload ID stored: ${uploadId}`, 'DEBUG');

    return { success: true, uploadId };
  }

  async generatePreSignedUrlsParts(data: GeneratePreSignedUrlsPartsData, bucketName: string) {
    const { objectKey, uploadId, numberOfParts } = data;

    // Connect to S3 client.
    const S3 = getS3Client();

    // Prepare state.
    const parts: string[] = [];
    for (let i = 0; i < numberOfParts; i += 1) {
      // Prepare S3 command for each chunk.
      const command = new UploadPartCommand({
        Bucket: bucketName,
        Key: objectKey,
        PartNumber: i + 1,
        UploadId: uploadId,
      });

      try {
        // Get the pre-signed url for the specific chunk.
        const url = await getSignedUrl(S3, command, {
          expiresIn: Number(process.env.AWS_PRESIGNED_URL_EXPIRATION),
        });

        if (url) {
          // Save.
          parts.push(url);
        }
      } catch (error: unknown) {
        // @todo handle more errors here.
        const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
        const additionalDetails = handleAWSError(error);

        logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
      }
    }
    return { parts };
  }

  temporaryStoreCurrentContributionUploadedChunkData(
    data: TemporaryStoreCurrentContributionUploadedChunkData,
  ) {
    const { chunk } = data;

    // For basic implementation, just log the chunk info
    // In a full implementation, you might store this in a database or cache
    printLog(
      `Temporary chunk data stored: ETag ${chunk.ETag} and PartNumber ${chunk.PartNumber}`,
      'DEBUG',
    );

    return { success: true, chunk };
  }

  async completeMultipartUpload(data: CompleteMultiPartUploadData, bucketName: string) {
    const { objectKey, uploadId, parts } = data;

    // Connect to S3.
    const S3 = getS3Client();

    // Prepare S3 command.
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: objectKey,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });
    try {
      // Execute S3 command.
      const response = await S3.send(command);

      if (response.$metadata.httpStatusCode === 200 && !!response.Location) {
        printLog(
          `Multi-part upload ${data.uploadId} completed. Object location: ${response.Location}`,
          'DEBUG',
        );
        return { location: response.Location };
      } else {
        throw new Error('The multi-part upload has not been completed.');
      }
    } catch (error: unknown) {
      // @todo handle more errors here.
      if (isAWSError(error) && error.$metadata?.httpStatusCode !== 200) {
        const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
        const additionalDetails = handleAWSError(error);

        logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
      }
    }
  }

  async checkIfObjectExists(data: ObjectKeyDto, bucketName: string) {
    // Prepare data.
    const { objectKey } = data;

    // Connect to S3 client.
    const S3 = getS3Client();

    // Prepare S3 command.
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: objectKey });
    try {
      // Execute S3 command.
      const response = await S3.send(command);

      // Check response.
      if (response.$metadata.httpStatusCode === 200 && !!response.ETag) {
        printLog(
          `The object associated w/ ${objectKey} key has been found in the ${bucketName} bucket`,
          'LOG',
        );

        return { result: true };
      }
    } catch (error: unknown) {
      if (isAWSError(error) && error.$metadata?.httpStatusCode === 403)
        logAndThrowError(SPECIFIC_ERRORS.SE_STORAGE_MISSING_PERMISSIONS);

      // @todo handle more specific errors here.

      // nb. do not handle common errors! This method must return false if not found!
      // const commonError = COMMON_ERRORS.CM_INVALID_REQUEST
      // const additionalDetails = error.toString()

      // logAndThrowError(makeError(
      //     commonError.code,
      //     commonError.message,
      //     additionalDetails
      // ))
    }

    return { result: false };
  }

  async generateGetObjectPreSignedUrl(data: ObjectKeyDto, bucketName: string) {
    // Prepare data.
    const { objectKey } = data;

    // Connect to S3 client.
    const S3 = getS3Client();

    // Prepare S3 command.
    const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });

    try {
      // Execute S3 command.
      const url = await getSignedUrl(S3, command, {
        expiresIn: Number(process.env.AWS_PRESIGNED_URL_EXPIRATION),
      });

      if (url) {
        printLog(`The generated pre-signed url is ${url}`, 'DEBUG');

        return { url };
      }
    } catch (error: unknown) {
      // @todo handle more errors here.
      const commonError = COMMON_ERRORS.CM_INVALID_REQUEST;
      const additionalDetails = handleAWSError(error);

      logAndThrowError(makeError(commonError.code, commonError.message, additionalDetails));
    }
  }
}
