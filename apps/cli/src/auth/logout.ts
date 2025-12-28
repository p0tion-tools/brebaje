import { loadConfig } from "../utils/config.js";
import { deleteToken, hasToken } from "./token.js";
import { ScriptLogger } from "../utils/logger.js";
import { scriptLoggerTitle } from "../utils/constant.js";

/**
 * Logout and clear stored authentication token
 */
export async function logout(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Auth:Logout`);

  try {
    const config = loadConfig();
    const tokenPath = config.BREBAJE_AUTH_TOKEN_PATH;

    if (!hasToken(tokenPath)) {
      logger.log("ℹ️  No active session found");
      console.log("");
      console.log("You are not currently logged in.");
      return;
    }

    logger.log("🚪 Logging out...");

    const deleted = deleteToken(tokenPath);

    if (deleted) {
      logger.success("✅ Logged out successfully!");
      console.log("");
      console.log("Your authentication token has been removed.");
      console.log("");
      console.log("To login again, run: brebaje-cli auth login");
    } else {
      logger.error("❌ Failed to remove authentication token");
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Logout failed: ${errorMessage}`);
    process.exit(1);
  }
}
