// The showcase after the film (Oct 24, Yulun: "an animation of a real person using Fovea on their Mac", set out the way
// Dia's site shows its features; round two the same evening: the Mac in dark mode, the island in Fovea's own
// see-through glass, the whole screen in every frame so the notch is the size it is on a real Mac, and the notch as
// FoveaV1 draws it today). Three short scenes, each one thing Fovea does today, drawn with the film's parts and numbers
// (film.ts, island.ts, tokens.ts) and FoveaV1's current notch (WorkbenchTokens.swift, OpenChat.swift, V2History.swift,
// DispatchV2.swift):
// - point: ⌘ and a drag over a button that sits low, again over one that's right, a spec dragged onto the notch, one
//   sentence, and it goes to the person's own Codex, which lines the button up; they never leave the browser;
// - notch: the board under the notch (the greeting and the search over its rows): a test run allowed in its row, a
//   finished answer opened (the request in its bubble at the right), a follow-up asked by voice, and the chat pulled out
//   of the notch by its grab bar into a window of its own, where the answer comes in;
// - talk: Voiceflow as a person thinks out loud: a list, an item taken back, another subject with a picture taken by ⌘,
//   a last item remembered; fn again, and the email reads as the list in order, the picture after the words.
// Each loops: out of the dark, the one thing done, back into the dark. Pure: the scene at t. components/book/showcase
// plays them.

import { clamp, ease, mix, seg, spring, window01 } from "./ease";
import { bars, islandPath, outlineAt, rimPath, type OutlineKey } from "./island";
import { level, lineOpacity, shown, speak, type Line } from "./speech";
import { CAPTURE, OUTLINE, SPRING, STAGE, glassAt, type Outline } from "./tokens";
import { STACK, WIDE, clickAt, earsPath, glow, lerpRect, live, pathAt, pointer, press, set, slotP, stack, type Ctx, type Frame, type Span } from "./film";
import { dragRect, pointerAt, type Pt } from "./pointer";
import { auroraAt, auroraParts, type Ellipse } from "./aurora";
import type { Rect } from "./content";

export type SceneId = "point" | "notch" | "talk";

/** What of the screen a frame shows: all of it, as a Mac's screen is, so the notch is the size it really is (180 of
 *  1470 pt); scaled to the frame, the menu bar at its top edge. A phone's frame is taller than the screen: the keys and
 *  the words sit in the strip under it. */
export function showFit(W: number, H: number) {
  const s = Math.min(W / STAGE.w, H / STAGE.h);
  return { s, tx: (W - STAGE.w * s) / 2, ty: 0 };
}

/** The keys the scenes press, each with what it does there (the film's caps; Voiceflow's and asking more are fn alone,
 *  as FoveaV1's FLOWS.md has them). */
export const SC_KEYS = {
  fn: { caps: ["fn", "⌃"], label: "talk" },
  cmd: { caps: ["⌘"], label: "part of the screen" },
  fnDone: { caps: ["fn", "⌃"], label: "done" },
  toCodex: { caps: ["enter"], label: "to your Codex" },
  more: { caps: ["fn"], label: "ask more" },
  moreDone: { caps: ["fn"], label: "done" },
  vf: { caps: ["fn"], label: "talk" },
  vfDone: { caps: ["fn"], label: "done" },
} as const;
export type ScKey = keyof typeof SC_KEYS;

// ———————————————————————————— shared: the island, the keys, the words, the loop

const I = (at: number, to: Outline, dur: number): OutlineKey => ({ at, to, dur });
const around = (r: Rect, m = 8): Rect => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m });

/** The board as the real Mac draws it (Oct 24, OpenChat.swift): the greeting and the search on a bar 34 pt tall over
 *  its rows. */
export const BOARD_BAR = 34;
export const boardOutline = (rows: number, sections = 1): Outline => {
  const b = OUTLINE.board(rows, sections);
  return { ...b, h: b.h + BOARD_BAR };
};

/** When a scene's aurora shows: while the person talks to their agent (from fn ⌃, or fn in a session, to the press
 *  that ends it), then as the progress bar while the words are transcribed; and what is said meanwhile. */
export type Aurora = { talk: Span; trans: Span; lines: readonly Line[] };

/** The aurora (aurora.ts) in the island's body, over what it holds (AgentEdgeLayer): it comes in as the person starts
 *  to talk, swells with the words, and while they're transcribed fills the edge from the leading side, then goes. */
