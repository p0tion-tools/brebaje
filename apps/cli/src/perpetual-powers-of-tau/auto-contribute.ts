import { getUrlsJson } from "../utils/file_handling.js";
import { loadConfig } from "../utils/config.js";
import { CeremonyUrls } from "src/utils/types.js";
import { readFileSync } from "fs";
import { downloadPerpetualPowersOfTau } from "./download.js";
import { contributePerpetualPowersOfTau } from "./contribute.js";
import { uploadPerpetualPowersOfTau } from "./upload.js";
import { postRecordPerpetualPowersOfTau } from "./post-record.js";

// Function to validate GitHub tokens and configuration
function validateTokensAndConfig(): void {
  // Get tokens and configuration from global/local config
  const config = loadConfig();
  const gistToken = config.GITHUB_TOKEN;
  const repoToken = config.GITHUB_TOKEN_SCOPED;
  const repositoryUrl = config.CEREMONY_REPOSITORY_URL;
  const contributorName = config.CONTRIBUTOR_NAME;

  // Validate classic token for gists
  if (!gistToken) {
    console.error(`🔑 GitHub classic token required for gist creation.`);
    console.error(`You can provide it by:`);
    console.error(`  1. Using: brebaje-cli config gh-token <your-classic-token>`);
    console.error(`  2. Create a classic token at: https://github.com/settings/tokens`);
    console.error(`     (Select 'gist' scope only)`);
    process.exit(1);
  }

  // Validate classic token format
  const classicTokenPattern = /^ghp_[A-Za-z0-9]{36}$/;
  if (!classicTokenPattern.test(gistToken)) {
    console.error(`❌ Invalid GitHub classic token format.`);
    console.error(`Expected format: ghp_[36 characters]`);
    console.error(`Please check your token and reconfigure using: brebaje-cli config gh-token`);
    process.exit(1);
  }

  // Validate fine-grained token for repository operations
  if (!repoToken) {
    console.error(`🔑 GitHub fine-grained token required for repository operations.`);
    console.error(`You can set it up by:`);
    console.error(`  1. Using: brebaje-cli config gh-token-scoped <your-fine-grained-token>`);
    console.error(`  2. Create a fine-grained token at: https://github.com/settings/tokens`);
    console.error(`     (Scope to your forked ceremony repository with Contents + PR permissions)`);
    process.exit(1);
  }

  // Validate fine-grained token format
  const fineGrainedTokenPattern = /^github_pat_[A-Za-z0-9_]{82}$/;
  if (!fineGrainedTokenPattern.test(repoToken)) {
    console.error(`❌ Invalid GitHub fine-grained token format.`);
    console.error(`Expected format: github_pat_[82 characters]`);
    console.error(
      `Please check your token and reconfigure using: brebaje-cli config gh-token-scoped`,
    );
    process.exit(1);
  }

  // Validate repository URL
  if (!repositoryUrl) {
    console.error(`🏗️ Ceremony repository URL required.`);
    console.error(`You can set it up by:`);
    console.error(`  1. Using: brebaje-cli config ceremony-repo <your-forked-repo-url>`);
    console.error(`     Example: https://github.com/your-username/ceremony-repo-fork`);
    process.exit(1);
  }

  // Validate contributor name
  if (!contributorName) {
    console.error(`👤 Contributor name required for ceremony records.`);
    console.error(`You can set it up by:`);
    console.error(`  1. Using: brebaje-cli config name "Your Full Name"`);
    console.error(`     Example: brebaje-cli config name "John Doe"`);
    process.exit(1);
  }

  console.log(`✅ Token and configuration validation passed`);
}

export async function autoContributePerpetualPowersOfTau(jsonPath?: string): Promise<void> {
  try {
    console.log(`🚀 Starting auto-contribute process...`);
    console.log(`This will: download → contribute → upload → post-record`);
    console.log(`=`.repeat(60));

    // Validate tokens and configuration before starting
    console.log(`🔐 Validating GitHub tokens and configuration...`);
    validateTokensAndConfig();

    // Find ceremony URLs JSON file
    const ceremonyUrlsPath = getUrlsJson("input", jsonPath);

    // Read and parse JSON file
    let ceremonyUrls: CeremonyUrls;
    try {
      const jsonContent = readFileSync(ceremonyUrlsPath, "utf-8");
      ceremonyUrls = JSON.parse(jsonContent);
      console.log(`📄 Using ceremony URLs from: ${ceremonyUrlsPath}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await downloadPerpetualPowersOfTau(DOWNLOAD_URL);
      console.log(`✅ Download completed`);
    } catch (error) {
      console.error(`❌ Download failed:`, error);
      process.exit(1);
    }

    // Step 2: Make contribution
    console.log(`\n🔧 Step 2/4: Making contribution...`);
    try {
      // Use CONTRIBUTOR_NAME from global/local config for auto-contribute workflow
      const config = loadConfig();
      const contributorName = config.CONTRIBUTOR_NAME;
      await contributePerpetualPowersOfTau(contributorName);
      console.log(`✅ Contribution completed`);
    } catch (error) {
      console.error(`❌ Contribution failed:`, error);
      process.exit(1);
    }

    // Step 3: Upload contribution
    console.log(`\n📤 Step 3/4: Uploading contribution...`);
    try {
      await uploadPerpetualPowersOfTau(UPLOAD_URL);
      console.log(`✅ Upload completed`);
    } catch (error) {
      console.error(`❌ Upload failed:`, error);
      process.exit(1);
    }

    // Step 4: Post record to GitHub Gist
    console.log(`\n📋 Step 4/4: Posting contribution record...`);
    try {
      await postRecordPerpetualPowersOfTau();
      console.log(`✅ Record posted`);
    } catch (error) {
      console.error(`❌ Record posting failed unexpectedly:`, error);
      console.error(`This shouldn't happen since tokens were validated. Please check:`);
      console.error(`  1. Network connectivity`);
      console.error(`  2. Token permissions are still valid`);
      console.error(`  3. Repository access`);
      console.error(`You can retry with: brebaje-cli ppot post-record`);
      throw error; // Re-throw since this indicates a serious issue
    }

    // Success summary
    console.log(`\n🎉 Auto-contribute process completed successfully!`);
    console.log(`=`.repeat(60));
    console.log(`✅ Challenge file downloaded`);
    console.log(`✅ Contribution made and saved`);
    console.log(`✅ Contribution uploaded to ceremony`);
    console.log(`✅ Record posted publicly to GitHub`);
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
