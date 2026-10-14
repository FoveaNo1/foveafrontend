#!/bin/sh
# Regenerate the history's photographs: assets/history/ from the sources in historical/. Three Vision cutouts on
# transparent (tools/specimen.swift), trimmed to their silhouettes and Lanczos-downscaled to about 2× their
# display width, and the map photograph copied as is (600 wide; it is drawn at 268 and masked in CSS). Prints
# every output's size: those are the width/height attributes in index.html. Needs macOS 14+ and Swift. Extra
# flags go to every specimen.swift call: sh tools/make-history.sh --erode 2
set -e
cd "$(dirname "$0")/.."
SRC="historical"
OUT="assets/history"
mkdir -p "$OUT"
# 1963 · the Teletype Model 33 (2133×3200 on white). Drawn 173px wide at 1440; 700 also serves 1760-wide and 3× screens.
swift tools/specimen.swift "$SRC/Weixin Image_20260913161204_158.png" "$OUT/teletype.png" --mask "$OUT/teletype-mask.png" --width 700 --min-width 0 "$@"
# 1968 · the NLS console (750×532, black and white). The source is narrower than 2× would want: keep its pixels.
swift tools/specimen.swift "$SRC/Weixin Image_20260913161204_159.png" "$OUT/nls.png" --mask "$OUT/nls-mask.png" --width 0 --min-width 0 "$@"
# 2007 · the hand and the first iPhone: a crop of the keynote photograph (3000×1838), rows from the top. The crop's
# bottom cuts the wrist, so the last 160 source rows fade out instead of ending on a torn edge.
swift tools/specimen.swift "$SRC/Weixin Image_20260913161204_160.png" "$OUT/iphone.png" --mask "$OUT/iphone-mask.png" --crop 1400,40,1320,1700 --fade-bottom 160 --width 520 --min-width 0 "$@"
# — · the map photograph, a rectangle, used as is
cp "$SRC/Weixin Image_20260913161204_165.png" "$OUT/map.png"
for f in map teletype nls iphone; do
  sips -g pixelWidth -g pixelHeight -g hasAlpha "$OUT/$f.png" | grep -E "^/|pixel|hasAlpha"
done
