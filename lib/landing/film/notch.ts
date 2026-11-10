// Fovea's notch as the app draws it since Nov 8 (FoveaV1, the demo, with the Mac app's Nov 7–8 redesign: hellofovea/
// fovea-mac docs/onboarding/THREE_KEYS.md; app-ui-v1 docs/island: BAR_DESIGNS.md, CAPTURE_FLIGHT.md, LANES_VARIATIONS.md),
// for the page's first screen (hero.ts) and its showcase (showcase.ts). At rest the notch is black, its 6 pt ears drawn
// into the menu bar. Listening, the bar is Wings: the menu bar's height, all black, grown sideways from the notch, what's
// taken (or "Listening") at its left and six white bars at its right, still while the room is quiet, moving with a voice.
// Asking your agent (fn ⌃) lights the bar's bottom-right corner in Sea Glass; dictation (fn) stays the plain notch.
// Transcribing, the word and a ring filling. What opens under the notch (Choose chat, the board, a chat) is black, as the
// notch is, every neutral white at an opacity. What's taken flies there in one move and is its card when it lands. Pure.

import { bezier, clamp, ease, mix, seg } from "./ease";
import { islandPath, outlineAt, rimPath, type OutlineKey } from "./island";
import { level, type Line } from "./speech";
import { NOTCH, STAGE, type Outline } from "./tokens";
import { earsPath, live, pathAt, set, slotP, type Ctx, type Span } from "./film";
import type { Rect } from "./content";

/** Wings: its ears into the menu bar, its foot's corners; from a wing's end to what's in it, between that and the
 *  notch, the least a wing is (V1WingsReferenceTokens.Bar). */
export const WINGS = { ear: 10, foot: 12, inset: 12, pad: 9, min: 26 } as const;
/** What the bar's sides hold, wide (SF Pro medium 12, the website's three dots after a word that works; measured on
 *  the app's pictures): the words, the six bars (2.5 wide, 2.5 apart), the ring. */
export const SIDE = { listen: 53.5, trans: 87, think: 64, wave: 27.5, ring: 14 } as const;
/** The pile of what's taken (V1IslandBarTokens, Nov 8): an 18 pt card in front, two more behind it 5 pt further out
 *  each, 8 % smaller, turned 4° and −3°, at .78; the whole count beside them from two on ("3", never "+2"). */
export const PILE = { card: 18, offset: 5, shrink: 0.08, behind: 0.78, turn: [0, 4, -3], gap: 6, digit: 7 } as const;
export const pileW = (n: number) => {
  const k = Math.min(Math.max(n, 1), 3);
  return PILE.card + (k - 1) * PILE.offset + (n > 1 ? PILE.gap + PILE.digit * String(n).length : 0);
};

/** Outlines: the width takes in the ears; the height runs from the screen's top edge. A panel's content sits 32 in
 *  from its outline and starts 53.5 down. */
export const NOUT = {
  rest: { w: NOTCH.w + 12, h: NOTCH.h, tr: 6, br: 9 } as Outline,
  /** Wings for what its sides hold: each wing as wide as the wider side needs, so the two stay balanced */
  wings: (l: number, r: number = SIDE.wave): Outline => {
    const s = Math.max(WINGS.min, WINGS.inset + l + WINGS.pad, WINGS.inset + r + WINGS.pad);
    return { w: NOTCH.w + 2 * s + 2 * WINGS.ear, h: NOTCH.h, tr: WINGS.ear, br: WINGS.foot };
  },
  /** Choose chat at its usual size and a chat at the notch (516 wide) */
  panel: (h: number): Outline => ({ w: 516, h, tr: 10.5, br: 21.5 }),
  /** the board, Focus (its body 407.5 wide, measured on the demo's pictures) */
  board: (h: number): Outline => ({ w: 428.5, h, tr: 10.5, br: 16.5 }),
};
export const PANEL_X = 32;
export const PANEL_TOP = 53.5;

/** Choose chat at its usual size (Nov 8, "p6": IslandChatStageView): ‹, the words (14 pt, a line 19), what was taken at
 *  their right; a hairline; the foot, 48 tall: To the chat, "⌃ more chats", Send. */
export const CHOOSE = { line: 19, head: 24, under: 6, foot: 48, bottom: 8 } as const;
export const chooseH = (lines: number) => PANEL_TOP + Math.max(CHOOSE.head, lines * CHOOSE.line) + CHOOSE.under + 1 + CHOOSE.foot + CHOOSE.bottom;

/** The board, Focus (Oct 31; FocusBoard.swift at the notch's sizes): the greeting's row, the one session in focus as a
 *  card, every other a 21 pt line, tasks first, then "Chats" and theirs. */
