import { scriptLoggerTitle } from "src/utils/constant.js";
import { migrateLocalToGlobal, hasLocalConfig, hasGlobalConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";

export function migrateConfig(): void {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Config:Migrate`);

  try {
    logger.log("🚚 Migrating local configuration to global...");

    // Check if local config exists
    if (!hasLocalConfig()) {
      logger.warn("⚠️  No local .env file found to migrate");
      console.log("");
      console.log("💡 Create a global configuration with:");
      console.log("   brebaje-cli config new");
      return;
    }

    // Check if global config already exists
    if (hasGlobalConfig()) {
      logger.warn("⚠️  Global configuration already exists");
      console.log("");
      console.log("💡 Options:");
      console.log("   1. View existing global config: brebaje-cli config path");
      console.log("   2. Recreate global config: brebaje-cli config new");
      console.log("   3. Manually merge configurations");
      return;
    }

    // Perform migration
    migrateLocalToGlobal();

    logger.success("✅ Migration completed successfully!");
    console.log("");
    console.log("🎯 Your configuration is now global and will work from any directory");
    console.log("");
    console.log("💡 Next steps:");
    console.log("   1. Verify migration: brebaje-cli config path");
    console.log("   2. You can now remove the local .env file if desired");
    console.log("   3. Test commands from any directory");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to migrate configuration: ${errorMessage}`);
    process.exit(1);
  }
}
