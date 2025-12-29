import { loadConfig } from "../utils/config.js";
import { getAuthToken } from "./token.js";

/**
 * Creates HTTP headers with authentication token
 */
export function createAuthHeaders(): HeadersInit {
  const { BREBAJE_AUTH_TOKEN_PATH } = loadConfig();
  const token = getAuthToken(BREBAJE_AUTH_TOKEN_PATH);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Makes an authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { BREBAJE_API_URL } = loadConfig();

  // Prepend API URL if relative path
  const fullUrl = url.startsWith("http") ? url : `${BREBAJE_API_URL}${url}`;

  const authHeaders = createAuthHeaders();

  return fetch(fullUrl, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
}
