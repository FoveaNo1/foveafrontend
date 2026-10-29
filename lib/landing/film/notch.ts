// Fovea's notch as FoveaV1 draws it since Oct 28 (app-ui-v1 docs/island: BAR_DESIGNS.md, CHOOSE_CHAT.md, POP_UP.md;
// WorkbenchTokens.Bar, V2, Board in Compact), for the page's first screen (hero.ts) and its showcase (showcase.ts), with
// the launch film's numbers (landing/research/launch-film/comp/v2-island.js). At rest the notch is black, its 6 pt ears
// drawn into the menu bar. Listening, the bar is Wings: the menu bar's height, all black, grown sideways from the
// notch, what's taken (or "Listening") at its left, five small bars and a little light in the accent's colours in its
// bottom-right corner at its right; transcribing, the word and a ring filling. What opens under the notch (Choose
// chat's sentence, the board, a session) is dark glass, the notch's black blended into it (the Halo). Pure.

import { clamp, ease, mix, seg } from "./ease";
import { islandPath, outlineAt, rimPath, type OutlineKey } from "./island";
import { level, type Line } from "./speech";
import { NOTCH, STAGE, type Outline } from "./tokens";
import { earsPath, live, pathAt, set, slotP, type Ctx, type Span } from "./film";
import type { Rect } from "./content";

/** Wings: its ears into the menu bar, its foot's corners; from a wing's end to what's in it, between that and the
 *  notch, the least a wing is (WorkbenchTokens.Bar). */
export const WINGS = { ear: 10, foot: 12, inset: 12, pad: 9, min: 26 } as const;
/** What the bar's sides hold, wide (SF Pro medium 12, the website's three dots after a word that works; measured on
 *  the app's pictures): the words, the waveform, the ring. */
export const SIDE = { listen: 53.5, trans: 87, think: 64, wave: 20.5, ring: 14 } as const;
/** The pile of what's taken: a front card 26 × 18, two more peeking out behind it 3.5 pt further each. */
export const pileW = (n: number) => 26 + (Math.min(Math.max(n, 1), 3) - 1) * 3.5;

/** Outlines: the width takes in the ears; the height runs from the screen's top edge. A panel's content sits 32 in
 *  from its outline and starts 53.5 down (the notch, then the Halo's room). */
export const NOUT = {
  rest: { w: NOTCH.w + 12, h: NOTCH.h, tr: 6, br: 9 } as Outline,
  /** Wings for what its sides hold: each wing as wide as the wider side needs, so the two stay balanced */
  wings: (l: number, r: number = SIDE.wave): Outline => {
    const s = Math.max(WINGS.min, WINGS.inset + l + WINGS.pad, WINGS.inset + r + WINGS.pad);
    return { w: NOTCH.w + 2 * s + 2 * WINGS.ear, h: NOTCH.h, tr: WINGS.ear, br: WINGS.foot };
  },
  /** Choose chat and a session (V2.width 600, Compact) */
  panel: (h: number): Outline => ({ w: 516, h, tr: 10.5, br: 21.5 }),
  /** the board (Board.width 368, Compact) */
  board: (h: number): Outline => ({ w: 316.5, h, tr: 10.5, br: 16.5 }),
};
export const PANEL_X = 32;
export const PANEL_TOP = 53.5;
/** Choose chat's sentence, its request `lines` tall (17 pt type at 0.92: 20.25 a line), the hairline and the line. */
export const sentenceH = (lines: number) => PANEL_TOP + lines * 20.25 + 18 + 29.5 + 12;
/** The board: the greeting's 26, rows of 34.5, 7 between kinds, 6 under. */
export const boardH = (rows: number, sections = 1) => PANEL_TOP + 26 + rows * 34.5 + 7 * (sections - 1) + 6;

