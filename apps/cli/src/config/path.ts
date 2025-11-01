import { scriptLoggerTitle } from "src/utils/constant.js";
import { GLOBAL_CONFIG_DIR, GLOBAL_CONFIG_PATH, hasGlobalConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

export function showConfigPath(): void {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:Path`);

  try {
    logger.log("🔍 Checking global configuration...");

    console.log(`📁 Global config directory: ${GLOBAL_CONFIG_DIR}`);
    console.log(`📄 Global config file: ${GLOBAL_CONFIG_PATH}`);

    if (hasGlobalConfig()) {
      logger.success("✅ Global configuration file exists");
    } else {
      logger.warn("⚠️  Global configuration file does not exist");
      console.log("");
      console.log("💡 Create a new global configuration with:");
      console.log("   brebaje-cli config new");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to check config path: ${errorMessage}`);
    process.exit(1);
  }
}
