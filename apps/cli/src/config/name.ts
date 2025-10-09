import { setConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { status, infoBox } from "../utils/visual.js";

const logger = new ScriptLogger("CLI:Config:Name");

export async function setupContributorNameGlobal(fullName: string): Promise<void> {
  try {
    status("running", "Setting up contributor name for ceremony contributions...");

    // Basic validation
    if (!fullName || fullName.trim().length < 2) {
      logger.error("Please provide a valid full name (at least 2 characters)");
      process.exit(1);
    }

    const cleanName = fullName.trim();

    // Use global config manager to set the contributor name
    setConfig("CONTRIBUTOR_NAME", cleanName);

    logger.success("Contributor name configured successfully!");

    infoBox("Configuration Complete", [
      `Name: ${cleanName}`,
      "Saved to global configuration",
      "",
      "This name will be used in:",
      "  • Ceremony contribution records",
      "  • Pull request documentation",
      "  • Response resume files",
      "",
      "Privacy reminder:",
      "  • This name appears in public contribution records",
      "  • Your global config is stored securely in ~/.brebaje/",
    ]);
  } catch (error) {
    logger.error("Failed to setup contributor name", error instanceof Error ? error : undefined);
    process.exit(1);
  }
}
