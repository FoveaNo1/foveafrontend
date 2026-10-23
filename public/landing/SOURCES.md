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

The demo film (`film/`, components/book/film), Unsplash photographs through picsum.photos (the Unsplash license:
free to use commercially, no attribution required), downloaded Oct 13:

- wall.jpg: picsum id 128, Matteo Minelli, https://unsplash.com/photos/hlnucYOsL-c
- trail.jpg: picsum id 17, Paul Jarvis, https://unsplash.com/photos/Ven2CV8IJ5A
- thumb-1036, thumb-216, thumb-29: the same ids on picsum.photos (480 × 320), the trail cards in Field Notes
- fovea-bar.png: Fovea's own Fovea Bar render (fovea website/assets/product/fovea-bar.png), resized to 1100 px.
- fovea-mark.png: Fovea's current icon (app-ui-v1/FoveaV1/Sources/FoveaIsland/Resources/Agents/fovea.png), the mark on Quick answers.
- chatgpt-mark.png, claude-mark.png, cursor-mark.png, grok-mark.png (in agents/): app-ui-v1's destination marks
  (Sources/FoveaCore/Resources/Destinations, from lobe-icons); out of the film's row of agents since Oct 17.
- grok-bot.png (in agents/): FoveaV1's Grok Bot icon (Resources/Agents), the 256 × 256 representation of the signed
  `/Applications/Grok Bot.app` (SpaceXAI, bundle com.anysphere.sand); the same artwork as its App Store icon (Oct 17).
- claude-code.png, codex.png (in agents/): FoveaV1's (Resources/Agents/SOURCES.md): the Claude app's icon, which
  Fovea's app shows for Claude Code, and the Codex icon from the signed app.

The film's row of agents (Oct 17): Muse, Claude Code, Codex, Grok Bot, Instinct, Manus, each its own icon:
- muse.png: Muse from Meta, the 256 × 256 representation of the installed `/Applications/Muse.app` (bundle
  com.meta.endo, 5.0) `AppIcon.icns`, the same artwork as its App Store icon (apps.apple.com id6760173601).
- manus.svg: Manus (Meta), `Manus-Icon.svg` from its brand page, manus.im/brand
  (files.manuscdn.com/assets/image/brand/image/Manus-Icon.svg, 5,635 B), unaltered. Its rules: don't recolour, rotate,
  flip or outline it.
- instinct.png: Instinct (instinct.com, Spear Street Technology), its `apple-touch-icon.png` (180 × 180, 1,871 B), the
  only icon it publishes (no App Store listing, no brand kit).
- Showing these marks in a marketing film is a trademark question: check before launch (landing/README.md).
