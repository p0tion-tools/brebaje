import { S3 } from "aws-sdk";
import { loadConfig } from "../utils/config.js";
import { writeFileSync } from "fs";

export async function generateUploadUrlPerpetualPowersOfTau(
  filename: string,
  expirationMinutes: number = 60,
): Promise<void> {
  // Load configuration
  const config = loadConfig();
  const AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;
  const AWS_REGION = config.AWS_REGION;
  const S3_BUCKET = config.S3_BUCKET;
  const S3_PREFIX = config.S3_PREFIX;

  try {
    console.log(`🔗 Generating pre-signed upload URL for: ${filename}`);

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
      console.error(`  AWS_REGION=us-east-1 (optional, defaults to us-east-1)`);
      process.exit(1);
    }

    // Validate expiration time
    if (expirationMinutes < 1 || expirationMinutes > 10080) {
      // Max 1 week
      console.error(`❌ Error: Invalid expiration time: ${expirationMinutes} minutes`);
      console.error(`Expiration must be between 1 minute and 1 week (10080 minutes)`);
      process.exit(1);
    }

    const s3 = new S3({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });

    // Generate pre-signed URL for PUT operation
    const key = `${S3_PREFIX}${filename}`;
    const expirationSeconds = expirationMinutes * 60;

    console.log(`⏱️  URL will expire in ${expirationMinutes} minutes`);
    console.log(`📍 S3 Key: ${key}`);

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: expirationSeconds,
      ContentType: "application/octet-stream",
      // Add metadata for ceremony tracking
      Metadata: {
        "ceremony-type": "perpetual-powers-of-tau",
        "generated-at": new Date().toISOString(),
        coordinator: "brebaje-cli",
      },
    };

    try {
      const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

      console.log(`✅ Pre-signed upload URL generated successfully!`);
      console.log(`📄 Filename: ${filename}`);
      console.log(`🪣 Bucket: s3://${S3_BUCKET}/${key}`);
      console.log(`⏰ Expires: ${new Date(Date.now() + expirationSeconds * 1000).toISOString()}`);
      console.log(`🔗 Upload URL:`);
      console.log(`${uploadUrl}`);
      console.log(``);
      console.log(`💡 Share this URL with the participant to upload their contribution.`);
      console.log(`⚠️  This URL allows uploading ONLY to the specified file path.`);

      // Optional: Save URL to file for easy sharing
      const urlFilename = `upload-url-${filename.replace(".ptau", "")}.txt`;
      const urlContent = [
        `Pre-signed Upload URL for ${filename}`,
        `Generated: ${new Date().toISOString()}`,
        `Expires: ${new Date(Date.now() + expirationSeconds * 1000).toISOString()}`,
        ``,
        `Upload URL:`,
        uploadUrl,
        ``,
        `Instructions for participant:`,
        `brebaje-cli ppot upload "${uploadUrl}"`,
      ].join("\n");

      writeFileSync(urlFilename, urlContent, "utf-8");
      console.log(`📝 URL saved to: ${urlFilename}`);
    } catch (awsError: any) {
      console.error(`❌ AWS Error: ${awsError.message}`);
      if (awsError.code === "InvalidAccessKeyId") {
        console.error(`Please check your AWS_ACCESS_KEY_ID`);
      } else if (awsError.code === "SignatureDoesNotMatch") {
        console.error(`Please check your AWS_SECRET_ACCESS_KEY`);
      } else if (awsError.code === "NoSuchBucket") {
        console.error(`Bucket ${S3_BUCKET} does not exist or you don't have access`);
      }
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to generate pre-signed URL:", errorMessage);
    process.exit(1);
  }
}