function aurora(c: Ctx, o: Outline, x0: number, a: Aurora) {
  const [from, to] = a.talk, [, end] = a.trans;
  if (c.t < from || c.t >= end + 0.15) return;
  const f = auroraAt(a.lines, from, c.t, c.reduced);
  const w = o.w - 2 * o.tr, p = auroraParts(f, w, o.h);
  const fill = c.t < to ? 1 : seg(c.t, to, end);
  const px = (n: number) => `${n.toFixed(1)}px`;
  set(c, "au", {
    x: x0 + o.tr, w, h: o.h, o: Math.min(clamp((c.t - from) / 0.18), 1 - clamp((c.t - end) / 0.15)),
    clip: fill < 1 ? `inset(0 ${((1 - fill) * 100).toFixed(2)}% 0 0)` : undefined,
    v: { "--hue": `${f.drift.toFixed(2)}deg`, "--br": px(o.br), "--cx": px(p.ceiling.rx), "--cy": px(p.ceiling.ry), "--bx": px(p.bloomCeiling.rx), "--by": px(p.bloomCeiling.ry) },
  });
  set(c, "au:gi", { o: p.opacity.inner });
  set(c, "au:gb", { o: p.opacity.bloom });
  set(c, "au:gs", { o: p.opacity.stroke });
  const put = (k: string, e: Ellipse) => set(c, k, { x: e.x - e.rx, y: e.y - e.ry, w: 2 * e.rx, h: 2 * e.ry });
  p.inner.forEach((e, i) => put(`au:i${i}`, e));
  p.bloom.forEach((e, i) => put(`au:b${i}`, e));
  p.stroke.forEach((e, i) => put(`au:s${i}`, e));
  put("au:core", p.core);
}

/** The island at t: its outline, glass, ears and rim; each content slot in its own time; the waveform with the words;
 *  Transcribing's dots; the aurora while the person talks to their agent. Slots named "voice", "trans" and "band" take
 *  the voice bar's quicker entrance. */
function island(c: Ctx, keys: OutlineKey[], slots: Record<string, Span[]>, lines: readonly Line[], aur?: Aurora) {
  const o = outlineAt(keys, c.t);
  const x0 = STAGE.w / 2 - o.w / 2, g = glassAt(o.h);
  set(c, "is:glass", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h + 6, o: g, v: { "--br": `${o.br.toFixed(1)}px` } });
  set(c, "is:ears", { x: x0, w: o.w, h: o.tr + 1, o: g, d: earsPath(o) });
  set(c, "is:rim", { x: x0, w: o.w, h: o.h, o: g, d: rimPath(o) });
  set(c, "is:clip", { clip: `path("${pathAt(islandPath(o), x0)}")` });
  for (const [id, spans] of Object.entries(slots)) set(c, `is:${id}`, slotP(id === "band" ? "voice" : id, spans, c.t, c.reduced));
  // a board's working rings turn with the clock, given to the board shown alone (as the film does)
  for (const [id, spans] of Object.entries(slots)) if (id.startsWith("board") && live(spans, c.t)) set(c, `is:${id}`, { v: { "--t": c.t.toFixed(3) } });
  const voice = slots.voice ?? slots.band;
  if (voice && live(voice, c.t)) bars(level([...lines], c.t), c.t).forEach((h, i) => set(c, `vb:b${i}`, { h }));
  if (slots.trans && live(slots.trans, c.t)) set(c, "tr:dots", { st: String(Math.floor(c.t * 3) % 3) });
  if (aur) aurora(c, o, x0, aur);
  return o;
}

/** The keys a scene presses, each shown a moment before it goes down and held until the next (film.ts keys). */
type Press = [ScKey, number];
function keyCaps(c: Ctx, presses: Press[], hold = 1.9) {
  presses.forEach(([id, at], i) => {
    const next = presses[i + 1]?.[1] ?? Infinity;
    const o = window01(c.t, at - 0.35, Math.min(at + hold, next - 0.35), 0.2, 0.25);
    if (o > 0) set(c, `key:${id}`, { o, st: c.t >= at && c.t < at + 0.2 ? "down" : "up" });
  });
}

