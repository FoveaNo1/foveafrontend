#!/bin/sh
# Regenerate the hero layers from assets/hero-source.png.
# Run once, and again whenever the photograph changes. Needs macOS 14+ (Vision subject lifting) and Swift.
set -e
cd "$(dirname "$0")/.."
swift tools/cutout.swift assets/hero-source.png assets "${1:-1.5}"
sips -g pixelWidth -g pixelHeight assets/hardware-cutout.png assets/hardware-shadow-6.png assets/hardware-shadow-16.png | grep -E "^/|pixel"
