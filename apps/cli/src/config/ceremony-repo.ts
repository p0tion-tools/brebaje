import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { status, infoBox, warningBox, link } from "../utils/visual.js";

const logger = new ScriptLogger("CLI:Config:CeremonyRepo");

function validateRepositoryUrl(url: string): boolean {
  // Validate GitHub repository URL format
  const urlPattern = /^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\/?$/;
  return urlPattern.test(url);
}

export async function setupCeremonyRepositoryGlobal(repositoryUrl: string): Promise<void> {
  try {
    status("running", "Setting up ceremony repository...");

    // Validate repository URL format
    if (!validateRepositoryUrl(repositoryUrl)) {
      logger.error("Invalid GitHub repository URL format");
      warningBox("Invalid Repository URL", [
        "Expected format: https://github.com/owner/repository",
        "Example: https://github.com/your-username/ceremony-repo-fork",
      ]);
      process.exit(1);
    }

    // Use global config manager to set the repository URL
    setConfig("CEREMONY_REPOSITORY_URL", repositoryUrl);

    logger.success("Ceremony repository configured successfully!");

    link("Repository", repositoryUrl);

    infoBox("Configuration Complete", [
      "Saved to global configuration",
      "",
      "This should be your forked repository URL where contribution records will be posted.",
      "You can create PRs from this fork to the original ceremony repository.",
    ]);
  } catch (error) {
    logger.error("Failed to setup ceremony repository", error instanceof Error ? error : undefined);
    process.exit(1);
  }
}
