import { writeFileSync } from "fs";
import { loadConfig } from "../utils/config.js";
import { S3 } from "aws-sdk";

export async function generateUrlsPerpetualPowersOfTau(
  downloadFilename: string,
  options: {
    outputPath?: string;
    downloadExpiration?: number;
    uploadExpiration?: number;
    instanceId?: string;
  } = {},
): Promise<void> {
  // Load configuration
  const config = loadConfig();
  const AWS_ACCESS_KEY_ID = config.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY;
  const AWS_REGION = config.AWS_REGION;
  const S3_BUCKET = config.S3_BUCKET;
  const S3_PREFIX = config.S3_PREFIX;

  try {
    const downloadExpirationMinutes = options.downloadExpiration || 1440; // 24 hours default
    const uploadExpirationMinutes = options.uploadExpiration || 60; // 1 hour default

    console.log(`🔗 Generating URL pair for ceremony coordination`);
    console.log(`📥 Download file: ${downloadFilename}`);

    // Validate download filename format
    const filenameRegex = /^pot\d+_\d+\.ptau$/;
    if (!filenameRegex.test(downloadFilename)) {
      console.error(`❌ Error: Invalid filename format: ${downloadFilename}`);
      console.error(`Expected format: pot<power>_<index>.ptau (e.g., pot12_0005.ptau)`);
      process.exit(1);
    }

    // Extract power and index from download filename to generate upload filename
    const match = downloadFilename.match(/^pot(\d+)_(\d+)\.ptau$/);
    if (!match) {
      console.error(`❌ Error: Could not parse filename: ${downloadFilename}`);
      process.exit(1);
    }

    const power = match[1];
    const currentIndex = parseInt(match[2]);
    const nextIndex = currentIndex + 1;
    const uploadFilename = `pot${power}_${nextIndex.toString().padStart(4, "0")}.ptau`;

    console.log(`📤 Upload file: ${uploadFilename}`);
    console.log(`=`.repeat(60));

    // Check AWS credentials
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.error(`❌ Error: AWS credentials not found`);
      console.error(`Please set the following environment variables:`);
      console.error(`  AWS_ACCESS_KEY_ID=your_access_key`);
      console.error(`  AWS_SECRET_ACCESS_KEY=your_secret_key`);
      console.error(`  AWS_REGION=us-east-2 (or your bucket's region)`);
      process.exit(1);
    }

    // Validate expiration times
    if (downloadExpirationMinutes < 1 || downloadExpirationMinutes > 10080) {
      console.error(`❌ Error: Invalid download expiration: ${downloadExpirationMinutes} minutes`);
      console.error(`Expiration must be between 1 minute and 1 week (10080 minutes)`);
      process.exit(1);
    }

    if (uploadExpirationMinutes < 1 || uploadExpirationMinutes > 10080) {
      console.error(`❌ Error: Invalid upload expiration: ${uploadExpirationMinutes} minutes`);
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

    // Generate download URL
    console.log(`📥 Generating download URL...`);
    const downloadKey = `${S3_PREFIX}${downloadFilename}`;
    const downloadExpirationSeconds = downloadExpirationMinutes * 60;

    // Check if download file exists
    try {
      await s3.headObject({ Bucket: S3_BUCKET, Key: downloadKey }).promise();
      console.log(`✅ Download file exists in S3`);
    } catch (error: any) {
      if (error.code === "NotFound") {
        console.error(`❌ Error: Download file does not exist: ${downloadFilename}`);
        console.error(`Please ensure the file has been uploaded to S3 first.`);
        process.exit(1);
      }
      throw error;
    }

    const downloadParams = {
      Bucket: S3_BUCKET,
      Key: downloadKey,
      Expires: downloadExpirationSeconds,
    };

    const downloadUrl = await s3.getSignedUrlPromise("getObject", downloadParams);

    // Generate upload URL
    console.log(`📤 Generating upload URL...`);
    const uploadKey = `${S3_PREFIX}${uploadFilename}`;
    const uploadExpirationSeconds = uploadExpirationMinutes * 60;

    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: uploadKey,
      Expires: uploadExpirationSeconds,
      ContentType: "application/octet-stream",
      Metadata: {
        "ceremony-type": "perpetual-powers-of-tau",
        "generated-at": new Date().toISOString(),
        coordinator: "brebaje-cli",
      },
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", uploadParams);

    // Generate output filename - use provided path or default to current folder
    const outputFilename =
      options.outputPath || `ceremony-urls-${downloadFilename.replace(".ptau", "")}.json`;

    // Create JSON structure
    const downloadExpiry = new Date(Date.now() + downloadExpirationSeconds * 1000);
    const uploadExpiry = new Date(Date.now() + uploadExpirationSeconds * 1000);

    const urlData = {
      download_info: {
        field_name: downloadFilename,
        s3_key_field: downloadKey,
        expiration: downloadExpiry.toISOString(),
        download_url: downloadUrl,
      },
      upload_info: {
        field_name: uploadFilename,
        s3_key_field: uploadKey,
        expiration: uploadExpiry.toISOString(),
        upload_url: uploadUrl,
      },
      vm_info: {
        instance_id: options.instanceId || null,
        bucket_name: S3_BUCKET,
      },
    };

    // Save to JSON file
    writeFileSync(outputFilename, JSON.stringify(urlData, null, 2), "utf-8");

    // Success output
    console.log(`✅ URL pair generated successfully!`);
    console.log(`=`.repeat(60));
    console.log(`📥 Download: ${downloadFilename} (expires ${downloadExpiry.toISOString()})`);
    console.log(`📤 Upload: ${uploadFilename} (expires ${uploadExpiry.toISOString()})`);
    console.log(`📝 URLs saved to: ${outputFilename}`);
    console.log(``);
    console.log(`💡 Participants can now use: brebaje-cli ppot auto-contribute ${outputFilename}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to generate URL pair:", errorMessage);
    process.exit(1);
  }
}
