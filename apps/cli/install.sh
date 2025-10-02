#!/bin/bash

echo "🚀 Brebaje CLI Installation"
echo "=========================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare versions (returns 0 if version1 >= version2)
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Check Node.js
echo "🔍 Checking Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_NODE="22.17.1"
    if version_ge "$NODE_VERSION" "$REQUIRED_NODE"; then
        echo "✅ Node.js $NODE_VERSION (>= $REQUIRED_NODE required)"
    else
        echo "❌ Node.js $NODE_VERSION found, but >= $REQUIRED_NODE required"
        echo "   Please upgrade Node.js: https://nodejs.org/"
        exit 1
    fi
else
    echo "❌ Node.js not found"
    echo "   Please install Node.js >= 22.17.1: https://nodejs.org/"
    exit 1
fi

# Check pnpm
echo "🔍 Checking pnpm..."
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm --version)
    REQUIRED_PNPM="9.0.0"
    if version_ge "$PNPM_VERSION" "$REQUIRED_PNPM"; then
        echo "✅ pnpm $PNPM_VERSION (>= $REQUIRED_PNPM required)"
    else
        echo "❌ pnpm $PNPM_VERSION found, but >= $REQUIRED_PNPM required"
        echo "   Please upgrade pnpm: npm install -g pnpm@latest"
        exit 1
    fi
else
    echo "❌ pnpm not found"
    echo "   Please install pnpm: npm install -g pnpm"
    echo "   Or visit: https://pnpm.io/installation"
    exit 1
fi

# Check and configure pnpm global bin directory
echo "🔍 Checking pnpm global configuration..."
PNPM_GLOBAL_BIN=$(pnpm config get global-bin-dir 2>/dev/null)
RECOMMENDED_BIN_DIR="$HOME/.local/bin"

if [ -z "$PNPM_GLOBAL_BIN" ] || [ "$PNPM_GLOBAL_BIN" = "undefined" ]; then
    echo "⚠️  pnpm global-bin-dir not configured"
    echo "   Setting up global bin directory: $RECOMMENDED_BIN_DIR"
    
    # Create the directory if it doesn't exist
    mkdir -p "$RECOMMENDED_BIN_DIR"
    
    # Configure pnpm to use this directory
    pnpm config set global-bin-dir "$RECOMMENDED_BIN_DIR"
    
    if [ $? -eq 0 ]; then
        echo "✅ pnpm global-bin-dir configured successfully"
        PNPM_GLOBAL_BIN="$RECOMMENDED_BIN_DIR"
    else
        echo "❌ Failed to configure pnpm global-bin-dir"
        exit 1
    fi
else
    echo "✅ pnpm global-bin-dir: $PNPM_GLOBAL_BIN"
fi

# Check if global bin directory is in PATH
if echo "$PATH" | grep -q "$PNPM_GLOBAL_BIN"; then
    echo "✅ Global bin directory is in PATH"
else
    echo "⚠️  Global bin directory not in PATH"
    echo "   After installation, you may need to add this to your shell profile:"
    echo "   echo 'export PATH=\"$PNPM_GLOBAL_BIN:\$PATH\"' >> ~/.bashrc"
    echo "   echo 'export PATH=\"$PNPM_GLOBAL_BIN:\$PATH\"' >> ~/.zshrc"
    echo "   Then restart your terminal or run: source ~/.bashrc (or ~/.zshrc)"
fi

# Check wget
echo "🔍 Checking wget..."
if command_exists wget; then
    echo "✅ wget is available"
else
    echo "❌ wget not found"
    echo "   wget is required for downloading ceremony files"
    echo "   Please install wget for your platform:"
    echo "   Ubuntu/Debian: sudo apt-get install wget"
    echo "   CentOS/RHEL: sudo yum install wget"
    echo "   Fedora: sudo dnf install wget"
    echo "   macOS: brew install wget"
    echo "   Windows: https://eternallybored.org/misc/wget/"
    echo "   Alpine: apk add wget"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed!"
    exit 1
fi

echo ""
echo "🔨 Building Brebaje CLI..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🔗 Installing Brebaje CLI globally..."
pnpm link --global

if [ $? -eq 0 ]; then
    echo "✅ Installation successful!"
    echo ""
    
    # Verify CLI is accessible
    echo "🔍 Verifying CLI accessibility..."
    if command_exists brebaje-cli; then
        echo "✅ brebaje-cli is accessible in PATH"
        echo ""
        echo "🎉 Installation completed successfully!"
        echo ""
        brebaje-cli --help
    else
        echo "⚠️  brebaje-cli not found in PATH"
        echo ""
        echo "The installation succeeded, but the CLI may not be accessible."
        echo "This usually happens when the global bin directory is not in PATH."
        echo ""
        echo "To fix this, add the following to your shell profile:"
        echo "  export PATH=\"$PNPM_GLOBAL_BIN:\$PATH\""
        echo ""
        echo "For bash users:"
        echo "  echo 'export PATH=\"$PNPM_GLOBAL_BIN:\$PATH\"' >> ~/.bashrc"
        echo "  source ~/.bashrc"
        echo ""
        echo "For zsh users:"
        echo "  echo 'export PATH=\"$PNPM_GLOBAL_BIN:\$PATH\"' >> ~/.zshrc"
        echo "  source ~/.zshrc"
        echo ""
        echo "Alternatively, you can run the CLI directly with:"
        echo "  $PNPM_GLOBAL_BIN/brebaje-cli --help"
    fi
else
    echo "❌ Installation failed!"
    exit 1
fi