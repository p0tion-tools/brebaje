# Quick Start: CLI Authentication

This guide helps you quickly get started with GitHub authentication in the Brebaje CLI.

## Prerequisites

1. **Install the CLI**: Follow the installation instructions in the CLI README
2. **Backend Running**: Ensure the Brebaje backend is running and accessible
3. **GitHub OAuth App**: The backend must be configured with GitHub OAuth credentials

## Setup Configuration

Create or update your global configuration file:

```bash
brebaje-cli config new
```

Then set the API URL:

```bash
brebaje-cli config path
# Edit the file shown and set:
# BREBAJE_API_URL=http://localhost:3000
# BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

Or manually create `~/.brebaje/.env`:

```env
BREBAJE_API_URL=http://localhost:3000
BREBAJE_AUTH_TOKEN_PATH=~/.brebaje/token
```

## Quick Start Commands

### 1. Login to Brebaje

```bash
brebaje-cli auth login
```

Follow the on-screen instructions:

1. Visit the GitHub device verification URL
2. Enter the displayed code
3. Authorize the application
4. Wait for confirmation

**Example output:**

```
🔐 Starting GitHub authentication...
📡 Fetching GitHub client ID from backend...
🚀 Initiating GitHub device flow...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 GitHub Device Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Visit: https://github.com/login/device
2. Enter code: ABCD-1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Authentication successful!
👤 Logged in as: yourusername
📁 Token stored at: ~/.brebaje/token
```

### 2. Check Your Authentication Status

```bash
brebaje-cli auth status
```

**Example output:**

```
✅ Status: Authenticated
👤 User: yourusername
🔑 Provider: GITHUB
⏰ Token expires in: 23h 45m
```

### 3. View Your User Information

```bash
brebaje-cli auth whoami
```

**Example output:**

```
Display Name: yourusername
User ID: 123
Provider: GITHUB
Avatar URL: https://avatars.githubusercontent.com/u/123?v=4

Token issued at: 12/28/2024, 10:30:00 AM
Token expires at: 12/29/2024, 10:30:00 AM
```

### 4. Use Authenticated Commands

Now you can use commands that require authentication:

```bash
# List ceremonies (requires authentication)
brebaje-cli ceremonies list

# Contribute to a ceremony (requires authentication)
brebaje-cli ceremonies contribute [options]

# Create a new ceremony (requires authentication)
brebaje-cli ceremonies create [options]
```

### 5. Logout When Done

```bash
brebaje-cli auth logout
```

**Example output:**

```
✅ Logged out successfully!
Your authentication token has been removed.
```

## Common Issues

### "Failed to get GitHub client ID from backend"

**Problem**: Cannot connect to the backend API.

**Solutions**:

- Check that the backend is running
- Verify `BREBAJE_API_URL` in your config is correct
- Ensure there are no network/firewall issues

### "Authentication required"

**Problem**: You're not logged in or your token has expired.

**Solutions**:

- Run `brebaje-cli auth login` to authenticate
- Check status with `brebaje-cli auth status`

### "Token has expired"

**Problem**: Your authentication token is no longer valid.

**Solutions**:

- Run `brebaje-cli auth logout` to clear the old token
- Run `brebaje-cli auth login` to get a new token

### "No authentication token found"

**Problem**: You haven't logged in yet.

**Solution**:

- Run `brebaje-cli auth login` to authenticate

## Token Location

Your authentication token is stored at:

```
~/.brebaje/token
```

This file is created with secure permissions (read/write for owner only).

**⚠️ Warning**: Do not share this file or commit it to version control!

## Token Lifecycle

- **Created**: When you run `brebaje-cli auth login`
- **Expires**: Based on backend JWT configuration (typically 24 hours)
- **Deleted**: When you run `brebaje-cli auth logout`
- **Validated**: Automatically before each authenticated API request

## Next Steps

Once authenticated, you can:

1. **List ceremonies**: `brebaje-cli ceremonies list`
2. **Contribute to ceremonies**: `brebaje-cli ceremonies contribute`
3. **View participants**: `brebaje-cli participants list`
4. **Manage your contributions**: Check ceremony status and results

For more detailed information, see:

- `apps/cli/src/auth/README.md` - Detailed auth documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- Backend API documentation - Available API endpoints

## Security Tips

1. **Keep your token safe**: Don't share your `~/.brebaje/token` file
2. **Logout on shared systems**: Always run `auth logout` on shared computers
3. **Check expiration**: Run `auth status` to see when your token expires
4. **Re-authenticate regularly**: For better security, logout and login periodically

## Getting Help

If you encounter issues:

1. Check your authentication status: `brebaje-cli auth status`
2. Review the configuration: `brebaje-cli config path`
3. Check backend connectivity: Verify `BREBAJE_API_URL` is correct
4. Review logs: Look for error messages in command output
5. Report issues: Create an issue on the GitHub repository

## Advanced Usage

For developers integrating authentication into custom commands, see:

- `apps/cli/src/auth/README.md` - Integration guide
- `apps/cli/src/ceremonies/list.ts` - Example implementation
- `apps/cli/src/auth/http.ts` - Helper functions

---

**Happy contributing to ceremonies! 🎉**
