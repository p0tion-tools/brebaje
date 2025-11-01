import { scriptLoggerTitle } from "src/utils/constant.js";
import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

function validateGitHubToken(token: string): boolean {
  // GitHub classic tokens start with 'ghp_' and are 40 characters total
  const classicTokenPattern = /^ghp_[A-Za-z0-9]{36}$/;
  return classicTokenPattern.test(token);
}

export async function setupGitHubTokenGlobal(githubToken: string): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:GitHubToken`);

  try {
    logger.log("🔧 Setting up GitHub classic token for gist creation...");

    // Validate token format
    if (!validateGitHubToken(githubToken)) {
      logger.error("❌ Invalid GitHub classic token format");
      console.error("Expected format: ghp_[36 characters]");
      console.error("Example: ghp_abc123def456ghi789jkl012mno345pqr678");
      console.error("");
      console.error("To create a classic token:");
      console.error("1. Go to https://github.com/settings/tokens");
      console.error("2. Click 'Generate new token (classic)'");
      console.error("3. Select only 'gist' scope for gist creation");
      console.error("4. Copy the generated token");
      process.exit(1);
    }

    // Use global config manager to set the token
    setConfig("GITHUB_TOKEN", githubToken);

    logger.success("🎉 GitHub classic token configured successfully!");
    console.log(
      `🔧 Token: ${githubToken.substring(0, 10)}...${githubToken.substring(githubToken.length - 4)}`,
    );
    console.log("📁 Saved to global configuration");
    console.log("");
    console.log("🔒 Security reminder:");
    console.log("   - This token is used only for creating public gists");
    console.log("   - Your global config is stored securely in ~/.brebaje/");
    console.log("   - Never share your GitHub token");
    console.log("");
    console.log("🚀 Ready for gist creation! This token will be used for social sharing.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to setup GitHub token: ${errorMessage}`);
    process.exit(1);
  }
}
