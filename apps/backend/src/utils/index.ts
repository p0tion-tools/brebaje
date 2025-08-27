export * from './constants';
export * from './s3.service';
export * from './errors';

// Utility functions
export function getCurrentServerTimestampInMillis(): number {
  return Date.now();
}

// Simple bucket name generator for basic S3 operations
export function getBucketName(prefix: string, postfix: string): string {
  return `${prefix}-${postfix}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

// Simple storage path generator
export function getStorageFilePath(prefix: string, filename: string): string {
  return `${prefix}/${filename}`;
}

// Format index with leading zeros
export function formatIndex(index: number, length: number = 4): string {
  return index.toString().padStart(length, '0');
}
