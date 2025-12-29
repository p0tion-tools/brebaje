# Authentication Module

This module provides GitHub OAuth device flow authentication for the Brebaje CLI, allowing users to authenticate with the backend API and access protected routes.

## Features

- **GitHub Device Flow OAuth**: Secure authentication via GitHub without requiring a web browser redirect
- **JWT Token Management**: Automatic storage and validation of authentication tokens
- **Token Persistence**: Tokens stored securely at `~/.brebaje/token`
- **Multiple Auth Commands**: Login, logout, status check, and user information display

## Commands

### `brebaje-cli auth login`

Initiates GitHub OAuth device flow authentication.

**Process:**

1. Fetches GitHub client ID from backend
2. Initiates device flow with GitHub
3. Displays user code and verification URL
4. Polls for user authorization
5. Exchanges GitHub access token for backend JWT
6. Stores JWT token securely

**Example:**

```bash
$ brebaje-cli auth login-github

🔐 Starting GitHub authentication...
📡 Fetching GitHub client ID from backend...
🚀 Initiating GitHub device flow...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 GitHub Device Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Visit: https://github.com/login/device
2. Enter code: ABCD-1234

Or open this URL directly:
https://github.com/login/device?user_code=ABCD-1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Waiting for authorization...
(Code expires in 15 minutes)

✅ GitHub authorization successful!
🔄 Exchanging token with backend...
💾 Storing authentication token...
✅ Authentication successful!

👤 Logged in as: johndoe
📁 Token stored at: ~/.brebaje/token
```

### `brebaje-cli auth status`

Checks current authentication status.

**Example:**

```bash
$ brebaje-cli auth status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Authentication Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Status: Authenticated
👤 User: johndoe
🔑 Provider: GITHUB
⏰ Token expires in: 23h 45m
📁 Token location: ~/.brebaje/token

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### `brebaje-cli auth whoami`

Displays detailed information about the currently authenticated user.

**Example:**

```bash
$ brebaje-cli auth whoami

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 User Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Display Name: johndoe
User ID: 123
Provider: GITHUB
Avatar URL: https://avatars.githubusercontent.com/u/123?v=4
GitHub ID: 456

Token issued at: 12/28/2024, 10:30:00 AM
Token expires at: 12/29/2024, 10:30:00 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### `brebaje-cli auth logout`

Logs out the current user by removing the stored authentication token.

**Example:**

```bash
$ brebaje-cli auth logout

🚪 Logging out...
✅ Logged out successfully!

Your authentication token has been removed.

To login again, run: brebaje-cli auth login
```

## Using Authentication in CLI Commands

The authentication module provides helpers for making authenticated API requests.

### Importing Auth Helpers

```typescript
import { createAuthHeaders, authenticatedFetch } from "./auth/http.js";
import { getAuthToken, validateToken } from "./auth/token.js";
import { loadConfig } from "./utils/config.js";
```

### Making Authenticated API Requests

#### Using `authenticatedFetch`

Automatically includes authentication headers and prepends the API URL:

```typescript
import { authenticatedFetch } from "./auth/http.js";

async function listCeremonies() {
  try {
    const response = await authenticatedFetch("/ceremonies");

    if (!response.ok) {
      throw new Error(`Failed to fetch ceremonies: ${response.statusText}`);
    }

    const ceremonies = await response.json();
    return ceremonies;
  } catch (error) {
    console.error("Error fetching ceremonies:", error);
    throw error;
  }
}
```

#### Using `createAuthHeaders`

For manual request construction:

```typescript
import { createAuthHeaders } from "./auth/http.js";
import { loadConfig } from "./utils/config.js";

async function createCeremony(data) {
  const config = loadConfig();
  const headers = createAuthHeaders();

  const response = await fetch(`${config.BREBAJE_API_URL}/ceremonies`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return response.json();
}
```

### Checking Authentication Before API Calls

```typescript
import { validateToken } from "./auth/token.js";
import { loadConfig } from "./utils/config.js";

async function requireAuth() {
  const config = loadConfig();
  const validation = validateToken(config.BREBAJE_AUTH_TOKEN_PATH);

  if (!validation.valid) {
    console.error("❌ Authentication required");
    console.error(`⚠️  ${validation.error}`);
    console.error("");
    console.error("Please login first: brebaje-cli auth login");
    process.exit(1);
  }

  return validation;
}

// Usage
async function someProtectedCommand() {
  await requireAuth();

  // Make authenticated API calls
  const response = await authenticatedFetch("/protected-route");
  // ...
}
```

## Architecture

### Token Storage

- **Location**: `~/.brebaje/token` (configurable via `BREBAJE_AUTH_TOKEN_PATH`)
- **Format**: JWT token string
- **Permissions**: File mode 0600 (read/write for owner only)

### Token Validation

The `validateToken` function performs the following checks:

1. Token file exists
2. Token can be read successfully
3. Token can be decoded as valid JWT
4. Token has not expired (based on `exp` claim)

Returns a validation object with:

- `valid`: boolean indicating if token is valid
- `token`: the raw JWT string (if exists)
- `payload`: decoded JWT payload (if valid)
- `error`: error message (if invalid)

### Security Considerations

1. **Token Expiration**: Tokens expire based on backend JWT configuration (default: 1 day)
2. **Secure Storage**: Tokens stored with restrictive file permissions
3. **No Client Secret**: Uses device flow which doesn't require client secret on CLI
4. **Token Refresh**: Currently no automatic refresh; users must re-authenticate when token expires

## Configuration

Required configuration in `~/.brebaje/.env`:

```env
# API URL (where backend is running)
BREBAJE_API_URL=http://localhost:3000

# Token storage location
BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

## Error Handling

Common error scenarios and their handling:

1. **Network Errors**: Proper error messages for connection failures
2. **Expired Tokens**: Clear indication that re-authentication is needed
3. **Invalid Tokens**: Helpful error messages guiding users to login
4. **Missing Configuration**: Errors when required config is missing

## Dependencies

- `jsonwebtoken`: For JWT decoding and validation
- `@types/jsonwebtoken`: TypeScript types for jsonwebtoken

## Future Enhancements

Potential improvements for future versions:

1. **Token Refresh**: Automatic token refresh when nearing expiration
2. **Multiple Providers**: Support for Cardano wallet authentication
3. **Token Encryption**: Encrypt stored tokens for additional security
4. **Session Management**: Track multiple sessions or device logins
5. **Revocation**: Ability to revoke tokens server-side
