import { scriptLoggerTitle } from "src/utils/constant.js";
import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

export async function setupContributorNameGlobal(fullName: string): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:Name`);

  try {
    logger.log("👤 Setting up contributor name for ceremony contributions...");

    // Basic validation
    if (!fullName || fullName.trim().length < 2) {
      logger.error("❌ Please provide a valid full name (at least 2 characters)");
      process.exit(1);
    }

    const cleanName = fullName.trim();

    // Use global config manager to set the contributor name
    setConfig("CONTRIBUTOR_NAME", cleanName);

    logger.success("🎉 Contributor name configured successfully!");
    console.log(`👤 Name: ${cleanName}`);
    console.log("📁 Saved to global configuration");
    console.log("");
    console.log("💡 This name will be used in:");
    console.log("   - Ceremony contribution records");
    console.log("   - Pull request documentation");
    console.log("   - Response resume files");
    console.log("");
    console.log("🔒 Privacy reminder:");
    console.log("   - This name appears in public contribution records");
    console.log("   - Your global config is stored securely in ~/.brebaje/");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to setup contributor name: ${errorMessage}`);
    process.exit(1);
  }
}
