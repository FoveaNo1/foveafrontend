# Landing page assets

`app/icon.svg` is Fovea's app icon, the highlighter loop (app-ui-v1 Brand/fovea-app-icon.svg), and
`app/apple-icon.png` the icon's body drawn full-bleed on its ivory at 180 px. The page's pictures
are drawn live in code (lib/landing/gradient.ts); there are no image files for them.

The agent marks below are on page 2, beside "works with Claude Code and Codex". The photos are the
old demo's, unused by the page now.

Photos (`photos/`), copied from app-ui-v1/Sources/FoveaCore/Resources/Photos, where
scripts/fetch-photos.sh fetched them from https://picsum.photos (images from Unsplash, under the
Unsplash license: free to use commercially, no attribution required):

- coast.jpg: https://picsum.photos/id/1015/1200/800 (the demo's wallpaper, as in the onboarding)
- mountain.jpg: https://picsum.photos/id/1036/1200/800
- forest.jpg: https://picsum.photos/id/1018/1200/800
- building.jpg: https://picsum.photos/id/1040/900/1200

Agent marks (`agents/`): the app icons the Notch Workbench and Fovea 1.0's board draw, copied from
app-ui-v1/FoveaV1/Sources/FoveaIsland/Resources/Agents (see its SOURCES.md): `claude-code.png` (the
Claude app's icon), `codex.png` (the Codex app's icon), `fovea.png` (Fovea's dark icon, for Quick
answers). Before launch, confirm their use with Anthropic's and OpenAI's brand guidelines, or swap
in the marks from their brand kits.
No Apple logo or Apple app icons are drawn in the mock Mac.
