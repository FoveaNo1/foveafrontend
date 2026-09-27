#!/bin/sh
# Regenerate the product specimen from assets/product/fovea-bar-src.png: the cutout on transparent,
# trimmed to its silhouette, and its matte for inspection. Run once, and again whenever the render
# changes. Needs macOS 14+ (Vision subject lifting) and Swift. Extra flags go to specimen.swift and
# override its defaults: sh tools/make-specimen.sh --fade-bottom 240 · --erode 2 · --key .975 · --width 1360
set -e
cd "$(dirname "$0")/.."
swift tools/specimen.swift assets/product/fovea-bar-src.png assets/product/fovea-bar.png --mask assets/product/fovea-bar-mask.png "$@"
sips -g pixelWidth -g pixelHeight -g hasAlpha assets/product/fovea-bar.png | grep -E "^/|pixel|hasAlpha"
