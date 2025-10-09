import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { warningBox, infoBox, keyValue } from "../utils/visual.js";

const logger = new ScriptLogger("CLI:Config:GitHubToken");

function validateGitHubToken(token: string): boolean {
  // GitHub classic tokens start with 'ghp_' and are 40 characters total
  const classicTokenPattern = /^ghp_[A-Za-z0-9]{36}$/;
  return classicTokenPattern.test(token);
}

export async function setupGitHubTokenGlobal(githubToken: string): Promise<void> {
  try {
    logger.log("🔧 Setting up GitHub classic token for gist creation...");

    // Validate token format
    if (!validateGitHubToken(githubToken)) {
      logger.error("Invalid GitHub classic token format");

      warningBox("Invalid Token Format", [
        "Expected format: ghp_[36 characters]",
        "Example: ghp_abc123def456ghi789jkl012mno345pqr678",
        "",
        "To create a classic token:",
        "1. Go to https://github.com/settings/tokens",
        "2. Click 'Generate new token (classic)'",
        "3. Select only 'gist' scope for gist creation",
        "4. Copy the generated token",
      ]);
      process.exit(1);
    }

    // Use global config manager to set the token
    setConfig("GITHUB_TOKEN", githubToken);

    logger.success("GitHub classic token configured successfully!");

    keyValue({
      "Token (masked)": `${githubToken.substring(0, 10)}...${githubToken.substring(githubToken.length - 4)}`,
      "Storage location": "Global configuration (~/.brebaje/)",
      Scope: "Gist creation only",
    });

    infoBox("Security Reminder", [
      "This token is used only for creating public gists",
      "Your global config is stored securely in ~/.brebaje/",
      "Never share your GitHub token",
      "",
      "🚀 Ready for gist creation! This token will be used for social sharing.",
    ]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to setup GitHub token: ${errorMessage}`);
    process.exit(1);
  }
}
