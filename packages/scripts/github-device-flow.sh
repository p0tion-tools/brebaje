#!/bin/bash

# GitHub Device Flow OAuth Script
# This script demonstrates the complete GitHub Device Flow process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLIENT_ID="Ov23liT3u8hVgC7BIwd9"
SCOPES="user:email"  # Scopes you want to request
POLL_INTERVAL=5      # Default polling interval in seconds
MAX_ATTEMPTS=60      # Maximum polling attempts (5 minutes)

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if CLIENT_ID is provided
if [ -z "$CLIENT_ID" ]; then
    print_error "GitHub CLIENT_ID is required!"
    echo "Usage: GITHUB_CLIENT_ID=your_client_id $0"
    echo "Or set the GITHUB_CLIENT_ID environment variable"
    exit 1
fi

print_info "Starting GitHub Device Flow OAuth..."
print_info "Client ID: $CLIENT_ID"
print_info "Scopes: $SCOPES"
echo

# Step 1: Request device and user codes
print_info "Step 1: Requesting device and user codes from GitHub..."

DEVICE_RESPONSE=$(curl -s -X POST "https://github.com/login/device/code" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=$CLIENT_ID&scope=$SCOPES")

# Check if the request was successful
if echo "$DEVICE_RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    print_error "GitHub API Error:"
    echo "$DEVICE_RESPONSE" | jq .
    exit 1
fi

# Extract values from response
DEVICE_CODE=$(echo "$DEVICE_RESPONSE" | jq -r '.device_code')
USER_CODE=$(echo "$DEVICE_RESPONSE" | jq -r '.user_code')
VERIFICATION_URI=$(echo "$DEVICE_RESPONSE" | jq -r '.verification_uri')
VERIFICATION_URI_COMPLETE=$(echo "$DEVICE_RESPONSE" | jq -r '.verification_uri_complete')
EXPIRES_IN=$(echo "$DEVICE_RESPONSE" | jq -r '.expires_in')
INTERVAL=$(echo "$DEVICE_RESPONSE" | jq -r '.interval // 5')

print_success "Device authorization successful!"
echo "Device Code: $DEVICE_CODE"
echo "User Code: $USER_CODE"
echo "Verification URI: $VERIFICATION_URI"
echo "Expires in: $EXPIRES_IN seconds"
echo

# Step 2: User authorization
print_warning "Step 2: User Authorization Required"
echo
echo "Please complete the following steps:"
echo "1. Open this URL in your browser: $VERIFICATION_URI_COMPLETE"
echo "   OR"
echo "2. Go to: $VERIFICATION_URI"
echo "3. Enter this code: $USER_CODE"
echo
print_info "Waiting for authorization... (this may take a few minutes)"
print_info "Press Ctrl+C to cancel"
echo

# Step 3: Poll for access token
print_info "Step 3: Polling for access token..."

ATTEMPT=0
ACCESS_TOKEN=""

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    # Calculate remaining time
    REMAINING_TIME=$((EXPIRES_IN - (ATTEMPT * INTERVAL)))
    
    if [ $REMAINING_TIME -le 0 ]; then
        print_error "Device code expired! Please restart the process."
        exit 1
    fi
    
    print_info "Polling attempt $ATTEMPT/$MAX_ATTEMPTS (${REMAINING_TIME}s remaining)..."
    
    # Poll GitHub for the access token
    TOKEN_RESPONSE=$(curl -s -X POST "https://github.com/login/oauth/access_token" \
      -H "Accept: application/json" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "client_id=$CLIENT_ID&device_code=$DEVICE_CODE&grant_type=urn:ietf:params:oauth:grant-type:device_code")
    
    # Check the response
    ERROR=$(echo "$TOKEN_RESPONSE" | jq -r '.error // empty')
    
    if [ -z "$ERROR" ]; then
        # Success! We got the access token
        ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')
        TOKEN_TYPE=$(echo "$TOKEN_RESPONSE" | jq -r '.token_type')
        SCOPE=$(echo "$TOKEN_RESPONSE" | jq -r '.scope')
        
        print_success "Authorization successful!"
        echo "Access Token: $ACCESS_TOKEN"
        echo "Token Type: $TOKEN_TYPE"
        echo "Scope: $SCOPE"
        echo
        break
    elif [ "$ERROR" = "authorization_pending" ]; then
        # Still waiting for user authorization
        print_info "Authorization still pending..."
    elif [ "$ERROR" = "slow_down" ]; then
        # GitHub wants us to slow down
        print_warning "Rate limited - increasing interval"
        INTERVAL=$((INTERVAL + 5))
    elif [ "$ERROR" = "expired_token" ]; then
        print_error "Device code expired! Please restart the process."
        exit 1
    elif [ "$ERROR" = "access_denied" ]; then
        print_error "Authorization denied by user."
        exit 1
    else
        print_error "Unknown error: $ERROR"
        echo "$TOKEN_RESPONSE" | jq .
        exit 1
    fi
    
    # Wait before next poll
    sleep $INTERVAL
done

if [ -z "$ACCESS_TOKEN" ]; then
    print_error "Failed to get access token after $MAX_ATTEMPTS attempts."
    exit 1
fi

# Bonus: Test the access token by getting user info
print_info "Testing access token by fetching user info..."

USER_RESPONSE=$(curl -s -H "Authorization: token $ACCESS_TOKEN" \
  -H "Accept: application/json" \
  "https://api.github.com/user")

if echo "$USER_RESPONSE" | jq -e '.login' > /dev/null 2>&1; then
    USERNAME=$(echo "$USER_RESPONSE" | jq -r '.login')
    USER_ID=$(echo "$USER_RESPONSE" | jq -r '.id')
    
    print_success "Access token is valid!"
    echo "Authenticated as: $USERNAME (ID: $USER_ID)"
    echo
    
    # Output the final result in a format that can be used with your API
    print_success "Device Flow Complete! Use this data with your API:"
    echo
    echo "POST /auth/github/user"
    echo "Content-Type: application/json"
    echo
    echo "{"
    echo "  \"access_token\": \"$ACCESS_TOKEN\","
    echo "  \"token_type\": \"$TOKEN_TYPE\""
    echo "}"
else
    print_error "Failed to validate access token"
    echo "$USER_RESPONSE" | jq .
    exit 1
fi

print_success "GitHub Device Flow OAuth completed successfully! 🎉"