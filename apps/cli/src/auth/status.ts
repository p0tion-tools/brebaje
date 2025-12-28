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
    const config = loadConfig();
    const tokenPath = config.BREBAJE_AUTH_TOKEN_PATH;

    logger.log("🔍 Checking authentication status...");

    const validation = validateToken(tokenPath);

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 Authentication Status");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    if (validation.valid && validation.payload) {
      console.log("✅ Status: Authenticated");
      console.log(`👤 User: ${validation.payload.user.displayName}`);
      console.log(`🔑 Provider: ${validation.payload.user.provider}`);

      // Calculate time until expiration
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = validation.payload.exp - now;
      const hoursUntilExpiry = Math.floor(timeUntilExpiry / 3600);
      const minutesUntilExpiry = Math.floor((timeUntilExpiry % 3600) / 60);

      console.log(`⏰ Token expires in: ${hoursUntilExpiry}h ${minutesUntilExpiry}m`);
      console.log(`📁 Token location: ${tokenPath}`);
    } else {
      console.log("❌ Status: Not authenticated");

      if (validation.error) {
        console.log(`⚠️  Reason: ${validation.error}`);
      }

      console.log("");
      console.log("To login, run: brebaje-cli auth login");
    }

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Status check failed: ${errorMessage}`);
    process.exit(1);
  }
}
