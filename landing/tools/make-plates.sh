#!/bin/sh
# Regenerate the page-two plates from assets/plates/src/*.png: a JPEG of each plate, plus a
# blurred half-size twin for the two plates the demos zoom on (code, video).
# usage: sh tools/make-plates.sh [jpeg-quality=0.85] [blur-radius=7]
set -e
cd "$(dirname "$0")/.."
Q="${1:-0.85}"; R="${2:-7}"
for p in moodboard code video; do
  case $p in code|video) blur="--blur $R" ;; *) blur="" ;; esac
  swift tools/plates.swift "assets/plates/src/desk-$p.png" assets/plates --quality "$Q" $blur
done
