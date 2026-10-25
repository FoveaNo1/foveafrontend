// The aurora under the notch while a person talks to their agent (Yulun, Oct 24: "the notch actually has a dim aurora
// when the user is talking to it"). FoveaV1 draws it in MockDesktop/VoiceGlow.swift (its port of libraries.dev/voice's
// voice-glow, the Wide style, WorkbenchTokens.VoiceGlow) and shows it in AgentThinking.swift's AgentEdgeLayer: soft
// lobes of the palette inside the island's bottom edge, their bloom, and the lit edge with a white core, all swelling
// and flowing sideways with the voice, the hues drifting ±24° over 12 s; silent, it rests dim. Dispatch's alone (fn ⌃,
// and asking more in a session): Voiceflow is never a colour (docs/island/NATIVE.md, round three). While the words are
// transcribed, the same aurora is the progress bar, filling the edge from the leading side. Pure.

import { level, type Line } from "./speech";

/** The Wide style's scale: the package's chat-input tuning fitted to the notch's band. */
const S = 0.57;

export const AURORA = {
  reach: 1.2, spread: 1.05, flow: 48, bend: 60,
  glowWidth: 0.65, glowHeight: 1.25, lobeSpacing: 0.85, rangeWidth: 0.75, rangeHeight: 1, coreSize: 1,
  strokeOpacity: 1.16, innerOpacity: 0.8, bloomOpacity: 1.1,
  /** The driver: the gate, how fast it follows the voice up and down, the resting glow. */
  threshold: 0.015, attack: 0.325, release: 0.86, idle: 0.18,
  /** The lobes, px at scale 1 (styles.ts voiceLobes): x, width, height, the band each follows (0 lows, 1 mids, 2 highs). */
  lobes: [[0, 74, 46, 0], [-36, 54, 40, 1], [36, 54, 40, 1], [-72, 48, 32, 2], [72, 48, 32, 2], [-108, 42, 26, 1], [108, 42, 26, 1]],
  /** The ceilings the layers are masked to, px at scale 1. */
  ceiling: { half: 170, height: 64 },
  bloomCeiling: { half: 200, height: 130 },
  hueRange: 24, hueDuration: 12,
  /** Colorful, the palette the app starts with (GlowPalette.colorful), centre lobe first; the glow draws them through
   *  brightness 1.15 and saturate 1.2. */
  colors: [[255, 70, 120], [60, 190, 255], [175, 70, 255], [60, 220, 130], [255, 150, 40], [90, 100, 255], [40, 200, 190]],
} as const;

/** How far the lobes run before they wrap round (VoiceGlow.lobeSpan × lobeSpacing × scale). */
const SPAN = 36 * 7 * AURORA.lobeSpacing * S;

export type AuroraFrame = {
  /** The voice as followed, and the glow's presence (0.15 silent at no idle … 1). */
  level: number; glow: number;
  /** The lobes' width and height multipliers, and the bend's lift at the centre (pt). */
  w: number; h: number; lift: number;
  /** The hue drift, degrees. */
  drift: number;
  /** Each lobe's offset from the centre (pt, before the width) and its height. */
  lobeX: number[]; lobeL: number[];
};

/** Noise gate, then soft saturation, so a loud word rounds off instead of clipping. */
const shape = (raw: number, threshold: number) => {
  if (raw <= threshold) return 0;
  const t = (raw - threshold) / Math.max(0.001, 1 - threshold);
  return Math.min(1, Math.max(0, (1 - Math.exp(-3 * t)) / (1 - Math.exp(-3))));
};
/** One-pole follower: fast up, slow down. */
const follow = (prev: number, target: number, dt: number, attack: number, release: number) =>
  prev + (target - prev) * (1 - Math.exp(-dt / Math.max(0.001, target > prev ? attack : release)));
const wrap = (x: number, span: number) => {
  const half = span / 2, m = (x + half) % span;
  return (m < 0 ? m + span : m) - half;
};
/** A lobe fades out toward the wrap, so it never pops from one side to the other. */
const envelope = (x: number, span: number) => Math.max(0, 1 - (x / (span / 2 + 4)) ** 2);

