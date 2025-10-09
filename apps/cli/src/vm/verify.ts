import { ScriptLogger } from "../utils/logger.js";
import { loadConfig } from "../utils/config.js";

const logger = new ScriptLogger("CLI:VM:Verify");

interface CeremonyUrls {
  download_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    download_url: string;
  };
  upload_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    upload_url: string;
  };
  vm_info: {
    instance_id: string | null;
    bucket_name: string;
  };
}

export async function verifyVm(jsonPath?: string): Promise<void> {
  // Load configuration
  const config = loadConfig();
  const BREBAJE_API_URL = config.BREBAJE_API_URL;

  try {
    logger.log("🔍 Starting VM verification process...");
    console.log(`=`.repeat(60));

    // Find ceremony URLs JSON file
    const fs = await import("fs");
    const path = await import("path");

    let ceremonyUrlsPath: string;

    if (jsonPath) {
      // Use provided path
      ceremonyUrlsPath = jsonPath;
    } else {
      // Check current folder for ceremony-urls JSON files
      const currentDir = ".";
      const jsonFiles = fs
        .readdirSync(currentDir)
        .filter((file) => file.startsWith("ceremony-urls-") && file.endsWith(".json"));

      if (jsonFiles.length === 0) {
        logger.error("❌ Error: No ceremony URLs JSON file found");
        logger.error("Please either:");
        logger.error("  1. Provide JSON file path: brebaje-cli vm verify <json-path>");
        logger.error("  2. Place ceremony URLs JSON file in current folder");
        process.exit(1);
      }

      if (jsonFiles.length > 1) {
        logger.error("❌ Error: Multiple ceremony URLs JSON files found");
        logger.error("Please specify which file to use:");
        jsonFiles.forEach((file) => logger.error(`  brebaje-cli vm verify ${file}`));
        process.exit(1);
      }

      ceremonyUrlsPath = path.join(currentDir, jsonFiles[0]);
    }

    // Check if file exists
    if (!fs.existsSync(ceremonyUrlsPath)) {
      logger.error(`❌ Error: JSON file not found: ${ceremonyUrlsPath}`);
      process.exit(1);
    }

    logger.log(`📄 Reading ceremony file: ${ceremonyUrlsPath}`);

    // Parse JSON file
    let ceremonyData: CeremonyUrls;
    try {
      const jsonContent = fs.readFileSync(ceremonyUrlsPath, "utf-8");
      ceremonyData = JSON.parse(jsonContent);
    } catch (error) {
      logger.error(`❌ Error: Failed to parse JSON file: ${error}`);
      process.exit(1);
    }

    // Validate required fields
    if (!ceremonyData.vm_info) {
      logger.error("❌ Error: JSON file missing vm_info section");
      logger.error("Please regenerate the JSON file with --instance-id parameter");
      process.exit(1);
    }

    if (!ceremonyData.vm_info.instance_id) {
      logger.error("❌ Error: No instance_id found in JSON file");
      logger.error("Please regenerate the JSON file with --instance-id parameter");
      process.exit(1);
    }

    if (!ceremonyData.upload_info || !ceremonyData.upload_info.s3_key_field) {
      logger.error("❌ Error: Invalid JSON file structure - missing upload_info");
      process.exit(1);
    }

    // Extract verification parameters
    const instanceId = ceremonyData.vm_info.instance_id;
    const bucketName = ceremonyData.vm_info.bucket_name;
    const lastPtauStoragePath = ceremonyData.upload_info.s3_key_field;

    logger.log(`🖥️  Instance ID: ${instanceId}`);
    logger.log(`🪣  Bucket: ${bucketName}`);
    logger.log(`📁  File: ${lastPtauStoragePath}`);
    console.log(`=`.repeat(60));

    // Prepare verification request
    const verificationPayload = {
      instanceId,
      bucketName,
      lastPtauStoragePath,
    };

    logger.log("🚀 Sending verification request to backend...");

    // Import axios dynamically
    let axios: any;
    try {
      axios = (await import("axios")).default;
    } catch (error) {
      logger.error("❌ Error: axios not found");
      logger.error("Please install axios: pnpm add axios");
      process.exit(1);
    }

    // Make API request
    try {
      // Import https module for SSL configuration
      const https = await import("https");

      const response = await axios.post(`${BREBAJE_API_URL}/vm/verify`, verificationPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Bypass self-signed certificate verification
        }),
      });

      // Success response
      logger.success("✅ Verification request sent successfully!");
      console.log(`=`.repeat(60));
      logger.log(`📋 Command ID: ${response.data.commandId}`);
      logger.log(`🔗 Status URL: ${BREBAJE_API_URL}${response.data.statusUrl}`);

      if (response.data.autoStop) {
        logger.log(`⏹️  Auto-stop: ${response.data.autoStop}`);
      }

      if (response.data.monitoring) {
        logger.log(`📬 Monitoring: ${response.data.monitoring}`);
      }

      console.log(`=`.repeat(60));
      logger.log("💡 You can check verification status with:");
      logger.log(`   curl "${BREBAJE_API_URL}${response.data.statusUrl}"`);
    } catch (error: any) {
      if (error.response) {
        // API error response
        logger.failure(`❌ API Error`, `(${error.response.status}): ${error.response.statusText}`);
        if (error.response.data) {
          logger.error(`Details: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      } else if (error.request) {
        // Network error
        logger.failure("❌ Network error: Could not connect to backend", error.message);
        logger.error(`Make sure backend is running at: ${BREBAJE_API_URL}`);
      } else {
        // Other error
        logger.failure(`❌ Error:`, error.message);
      }
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.failure(`❌ Failed to start VM verification:`, errorMessage);
    process.exit(1);
  }
}
