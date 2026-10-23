// The landing page's tokens, mirrored from the app so the page, the notch and the onboarding read as
// one product. Names follow the Swift sources:
//   Site    the page's own (Oct 10, after the reference Yulun picked): a white card on a light grey,
//           near-black words, greys for what's said second. The pictures' colours: gradient.ts.
//   Reveal  ← FoveaV1/Sources/FoveaOnboarding/OnboardingTokens.swift `Motion` (reading pages rise in)
//   Colors  ← app-ui-v1/Sources/Fovea/Tokens.swift (the window: ink on paper; the old demo's)
//   Native  ← FoveaV1/Sources/FoveaIsland/WorkbenchTokens.swift `Native` + docs/island/NATIVE.md
//   Island, Motion, V2, Board, Capture, Referents ← WorkbenchTokens.swift (Spacious, 1.0's default)
// Colors are also declared in app/(landing)/landing.css (@theme); tests/landing/tokens.test.ts keeps
// the two equal. Geometry and timing live only here.

/** A white card on a light grey, near-black words, and greys for what's said second. */
export const Site = {
  ground: "#EFEEEB",
  card: "#FFFFFF",
  text: "#0E0E0E",
  secondary: "#6E6E6E",
  tertiary: "#A3A3A3",
  /** The nav's pill and the second button: a grey just off the card. */
  fill: "#F3F3F2",
  line: "#EAEAE8",
  ink: "#0C0C0C",
  /** The card's corners, and the pictures'. */
  cardRadius: 20,
  mediaRadius: 16,
} as const;

/** Words rise in as the onboarding's reading pages do (OT.Motion: pageIn 0.7 s on
 *  timingCurve(0.2, 0.9, 0.3, 1), blur 6, rise 18, stagger 0.1), word by word as born.com's lines
 *  do, once, when a line comes into view. */
export const Reveal = {
  duration: 0.7,
  ease: "cubic-bezier(0.2, 0.9, 0.3, 1)",
  blur: 8,
  /** A word rises a quarter of its size; a whole block, the onboarding's 18 px. */
  riseEm: 0.25,
  blockRise: 18,
  wordStagger: 0.035,
  /** However long the line, its last word starts within this. */
  maxSpread: 0.6,
  blockStagger: 0.1,
  /** How much of a line must show before it plays. */
  threshold: 0.35,
} as const;

export const Colors = {
  ink: "#0C0C0C",
  paper: "#EFEEEB",
  /** Every neutral on the page is the ink at an opacity. */
  inkSecondary: 0.58,
  inkTertiary: 0.42,
  hairline: 0.08,
  accent: "#007AFF",
} as const;

/** Native, light (docs/island/NATIVE.md): only the notch black; the island and what drops below
 *  it light glass, ink words; the system's state colors beside their words. */
export const Native = {
  notch: "#000000",
  panelTint: "rgba(255, 255, 255, 0.4)",
  rim: "rgba(255, 255, 255, 0.7)",
  rimWidth: 0.75,
  shadow: "rgba(0, 0, 0, 0.12)",
  shadowRadius: 12,
  shadowY: 4,
  /** Where glass has nothing behind it (the page's own notch over paper): a solid of its tone. */
  offscreen: "rgba(245, 245, 245, 0.94)",
  needsYou: "#FF9500",
  failed: "#FF3B30",
  done: "#34C759",
  accentWash: 0.2,
  /** The island's glass comes in over its first points of growth past the notch. */
  islandGlassRamp: 12,
} as const;

/** The display the demo draws (a 13-inch MacBook), and the island's resting geometry. */
export const Display = {
  width: 1470,
  height: 956,
  notchWidth: 200,
  notchHeight: 32,
  bezel: 12,
  bezelRadius: 22,
  screenRadius: 12,
  menuBarSidePadding: 16,
  menuBarItemSpacing: 20,
  dockIcon: 40,
  dockPadding: 6,
  dockSpacing: 8,
  dockBottomInset: 8,
  dockRadius: 16,
} as const;

export const Island = {
  /** Concave ear each side of the notch at rest: 6 pt, so the resting island is 212 wide. */
  ear: 6,
  restTopRadius: 6,
  restBottomRadius: 14,
  /** Listening and transcribing grow only downward. */
  voiceBelow: 44,
  openTopRadius: 19,
  waveformBars: 9,
  waveformBarWidth: 4,
  waveformBarGap: 4,
  waveformMinHeight: 16 / 3,
  waveformMaxHeight: 20,
  waveformFrameRate: 40,
  waveformSpread: 0.4,
  waveformGainBoost: 1.25,
} as const;

export const Motion = {
  /** The one curve: ease-out-quint. Never ease-in. */
  ease: "cubic-bezier(0.23, 1, 0.32, 1)",
  /** The onboarding's reading pages rise in part by part. */
  readEase: "cubic-bezier(0.2, 0.9, 0.3, 1)",
  readDuration: 0.7,
  readRise: 18,
  readBlur: 6,
  readStagger: 0.1,
  /** Springs, critically damped (SwiftUI interpolatingSpring(duration:, bounce: 0)). */
  voiceOpen: 0.18,
  voiceClose: 0.15,
  open: 0.34,
  resize: 0.3,
  fold: 0.28,
  close: 0.24,
  /** Content follows the shape: opacity, a light blur and a small scale from the top. */
  contentBlur: 4,
  contentScale: 0.97,
  contentDuration: 0.1,
  contentDelay: 0.02,
  panelContentDuration: 0.2,
  panelContentDelay: 0.08,
  reduceMotionFade: 0.12,
} as const;

/** Dispatch Version 2, Spacious. */
export const V2 = {
  width: 660,
  margin: 22,
  topGap: 14,
  bottomRadius: 32,
  gap: 16,
  requestSize: 15,
  attachRow: 48,
  attachThumb: 44,
  pillMaxWidth: 250,
  pillHeight: 36,
  sendSize: 36,
  chipRow: 32,
  chipHeight: 30,
  chipGap: 8,
  chipPaddingH: 12,
  chipIcon: 16,
  pillPaddingH: 14,
  pillIcon: 20,
  labelTrailing: 6,
  transcribeTime: 1.4,
  playChoose: 1.6,
  boardHold: 3,
  quickLimit: 8,
  chatHold: 12,
  answerPace: 1.2,
  taskPace: 2.2,
  headerIcon: 24,
  readingMeasure: 620,
} as const;

/** The control board, Badges design, Spacious. */
export const Board = {
  width: 460,
  paddingH: 10,
  paddingBottom: 16,
  bottomRadius: 32,
  row: 54,
  rowPaddingH: 12,
  rowRadius: 10,
  lineGap: 4,
  badgedIcon: 30,
  iconGap: 12,
  badge: 14,
  badgeRing: 2,
  badgeOffset: 3,
  titleSize: 14,
  lineSize: 12.5,
  trailingWidth: 48,
} as const;

export const Capture = {
  tapLength: 0.3,
  doubleTapWindow: 0.45,
  dragThreshold: 4,
  minimumSide: 12,
  fill: "rgba(128, 128, 128, 0.32)",
  stroke: "rgba(102, 102, 102, 0.75)",
  flight: 0.45,
  flightStartRadius: 4,
} as const;

export const Referents = {
  thumbHeight: 28,
  thumbWidth: 40,
  radius: 6,
  borderWidth: 0.75,
  maxLayers: 3,
  layerOffset: 5,
  layerShrink: 0.08,
  layerOpacity: 0.6,
  restRotation: [0, 4, -3],
} as const;