/** The driver (VoiceGlowEngine.advance) run sixty steps a second from `from`, when the person began to talk, to t: the
 *  voice followed, its three bands, the lobes' sideways flow; the hue drift on the same clock. The voice is the scene's
 *  own (speech.ts level), so the aurora swells with the words the subtitles show. */
export function auroraAt(lines: readonly Line[], from: number, t: number, reduced = false): AuroraFrame {
  const A = AURORA;
  let lv = 0, phase = 0;
  const bands = [0, 0, 0];
  const n = Math.max(0, Math.floor((t - from) * 60));
  for (let i = 1; i <= n + 1; i++) {
    const at = i <= n ? from + i / 60 : t;
    const dt = i <= n ? 1 / 60 : t - (from + n / 60);
    if (dt <= 0) continue;
    const raw = Math.min(1, Math.max(0, level([...lines], at)));
    const clock = at - from;
    const rawBands = [raw, raw * (0.72 + 0.28 * Math.sin(clock * 9.1)), raw * (0.6 + 0.4 * Math.sin(clock * 13.7 + 2))];
    lv = follow(lv, shape(raw, A.threshold), dt, A.attack, A.release);
    for (let b = 0; b < 3; b++) bands[b] = follow(bands[b], shape(rawBands[b], A.threshold * 0.6), dt, A.attack, A.release * 1.15);
    if (!reduced) phase = (((phase + A.flow * S * lv * dt) % SPAN) + SPAN) % SPAN;
  }
  const eff = lv + (1 - lv) * A.idle * 0.5;
  const lobeX = A.lobes.map(([x]) => wrap(x * A.lobeSpacing * S + phase, SPAN));
  const lobeL = A.lobes.map(([, , , band], i) => (0.6 + 0.7 * bands[band]) * envelope(lobeX[i], SPAN));
  const drift = reduced ? 0 : -A.hueRange + A.hueRange * (1 - Math.cos((2 * Math.PI * (t - from)) / A.hueDuration));
  return { level: lv, glow: 0.15 + 0.85 * eff, w: 0.85 + A.spread * eff, h: 0.5 + A.reach * eff, lift: A.bend * S * eff, drift, lobeX, lobeL };
}

export type Ellipse = { x: number; y: number; rx: number; ry: number };

/** Where the parts sit in a box `w` wide, its bottom edge at `h` (VoiceGlowRenderer): each layer's lobes (the inner
 *  light, the bloom, the lit edge, 2 pt under it), the white core, and the ceilings the layers are masked to. */
export function auroraParts(f: AuroraFrame, w: number, h: number) {
  const A = AURORA, gw = A.glowWidth * S, gh = A.glowHeight * S;
  const lobes = (sw: number, sh: number, dy: number): Ellipse[] =>
    A.lobes.map(([, lw, lh], i) => ({ x: w / 2 + f.lobeX[i] * f.w, y: h + dy, rx: lw * sw * f.w, ry: lh * sh * f.h * f.lobeL[i] }));
  const core = 30 * A.coreSize * S;
  return {
    inner: lobes(gw * 0.9, gh * 0.9, 0),
    bloom: lobes(gw * 1.15, gh * 1.5, 0),
    stroke: lobes(gw, gh, 2),
    core: { x: w / 2, y: h + 2, rx: core * f.w, ry: core * f.h },
    ceiling: { x: w / 2, y: h, rx: A.ceiling.half * A.rangeWidth * S * f.w, ry: A.ceiling.height * A.rangeHeight * S * f.h + f.lift },
    bloomCeiling: { x: w / 2, y: h, rx: A.bloomCeiling.half * A.rangeWidth * S * f.w, ry: A.bloomCeiling.height * A.rangeHeight * S * f.h + f.lift },
    opacity: { inner: f.glow * A.innerOpacity, bloom: Math.min(1, f.glow * A.bloomOpacity), stroke: Math.min(1, f.glow * A.strokeOpacity) },
  };
}
