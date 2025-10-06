import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

const logger = new ScriptLogger("CLI:Config:CeremonyRepo");

function validateRepositoryUrl(url: string): boolean {
  // Validate GitHub repository URL format
  const urlPattern = /^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\/?$/;
  return urlPattern.test(url);
}

export async function setupCeremonyRepositoryGlobal(repositoryUrl: string): Promise<void> {
  try {
    logger.log("🔧 Setting up ceremony repository...");

    // Validate repository URL format
    if (!validateRepositoryUrl(repositoryUrl)) {
      logger.error("❌ Invalid GitHub repository URL format");
      console.error("Expected format: https://github.com/owner/repository");
      console.error("Example: https://github.com/your-username/ceremony-repo-fork");
      process.exit(1);
    }

    // Use global config manager to set the repository URL
    setConfig("CEREMONY_REPOSITORY_URL", repositoryUrl);

    logger.success("🎉 Ceremony repository configured successfully!");
    console.log(`🔗 Repository: ${repositoryUrl}`);
    console.log("📁 Saved to global configuration");
    console.log("");
    console.log(
      "📋 This should be your forked repository URL where contribution records will be posted.",
    );
    console.log("   You can create PRs from this fork to the original ceremony repository.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to setup ceremony repository: ${errorMessage}`);
    process.exit(1);
  }
}