/** The waveform's five bars (Wings MiniWaveform): 3 to 12 pt, the voice lifting the middle on a bell, 40 a second. */
export function wingsBars(lv: number, t: number): number[] {
  const tt = Math.floor(t * 40) / 40;
  return Array.from({ length: 5 }, (_, i) => {
    const x = (i / 4) * 2 - 1, gain = Math.exp(-(x * x) / (2 * 0.36)), flutter = 0.7 + 0.3 * Math.sin(tt * 11 + i * 1.9);
    return 3 + 9 * clamp(gain * lv * 1.35 * flutter);
  });
}

/** The light in the bar's corner (WingsAurora, WorkbenchTokens.Aurora): three soft lights placed from the corner (x to
 *  the left, y up) in a 64 × 32 room, wandering a few points, the voice brightening and growing them; the edge along
 *  the corner lit with them. Multicolor's hues (the glow's Colorful: pink, blue, violet). */
export const AURORA_LIGHTS = [[12, 4, 15, 1], [28, 9, 11, 0.7], [7, 15, 9, 0.55]] as const;
export const AURORA_COLORS = ["rgb(255 84 140)", "rgb(70 200 255)", "rgb(190 90 255)"] as const;
export function auroraAt(t: number, lv: number) {
  const alpha = 0.85 * (0.55 + 0.45 * lv), grow = 0.85 + 0.35 * lv;
  const lights = AURORA_LIGHTS.map(([lx, ly, r, share], i) => {
    const ph = i * 2.1, x = 64 - lx + 3 * Math.sin(t * 0.7 + ph), y = 32 - ly + 3 * Math.cos(t * 0.56 + ph), rr = r * grow;
    return { x: x - rr, y: y - rr, w: 2 * rr, h: 2 * rr, o: alpha * share };
  });
  return { lights, rim: 0.6 * (0.55 + 0.45 * lv) };
}

/** Transcribing's ring (r 6 in a 14 pt box) filled to `p`, clockwise from the top. */
export function ringArc(p: number): string {
  const q = clamp(p);
  if (q <= 0.001) return "M7,1";
  if (q >= 0.999) return "M7,1 A6,6 0 1 1 6.99,1";
  const a = q * 2 * Math.PI, x = 7 + 6 * Math.sin(a), y = 7 - 6 * Math.cos(a);
  return `M7,1 A6,6 0 ${q > 0.5 ? 1 : 0} 1 ${x.toFixed(2)},${y.toFixed(2)}`;
}

/** Where the bar's body is on the screen (between its ears) for outline `o`. */
export const bodyOf = (o: Outline) => ({ x: STAGE.w / 2 - o.w / 2 + o.tr, w: o.w - 2 * o.tr });
/** Where pile card i lands in a bar whose body is `b`: the first in front, the next two 8 % smaller each behind it. */
export function pileSlot(i: number, b: { x: number; w: number }): Rect {
  const k = 1 - 0.08 * Math.min(i, 2), w = 26 * k, h = 18 * k, right = b.x + WINGS.inset + 26 + Math.min(i, 2) * 3.5;
  return { x: right - w, y: NOTCH.h / 2 - h / 2, w, h };
}

/** What the bar shows at t: listening over `voice` (the word, or the pile once a capture has landed at `pileAt`, the
 *  waveform and the corner's light), then its words transcribed over `trans` ("Transcribing", or Voiceflow's
 *  "Thinking", and the ring filling). */
export type BarState = { o: number; listen: number; trans: number; think: number; pile: number; wave: number; ring: number; prog: number; level: number };
export function barAt(t: number, voice: Span[], trans: Span[], lines: readonly Line[], opts: { think?: boolean; pileAt?: number; reduced?: boolean } = {}): BarState {
  const lv = slotP("voice", voice, t, opts.reduced).o ?? 0, lt = slotP("trans", trans, t, opts.reduced).o ?? 0;
  const pk = opts.pileAt === undefined ? 0 : opts.reduced ? (t >= opts.pileAt ? 1 : 0) : ease.out(seg(t, opts.pileAt, opts.pileAt + 0.15));
  const span = live(trans, t) ?? trans[0];
  return {
    o: Math.max(lv, lt), listen: lv * (1 - pk), trans: opts.think ? 0 : lt, think: opts.think ? lt : 0, pile: lv * pk,
    wave: lv, ring: lt, prog: span ? ease.inOut(seg(t, span[0], span[1] - 0.05)) : 0, level: level([...lines], t),
  };
}

