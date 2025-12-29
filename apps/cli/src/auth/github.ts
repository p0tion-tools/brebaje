import { loadConfig } from "../utils/config.js";
import { ScriptLogger } from "../utils/logger.js";
import { scriptLoggerTitle } from "../utils/constant.js";
import { BackendAuthResponse, BackendClientIdResponse } from "./declarations.js";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { Verification } from "@octokit/auth-oauth-device/dist-types/types.js";
import { storeToken } from "./token.js";

const logger = new ScriptLogger(`${scriptLoggerTitle}Authentication`);

/**
 * Handles expiration countdown to notify user
 */
function expirationCountdown(expirationInSeconds: number): void {
  // Prepare data.
  let secondsCounter = expirationInSeconds <= 60 ? expirationInSeconds : 60;
  const interval = 1; // 1s

  setInterval(() => {
    if (expirationInSeconds !== 0) {
      // Update time and seconds counter.
      expirationInSeconds -= interval;
      secondsCounter -= interval;

      if (secondsCounter % 60 === 0) secondsCounter = 0;

      // Notify user.
      logger.log(`Expires in 00:${Math.floor(expirationInSeconds / 60)}:${secondsCounter}`);
    } else {
      process.stdout.write(`\n\n`); // workaround to \r.
      logger.error(
        `❌ GitHub OAuth device flow session has expired. Please restart the authentication process.`,
      );
      process.exit(1);
    }
  }, interval * 1000); // ms.
}

/**
 * Initiates GitHub device flow authorization
 */
async function initiateDeviceFlow(clientId: string): Promise<string> {
  /**
   * GitHub OAuth 2.0 Device Flow.
   * # Step 1: Request device and user verification codes and gets auth verification uri.
   * # Step 2: The app prompts the user to enter a user verification code at https://github.com/login/device.
   * # Step 3: The app polls/asks for the user authentication status.
   */

  // # Step 1.
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId,
    scopes: ["gist"],
    onVerification: async (verification: Verification) => {
      logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.log("📱 GitHub Device Authentication");
      logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      logger.log(`1. Visit: ${verification.verification_uri}`);
      logger.log(`2. Enter code: ${verification.user_code}\n`);
      if (verification.verification_uri) {
        logger.log(`Or open this URL directly:`);
        logger.log(verification.verification_uri);
      }
      logger.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      // Countdown for time expiration.
      expirationCountdown(verification.expires_in);
    },
  });

  // # Step 3.
  const { token } = await auth({
    type: "oauth",
  });

  return token;
}

/**
 * Exchanges GitHub access token for backend JWT
 */
async function exchangeGithubTokenForJWT(
  accessToken: string,
  apiUrl: string,
): Promise<BackendAuthResponse> {
  const response = await fetch(`${apiUrl}/auth/github/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      token_type: "bearer",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate with backend: ${response.statusText}`);
  }

  return (await response.json()) as BackendAuthResponse;
}

/**
 * Main GitHub OAuth authentication function using device flow
 */
export async function githubAuth(): Promise<void> {
  logger.log("🔐 Starting GitHub authentication...");

  try {
    const { BREBAJE_API_URL, BREBAJE_AUTH_TOKEN_PATH } = loadConfig();

    logger.log("📡 Fetching GitHub client ID from backend...");
    const { client_id } = (await fetch(`${BREBAJE_API_URL}/auth/github/client-id`).then((res) =>
      res.json(),
    )) as BackendClientIdResponse;

    const deviceToken = await initiateDeviceFlow(client_id);

    logger.log("✅ GitHub authorization successful!");
    logger.log("🔄 Exchanging token with backend...");

    const { jwt, user } = await exchangeGithubTokenForJWT(deviceToken, BREBAJE_API_URL);

    logger.log("💾 Storing authentication token...");
    storeToken(jwt, BREBAJE_AUTH_TOKEN_PATH);

    logger.success("✅ Authentication successful! \n");
    logger.success(`👤 Logged in as: ${user.displayName}`);
    logger.success(`📁 Token stored at: ${BREBAJE_AUTH_TOKEN_PATH} \n`);

    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Authentication failed: ${errorMessage}`);

    process.exit(1);
  }
}
