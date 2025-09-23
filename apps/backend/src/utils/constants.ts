import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const DB_SQLITE_STORAGE_PATH = process.env.DB_SQLITE_STORAGE_PATH || '.db/data.sqlite3';
export const DB_SQLITE_SYNCHRONIZE = process.env.DB_SQLITE_SYNCHRONIZE === 'true';
export const DB_BUILD_MODELS = process.env.DB_BUILD_MODELS === 'true';

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_CEREMONY_BUCKET_POSTFIX =
  process.env.AWS_CEREMONY_BUCKET_POSTFIX || 'brebaje-testing';
export const AWS_S3_CORS_ORIGINS = process.env.AWS_S3_CORS_ORIGINS
  ? process.env.AWS_S3_CORS_ORIGINS.split(',')
  : ['*'];

// non env constants
export const AWS_WAIT_TIME = 60;

export const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
