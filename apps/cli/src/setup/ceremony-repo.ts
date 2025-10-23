import fs from "fs";

function validateRepositoryUrl(url: string): boolean {
  // Validate GitHub repository URL format
  const urlPattern = /^https:\/\/github\.com\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+\/?$/;
  return urlPattern.test(url);
}

export async function setupCeremonyRepository(repositoryUrl: string): Promise<void> {
  try {
    console.log("🔧 Setting up ceremony repository...");

    // Validate repository URL format
    if (!validateRepositoryUrl(repositoryUrl)) {
      console.error("❌ Error: Invalid GitHub repository URL format");
      console.error("Expected format: https://github.com/owner/repository");
      console.error("Example: https://github.com/your-username/ceremony-repo-fork");
      process.exit(1);
    }
    const envExamplePath = ".env.example";
    const envPath = ".env";

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
      console.error(`❌ Error: ${envExamplePath} file not found`);
      console.error("Please run this command from the CLI directory (apps/cli)");
      process.exit(1);
    }

    const newRepoLine = `CEREMONY_REPOSITORY_URL=${repositoryUrl}`;

    if (fs.existsSync(envPath)) {
      // .env file exists, modify the CEREMONY_REPOSITORY_URL line
      console.log("📝 .env file exists, updating CEREMONY_REPOSITORY_URL...");

      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");

      let repoUpdated = false;
      const updatedLines = lines.map((line) => {
        if (line.startsWith("CEREMONY_REPOSITORY_URL=")) {
          repoUpdated = true;
          return newRepoLine;
        }
        return line;
      });

      // If CEREMONY_REPOSITORY_URL line doesn't exist, add it
      if (!repoUpdated) {
        updatedLines.push(
          "",
          "# Ceremony Repository (for posting official contribution records)",
          newRepoLine,
        );
      }

      fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");
      console.log("✅ Updated CEREMONY_REPOSITORY_URL in existing .env file");
    } else {
      // .env file doesn't exist, copy from .env.example and replace repository URL
      console.log("📄 Creating .env file from .env.example...");

      const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
      const repoPlaceholder = "CEREMONY_REPOSITORY_URL=https://github.com/owner/ceremony-repo";

      if (!envExampleContent.includes(repoPlaceholder)) {
        console.error("❌ Error: Ceremony repository placeholder not found in .env.example");
        console.error(`Expected to find: ${repoPlaceholder}`);
        process.exit(1);
      }

      const newEnvContent = envExampleContent.replace(repoPlaceholder, newRepoLine);
      fs.writeFileSync(envPath, newEnvContent, "utf-8");
      console.log("✅ Created .env file with ceremony repository URL");
    }

    // Verify the repository URL was written correctly
    const verifyContent = fs.readFileSync(envPath, "utf-8");
    if (!verifyContent.includes(newRepoLine)) {
      console.error("❌ Error: Failed to write repository URL to .env file");
      process.exit(1);
    }

    console.log("");
    console.log("🎉 Ceremony repository configured successfully!");
    console.log(`🔗 Repository: ${repositoryUrl}`);
    console.log("");
    console.log(
      "📋 This should be your forked repository URL where contribution records will be posted.",
    );
    console.log("   You can create PRs from this fork to the original ceremony repository.");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to setup ceremony repository:", errorMessage);
    process.exit(1);
  }
}
