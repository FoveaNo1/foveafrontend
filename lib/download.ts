// The one place the landing page's "Download for Mac" points. Fovea 1.0 isn't hosted yet; until it
// is, the button takes the current beta build (macOS 14+, Apple silicon). Swap DMG_URL for the 1.0
// URL when it's up. /download keeps its own copy for now.

export const DMG_URL = "https://updates.hellofovea.com/beta/fovea-mac/releases/latest.dmg";

/** The Gaze Collector, for "Help train it" in the Next section. */
export const GAZE_COLLECTOR_URL =
  "https://updates.hellofovea.com/beta/fovea-gaze-collect/releases/latest.dmg";

/** Shown under every Download button. */
export const REQUIREMENTS = "macOS 14 or later · Apple silicon";
