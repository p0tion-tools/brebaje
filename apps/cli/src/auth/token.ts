import { readFileSync, existsSync, unlinkSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { homedir } from "os";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./declarations";

/**
 * Expands ~ in path to home directory
 */
function expandPath(path: string): string {
  return path.replace(/^~/, homedir());
}

/**
 * Stores JWT token to file
 * Note: File is created with 0600 permissions (read/write for owner only).
 * Ensure the parent directory also has secure permissions via umask or manual setting.
 */
export function storeToken(jwt: string, tokenPath: string): void {
  const expandedPath = expandPath(tokenPath);

  // Ensure directory exists
  const dir = dirname(expandedPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 }); // Secure directory permissions
  }

  // Write token to file with secure permissions
  writeFileSync(expandedPath, jwt, { mode: 0o600 });
}

/**
 * Checks if a token file exists
 */
export function hasToken(tokenPath: string): boolean {
  const expandedPath = expandPath(tokenPath);
  return existsSync(expandedPath);
}

/**
 * Reads JWT token from file
 */
export function readToken(tokenPath: string): string | null {
  const expandedPath = expandPath(tokenPath);

  if (!existsSync(expandedPath)) {
    return null;
  }

  try {
    return readFileSync(expandedPath, "utf-8").trim();
  } catch (error) {
    console.error("Error reading token:", error);
    return null;
  }
}

/**
 * Decodes JWT token without verification
 * Note: Client-side verification is not performed as we don't have access to the secret.
 * The backend verifies the token signature when making authenticated requests.
 * This function is only used to extract payload information for display purposes.
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null;
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Checks if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) {
    return true;
  }

  // Check if token is expired (exp is in seconds, Date.now() is in ms)
  return decoded.exp * 1000 < Date.now();
}

/**
 * Validates token (exists and not expired)
 * Returns valid boolean, jwt, and the payload user fields like displayName and provider
 */
export function validateToken(tokenPath: string): {
  valid: boolean;
  token: string | null;
  payload: JWTPayload | null;
  error?: string;
} {
  if (!hasToken(tokenPath)) {
    return {
      valid: false,
      token: null,
      payload: null,
      error: "No authentication token found",
    };
  }

  const token = readToken(tokenPath);

  if (!token) {
    return {
      valid: false,
      token: null,
      payload: null,
      error: "Failed to read token",
    };
  }

  const payload = decodeToken(token);

  if (!payload) {
    return {
      valid: false,
      token,
      payload: null,
      error: "Invalid token format",
    };
  }

  if (isTokenExpired(token)) {
    return {
      valid: false,
      token,
      payload,
      error: "Token has expired",
    };
  }

  return {
    valid: true,
    token,
    payload,
  };
}

/**
 * Deletes token file
 */
export function deleteToken(tokenPath: string): boolean {
  const expandedPath = expandPath(tokenPath);

  if (!existsSync(expandedPath)) {
    return false;
  }

  try {
    unlinkSync(expandedPath);
    return true;
  } catch (error) {
    console.error("Error deleting token:", error);
    return false;
  }
}

/**
 * Gets token for API requests
 */
export function getAuthToken(tokenPath: string): string | null {
  const validation = validateToken(tokenPath);

  if (!validation.valid) {
    return null;
  }

  return validation.token;
}
