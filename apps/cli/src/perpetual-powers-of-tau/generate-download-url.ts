import { config } from "dotenv";

// Load environment variables
config();

// Environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const S3_BUCKET = process.env.S3_BUCKET || "cardano-trusted-setup-test";
const S3_PREFIX = process.env.S3_PREFIX || "Cardano-PPOT/";

export async function generateDownloadUrlPerpetualPowersOfTau(
  filename: string,
  expirationMinutes: number = 1440, // 24 hours default for downloads
): Promise<void> {
  try {
    console.log(`🔗 Generating pre-signed download URL for: ${filename}`);

    // Validate filename format
    const filenameRegex = /^pot\d+_\d+\.ptau$/;
    if (!filenameRegex.test(filename)) {
      console.error(`❌ Error: Invalid filename format: ${filename}`);
      console.error(`Expected format: pot<power>_<index>.ptau (e.g., pot12_0005.ptau)`);
      process.exit(1);
    }

    // Check AWS credentials
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.error(`❌ Error: AWS credentials not found`);
      console.error(`Please set the following environment variables:`);
      console.error(`  AWS_ACCESS_KEY_ID=your_access_key`);
      console.error(`  AWS_SECRET_ACCESS_KEY=your_secret_key`);
      console.error(`  AWS_REGION=us-east-2 (or your bucket's region)`);
      process.exit(1);
    }

    // Validate expiration time
    if (expirationMinutes < 1 || expirationMinutes > 10080) {
      // Max 1 week
      console.error(`❌ Error: Invalid expiration time: ${expirationMinutes} minutes`);
      console.error(`Expiration must be between 1 minute and 1 week (10080 minutes)`);
      process.exit(1);
    }

    // Check if AWS SDK is available
    let AWS: any;
    try {
      AWS = await import("aws-sdk");
    } catch (error) {
      console.error(`❌ Error: AWS SDK not found`);
      console.error(`Please install aws-sdk:`);
      console.error(`  pnpm add aws-sdk`);
      console.error(`  # or`);
      console.error(`  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`);
      console.error(`  (for AWS SDK v3)`);
      process.exit(1);
    }

    // Configure AWS
    AWS.default.config.update({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });

    const s3 = new AWS.default.S3();

    // Generate pre-signed URL for GET operation
    const key = `${S3_PREFIX}${filename}`;
    const expirationSeconds = expirationMinutes * 60;

    console.log(`⏱️  URL will expire in ${expirationMinutes} minutes`);
    console.log(`📍 S3 Key: ${key}`);

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: expirationSeconds,
    };

    try {
      // Check if file exists first
      try {
        await s3.headObject({ Bucket: S3_BUCKET, Key: key }).promise();
      } catch (error: any) {
        if (error.code === "NotFound") {
          console.error(`❌ Error: File does not exist: ${filename}`);
          console.error(`Please ensure the file has been uploaded to S3 first.`);
          process.exit(1);
        }
        throw error;
      }

      const downloadUrl = await s3.getSignedUrlPromise("getObject", params);

      console.log(`✅ Pre-signed download URL generated successfully!`);
      console.log(`📄 Filename: ${filename}`);
      console.log(`🪣 Bucket: s3://${S3_BUCKET}/${key}`);
      console.log(`⏰ Expires: ${new Date(Date.now() + expirationSeconds * 1000).toISOString()}`);
      console.log(`🔗 Download URL:`);
      console.log(`${downloadUrl}`);
      console.log(``);
      console.log(`💡 Share this URL with participants to download the challenge file.`);
      console.log(`⚠️  This URL allows downloading ONLY the specified file.`);

      // Optional: Save URL to file for easy sharing
      const fs = await import("fs");
      const urlFilename = `download-url-${filename.replace(".ptau", "")}.txt`;
      const urlContent = [
        `Pre-signed Download URL for ${filename}`,
        `Generated: ${new Date().toISOString()}`,
        `Expires: ${new Date(Date.now() + expirationSeconds * 1000).toISOString()}`,
        ``,
        `Download URL:`,
        downloadUrl,
        ``,
        `Instructions for participant:`,
        `brebaje-cli ppot download "${downloadUrl}"`,
      ].join("\n");

      fs.writeFileSync(urlFilename, urlContent, "utf-8");
      console.log(`📝 URL saved to: ${urlFilename}`);
    } catch (awsError: any) {
      console.error(`❌ AWS Error: ${awsError.message}`);
      if (awsError.code === "InvalidAccessKeyId") {
        console.error(`Please check your AWS_ACCESS_KEY_ID`);
      } else if (awsError.code === "SignatureDoesNotMatch") {
        console.error(`Please check your AWS_SECRET_ACCESS_KEY`);
      } else if (awsError.code === "NoSuchBucket") {
        console.error(`Bucket ${S3_BUCKET} does not exist or you don't have access`);
      } else if (awsError.code === "NoSuchKey") {
        console.error(`File ${filename} does not exist in the bucket`);
      }
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to generate pre-signed download URL:", errorMessage);
    process.exit(1);
  }
}
