// The showcase after the film (Oct 24, Yulun: "an animation of a real person using Fovea on their Mac", set out the way
// Dia's site shows its features; round two the same evening: the Mac in dark mode, the whole screen in every frame so
// the notch is the size it is on a real Mac). Three short scenes, each one thing Fovea does today, with the notch as
// FoveaV1 draws it since Oct 28 (notch.ts: Wings, the Halo, the Sentence, one board, a session popping up by itself):
// - point: ⌘ and a drag over a button that sits low, again over one that's right, a spec dragged to the notch's drop
//   zone, one sentence, and it goes to the person's own Codex, which lines the button up; they never leave the browser;
// - notch: Claude Code's chat pops up from the notch asking to run the tests, and is allowed in place; Codex's chat
//   pops up done; a follow-up is asked by voice over it; the chat is pulled out of the notch by its grab bar into a
//   window of its own, where the answer comes in, while the board shows every session at work;
// - talk: Voiceflow as a person thinks out loud: a list, an item taken back, another subject with a picture taken by ⌘,
//   a last item remembered; fn again, and the email reads as the list in order, the picture after the words.
// Each loops: out of the dark, the one thing done, back into the dark. Pure: the scene at t. components/book/showcase
// plays them.

import { clamp, ease, mix, seg, spring, window01 } from "./ease";
import { outlineAt, type OutlineKey } from "./island";
import { lineOpacity, shown, speak, type Line } from "./speech";
import { CAPTURE, SPRING, STAGE, type Outline } from "./tokens";
import { WIDE, clickAt, glow, lerpRect, live, pointer, press, set, type Ctx, type Frame, type Span } from "./film";
import { dragRect, pointerAt, type Pt } from "./pointer";
import { DROP_ZONE, NOUT, PANEL_TOP, SIDE, barAt, bodyOf, boardH, dropZone, notch, pileSlot, pileW, sentenceH, wings } from "./notch";
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
/** An island's outline at t (for the tests). */
const notchOutline = (keys: OutlineKey[], t: number) => outlineAt(keys, t);

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

/** A capture's flight from where it was taken into its place in the bar's pile (the film's 0.6 s; the app's spring). */
function flight(c: Ctx, key: string, kind: string, from: Rect, start: number, slot: Rect) {
  if (c.t < start || c.t > start + CAPTURE.flight + 0.05 || c.reduced) return;
  const p = spring(seg(c.t, start, start + CAPTURE.flight));
  const r = lerpRect(from, slot, p);
  // it lifts off what it was taken from: the picture comes up over the first quarter of the flight
  set(c, key, { x: r.x, y: r.y, w: r.w, h: r.h, o: clamp(p * 4), st: kind, v: { "--rad": `${mix(4, 4.5, p).toFixed(2)}px` } });
}

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
  grab: 6.65, drag: [6.75, 7.7], near: 7.3, drop: 7.75,
  done: 8.75, choose: 9.95, ret: 11.6, step: 12.6, fix: [13.0, 13.5], fixed: 13.55, close: 14.8,
  len: 15.6, still: 10.6,
} as const;

/** What the person says: "this" as each region is let go, "the spec" as the file is dropped. */
export const POINT_LINE = speak("point", PB.say, "Line [this] up with [this one,] like [the spec.]", { 1: PB.up1, 4: PB.up2, 7: PB.drop });
/** Where Fovea sends it: the person's Codex, in the chat for this project. */
export const POINT_CHAT = { agent: "codex", name: "Field Notes" } as const;

/** The spec's picture while it's dragged: its icon, a little smaller and see-through, held where it was grabbed. */
const SPEC_DRAG = { w: 52, h: 65, o: 0.82 };
const GRAB: Pt = { x: PT.file.x + 18, y: PT.file.y + 16 };
/** Where it's let go: over the drop zone that opened under the bar. */
export const DROP_AT: Pt = { x: DROP_ZONE.x + DROP_ZONE.w / 2 + 30, y: DROP_ZONE.y + DROP_ZONE.h / 2 };

