import { loadConfig } from "../utils/config.js";
import { validateToken } from "./token.js";
import { ScriptLogger } from "../utils/logger.js";
import { scriptLoggerTitle } from "../utils/constant.js";

/**
 * Show current user information
 */
export async function whoami(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Auth:Whoami`);

  try {
    const { BREBAJE_AUTH_TOKEN_PATH } = loadConfig();

    logger.log("👤 Fetching user information...");

    const { valid, payload, error } = validateToken(BREBAJE_AUTH_TOKEN_PATH);

    if (!valid || !payload) {
      logger.error("❌ Not authenticated");

      if (error) {
        logger.error(`⚠️  ${error}`);
      }

      logger.log("To login, run: brebaje-cli auth login-github \n");
      process.exit(1);
    }

    const { displayName, id, provider, walletAddress } = payload.user;

    logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.log("👤 User Information");
    logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    logger.log(`Display Name: ${displayName}`);
    logger.log(`User ID: ${id}`);
    logger.log(`Provider: ${provider}`);

    if (walletAddress) {
      logger.log(`Wallet Address: ${walletAddress}`);
    }

    logger.log(`Token issued at: ${new Date(payload.iat * 1000).toLocaleString()}`);
    logger.log(`Token expires at: ${new Date(payload.exp * 1000).toLocaleString()}`);

    logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to get user information: ${errorMessage}`);
    process.exit(1);
  }
}