/** The bar's sides at a body `b` on the screen, under keys `${k}…`: the words, the pile, the waveform, the ring and
 *  the corner's light (Notch.tsx's Wings). */
export function wings(c: Ctx, k: string, b: { x: number; w: number }, s: BarState) {
  if (s.o <= 0.001) return;
  set(c, k, { x: b.x, w: b.w, o: s.o });
  set(c, `${k}:listen`, { o: s.listen });
  set(c, `${k}:trans`, { o: s.trans });
  set(c, `${k}:think`, { o: s.think });
  if (s.trans > 0) set(c, `${k}:dots`, { st: String(Math.floor(c.t / 0.36) % 3) });
  if (s.think > 0) set(c, `${k}:dots2`, { st: String(Math.floor(c.t / 0.36) % 3) });
  set(c, `${k}:pile`, { o: s.pile });
  set(c, `${k}:wave`, { o: s.wave });
  if (s.wave > 0) wingsBars(s.level, c.t).forEach((h, i) => set(c, `${k}:b${i}`, { h }));
  set(c, `${k}:ring`, { o: s.ring });
  if (s.ring > 0) set(c, `${k}:arc`, { d: ringArc(s.prog) });
  set(c, `${k}:aur`, { o: s.wave });
  if (s.wave > 0) {
    const a = auroraAt(c.t, s.level);
    a.lights.forEach((l, i) => set(c, `${k}:l${i}`, l));
    set(c, `${k}:rim`, { o: a.rim });
  }
}

/** The island at t: its outline on the app's springs, the black (at rest and as Wings) giving way to the glass over the
 *  first 12 pt of growth past the notch, the Halo in the glass, each part in its own time. Returns the outline. */
export function notch(c: Ctx, keys: OutlineKey[], slots: Record<string, Span[]>): Outline {
  const o = outlineAt(keys, c.t);
  const x0 = STAGE.w / 2 - o.w / 2, ga = clamp((o.h - NOTCH.h) / 12), ba = 1 - ga;
  set(c, "is:blk", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h, o: ba, v: { "--br": `${o.br.toFixed(1)}px` } });
  set(c, "is:bears", { x: x0, w: o.w, h: o.tr + 1, o: ba, d: earsPath(o) });
  set(c, "is:glass", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h + 6, o: ga, v: { "--br": `${o.br.toFixed(1)}px` } });
  set(c, "is:ears", { x: x0, w: o.w, h: o.tr + 1, o: ga, d: earsPath(o) });
  set(c, "is:rim", { x: x0, w: o.w, h: o.h, o: ga, d: rimPath(o) });
  set(c, "is:clip", { clip: `path("${pathAt(islandPath(o), x0)}")` });
  set(c, "is:halo", { o: ga });
  for (const [id, spans] of Object.entries(slots)) {
    const p = slotP(id, spans, c.t, c.reduced);
    set(c, `is:${id}`, { ...p, o: (p.o ?? 0) * ga });
  }
  return o;
}

/** The drop zone (MockIsland.swift DropZoneCard): a file dragged near the notch while it listens opens a glass card
 *  floating 8 pt under the bar, a well with dashes in it; over it, the well lights in the accent. */
export const DROP_ZONE: Rect = { x: STAGE.w / 2 - 150, y: NOTCH.h + 8, w: 300, h: 74 };
export function dropZone(c: Ctx, open: number, lit: boolean) {
  if (open <= 0.001) return;
  set(c, "dz", { o: open, s: mix(0.96, 1, open), st: lit ? "on" : "" });
}
