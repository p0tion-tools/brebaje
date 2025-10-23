import fs from "fs";

export async function setupContributorName(fullName: string): Promise<void> {
  try {
    console.log("👤 Setting up contributor name for ceremony contributions...");

    // Basic validation
    if (!fullName || fullName.trim().length < 2) {
      console.error("❌ Error: Please provide a valid full name (at least 2 characters)");
      process.exit(1);
    }

    const cleanName = fullName.trim();
    const envExamplePath = ".env.example";
    const envPath = ".env";

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
      console.error(`❌ Error: ${envExamplePath} file not found`);
      console.error("Please run this command from the CLI directory (apps/cli)");
      process.exit(1);
    }

    const newNameLine = `CONTRIBUTOR_NAME=${cleanName}`;

    if (fs.existsSync(envPath)) {
      // .env file exists, modify the CONTRIBUTOR_NAME line
      console.log("📝 .env file exists, updating CONTRIBUTOR_NAME...");

      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");

      let nameUpdated = false;
      const updatedLines = lines.map((line) => {
        if (line.startsWith("CONTRIBUTOR_NAME=")) {
          nameUpdated = true;
          return newNameLine;
        }
        return line;
      });

      // If CONTRIBUTOR_NAME line doesn't exist, add it
      if (!nameUpdated) {
        updatedLines.push(
          "",
          "# Contributor Name (for ceremony contribution records)",
          newNameLine,
        );
      }

      fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");
      console.log("✅ Updated CONTRIBUTOR_NAME in existing .env file");
    } else {
      // .env file doesn't exist, copy from .env.example and add name
      console.log("📄 Creating .env file from .env.example...");

      const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
      const namePlaceholder = "CONTRIBUTOR_NAME=Your Full Name Here";

      // If placeholder exists, replace it; otherwise append
      let newEnvContent;
      if (envExampleContent.includes(namePlaceholder)) {
        newEnvContent = envExampleContent.replace(namePlaceholder, newNameLine);
      } else {
        newEnvContent =
          envExampleContent +
          "\n\n# Contributor Name (for ceremony contribution records)\n" +
          newNameLine;
      }

      fs.writeFileSync(envPath, newEnvContent, "utf-8");
      console.log("✅ Created .env file with contributor name");
    }

    // Verify the name was written correctly
    const verifyContent = fs.readFileSync(envPath, "utf-8");
    if (!verifyContent.includes(newNameLine)) {
      console.error("❌ Error: Failed to write contributor name to .env file");
      process.exit(1);
    }

    console.log("");
    console.log("🎉 Contributor name configured successfully!");
    console.log(`👤 Name: ${cleanName}`);
    console.log("");
    console.log("💡 This name will be used in:");
    console.log("   - Ceremony contribution records");
    console.log("   - Pull request documentation");
    console.log("   - Response resume files");
    console.log("");
    console.log("🔒 Privacy reminder:");
    console.log("   - This name appears in public contribution records");
    console.log("   - Keep your .env file private (already in .gitignore)");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to setup contributor name:", errorMessage);
    process.exit(1);
  }
}
