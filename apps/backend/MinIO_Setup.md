# MinIO Setup Guide

## What is MinIO?

MinIO is a high-performance, S3-compatible object storage service. It's perfect for development and production environments as an alternative to AWS S3.

## Installation

### Using Docker (Recommended)

```bash
# Run MinIO server
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v /tmp/minio/data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

### Using Homebrew (macOS)

```bash
brew install minio/stable/minio
minio server /tmp/minio/data --console-address ":9001"
```

### Using Binary (Linux/Windows)

Download from: https://min.io/download

## Configuration

1. Copy the environment variables from `.env.example`:

```bash
cp .env.example .env
```

2. Update the following variables in your `.env` file:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
AWS_PRESIGNED_URL_EXPIRATION=3600
```

## Access

- **MinIO Console**: http://localhost:9001
- **S3 API Endpoint**: http://localhost:9000
- **Default Credentials**: minioadmin / minioadmin

## Testing

You can test the S3 functionality using the provided endpoints:

1. Create a bucket:

```bash
POST http://localhost:3000/storage/create-bucket
Body: { "bucketName": "test-bucket" }
```

2. Upload a file (multipart):

```bash
POST http://localhost:3000/storage/start-multipart-upload
Body: { "objectKey": "test-file.txt", "bucketName": "test-bucket" }
```

## Security Note

The default credentials (minioadmin/minioadmin) should be changed in production environments.
