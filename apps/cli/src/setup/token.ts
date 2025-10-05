function validateGitHubToken(token: string): boolean {
  // GitHub classic tokens start with 'ghp_' and are 40 characters total
  const classicTokenPattern = /^ghp_[A-Za-z0-9]{36}$/;
  return classicTokenPattern.test(token);
}

function validateGitHubTokenScoped(token: string): boolean {
  // GitHub fine-grained tokens start with 'github_pat_' and are longer
  const fineGrainedTokenPattern = /^github_pat_[A-Za-z0-9_]{82}$/;
  return fineGrainedTokenPattern.test(token);
}

export async function setupGitHubToken(githubToken: string): Promise<void> {
  try {
    console.log("🔧 Setting up GitHub classic token for gist creation...");

    // Validate token format
    if (!validateGitHubToken(githubToken)) {
      console.error("❌ Error: Invalid GitHub classic token format");
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

    const fs = await import("fs");
    const envExamplePath = ".env.example";
    const envPath = ".env";

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
      console.error(`❌ Error: ${envExamplePath} file not found`);
      console.error("Please run this command from the CLI directory (apps/cli)");
      process.exit(1);
    }

    const newTokenLine = `GITHUB_TOKEN=${githubToken}`;

    if (fs.existsSync(envPath)) {
      // .env file exists, modify the GITHUB_TOKEN line
      console.log("📝 .env file exists, updating GITHUB_TOKEN...");

      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");

      let tokenUpdated = false;
      const updatedLines = lines.map((line) => {
        if (line.startsWith("GITHUB_TOKEN=")) {
          tokenUpdated = true;
          return newTokenLine;
        }
        return line;
      });

      // If GITHUB_TOKEN line doesn't exist, add it
      if (!tokenUpdated) {
        updatedLines.push(
          "",
          "# GitHub Token (for posting contribution records to gists)",
          newTokenLine,
        );
      }

      fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");
      console.log("✅ Updated GITHUB_TOKEN in existing .env file");
    } else {
      // .env file doesn't exist, copy from .env.example and replace token
      console.log("📄 Creating .env file from .env.example...");

      const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
      const tokenPlaceholder = "GITHUB_TOKEN=ghp_your_github_token_here";

      if (!envExampleContent.includes(tokenPlaceholder)) {
        console.error("❌ Error: GitHub token placeholder not found in .env.example");
        console.error(`Expected to find: ${tokenPlaceholder}`);
        process.exit(1);
      }

      const newEnvContent = envExampleContent.replace(tokenPlaceholder, newTokenLine);
      fs.writeFileSync(envPath, newEnvContent, "utf-8");
      console.log("✅ Created .env file with GitHub token");
    }

    // Verify the token was written correctly
    const verifyContent = fs.readFileSync(envPath, "utf-8");
    if (!verifyContent.includes(newTokenLine)) {
      console.error("❌ Error: Failed to write token to .env file");
      process.exit(1);
    }

    console.log("");
    console.log("🎉 GitHub classic token configured successfully!");
    console.log(
      `🔧 Token: ${githubToken.substring(0, 10)}...${githubToken.substring(githubToken.length - 4)}`,
    );
    console.log("");
    console.log("🔒 Security reminder:");
    console.log("   - This token is used only for creating public gists");
    console.log("   - Keep your .env file private (already in .gitignore)");
    console.log("   - Never share your GitHub token");
    console.log("");
    console.log("🚀 Ready for gist creation! This token will be used for social sharing.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to setup GitHub token:", errorMessage);
    process.exit(1);
  }
}
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;

export async function setupGitHubTokenScoped(githubTokenScoped: string): Promise<void> {
  try {
    console.log("🔧 Setting up fine-grained GitHub token...");

    // Validate token format
    if (!validateGitHubTokenScoped(githubTokenScoped)) {
      console.error("❌ Error: Invalid fine-grained GitHub token format");
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

    const fs = await import("fs");
    const envExamplePath = ".env.example";
    const envPath = ".env";

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
      console.error(`❌ Error: ${envExamplePath} file not found`);
      console.error("Please run this command from the CLI directory (apps/cli)");
      process.exit(1);
    }

    const newTokenLine = `GITHUB_TOKEN_SCOPED=${githubTokenScoped}`;

    if (fs.existsSync(envPath)) {
      // .env file exists, modify the GITHUB_TOKEN_SCOPED line
      console.log("📝 .env file exists, updating GITHUB_TOKEN_SCOPED...");

      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");

      let tokenUpdated = false;
      const updatedLines = lines.map((line) => {
        if (line.startsWith("GITHUB_TOKEN_SCOPED=")) {
          tokenUpdated = true;
          return newTokenLine;
        }
        return line;
      });

      // If GITHUB_TOKEN_SCOPED line doesn't exist, add it
      if (!tokenUpdated) {
        updatedLines.push(
          "",
          "# GitHub Fine-grained Token (for ceremony repository operations)",
          newTokenLine,
        );
      }

      fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");
      console.log("✅ Updated GITHUB_TOKEN_SCOPED in existing .env file");
    } else {
      // .env file doesn't exist, copy from .env.example and replace token
      console.log("📄 Creating .env file from .env.example...");

      const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
      const tokenPlaceholder = "GITHUB_TOKEN_SCOPED=github_pat_your_fine_grained_token_here";

      // If placeholder doesn't exist, just append
      let newEnvContent;
      if (envExampleContent.includes(tokenPlaceholder)) {
        newEnvContent = envExampleContent.replace(tokenPlaceholder, newTokenLine);
      } else {
        newEnvContent =
          envExampleContent +
          "\n\n# GitHub Fine-grained Token (for ceremony repository operations)\n" +
          newTokenLine;
      }

      fs.writeFileSync(envPath, newEnvContent, "utf-8");
      console.log("✅ Created .env file with fine-grained GitHub token");
    }

    // Verify the token was written correctly
    const verifyContent = fs.readFileSync(envPath, "utf-8");
    if (!verifyContent.includes(newTokenLine)) {
      console.error("❌ Error: Failed to write scoped token to .env file");
      process.exit(1);
    }

    console.log("");
    console.log("🎉 Fine-grained GitHub token configured successfully!");
    console.log(
      `🔧 Token: ${githubTokenScoped.substring(0, 15)}...${githubTokenScoped.substring(githubTokenScoped.length - 6)}`,
    );
    console.log("");
    console.log("🔒 Security reminder:");
    console.log("   - This token only works with your selected ceremony repository");
    console.log("   - Keep your .env file private (already in .gitignore)");
    console.log("   - Never share your GitHub token");
    console.log("");
    console.log("🚀 You're ready to post repository contributions!");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to setup fine-grained GitHub token:", errorMessage);
    process.exit(1);
  }
}