/** When each capture lands in the bar's pile, and so the bar's left becomes the pile, a card at a time. */
export const P_LANDS = [PB.lift1, PB.lift2, PB.drop].map((a) => a + CAPTURE.flight);
const P_ISLAND: OutlineKey[] = [
  I(0, NOUT.rest, 0),
  I(PB.fn + press, NOUT.wings(SIDE.listen), SPRING.barOpen),
  ...P_LANDS.map((at, i) => I(at, NOUT.wings(pileW(i + 1)), SPRING.resize)),
  I(PB.done + press, NOUT.wings(SIDE.trans, SIDE.ring), SPRING.resize),
  I(PB.choose, NOUT.panel(sentenceH(1)), SPRING.open),
  I(PB.ret + press, NOUT.board(boardH(2, 2)), SPRING.resize),
  I(PB.close, NOUT.rest, SPRING.close),
];
/** The bar: listening from fn ⌃ to fn ⌃, then its words transcribed until Choose chat; the panels under the notch. */
export const P_VOICE: Span[] = [[PB.fn + press, PB.done + press]];
export const P_TRANS: Span[] = [[PB.done + press, PB.choose, 0.2]];
export const P_SLOTS: Record<"sent" | "board", Span[]> = {
  sent: [[PB.choose, PB.ret + press, 0.3]],
  board: [[PB.ret + press, PB.close, 0.24]],
};
export const pointOutline = (t: number) => notchOutline(P_ISLAND, t);

