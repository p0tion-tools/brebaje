import { scriptLoggerTitle } from "src/utils/constant.js";
import {
  GLOBAL_CONFIG_PATH,
  hasGlobalConfig,
  ensureConfigDirectory,
  createInitialConfig,
} from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { showConfigPath } from "./path.js";
import { writeFileSync } from "fs";

export async function createNewConfig(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:New`);

  try {
    logger.log("🆕 Creating new global configuration...");

    // First, show current path status
    showConfigPath();
    console.log(""); // Add spacing

    // Check if global config already exists
    if (hasGlobalConfig()) {
      logger.warn("⚠️  Global configuration file already exists");
      console.log("");
      console.log("This will overwrite your existing configuration.");
      console.log("Press Enter to confirm, or Ctrl+C to cancel:");

      // Wait for user confirmation
      await waitForEnterKey();
      console.log(""); // Add spacing after confirmation
    }

    logger.log("📁 Creating global config directory...");

    // Ensure directory exists
    ensureConfigDirectory();

    logger.log("📄 Creating configuration file from template...");

    // Try to find .env.example file
    const configContent = createInitialConfig();

    // Write the configuration file
    writeFileSync(GLOBAL_CONFIG_PATH, configContent, "utf-8");

    logger.success("✅ Global configuration created successfully!");
    console.log("");
    console.log(`📁 Location: ${GLOBAL_CONFIG_PATH}`);
    console.log("");
    console.log("💡 Next steps:");
    console.log("   1. Edit the configuration file with your values:");
    console.log(`      nano ${GLOBAL_CONFIG_PATH}`);
    console.log("   2. Or use specific config commands:");
    console.log('      brebaje-cli config name "Your Name"');
    console.log("      brebaje-cli config gh-token <your-token>");
    console.log("");
    console.log("🔒 The configuration is stored securely in your home directory");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to create new config: ${errorMessage}`);
    process.exit(1);
  }
}

async function waitForEnterKey(): Promise<void> {
  return new Promise((resolve) => {
    const stdin = process.stdin;

    // Check if stdin is a TTY (interactive terminal)
    if (!stdin.isTTY) {
      // Non-interactive mode, assume confirmation
      console.log("(Non-interactive mode: assuming confirmation)");
      resolve();
      return;
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (key: string) => {
      // Enter key is '\r' on most systems, '\n' on some
      if (key === "\r" || key === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        resolve();
      } else if (key === "\u0003") {
        // Ctrl+C
        console.log("\n❌ Operation cancelled");
        process.exit(0);
      }
    };

    stdin.on("data", onData);
  });
}
