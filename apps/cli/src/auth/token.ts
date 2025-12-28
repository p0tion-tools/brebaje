import { readFileSync, existsSync, unlinkSync } from "fs";
import { homedir } from "os";
import jwt from "jsonwebtoken";

interface JWTPayload {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    provider: string;
    githubId?: string;
    walletAddress?: string;
  };
  iat: number;
  exp: number;
}

/**
 * Expands ~ in path to home directory
 */
function expandPath(path: string): string {
  return path.replace(/^~/, homedir());
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
