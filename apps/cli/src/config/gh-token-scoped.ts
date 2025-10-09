import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { status, warningBox, infoBox, keyValue } from "../utils/visual.js";

const logger = new ScriptLogger("CLI:Config:GitHubTokenScoped");

function validateGitHubTokenScoped(token: string): boolean {
  // GitHub fine-grained tokens start with 'github_pat_' and are longer
  const fineGrainedTokenPattern = /^github_pat_[A-Za-z0-9_]{82}$/;
  return fineGrainedTokenPattern.test(token);
}

export async function setupGitHubTokenScopedGlobal(githubTokenScoped: string): Promise<void> {
  try {
    status("running", "Setting up fine-grained GitHub token...");

    // Validate token format
    if (!validateGitHubTokenScoped(githubTokenScoped)) {
      logger.error("Invalid fine-grained GitHub token format");
      warningBox("Invalid Token Format", [
        "Expected format: github_pat_[82 characters]",
        "Example: github_pat_11ABC...XYZ789",
        "",
        "To create a fine-grained token:",
        "1. Go to https://github.com/settings/tokens",
        "2. Click 'Generate new token' > 'Fine-grained personal access token'",
        "3. Select 'Selected repositories' and choose your forked ceremony repository",
        "4. Grant these permissions:",
        "   - Contents: Write",
        "   - Pull requests: Write",
        "   - Metadata: Read",
        "5. Copy the generated token",
      ]);
      process.exit(1);
    }

    // Use global config manager to set the token
    setConfig("GITHUB_TOKEN_SCOPED", githubTokenScoped);

    logger.success("Fine-grained GitHub token configured successfully!");

    keyValue({
      "Token (masked)": `${githubTokenScoped.substring(0, 15)}...${githubTokenScoped.substring(githubTokenScoped.length - 6)}`,
      "Storage location": "Global configuration (~/.brebaje/)",
      Scope: "Selected ceremony repository only",
    });

    infoBox("Security Reminder", [
      "This token only works with your selected ceremony repository",
      "Your global config is stored securely in ~/.brebaje/",
      "Never share your GitHub token",
      "",
      "🚀 You're ready to post repository contributions!",
    ]);
  } catch (error) {
    logger.error(
      "Failed to setup fine-grained GitHub token",
      error instanceof Error ? error : undefined,
    );
    process.exit(1);
  }
}