/** The words, as subtitles, each as it is said. */
function subtitles(c: Ctx, line: Line) {
  const o = lineOpacity(line, c.t);
  if (o <= 0) return;
  set(c, `sub:${line.id}`, { o });
  const n = shown(line, c.t);
  line.words.forEach((w, i) => set(c, `sw:${line.id}:${i}`, { o: i < n ? clamp((c.t - w.at) / 0.12) : 0 }));
}

/** The loop's seam: each scene comes up out of the dark and goes back into it. */
function dip(c: Ctx, len: number) {
  const o = Math.max(1 - ease.out(seg(c.t, 0, 0.5)), ease.inOut(seg(c.t, len - 0.5, len)));
  if (o > 0) set(c, "dip", { o });
}

const frameOf = (t: number, id: SceneId, reduced?: boolean): Ctx => ({ f: { t, chapter: 0, shot: id, aim: WIDE, k: {} } as Frame, t, reduced });

// ———————————————————————————— 1 · point: "Line this up with this one, like the spec."

/** Field Notes' trails page in the browser: three cards, the middle one's button sitting 16 pt low; the spec, a PDF on
 *  the desktop. Window-local except `file`. */
export const PT = {
  win: { x: 190, y: 72, w: 900, h: 600 },
  card: (i: number): Rect => ({ x: 36 + i * 286, y: 196, w: 256, h: 340 }),
  btn: { x: 20, y: 280, w: 150, h: 36 },
  low: 16,
  file: { x: 1214, y: 96, w: 64, h: 80 },
} as const;
/** A card's button on the screen (the middle one where it sits, low) and the region ⌘ takes round it. */
export const ptButton = (i: number, fixed = false): Rect => {
  const c = PT.card(i);
  return { x: PT.win.x + c.x + PT.btn.x, y: PT.win.y + c.y + PT.btn.y + (i === 1 && !fixed ? PT.low : 0), w: PT.btn.w, h: PT.btn.h };
};
export const PT_R1 = around(ptButton(1));
export const PT_R2 = around(ptButton(0));

export const PB = {
  fn: 0.9, say: 1.5,
  cmd1: 2.0, down1: 2.25, up1: 3.05, lift1: 3.45,
  cmd2: 4.45, down2: 4.7, up2: 5.45, lift2: 5.9,
  grab: 6.65, drag: [6.75, 7.7], well: 7.45, drop: 7.75,
  done: 8.75, choose: 9.95, ret: 11.6, step: 12.6, fix: [13.0, 13.5], fixed: 13.55, close: 14.8,
  len: 15.6, still: 10.6,
} as const;

/** What the person says: "this" as each region is let go, "the spec" as the file is dropped. */
export const POINT_LINE = speak("point", PB.say, "Line [this] up with [this one,] like [the spec.]", { 1: PB.up1, 4: PB.up2, 7: PB.drop });
/** Where Fovea sends it: the person's Codex, in the chat for this project; the others it suggests. */
export const POINT_CHAT = {
  agent: "codex", name: "Field Notes",
  chips: [{ agent: "codex", name: "Field Notes" }, { agent: "claude-code", name: "Studio Nord vase" }, { agent: "claude-code", name: "New chat" }],
} as const;

/** The spec's picture while it's dragged: its icon, a little smaller and see-through, held where it was grabbed. */
const SPEC_DRAG = { w: 52, h: 65, o: 0.82 };
const GRAB: Pt = { x: PT.file.x + 18, y: PT.file.y + 16 };
const DROP_AT: Pt = { x: 800, y: 54 };

const P_ISLAND: OutlineKey[] = [
  I(0, OUTLINE.rest, 0),
  I(PB.fn + press, OUTLINE.bar, SPRING.barOpen),
  I(PB.choose, OUTLINE.choose, SPRING.resize),
  I(PB.ret + press, boardOutline(2, 2), SPRING.resize),
  I(PB.close, OUTLINE.rest, SPRING.close),
];
export const P_SLOTS: Record<"voice" | "trans" | "choose" | "board", Span[]> = {
  voice: [[PB.fn + press, PB.done + press]],
  trans: [[PB.done + press, PB.choose, 0.3]],
  choose: [[PB.choose, PB.ret + press, 0.3]],
  board: [[PB.ret + press, PB.close, 0.24]],
};
/** The aurora under the bar from fn ⌃ to fn ⌃, then filling its edge while the words are transcribed. */
export const P_AURORA: Aurora = { talk: [PB.fn + press, PB.done + press], trans: [PB.done + press, PB.choose], lines: [POINT_LINE] };

