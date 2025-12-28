import { writeFileSync } from "fs";
import { homedir } from "os";
import { dirname } from "path";
import { mkdirSync, existsSync } from "fs";
import { loadConfig } from "../utils/config.js";
import { fetchWithTimeout } from "../utils/http.js";
import { ScriptLogger } from "../utils/logger.js";
import { scriptLoggerTitle } from "../utils/constant.js";

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string;
  expires_in: number;
  interval: number;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface BackendAuthResponse {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    provider: string;
  };
  jwt: string;
}

/**
 * Initiates GitHub device flow authorization
 */
async function initiateDeviceFlow(clientId: string): Promise<DeviceCodeResponse> {
  const body = new URLSearchParams({
    client_id: clientId,
    scope: "user:email",
  });

  const response = await fetchWithTimeout("https://github.com/login/device/code", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to initiate device flow: ${response.statusText}`);
  }

  return (await response.json()) as DeviceCodeResponse;
}

/**
 * Polls GitHub for access token
 */
async function pollForToken(
  clientId: string,
  deviceCode: string,
  interval: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const body = new URLSearchParams({
          client_id: clientId,
          device_code: deviceCode,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        });

        const response = await fetchWithTimeout("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        const data = (await response.json()) as TokenResponse;

        if (data.error) {
          if (data.error === "authorization_pending") {
            // Continue polling
            setTimeout(poll, interval * 1000);
          } else if (data.error === "slow_down") {
            // Increase interval
            setTimeout(poll, (interval + 5) * 1000);
          } else {
            reject(new Error(data.error_description || data.error));
          }
        } else if (data.access_token) {
          resolve(data.access_token);
        }
      } catch (error) {
        reject(error);
      }
    };

    // Start polling
    poll();
  });
}

interface BackendTokenRequest {
  access_token: string;
  token_type: string;
}

/**
 * Exchanges GitHub access token for backend JWT
 */
async function exchangeForJWT(accessToken: string, apiUrl: string): Promise<BackendAuthResponse> {
  const requestBody: BackendTokenRequest = {
    access_token: accessToken,
    token_type: "bearer",
  };

  const response = await fetchWithTimeout(`${apiUrl}/auth/github/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to authenticate with backend: ${response.statusText}`);
  }

  return (await response.json()) as BackendAuthResponse;
}

/**
 * Stores JWT token to file
 * Note: File is created with 0600 permissions (read/write for owner only).
 * Ensure the parent directory also has secure permissions via umask or manual setting.
 */
function storeToken(jwt: string, tokenPath: string): void {
  // Expand ~ to home directory
  const expandedPath = tokenPath.replace(/^~/, homedir());

  // Ensure directory exists
  const dir = dirname(expandedPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 }); // Secure directory permissions
  }

  // Write token to file with secure permissions
  writeFileSync(expandedPath, jwt, { mode: 0o600 });
}

/**
 * Main GitHub OAuth authentication function using device flow
 */
export async function githubAuth(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Auth:GitHub`);

  try {
    logger.log("🔐 Starting GitHub authentication...");

    // Load configuration
    const config = loadConfig();
    const apiUrl = config.BREBAJE_API_URL;
    const tokenPath = config.BREBAJE_AUTH_TOKEN_PATH;

    // Get GitHub client ID from backend
    logger.log("📡 Fetching GitHub client ID from backend...");
    const clientIdResponse = await fetchWithTimeout(`${apiUrl}/auth/github/client-id`);

    if (!clientIdResponse.ok) {
      throw new Error("Failed to get GitHub client ID from backend");
    }

    const { client_id: clientId } = (await clientIdResponse.json()) as { client_id: string };

    // Initiate device flow
    logger.log("🚀 Initiating GitHub device flow...");
    const deviceFlow = await initiateDeviceFlow(clientId);

    // Display user code and verification URL
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📱 GitHub Device Authentication");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log(`1. Visit: ${deviceFlow.verification_uri}`);
    console.log(`2. Enter code: ${deviceFlow.user_code}`);
    console.log("");
    if (deviceFlow.verification_uri_complete) {
      console.log(`Or open this URL directly:`);
      console.log(deviceFlow.verification_uri_complete);
      console.log("");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    logger.log("⏳ Waiting for authorization...");
    logger.log(`(Code expires in ${Math.floor(deviceFlow.expires_in / 60)} minutes)`);

    // Poll for access token
    const accessToken = await pollForToken(clientId, deviceFlow.device_code, deviceFlow.interval);

    logger.log("✅ GitHub authorization successful!");

    // Exchange for backend JWT
    logger.log("🔄 Exchanging token with backend...");
    const authResponse = await exchangeForJWT(accessToken, apiUrl);

    // Store JWT token
    logger.log("💾 Storing authentication token...");
    storeToken(authResponse.jwt, tokenPath);

    // Success message
    logger.success("✅ Authentication successful!");
    console.log("");
    console.log(`👤 Logged in as: ${authResponse.user.displayName}`);
    console.log(`📁 Token stored at: ${tokenPath}`);
    console.log("");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Authentication failed: ${errorMessage}`);
    process.exit(1);
  }
}
