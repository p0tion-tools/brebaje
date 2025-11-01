#!/bin/bash

echo "🗑️  Uninstalling Brebaje CLI..."
pnpm unlink --global

if [ $? -eq 0 ]; then
    echo "✅ Uninstallation successful!"
    echo "brebaje-cli command is no longer available globally"
else
    echo "❌ Uninstallation failed!"
    exit 1
fi