export const FOCUS = { head: 26, gap: 4, row: 21, chats: 25, bottom: 8, card: { task: 109, ask: 113 } } as const;
export const boardH = (card: number, rows: number, chats = 0) =>
  PANEL_TOP - 6 + FOCUS.head + FOCUS.gap + card + rows * FOCUS.row + (chats ? FOCUS.chats + chats * FOCUS.row : 0) + FOCUS.bottom;

/** The six bars (V1WingsReferenceRenderer.heights): 6 pt and still while the room is all the microphone hears; with a
 *  voice up to 16, the middle carrying most of it and a wave flowing across them. 40 a second. */
export function wingsBars(lv: number, t: number): number[] {
  const tt = Math.floor(t * 40) / 40;
  const voice = Math.min(1, clamp((lv - 0.16) / (1 - 0.16)) * 1.5);
  return Array.from({ length: 6 }, (_, i) => {
    if (voice <= 0) return 6;
    const x = (i / 5) * 2 - 1, gain = 0.45 + 0.55 * Math.exp(-(x * x) / (2 * 0.75 * 0.75));
    const wave = 0.5 + 0.5 * Math.sin(tt * 10 - i * 0.95);
    return 6 + 10 * Math.min(1, voice * gain * (0.3 + 0.7 * wave));
  });
}

/** Ask your agent's light in the bar's corner (V1WingsReferenceTokens.Aurora): three soft lights placed from the corner
 *  (x to the left, y up) in a 64 × 32 room, wandering a few points, the voice brightening and growing them; the edge
 *  along the corner lit in the first. Sea Glass, the window's three colours (Nov 7). */
export const AURORA_LIGHTS = [[12, 4, 15, 1], [28, 9, 11, 0.7], [7, 15, 9, 0.55]] as const;
export const AURORA_COLORS = ["#D7DBB4", "#7FAD9B", "#4F7A6C"] as const;
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
/** Where pile card i sits in a bar whose body is `b`: the first in front, each one behind 5 pt further out and 8 %
 *  smaller, drawn from its leading edge. */
export function pileSlot(i: number, b: { x: number; w: number }): Rect {
  const l = Math.min(i, 2), k = 1 - PILE.shrink * l, s = PILE.card * k;
  return { x: b.x + WINGS.inset + l * PILE.offset, y: NOTCH.h / 2 - s / 2, w: s, h: s };
}

/** What the bar shows at t: listening over `voice` (the word, or the pile once a capture has landed at `pileAt`, the
 *  bars, and with `lit` the corner's light), then its words transcribed over `trans` ("Transcribing", or Voiceflow's
 *  "Thinking", and the ring filling). */
export type BarState = { o: number; listen: number; trans: number; think: number; pile: number; wave: number; lit: number; ring: number; prog: number; level: number };
export function barAt(t: number, voice: Span[], trans: Span[], lines: readonly Line[], opts: { think?: boolean; lit?: boolean; pileAt?: number; reduced?: boolean } = {}): BarState {
  const lv = slotP("voice", voice, t, opts.reduced).o ?? 0, lt = slotP("trans", trans, t, opts.reduced).o ?? 0;
  const pk = opts.pileAt === undefined ? 0 : opts.reduced ? (t >= opts.pileAt ? 1 : 0) : ease.out(seg(t, opts.pileAt, opts.pileAt + 0.15));
  const span = live(trans, t) ?? trans[0];
  return {
    o: Math.max(lv, lt), listen: lv * (1 - pk), trans: opts.think ? 0 : lt, think: opts.think ? lt : 0, pile: lv * pk,
    wave: lv, lit: opts.lit ? lv : 0, ring: lt, prog: span ? ease.inOut(seg(t, span[0], span[1] - 0.05)) : 0, level: level([...lines], t),
  };
}

/** The bar's sides at a body `b` on the screen, under keys `${k}…`: the words, the pile, the bars, the ring and Ask
 *  your agent's light (Notch.tsx's Wings). */
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
  set(c, `${k}:aur`, { o: s.lit });
  if (s.lit > 0) {
    const a = auroraAt(c.t, s.level);
    a.lights.forEach((l, i) => set(c, `${k}:l${i}`, l));
    set(c, `${k}:rim`, { o: a.rim });
  }
}

/** The pile's cards and its count in a bar, keys `${k}:c0…` and `${k}:n…`: card i shows once its capture is about to
 *  land (`lands[i]`, the flight still crossing it for 70 ms), the count from two on, rolling up as each lands. */