function pointAt(t: number, opts: { reduced?: boolean } = {}): Frame {
  const c = frameOf(t, "point", opts.reduced), s = PB;
  island(c, P_ISLAND, P_SLOTS, [POINT_LINE], P_AURORA);
  keyCaps(c, [["fn", s.fn], ["cmd", s.cmd1], ["cmd", s.cmd2], ["fnDone", s.done], ["toCodex", s.ret]]);
  const r1 = PT_R1, r2 = PT_R2;
  const p = pointerAt({ x: 1000, y: 780 }, [
    { at: 1.1, to: { x: r1.x, y: r1.y }, dur: 0.75 },
    { at: s.down1, to: { x: r1.x + r1.w, y: r1.y + r1.h }, dur: s.up1 - s.down1 - 0.05, bend: 0.03 },
    { at: 3.55, to: { x: r2.x, y: r2.y }, dur: 0.75 },
    { at: s.down2, to: { x: r2.x + r2.w, y: r2.y + r2.h }, dur: s.up2 - s.down2 - 0.05, bend: 0.03 },
    { at: 5.65, to: GRAB, dur: 0.95 },
    { at: s.drag[0], to: DROP_AT, dur: s.drag[1] - s.drag[0] + 0.05, bend: 0.1 },
    { at: 8.2, to: { x: 1010, y: 560 }, dur: 0.7 },
  ], t);
  // ⌘ turns the pointer into the crosshair until its region is taken
  const cross = (t >= s.cmd1 + press && t < s.up1) || (t >= s.cmd2 + press && t < s.up2);
  pointer(c, p, cross ? "cross" : "arrow", window01(t, 0.5, 9.4, 0.3, 0.4));
  clickAt(c, s.grab, p);
  // each region follows the pointer, is held a moment once let go, then its picture lifts and flies
  for (const [r, down, up, lift] of [[r1, s.down1, s.up1, s.lift1], [r2, s.down2, s.up2, s.lift2]] as const) {
    if (t < down || t >= lift + 0.15) continue;
    const a = { x: r.x, y: r.y }, b = { x: r.x + r.w, y: r.y + r.h };
    const sel = dragRect(a, t < up ? p : b);
    set(c, "sel", { ...sel, o: t < lift ? 1 : 1 - seg(t, lift, lift + 0.15) });
  }
  // the spec: grabbed on the desktop and dragged onto the notch, which lights as a well; let go there, it flies in
  const off = { x: GRAB.x - PT.file.x - 2, y: GRAB.y - PT.file.y - 2 };
  const dropRect: Rect = { x: DROP_AT.x - off.x, y: DROP_AT.y - off.y, w: SPEC_DRAG.w, h: SPEC_DRAG.h };
  if (t >= s.grab + 0.08 && t < s.drop && !c.reduced) {
    set(c, "fl:drag", { x: p.x - off.x, y: p.y - off.y, w: SPEC_DRAG.w, h: SPEC_DRAG.h, o: SPEC_DRAG.o * ease.out(seg(t, s.grab + 0.08, s.grab + 0.2)), st: "spec" });
  } else if (t >= s.drop && t < s.drop + CAPTURE.flight + 0.05 && !c.reduced) {
    const r = lerpRect(dropRect, STACK[2], spring(seg(t, s.drop, s.drop + CAPTURE.flight)));
    set(c, "fl:drag", { x: r.x, y: r.y, w: r.w, h: r.h, o: mix(SPEC_DRAG.o, 1, seg(t, s.drop, s.drop + 0.2)), st: "spec", v: { "--rad": "6px" } });
  }
  stack(c, [{ kind: "low", at: s.lift1, from: r1 }, { kind: "ok", at: s.lift2, from: r2 }, { kind: "spec", at: s.drop, from: dropRect, own: true }]);
  const well = window01(t, s.well, s.drop + 0.15, 0.12, 0.15);
  if (well > 0) { set(c, "vb:drop", { o: well }); set(c, "vb:wave", { o: 1 - well }); }
  // Choose chat: the chat it belongs in is already picked, and lit a moment
  glow(c, "ch:glow", s.choose + 0.35);
  // the board: Codex reads what it was given, edits the card, and the button comes up into line
  set(c, "pt:row", { st: t < s.fixed ? "working" : "done" });
  set(c, "pt:steps", { st: t < s.step ? "0" : "1" });
  const up = c.reduced ? (t >= s.fix[1] ? 1 : 0) : ease.inOut(seg(t, s.fix[0], s.fix[1]));
  set(c, "pt:low", { y: PT.low * (1 - up) });
  glow(c, "pt:glow", s.fix[1]);
  const fast = window01(t, s.ret + press + 0.3, s.close - 0.2, 0.3, 0.3);
  if (fast > 0) set(c, "tag:fast", { o: fast });
  subtitles(c, POINT_LINE);
  dip(c, s.len);
  return c.f;
}

