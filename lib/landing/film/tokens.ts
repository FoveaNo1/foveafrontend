// The film's measures. The stage is a 13-inch MacBook Air's screen in points (1470 × 956), and every island size is
// Fovea 1.0's (FoveaV1 WorkbenchTokens.swift, Spacious), checked on the pictures of the real app
// (app-ui-v1/handoff/Fovea-1.0-design-pictures, 2940 × 1912, so pixels ÷ 2 are points). Pure.

export const STAGE = { w: 1470, h: 956 } as const;
export const MENU_H = 32;

/** The hardware notch, centred on the top edge (DSP-01: 180 × 32, its bottom corners about 8). */
export const NOTCH = { w: 180, h: 32, x: (1470 - 180) / 2, radius: 8 } as const;
export const EAR = 6;
/** An open panel's ears, and its content's inset from the outline's edge (ear 19 + margin 16). */
export const PANEL_EAR = 19;
export const PANEL_INSET = 35;

/** An island outline: its width includes both ears; its height runs from the screen's top edge. */
export type Outline = { w: number; h: number; tr: number; br: number };

export const OUTLINE = {
  /** At rest only the notch shows; the glass is 0. */
  rest: { w: NOTCH.w + 2 * EAR, h: NOTCH.h, tr: EAR, br: 14 },
  /** The voice bar and Transcribing (DSP-01, DSP-02): 192 × 76. */
  bar: { w: NOTCH.w + 2 * EAR, h: 76, tr: EAR, br: 14 },
  /** Choose chat (V2.width 660, DSP-03): a one-line request is 42 + 19 + 12 + 44 + 10 + 28 + 16 = 171 tall. */
  choose: { w: 660, h: 171, tr: PANEL_EAR, br: 28 },
  /** Choose chat with nothing to pick from (Soon: Fovea picks the chat by itself): 42 + 19 + 12 + 44 + 16 = 133. */
  chooseBare: { w: 660, h: 133, tr: PANEL_EAR, br: 28 },
  /** The session panel (DSP-15 / DSP-16): 660 wide; its height is its content's. */
  panel: (h: number) => ({ w: 660, h, tr: PANEL_EAR, br: 28 }),
  /** The board, Badges style (Board.width 400, DSP-10): 42 above the rows, 46 a row, 9 between groups, 8 below. */
  board: (rows: number, sections = 2) => ({ w: 400, h: 42 + rows * 46 + 9 * (sections - 1) + 8, tr: PANEL_EAR, br: 22 }),
} as const;

/** Springs and fades, in seconds (WorkbenchTokens: Island, Motion, Panel, V2; all critically damped). */
export const SPRING = {
  barOpen: 0.18,
  barClose: 0.15,
  open: 0.34,
  resize: 0.3,
  close: 0.24,
  /** A panel's content comes in 0.08 s after its outline, over 0.2 s; the voice bar's after 0.02 s, over 0.1 s. */
  contentDelay: 0.08,
  content: 0.2,
  barContentDelay: 0.02,
  barContent: 0.1,
  flight: 0.45,
  /** The waveform moves aside for the stack on this spring, from the moment a capture starts flying. */
  wave: 0.3,
} as const;

/** After Send, the board holds 3 s; an answer back within 8 s then opens by itself (DispatchV2.swift). */
export const DISPATCH = { boardHold: 3, quickLimit: 8, transcribe: 1.4 } as const;

/** A capture, as the film shows it (Capture tokens; CaptureLayer.swift). The app's flight is SPRING.flight (0.45 s)
 *  and a mark holds 0.9 s; the film flies 0.6 s and holds each mark a little longer, so a viewer can follow what
 *  was taken. A whole-screen capture flies from the screen inset 40 pt. */
export const CAPTURE = { flight: 0.6, markFade: 0.35, screenInset: 40, flash: 0.35 } as const;

/** The glass fades in over the island's first 12 pt of growth below the notch (Native.islandGlassRamp). */
export const glassAt = (h: number) => Math.max(0, Math.min(1, (h - NOTCH.h) / 12));

/** The gaze ring: hellofovea.com's soft band (112 plate px on a 1672 plate, so 98 pt here) in its own sky blue; it
 *  glides 0.42 s from one thing to the next and trembles a little while it rests. */
export const RING = { size: 98, color: "#52B4F5", tremor: 1.4, tremorHz: 9, glide: 0.42 } as const;

/** Speech: a word every 0.32 s, a breath after a comma, and the line held after its last word. */
export const SPEECH = { word: 0.32, comma: 0.22, hold: 1.2 } as const;

/** Chapter breaks dip to paper over a second; states cross-fade in half a second. */
export const DIP = 1.0;
export const DISSOLVE = 0.5;

/** The page's paper and ink, and the system's selection and accent (light appearance), as the film draws them. */
export const COLOR = { paper: "#F8F8F5", ink: "#141414", accent: "#007AFF", selection: "rgba(179, 215, 255, .9)" } as const;
