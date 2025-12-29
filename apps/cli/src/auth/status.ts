import { loadConfig } from "../utils/config.js";
import { validateToken } from "./token.js";
import { ScriptLogger } from "../utils/logger.js";
import { scriptLoggerTitle } from "../utils/constant.js";

/**
 * Check authentication status
 */
export async function checkAuthStatus(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Auth:Status`);

  try {
    const { BREBAJE_AUTH_TOKEN_PATH } = loadConfig();

    logger.log("🔍 Checking authentication status...");

    const validation = validateToken(BREBAJE_AUTH_TOKEN_PATH);

    logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.log("🔐 Authentication Status");
    logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (validation.valid && validation.payload) {
      logger.log("✅ Status: Authenticated");
      logger.log(`👤 User: ${validation.payload.user.displayName}`);
      logger.log(`🔑 Provider: ${validation.payload.user.provider}`);

      // Calculate time until expiration
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = validation.payload.exp - now;
      const hoursUntilExpiry = Math.floor(timeUntilExpiry / 3600);
      const minutesUntilExpiry = Math.floor((timeUntilExpiry % 3600) / 60);

      logger.log(`⏰ Token expires in: ${hoursUntilExpiry}h ${minutesUntilExpiry}m`);
      logger.log(`📁 Token location: ${BREBAJE_AUTH_TOKEN_PATH}`);
    } else {
      logger.log("❌ Status: Not authenticated");

      if (validation.error) {
        logger.log(`⚠️  Reason: ${validation.error}`);
      }

      logger.log("\nTo login, run:");
      logger.log("brebaje-cli auth login-github");
      // TODO: Add other login methods when available
    }

    logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Status check failed: ${errorMessage}`);
    process.exit(1);
  }
}