// ———————————————————————————— 2 · notch: a test run allowed, an answer opened, a follow-up by voice, the chat pulled out

export const NB = {
  open: 1.9, allow: 3.75, allowed: 3.9, click: 5.4,
  more: 7.6, say: 8.1, moreDone: 10.05, back: 11.25,
  grab: 12.55, pull: 12.8, drop: 14.3, rest: 16.9, answer: 17.3,
  len: 20.1, still: 15.6,
} as const;
/** The board's rows (Badges: Needs you, Done, Running) under its bar, and where its buttons are: rows from 76 pt, 46
 *  a row, 9 between sections; Run Tests at the row's right, 70 wide. */
const ROW = (i: number) => 42 + BOARD_BAR + i * 55 + 23;
export const N_RUN: Pt = { x: STAGE.w / 2 + 200 - 35 - 35, y: ROW(0) };
export const N_DONE: Pt = { x: 690, y: ROW(1) };
/** The session as it opens (V2ChatContent at its usual size, Oct 24): the header to 82 and its rule, the request in
 *  its bubble at the right, what the agent did (folded), the answer, Open …, the bar, the box, the grab bar. */
export const NP = { bubble: 95, worked: 140, lead: 172, quote: 199, open: 250, bar: 288, follow: 326, grab: 372, h: 388 } as const;
/** Asking more by voice: the band between the notch and the session (voiceBelow, 44 pt). */
export const N_BAND = 44;
/** Asked more: the session shows both exchanges, the new request in its bubble and the agent at work under it; the
 *  words leave the requests' outline a 30 pt gutter at the right (V2.outlineGutter). */
export const NQ = { bubble: 272, line: 317, bar: 357, follow: 395, grab: 441, h: 457, gutter: 30 } as const;
/** The chat pulled out (V2DetachedLayout): a window 340 × 468, its top held 18 pt over the pointer; it comes out once
 *  the grab bar is pulled 28 pt below the notch (V2.pullThreshold). Where the pointer takes the grab bar, and lets go. */
export const PULL = { w: 340, h: 468, grip: 18, threshold: 28 } as const;
export const N_GRAB: Pt = { x: STAGE.w / 2, y: NQ.grab + 8 };
export const N_DROP: Pt = { x: 1255, y: 270 };
export const pulledAt = (p: Pt): Rect => ({ x: p.x - PULL.w / 2, y: p.y - PULL.grip, w: PULL.w, h: PULL.h });

export const MORE_LINE = speak("more", NB.say, "Mention the snow banner too.");

const N_ISLAND: OutlineKey[] = [
  I(0, OUTLINE.rest, 0),
  I(NB.open, boardOutline(3, 3), SPRING.open),
  I(NB.click, OUTLINE.panel(NP.h), SPRING.resize),
  I(NB.more + press, OUTLINE.panel(NP.h + N_BAND), SPRING.resize),
  I(NB.back, OUTLINE.panel(NQ.h), SPRING.resize),
  I(NB.drop, boardOutline(3, 1), SPRING.resize),
  I(NB.rest, OUTLINE.rest, SPRING.close),
];
export const N_SLOTS: Record<"board" | "answer" | "band" | "board2", Span[]> = {
  board: [[NB.open, NB.click, 0.2]],
  answer: [[NB.click, NB.drop, 0.2]],
  band: [[NB.more + press, NB.back, 0.2]],
  board2: [[NB.drop, NB.rest, 0.24]],
};
/** Asking more by voice, the aurora at the session's foot (the island and the session are one shape: LOOK-13), from fn
 *  to fn, then filling that edge while the question is transcribed. */
export const N_AURORA: Aurora = { talk: [NB.more + press, NB.moreDone + press], trans: [NB.moreDone + press, NB.back], lines: [MORE_LINE] };

