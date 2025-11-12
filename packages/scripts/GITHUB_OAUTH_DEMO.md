# GitHub Device Flow OAuth Demo

This script demonstrates the complete GitHub Device Flow OAuth process using curl commands.

## Prerequisites

1. **jq** - JSON processor (install with `apt install jq` or `brew install jq`)
2. **curl** - Should be available by default
3. **GitHub OAuth App** - You need to create one at https://github.com/settings/developers

## Setup GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Authorization callback URL**: Not used in device flow, but required field
4. Note down your **Client ID**

## Usage

### Method 1: Environment Variable

```bash
export GITHUB_CLIENT_ID="Ov23liT3u8hVgC7BIwd9"
./github-device-flow.sh
```

### Method 2: Inline

```bash
GITHUB_CLIENT_ID="Ov23liT3u8hVgC7BIwd9" ./github-device-flow.sh
```

## What the Script Does

### Step 1: Device Authorization Request

```bash
curl -X POST "https://github.com/login/device/code" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&scope=user:email"
```

**Response:**

```json
{
  "device_code": "3584d83530557fdd1f46af8289938c8ef79f9dc5",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://github.com/login/device",
  "verification_uri_complete": "https://github.com/login/device?user_code=WDJB-MJHT",
  "expires_in": 900,
  "interval": 5
}
```

### Step 2: User Authorization

- Script displays the verification URL and user code
- User manually visits the URL and authorizes the app
- Script waits for authorization

### Step 3: Token Polling

```bash
curl -X POST "https://github.com/login/oauth/access_token" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&device_code=DEVICE_CODE&grant_type=urn:ietf:params:oauth:grant-type:device_code"
```

**Successful Response:**

```json
{
  "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
  "token_type": "bearer",
  "scope": "user:email"
}
```

### Step 4: Test Access Token

```bash
curl -H "Authorization: token ACCESS_TOKEN" \
  -H "Accept: application/json" \
  "https://api.github.com/user"
```

## Example Output

```
ℹ️  Starting GitHub Device Flow OAuth...
ℹ️  Client ID: your_client_id
ℹ️  Step 1: Requesting device and user codes from GitHub...
✅ Device authorization successful!
Device Code: 3584d83530557fdd1f46af8289938c8ef79f9dc5
User Code: WDJB-MJHT

⚠️  Step 2: User Authorization Required

Please complete the following steps:
1. Open this URL in your browser: https://github.com/login/device?user_code=WDJB-MJHT
2. Enter this code: WDJB-MJHT

ℹ️  Step 3: Polling for access token...
ℹ️  Polling attempt 1/60 (895s remaining)...
ℹ️  Authorization still pending...
ℹ️  Polling attempt 2/60 (890s remaining)...
✅ Authorization successful!
Access Token: gho_16C7e42F292c6912E7710c838347Ae178B4a
Token Type: bearer

✅ Access token is valid!
Authenticated as: yourusername (ID: 12345)

✅ Device Flow Complete! Use this data with your API:

POST /auth/github/user
Content-Type: application/json

{
  "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
  "token_type": "bearer"
}

✅ GitHub Device Flow OAuth completed successfully! 🎉
```

## Integration with Your NestJS API

The final output provides the exact JSON payload you need to send to your current API endpoint:

```bash
curl -X POST "http://localhost:3000/auth/github/user" \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "gho_16C7e42F292c6912E7710c838347Ae178B4a",
    "token_type": "bearer"
  }'
```

## Error Handling

The script handles various error conditions:

- `authorization_pending` - Still waiting for user
- `slow_down` - Rate limiting (increases interval)
- `expired_token` - Device code expired
- `access_denied` - User denied authorization
- Invalid client ID or other API errors

## Security Notes

- Never commit your `CLIENT_ID` to version control
- Access tokens should be handled securely
- This demo script is for development/testing purposes
- In production, implement proper error handling and security measures
