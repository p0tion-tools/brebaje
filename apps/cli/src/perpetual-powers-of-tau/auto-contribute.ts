import { config } from "dotenv";

// Load environment variables
config();

// Environment variables for auto-contribute
const DOWNLOAD_URL = process.env.DOWNLOAD_URL;
const UPLOAD_URL = process.env.UPLOAD_URL;

export async function autoContributePerpetualPowersOfTau(): Promise<void> {
  try {
    console.log(`🚀 Starting auto-contribute process...`);
    console.log(`This will: download → contribute → upload → post-record`);
    console.log(`=`.repeat(60));

    // Check required environment variables
    if (!DOWNLOAD_URL) {
      console.error(`❌ Error: DOWNLOAD_URL environment variable not set`);
      console.error(`Please set DOWNLOAD_URL in your .env file`);
      console.error(`Example: DOWNLOAD_URL=https://s3.amazonaws.com/bucket/challenge.ptau?...`);
      process.exit(1);
    }

    if (!UPLOAD_URL) {
      console.error(`❌ Error: UPLOAD_URL environment variable not set`);
      console.error(`Please set UPLOAD_URL in your .env file`);
      console.error(`Example: UPLOAD_URL=https://s3.amazonaws.com/bucket/contribution.ptau?...`);
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