/** Where the pointer is in the notch scene: it rests on the notch (the board opens), allows the test run, opens what
 *  Codex finished, steps aside while the answer is read, then takes the grab bar, pulls the chat out and lets it go. */
const notchPointer = (t: number) => pointerAt({ x: 640, y: 560 }, [
  { at: 0.8, to: { x: 735, y: 16 }, dur: 0.85 },
  { at: 2.9, to: { x: N_RUN.x, y: N_RUN.y + 1 }, dur: 0.6 },
  { at: 4.55, to: N_DONE, dur: 0.55 },
  { at: 5.9, to: { x: 1110, y: 640 }, dur: 0.8 },
  { at: 11.65, to: N_GRAB, dur: 0.8 },
  { at: NB.grab + 0.05, to: { x: N_GRAB.x + 8, y: N_GRAB.y + 52 }, dur: 0.3, bend: 0 },
  { at: 12.95, to: N_DROP, dur: 1.25, bend: 0.08 },
  { at: 14.65, to: { x: 1190, y: 800 }, dur: 0.8 },
], t);

function notchAt(t: number, opts: { reduced?: boolean } = {}): Frame {
  const c = frameOf(t, "notch", opts.reduced), s = NB;
  island(c, N_ISLAND, N_SLOTS, [MORE_LINE], N_AURORA);
  keyCaps(c, [["more", s.more], ["moreDone", s.moreDone]]);
  const p = notchPointer(t);
  pointer(c, p, "arrow", window01(t, 0.5, 15.6, 0.3, 0.4));
  clickAt(c, s.allow, p);
  clickAt(c, s.click, p);
  // Run Tests: pressed, then the row is back at work, running them
  if (t >= s.allow && t < s.allow + 0.16) set(c, "nd:run", { st: "down" });
  set(c, "nd:a", { st: t < s.allowed ? "needs" : "working" });
  const hov = window01(t, 5.0, s.click + 0.2, 0.15, 0.15);
  if (hov > 0) set(c, "nd:bh", { o: hov });
  // asking more by voice: the band opens between the notch and the session, which moves down for it and back
  const into = c.reduced ? (t >= s.more + press && t < s.back ? 1 : 0)
    : t < s.back ? spring(seg(t, s.more + press, s.more + press + SPRING.resize)) : 1 - spring(seg(t, s.back, s.back + SPRING.resize));
  if (into > 0) set(c, "an:body", { y: N_BAND * into });
  const listening = t < s.moreDone + press;
  set(c, "bd:wave", { o: listening ? 1 : 1 - seg(t, s.moreDone + press, s.moreDone + press + 0.12) });
  set(c, "bd:trans", { o: listening ? 0 : ease.out(seg(t, s.moreDone + press, s.moreDone + press + 0.15)) });
  if (!listening && t < s.back) set(c, "tr:dots", { st: String(Math.floor(t * 3) % 3) });
  // the question goes in: both exchanges show, the agent at work under the new one, the words narrowed for the outline
  const q = c.reduced ? (t >= s.back ? 1 : 0) : spring(seg(t, s.back, s.back + SPRING.resize));
  set(c, "an:b1", { x: -NQ.gutter * q });
  set(c, "an:quote", { w: 590 - NQ.gutter * q });
  set(c, "an:open", { o: 1 - q });
  set(c, "an:q2", { o: c.reduced ? q : ease.out(seg(t, s.back + 0.08, s.back + 0.3)), v: { "--t": t.toFixed(3) } });
  set(c, "an:bar", { y: (NQ.bar - NP.bar) * q, st: t < s.back ? "done" : "working" });
  set(c, "an:follow", { y: (NQ.follow - NP.follow) * q });
  set(c, "an:grab", { y: (NQ.grab - NP.grab) * q });
  // pulled by its grab bar past 28 pt, the chat comes out as a window that follows the pointer, the session behind it
  // dimmed; let go, it stays where it was let go, and the notch shows the board a moment, then rests
  if (t >= s.pull && t < s.drop) set(c, "an:body", { o: 0.25 });
  if (t >= s.pull) {
    const r = pulledAt(t < s.drop ? p : N_DROP);
    const o = t < s.drop ? 0.92 * ease.out(seg(t, s.pull, s.pull + 0.15)) : mix(0.92, 1, seg(t, s.drop, s.drop + 0.15));
    set(c, "pw", { x: r.x, y: r.y });
    set(c, "pw:glass", { o });
    set(c, "pw:body", { o, v: { "--t": t.toFixed(3) } });
  }
  // in its window, the answer comes in where the agent was at work
  const a2 = c.reduced ? (t >= s.answer ? 1 : 0) : ease.out(seg(t, s.answer, s.answer + 0.3));
  set(c, "pw:a2", { o: a2 });
  set(c, "pw:line", { o: 1 - a2 });
  set(c, "pw:bar", { st: t < s.answer ? "working" : "done" });
  subtitles(c, MORE_LINE);
  dip(c, s.len);
  return c.f;
}

