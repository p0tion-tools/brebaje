import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorObject {
  code: string;
  message: string;
}

// Common errors
export const COMMON_ERRORS = {
  CM_INEXISTENT_DOCUMENT_DATA: {
    code: 'CM_INEXISTENT_DOCUMENT_DATA',
    message: 'The requested document does not exist.',
  },
  CM_INVALID_REQUEST: {
    code: 'CM_INVALID_REQUEST',
    message: 'Invalid request parameters.',
  },
};

// Storage specific errors
export const SPECIFIC_ERRORS = {
  SE_STORAGE_CANNOT_INTERACT_WITH_MULTI_PART_UPLOAD: {
    code: 'SE_STORAGE_CANNOT_INTERACT_WITH_MULTI_PART_UPLOAD',
    message:
      'Cannot interact with multi-part upload. Invalid participant status or contribution step.',
  },
  SE_STORAGE_WRONG_OBJECT_KEY: {
    code: 'SE_STORAGE_WRONG_OBJECT_KEY',
    message: 'The provided object key is invalid for this participant.',
  },
  SE_STORAGE_INVALID_BUCKET_NAME: {
    code: 'SE_STORAGE_INVALID_BUCKET_NAME',
    message: 'The bucket name is invalid or already exists.',
  },
  SE_STORAGE_TOO_MANY_BUCKETS: {
    code: 'SE_STORAGE_TOO_MANY_BUCKETS',
    message: 'Too many buckets. Cannot create more buckets.',
  },
  SE_STORAGE_MISSING_PERMISSIONS: {
    code: 'SE_STORAGE_MISSING_PERMISSIONS',
    message: 'Missing permissions to access the storage resource.',
  },
  SE_PARTICIPANT_CANNOT_STORE_TEMPORARY_DATA: {
    code: 'SE_PARTICIPANT_CANNOT_STORE_TEMPORARY_DATA',
    message: 'Participant cannot store temporary data in current state.',
  },
};

export function makeError(code: string, message: string, additionalDetails?: string): ErrorObject {
  return {
    code,
    message: additionalDetails ? `${message} ${additionalDetails}` : message,
  };
}

// Type for AWS SDK errors
interface AWSError extends Error {
  $metadata?: {
    httpStatusCode?: number;
  };
  Code?: string;
  httpErrorCode?: {
    canonicalName?: string;
  };
}

export function isAWSError(error: unknown): error is AWSError {
  return error instanceof Error;
}

export function logAndThrowError(error: ErrorObject): never {
  console.error(`[ERROR] ${error.code}: ${error.message}`);
  throw new HttpException(error, HttpStatus.BAD_REQUEST);
}

export function printLog(message: string, level: 'LOG' | 'DEBUG' | 'ERROR' = 'LOG'): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

export function handleAWSError(error: unknown): string {
  if (isAWSError(error)) {
    return error.message || 'AWS Error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
}
