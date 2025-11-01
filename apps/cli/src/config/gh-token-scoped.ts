import { scriptLoggerTitle } from "src/utils/constant.js";
import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

function validateGitHubTokenScoped(token: string): boolean {
  // GitHub fine-grained tokens start with 'github_pat_' and are longer
  const fineGrainedTokenPattern = /^github_pat_[A-Za-z0-9_]{82}$/;
  return fineGrainedTokenPattern.test(token);
}

export async function setupGitHubTokenScopedGlobal(githubTokenScoped: string): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:GitHubTokenScoped`);

  try {
    logger.log("🔧 Setting up fine-grained GitHub token...");

    // Validate token format
    if (!validateGitHubTokenScoped(githubTokenScoped)) {
      logger.error("❌ Invalid fine-grained GitHub token format");
      console.error("Expected format: github_pat_[82 characters]");
      console.error("Example: github_pat_11ABC...XYZ789");
      console.error("");
      console.error("To create a fine-grained token:");
      console.error("1. Go to https://github.com/settings/tokens");
      console.error("2. Click 'Generate new token' > 'Fine-grained personal access token'");
      console.error("3. Select 'Selected repositories' and choose your forked ceremony repository");
      console.error("4. Grant these permissions:");
      console.error("   - Contents: Write");
      console.error("   - Pull requests: Write");
      console.error("   - Metadata: Read");
      console.error("5. Copy the generated token");
      process.exit(1);
    }

    // Use global config manager to set the token
    setConfig("GITHUB_TOKEN_SCOPED", githubTokenScoped);

    logger.success("🎉 Fine-grained GitHub token configured successfully!");
    console.log(
      `🔧 Token: ${githubTokenScoped.substring(0, 15)}...${githubTokenScoped.substring(githubTokenScoped.length - 6)}`,
    );
    console.log("📁 Saved to global configuration");
    console.log("");
    console.log("🔒 Security reminder:");
    console.log("   - This token only works with your selected ceremony repository");
    console.log("   - Your global config is stored securely in ~/.brebaje/");
    console.log("   - Never share your GitHub token");
    console.log("");
    console.log("🚀 You're ready to post repository contributions!");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to setup fine-grained GitHub token: ${errorMessage}`);
    process.exit(1);
  }
}