// ———————————————————————————— 3 · talk: Voiceflow, thinking out loud into an email

export const TB = {
  click: 1.3, vf: 1.9,
  cmd: 12.2, down: 13.0, up: 14.3, lift: 14.7, home: 15.0,
  done: 19.6, paste: 20.9, len: 25.9, still: 22.6,
} as const;

/** What's said, as a person thinks out loud: a list, an item taken back, another subject with a picture taken by ⌘
 *  ("this" as its region is let go), and one more item for the list, remembered last. */
export const TALK: Line[] = [
  speak("t1", 2.4, "For Friday we need the pricing page, the demo video, the press kit, and the FAQ."),
  speak("t2", 8.7, "Actually, drop the video, that's next week."),
  speak("t3", 11.6, "Also, the banner's cut off on mobile, [this.]", { 7: TB.up }),
  speak("t4", 15.6, "Oh, and one more for Friday: the launch email."),
];
/** What Fovea makes of it: "the demo video," taken back (struck as "drop the video," ends), "the launch email." put
 *  in the list it belongs to (marked as it's said). Word indices in their lines. */
export const TALK_DROP = { line: 0, words: [7, 8, 9], at: TALK[1].words[3].at } as const;
export const TALK_ADD = { line: 3, words: [6, 7, 8] } as const;
/** What Voiceflow types into the email: the list in order without the video, the launch email in it, the other subject
 *  after it, and what ⌘ took after the words (Oct 17, Ryan: "paste them after the words"). */
export const TALK_OUT = {
  lead: "For Friday we need:",
  list: ["The pricing page", "The press kit", "The FAQ", "The launch email"],
  also: "Also, the banner is cut off on mobile:",
} as const;

/** Mail, a new message to the launch team, the words' first line 140 pt into the window and 24 pt a line; the iPhone
 *  simulator beside it, the site's banner cut off at its right edge, and the region ⌘ takes: the banner, edge to edge. */
export const TK = {
  win: { x: 230, y: 92, w: 740, h: 540 },
  body: { x: 24, y: 140, line: 24 },
  shot: { w: 330, h: 70 },
  phone: { x: 1072, y: 106, w: 244, h: 508 },
  banner: { x: 1081, y: 163, w: 226, h: 36 },
} as const;
export const TK_REGION: Rect = { x: TK.banner.x, y: TK.banner.y - 6, w: TK.banner.w, h: TK.banner.h + 12 };
/** Where the cleaned words sit in the email (window-local tops): the lead, the four items, the other subject, the
 *  picture. */
export const TK_LINES = (() => {
  const { y, line } = TK.body;
  const list = TALK_OUT.list.map((_, i) => y + line * (i + 1));
  const also = y + line * 5 + 12;
  return { lead: y, list, also, shot: also + line + 8 };
})();

const T_ISLAND: OutlineKey[] = [
  I(0, OUTLINE.rest, 0),
  I(TB.vf + press, OUTLINE.bar, SPRING.barOpen),
  I(TB.paste, OUTLINE.rest, SPRING.barClose),
];
export const T_SLOTS: Record<"voice" | "trans", Span[]> = {
  voice: [[TB.vf + press, TB.done + press]],
  trans: [[TB.done + press, TB.paste, 0.2]],
};

/** Where the pointer is in the talk scene: a click in the email, hands off while talking, ⌘ and a drag round the
 *  banner, back over the email (the words land in the field under the pointer: IslandLive.findLanding), then aside. */
