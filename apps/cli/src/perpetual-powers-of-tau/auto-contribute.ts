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
}

export async function autoContributePerpetualPowersOfTau(jsonPath?: string): Promise<void> {
  try {
    console.log(`🚀 Starting auto-contribute process...`);
    console.log(`This will: download → contribute → upload → post-record`);
    console.log(`=`.repeat(60));

    // Find ceremony URLs JSON file
    const fs = await import("fs");
    const path = await import("path");

    let ceremonyUrlsPath: string;

    if (jsonPath) {
      // Use provided path
      ceremonyUrlsPath = jsonPath;
    } else {
      // Check input folder for ceremony-urls JSON files
      const inputDir = "input";
      if (!fs.existsSync(inputDir)) {
        console.error(`❌ Error: No ceremony URLs JSON file provided and input/ folder not found`);
        console.error(`Please either:`);
        console.error(`  1. Provide JSON file path: brebaje-cli ppot auto-contribute <json-path>`);
        console.error(`  2. Place ceremony URLs JSON file in input/ folder`);
        process.exit(1);
      }

      const jsonFiles = fs
        .readdirSync(inputDir)
        .filter((file) => file.startsWith("ceremony-urls-") && file.endsWith(".json"));

      if (jsonFiles.length === 0) {
        console.error(`❌ Error: No ceremony URLs JSON file found in input/ folder`);
        console.error(`Please either:`);
        console.error(`  1. Provide JSON file path: brebaje-cli ppot auto-contribute <json-path>`);
        console.error(
          `  2. Generate URLs: brebaje-cli ppot generate-urls <filename> -o input/ceremony-urls-<name>.json`,
        );
        process.exit(1);
      }

      if (jsonFiles.length > 1) {
        console.error(`❌ Error: Multiple ceremony URLs JSON files found in input/ folder:`);
        jsonFiles.forEach((file) => console.error(`  - ${file}`));
        console.error(
          `Please specify which one to use: brebaje-cli ppot auto-contribute input/<filename>.json`,
        );
        process.exit(1);
      }

      ceremonyUrlsPath = path.join(inputDir, jsonFiles[0]);
    }

    // Check if file exists
    if (!fs.existsSync(ceremonyUrlsPath)) {
      console.error(`❌ Error: Ceremony URLs file not found: ${ceremonyUrlsPath}`);
      process.exit(1);
    }

    // Read and parse JSON file
    let ceremonyUrls: CeremonyUrls;
    try {
      const jsonContent = fs.readFileSync(ceremonyUrlsPath, "utf-8");
      ceremonyUrls = JSON.parse(jsonContent);
      console.log(`📄 Using ceremony URLs from: ${ceremonyUrlsPath}`);
    } catch (error) {
      console.error(`❌ Error: Failed to read ceremony URLs file: ${ceremonyUrlsPath}`);
      console.error(`Please ensure the file contains valid JSON`);
      process.exit(1);
    }

    // Validate JSON structure
    if (!ceremonyUrls.download_info || !ceremonyUrls.upload_info) {
      console.error(`❌ Error: Invalid ceremony URLs file structure`);
      console.error(`Expected: { download_info: {...}, upload_info: {...} }`);
      process.exit(1);
    }

    const DOWNLOAD_URL = ceremonyUrls.download_info.download_url;
    const UPLOAD_URL = ceremonyUrls.upload_info.upload_url;

    if (!DOWNLOAD_URL || !UPLOAD_URL) {
      console.error(`❌ Error: Missing URLs in ceremony file`);
      console.error(`Please ensure the JSON file contains valid download_url and upload_url`);
      process.exit(1);
    }

    // Step 1: Download challenge file
    console.log(`\n📥 Step 1/4: Downloading challenge file...`);
    try {
      const { downloadPerpetualPowersOfTau } = await import("./download.js");
      await downloadPerpetualPowersOfTau(DOWNLOAD_URL);
      console.log(`✅ Download completed`);
    } catch (error) {
      console.error(`❌ Download failed:`, error);
      process.exit(1);
    }

    // Step 2: Make contribution
    console.log(`\n🔧 Step 2/4: Making contribution...`);
    try {
      const { contributePerpetualPowersOfTau } = await import("./contribute.js");
      await contributePerpetualPowersOfTau();
      console.log(`✅ Contribution completed`);
    } catch (error) {
      console.error(`❌ Contribution failed:`, error);
      process.exit(1);
    }

    // Step 3: Upload contribution
    console.log(`\n📤 Step 3/4: Uploading contribution...`);
    try {
      const { uploadPerpetualPowersOfTau } = await import("./upload.js");
      await uploadPerpetualPowersOfTau(UPLOAD_URL);
      console.log(`✅ Upload completed`);
    } catch (error) {
      console.error(`❌ Upload failed:`, error);
      process.exit(1);
    }

    // Step 4: Post record to GitHub Gist
    console.log(`\n📋 Step 4/4: Posting contribution record...`);
    try {
      const { postRecordPerpetualPowersOfTau } = await import("./post-record.js");
      await postRecordPerpetualPowersOfTau();
      console.log(`✅ Record posted`);
    } catch (error) {
      console.warn(`⚠️  Record posting failed:`, error);
      console.warn(`You can manually post your record later using: brebaje-cli ppot post-record`);
    }

    // Success summary
    console.log(`\n🎉 Auto-contribute process completed successfully!`);
    console.log(`=`.repeat(60));
    console.log(`✅ Challenge file downloaded`);
    console.log(`✅ Contribution made and saved`);
    console.log(`✅ Contribution uploaded to ceremony`);
    console.log(`✅ Record posted publicly (if GitHub token provided)`);
    console.log(`\n💡 Your contribution is now part of the ceremony!`);

    // Cleanup suggestion
    console.log(`\n🧹 Optional cleanup:`);
    console.log(`  - Remove input/ directory: rm -rf input/`);
    console.log(`  - Keep output/ directory for your records`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Auto-contribute process failed:`, errorMessage);
    console.error(`\n💡 You can run individual steps manually:`);
    console.error(`  1. brebaje-cli ppot download <download-url>`);
    console.error(`  2. brebaje-cli ppot contribute`);
    console.error(`  3. brebaje-cli ppot upload <upload-url>`);
    console.error(`  4. brebaje-cli ppot post-record`);
    process.exit(1);
  }
}
