#!/bin/bash

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
    echo "You can now use: brebaje-cli --help"
    echo ""
    echo "Available commands:"
    echo "  brebaje-cli auth login"
    echo "  brebaje-cli ppot new"
    echo "  brebaje-cli ppot contribute <input-file>"
    echo ""
else
    echo "❌ Installation failed!"
    exit 1
fi