function validateGitHubToken(token: string): boolean {
  // GitHub classic tokens start with 'ghp_' and are 40 characters total
  const tokenPattern = /^ghp_[A-Za-z0-9]{36}$/;
  return tokenPattern.test(token);
}

export async function setupGitHubToken(githubToken: string): Promise<void> {
  try {
    console.log("🔧 Setting up GitHub token...");

    // Validate token format
    if (!validateGitHubToken(githubToken)) {
      console.error("❌ Error: Invalid GitHub token format");
      console.error("Expected format: ghp_[36 characters]");
      console.error("Example: ghp_abc123def456ghi789jkl012mno345pqr678");
      console.error("");
      console.error("To create a valid token:");
      console.error("1. Go to https://github.com/settings/tokens");
      console.error("2. Click 'Generate new token (classic)'");
      console.error("3. Select 'gist' scope");
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
    console.log("🎉 GitHub token configured successfully!");
    console.log(
      `🔧 Token: ${githubToken.substring(0, 10)}...${githubToken.substring(githubToken.length - 4)}`,
    );
    console.log("");
    console.log("🔒 Security reminder:");
    console.log("   - Keep your .env file private (already in .gitignore)");
    console.log("   - Never share your GitHub token");
    console.log("");
    console.log("🚀 You're ready to contribute! Try: brebaje-cli ppot auto-contribute");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to setup GitHub token:", errorMessage);
    process.exit(1);
  }
}