const talkPointer = (t: number) => {
  const r = TK_REGION;
  return pointerAt({ x: 980, y: 820 }, [
    { at: 0.5, to: { x: TK.win.x + 250, y: TK.win.y + 172 }, dur: 0.7 },
    { at: 12.25, to: { x: r.x, y: r.y }, dur: 0.7 },
    { at: TB.down, to: { x: r.x + r.w, y: r.y + r.h }, dur: TB.up - TB.down - 0.05, bend: 0.03 },
    { at: TB.home, to: { x: TK.win.x + 330, y: TK.win.y + 380 }, dur: 0.8 },
    { at: TB.paste + 0.9, to: { x: 1010, y: 720 }, dur: 0.8 },
  ], t);
};

/** The words as said, all of them, in a box under the screen: what's taken back struck through as it's taken back, the
 *  item remembered last marked as it's said. A word not yet said takes no room. */
function transcript(c: Ctx) {
  const t = c.t, first = TALK[0].start;
  if (t < first - 0.1) return;
  set(c, "tr:box", { o: clamp((t - first + 0.1) / 0.25) });
  TALK.forEach((line, li) => line.words.forEach((w, i) => {
    if (t < w.at) return;
    const struck = li === TALK_DROP.line && (TALK_DROP.words as readonly number[]).includes(i) && t >= TALK_DROP.at;
    const added = li === TALK_ADD.line && (TALK_ADD.words as readonly number[]).includes(i);
    set(c, `sw:${line.id}:${i}`, { o: clamp((t - w.at) / 0.12), st: struck ? "x" : added ? "add" : "said" });
  }));
}

function talkAt(t: number, opts: { reduced?: boolean } = {}): Frame {
  const c = frameOf(t, "talk", opts.reduced), s = TB;
  island(c, T_ISLAND, T_SLOTS, TALK);
  keyCaps(c, [["vf", s.vf], ["cmd", s.cmd], ["vfDone", s.done]]);
  const p = talkPointer(t), r = TK_REGION;
  const cross = t >= s.cmd + press && t < s.up;
  const overMail = (t >= 1.0 && t < 12.25) || (t >= s.home + 0.55 && t < s.paste + 0.95);
  pointer(c, p, cross ? "cross" : overMail ? "ibeam" : "arrow", window01(t, 0.3, s.len - 0.8, 0.3, 0.4));
  clickAt(c, s.click, p);
  // ⌘: the region follows the pointer, is held a moment once let go, then its picture lifts and flies into the bar
  if (t >= s.down && t < s.lift + 0.15) {
    const sel = dragRect({ x: r.x, y: r.y }, t < s.up ? p : { x: r.x + r.w, y: r.y + r.h });
    set(c, "sel", { ...sel, o: t < s.lift ? 1 : 1 - seg(t, s.lift, s.lift + 0.15) });
  }
  stack(c, [{ kind: "banner", at: s.lift, from: r }]);
  // the caret where the words will go; once transcribed, the words, then the picture, into the email; the field they
  // went to lit a moment (IslandModel+Live markLanding)
  const blink = (from: number) => (Math.floor((t - from) / 0.53) % 2 === 0 ? 1 : 0);
  if (t >= s.click && t < s.paste) set(c, "tk:caret0", { o: blink(s.click) });
  set(c, "tk:text", { o: c.reduced ? (t >= s.paste ? 1 : 0) : ease.out(seg(t, s.paste, s.paste + 0.12)) });
  set(c, "tk:shot", { o: c.reduced ? (t >= s.paste ? 1 : 0) : ease.out(seg(t, s.paste + 0.15, s.paste + 0.3)) });
  if (t >= s.paste + 0.3) set(c, "tk:caret1", { o: blink(s.paste + 0.3) });
  const land = window01(t, s.paste, s.paste + 1.0, 0.08, 0.5);
  if (land > 0) set(c, "tk:land", { o: land });
  transcript(c);
  dip(c, s.len);
  return c.f;
}

/** The three scenes: how long each loop is, the moment that stands for it under Reduce Motion, and the scene at t. */
export const SCENES: Record<SceneId, { len: number; still: number; at: (t: number, opts?: { reduced?: boolean }) => Frame }> = {
  point: { len: PB.len, still: PB.still, at: pointAt },
  notch: { len: NB.len, still: NB.still, at: notchAt },
  talk: { len: TB.len, still: TB.still, at: talkAt },
};
/** Where a scene rests before it first plays: the desk, the notch at rest, the dark gone. */
export const REST = 0.6;
/** Where the pointer is in a scene at t, for the tests. */
export const pointerOf = { notch: notchPointer, talk: talkPointer } as const;