export function pile(c: Ctx, k: string, lands: number[]) {
  lands.forEach((at, i) => {
    if (c.t < at - MOVE.cross) return;
    const fade = c.reduced ? 1 : clamp((c.t - (at - MOVE.cross)) / MOVE.cross);
    set(c, `${k}:c${i}`, { o: fade * (i === 0 ? 1 : PILE.behind) });
  });
  const n = lands.filter((at) => c.t >= at).length;
  for (let i = 2; i <= lands.length; i++) {
    const at = lands[i - 1], next = lands[i];
    if (c.t < at || (next !== undefined && c.t >= next + 0.25)) continue;
    const up = c.reduced ? 1 : ease.out(seg(c.t, at, at + 0.25));
    const out = next !== undefined && !c.reduced ? ease.out(seg(c.t, next, next + 0.25)) : 0;
    set(c, `${k}:n${i}`, { o: n >= i ? up * (1 - out) : 0, y: 6 * (1 - up) - 6 * out });
  }
}

/** A capture's one move to the notch (CAPTURE_FLIGHT.md, Nov 5; Nov 8: nothing after it lands): 0.38 s on one curved
 *  path, bent 40 % toward coming in from below; its size well ahead of its place, so a large picture is small almost
 *  at once; corners 4 to 4.5 with a hairline; a soft shadow at its height mid-flight. Its card shows 70 ms before it
 *  lands, so the two cross; the selection it came from holds until it lands, then fades in 0.16 s. */
export const MOVE = { dur: 0.38, bend: 0.4, cross: 0.07, fade: 0.16 } as const;
const PLACE = bezier(0.38, 0, 0.12, 1), SIZE = bezier(0.165, 0.84, 0.44, 1);
export function moveAt(from: Rect, to: Rect, p: number): Rect & { shadow: number; rad: number } {
  const q = PLACE(p), z = SIZE(p);
  const a = { x: from.x + from.w / 2, y: from.y + from.h / 2 }, b = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, ctl = { x: mix(m.x, b.x, MOVE.bend), y: mix(m.y, a.y, MOVE.bend) };
  const u = 1 - q, x = u * u * a.x + 2 * u * q * ctl.x + q * q * b.x, y = u * u * a.y + 2 * u * q * ctl.y + q * q * b.y;
  const w = mix(from.w, to.w, z), h = mix(from.h, to.h, z);
  return { x: x - w / 2, y: y - h / 2, w, h, shadow: Math.sin(Math.PI * clamp(p)) * (from.w > 400 ? 0.6 : 1), rad: mix(4, 4.5, p) };
}
/** The move at t under key `key` (an element with class `flight`), from `from` into `to`, starting at `start`. */
export function flight(c: Ctx, key: string, kind: string, from: Rect, start: number, to: Rect) {
  if (c.t < start || c.t >= start + MOVE.dur || c.reduced) return;
  const r = moveAt(from, to, seg(c.t, start, start + MOVE.dur));
  set(c, key, { x: r.x, y: r.y, w: r.w, h: r.h, o: 1, st: kind, v: { "--rad": `${r.rad.toFixed(2)}px`, "--sh": r.shadow.toFixed(3) } });
}
/** The selection a picture was taken from: drawn while it's dragged, held through the move, gone 0.16 s after. */
export const selectionO = (t: number, landed: number) => (t < landed ? 1 : 1 - seg(t, landed, landed + MOVE.fade));

/** The island at t: its outline on the app's springs, black at rest, as Wings and as what opens under the notch, each
 *  part in its own time. Returns the outline. */
export function notch(c: Ctx, keys: OutlineKey[], slots: Record<string, Span[]>): Outline {
  const o = outlineAt(keys, c.t);
  const x0 = STAGE.w / 2 - o.w / 2, open = clamp((o.h - NOTCH.h) / 12);
  set(c, "is:blk", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h, v: { "--br": `${o.br.toFixed(1)}px`, "--open": open.toFixed(3) } });
  set(c, "is:ears", { x: x0, w: o.w, h: o.tr + 1, d: earsPath(o) });
  set(c, "is:rim", { x: x0, w: o.w, h: o.h, o: open, d: rimPath(o) });
  set(c, "is:clip", { clip: `path("${pathAt(islandPath(o), x0)}")` });
  for (const [id, spans] of Object.entries(slots)) {
    const p = slotP(id, spans, c.t, c.reduced);
    set(c, `is:${id}`, { ...p, o: (p.o ?? 0) * open });
  }
  return o;
}

/** The drop zone (MockIsland.swift DropZoneCard): a file dragged near the notch while it listens opens a black card
 *  floating 8 pt under the bar, a well with dashes in it; over it, the well lights in the accent. */
export const DROP_ZONE: Rect = { x: STAGE.w / 2 - 150, y: NOTCH.h + 8, w: 300, h: 74 };
export function dropZone(c: Ctx, open: number, lit: boolean) {
  if (open <= 0.001) return;
  set(c, "dz", { o: open, s: mix(0.96, 1, open), st: lit ? "on" : "" });
}