function pointAt(t: number, opts: { reduced?: boolean } = {}): Frame {
  const c = frameOf(t, "point", opts.reduced), s = PB;
  const o = notch(c, P_ISLAND, P_SLOTS), body = bodyOf(o);
  wings(c, "wb", body, barAt(t, P_VOICE, P_TRANS, [POINT_LINE], { pileAt: P_LANDS[0], reduced: c.reduced }));
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
  // the spec: grabbed on the desktop and dragged to the notch, where the drop zone opens under the bar and lights as
  // it comes over it; let go there, it flies into the pile
  const off = { x: GRAB.x - PT.file.x - 2, y: GRAB.y - PT.file.y - 2 };
  const dropRect: Rect = { x: DROP_AT.x - off.x, y: DROP_AT.y - off.y, w: SPEC_DRAG.w, h: SPEC_DRAG.h };
  if (t >= s.grab + 0.08 && t < s.drop && !c.reduced) {
    set(c, "fl:drag", { x: p.x - off.x, y: p.y - off.y, w: SPEC_DRAG.w, h: SPEC_DRAG.h, o: SPEC_DRAG.o * ease.out(seg(t, s.grab + 0.08, s.grab + 0.2)), st: "spec" });
  } else if (t >= s.drop && t < s.drop + CAPTURE.flight + 0.05 && !c.reduced) {
    const r = lerpRect(dropRect, pileSlot(2, body), spring(seg(t, s.drop, s.drop + CAPTURE.flight)));
    set(c, "fl:drag", { x: r.x, y: r.y, w: r.w, h: r.h, o: mix(SPEC_DRAG.o, 1, seg(t, s.drop, s.drop + 0.2)), st: "spec", v: { "--rad": "4.5px" } });
  }
  dropZone(c, window01(t, s.near, s.drop + 0.12, 0.15, 0.12), t >= s.drag[1] - 0.2 && t < s.drop + 0.12);
  flight(c, "fl:0", "low", r1, s.lift1, pileSlot(0, body));
  flight(c, "fl:1", "ok", r2, s.lift2, pileSlot(1, body));
  P_LANDS.forEach((at, i) => { if (t >= at) set(c, `wb:c${i}`, { o: i === 0 ? 1 : 0.6, st: ["low", "ok", "spec"][i] }); });
  // Choose chat: the chat it belongs in is already picked, and lit a moment; Send goes down with Return
  glow(c, "ch:glow", s.choose + 0.35);
  if (t >= s.ret && t < s.ret + press) set(c, "is:sent:send", { st: "down" });
  // the board: Codex reads what it was given, edits the card, and the button comes up into line
  if (live(P_SLOTS.board, t)) set(c, "is:board", { v: { "--t": t.toFixed(3) } });
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

// ———————————————————————————— 2 · notch: a chat pops up asking, then one done; a follow-up by voice; pulled out

export const NB = {
  ask: 1.4, allow: 3.55, allowed: 3.7, gone: 4.9,
  done: 5.7, more: 7.6, say: 8.1, moreDone: 10.05, back: 11.25,
  grab: 12.55, pull: 12.8, drop: 14.3, rest: 16.9, answer: 17.3,
  len: 20.1, still: 15.6,
} as const;
/** A session (V2ChatContent, Compact; tops from the island's top): the header to 83.5 and its rule; the request in its
 *  bubble at the right; then, asking (it needs you): the question in amber, what it runs, what it changes, Allow's
 *  choices, the bar with Deny and the action's own verb; done: what the agent did, the answer and its draft, Open …,
 *  the bar. "Ask a follow-up" and the grab bar under them. */
export const NA = { bubble: 93.5, q: 132, kv: [156, 176, 196], bar: 224, follow: 255, grab: 294, h: 302.5 } as const;
export const NP = { bubble: 93.5, worked: 132, lead: 158, quote: 180, open: 222.5, bar: 251, follow: 282, grab: 321.5, h: 329.5 } as const;
/** Asked more: both exchanges, the new request in its bubble and the agent at work under it, the words leaving the
 *  requests' outline a 22 pt gutter at the right (railGutter). */
export const NQ = { bubble: 228.5, line: 265, bar: 295, follow: 326, grab: 365.5, h: 373.5, gutter: 22 } as const;
/** Run Tests, where the pointer allows the run: the bar's right, its last button. */
export const N_RUN: Pt = { x: STAGE.w / 2 + 258 - 32 - 30, y: NA.bar + 11 };
/** The chat pulled out (V2DetachedLayout, Compact: 313 × 431), its top held 18 pt over the pointer; it comes out once
 *  the grab bar is pulled 28 pt below the notch (V2.pullThreshold). Where the pointer takes the grab bar, and lets go. */
export const PULL = { w: 313, h: 431, grip: 18, threshold: 28 } as const;
export const N_GRAB: Pt = { x: STAGE.w / 2, y: NQ.grab + 2.5 };
export const N_DROP: Pt = { x: 1255, y: 270 };
export const pulledAt = (p: Pt): Rect => ({ x: p.x - PULL.w / 2, y: p.y - PULL.grip, w: PULL.w, h: PULL.h });

export const MORE_LINE = speak("more", NB.say, "Mention the snow banner too.");

const N_ISLAND: OutlineKey[] = [
  I(0, NOUT.rest, 0),
  I(NB.ask, NOUT.panel(NA.h), SPRING.open),
  I(NB.gone, NOUT.rest, SPRING.close),
  I(NB.done, NOUT.panel(NP.h), SPRING.open),
  I(NB.back, NOUT.panel(NQ.h), SPRING.resize),
  I(NB.drop, NOUT.board(boardH(2)), SPRING.resize),
  I(NB.rest, NOUT.rest, SPRING.close),
];
export const N_SLOTS: Record<"asks" | "answer" | "board2", Span[]> = {
  asks: [[NB.ask, NB.gone, 0.2]],
  answer: [[NB.done, NB.drop, 0.2]],
  board2: [[NB.drop, NB.rest, 0.24]],
};
/** Asking more over the session: Wings on its glass beside the notch, listening from fn to fn, then transcribing. */
export const N_VOICE: Span[] = [[NB.more + press, NB.moreDone + press]];
export const N_TRANS: Span[] = [[NB.moreDone + press, NB.back, 0.2]];
export const notchSceneOutline = (t: number) => notchOutline(N_ISLAND, t);

/** Where the pointer is in the notch scene: it goes to Run Tests as the chat asks, allows the run, steps aside while the
 *  answer is read and the follow-up asked, then takes the grab bar, pulls the chat out and lets it go. */
const notchPointer = (t: number) => pointerAt({ x: 640, y: 560 }, [
  { at: 2.6, to: { x: N_RUN.x, y: N_RUN.y + 1 }, dur: 0.75 },
  { at: 4.2, to: { x: 1110, y: 640 }, dur: 0.8 },
  { at: 11.65, to: N_GRAB, dur: 0.8 },
  { at: NB.grab + 0.05, to: { x: N_GRAB.x + 8, y: N_GRAB.y + 52 }, dur: 0.3, bend: 0 },
  { at: 12.95, to: N_DROP, dur: 1.25, bend: 0.08 },
  { at: 14.65, to: { x: 1190, y: 800 }, dur: 0.8 },
], t);

function notchAt(t: number, opts: { reduced?: boolean } = {}): Frame {
  const c = frameOf(t, "notch", opts.reduced), s = NB;
  notch(c, N_ISLAND, N_SLOTS);
  // asking more: Wings drawn black on the session's glass, beside the notch, its body as wide as listening needs
  const over = t < s.moreDone + press ? NOUT.wings(SIDE.listen) : NOUT.wings(SIDE.trans, SIDE.ring);
  wings(c, "wo", bodyOf(over), barAt(t, N_VOICE, N_TRANS, [MORE_LINE], { reduced: c.reduced }));
  keyCaps(c, [["more", s.more], ["moreDone", s.moreDone]]);
  const p = notchPointer(t);
  pointer(c, p, "arrow", window01(t, 0.5, 15.6, 0.3, 0.4));
  clickAt(c, s.allow, p);
  // Run Tests: pressed; allowed, the chat is back at work and goes a moment later
  if (t >= s.allow && t < s.allow + 0.16) set(c, "na:run", { st: "down" });
  set(c, "na:body", { st: t < s.allowed ? "needs" : "working", v: { "--t": t.toFixed(3) } });
  // the question goes in: both exchanges show, the agent at work under the new one, the words narrowed for the outline
  const q = c.reduced ? (t >= s.back ? 1 : 0) : spring(seg(t, s.back, s.back + SPRING.resize));
  set(c, "an:b1", { x: -NQ.gutter * q });
  set(c, "an:quote", { w: 452 - NQ.gutter * q });
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
  if (live(N_SLOTS.board2, t)) set(c, "is:board2", { v: { "--t": t.toFixed(3) } });
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

const T_LAND = TB.lift + CAPTURE.flight;
const T_ISLAND: OutlineKey[] = [
  I(0, NOUT.rest, 0),
  I(TB.vf + press, NOUT.wings(SIDE.listen), SPRING.barOpen),
  I(T_LAND, NOUT.wings(pileW(1)), SPRING.resize),
  I(TB.done + press, NOUT.wings(SIDE.think, SIDE.ring), SPRING.resize),
  I(TB.paste, NOUT.rest, SPRING.barClose),
];
/** Voiceflow's bar: listening from fn to fn, then "Thinking" while the words are cleaned up, until they land. */
export const T_VOICE: Span[] = [[TB.vf + press, TB.done + press]];
export const T_TRANS: Span[] = [[TB.done + press, TB.paste, 0.2]];
export const talkOutline = (t: number) => notchOutline(T_ISLAND, t);

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
  const o = notch(c, T_ISLAND, {}), body = bodyOf(o);
  wings(c, "wb", body, barAt(t, T_VOICE, T_TRANS, TALK, { think: true, pileAt: T_LAND, reduced: c.reduced }));
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
  flight(c, "fl:0", "banner", r, s.lift, pileSlot(0, body));
  if (t >= T_LAND) set(c, "wb:c0", { o: 1, st: "banner" });
  // the caret where the words will go; once cleaned up, the words, then the picture, into the email; the field they
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
/** Where the panels' content starts (for the scenes' markup). */
export { PANEL_TOP };
