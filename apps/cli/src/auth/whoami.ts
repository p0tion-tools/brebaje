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
    const config = loadConfig();
    const tokenPath = config.BREBAJE_AUTH_TOKEN_PATH;

    logger.log("👤 Fetching user information...");

    const validation = validateToken(tokenPath);

    if (!validation.valid || !validation.payload) {
      console.log("");
      console.log("❌ Not authenticated");
      console.log("");

      if (validation.error) {
        console.log(`⚠️  ${validation.error}`);
        console.log("");
      }

      console.log("To login, run: brebaje-cli auth login");
      console.log("");
      process.exit(1);
    }

    const user = validation.payload.user;

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 User Information");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log(`Display Name: ${user.displayName}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Provider: ${user.provider}`);

    if (user.avatarUrl) {
      console.log(`Avatar URL: ${user.avatarUrl}`);
    }

    if (user.githubId) {
      console.log(`GitHub ID: ${user.githubId}`);
    }

    if (user.walletAddress) {
      console.log(`Wallet Address: ${user.walletAddress}`);
    }

    console.log("");
    console.log(`Token issued at: ${new Date(validation.payload.iat * 1000).toLocaleString()}`);
    console.log(`Token expires at: ${new Date(validation.payload.exp * 1000).toLocaleString()}`);

    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to get user information: ${errorMessage}`);
    process.exit(1);
  }
}
