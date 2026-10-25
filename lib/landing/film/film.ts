// The film, as a function of time: evaluate(t) says what every part of the picture is doing at t. Shots are short
// functions over their own time; springs, cross-fades, flights, saccades and typing are all worked out from time, so
// playing and seeking show exactly the same frame (nothing is left to CSS transitions). The picture
// (components/book/film) draws the parts named here and applies each frame. The script, shot by shot: landing/README.md.
// The island behaves as Fovea 1.0 does (FoveaV1 DispatchV2.swift, Capture.swift, KeyMonitors.swift; FoveaKeys and the
// first run since Oct 17-18), its keys as Yulun set them for the site on Oct 18: fn ⌃ toggles the voice bar, ⌘ once
// takes the area selected (a press, then a drag), ⌘ twice the whole screen; words need no key (selected, they're
// taken) and a file is dragged onto the notch,
// fn ⌃ again transcribes (1.4 s), Choose chat waits for Return, the board holds 3 s after Send, an answer back within
// 8 s opens by itself, and slower work waits on the board until the notch is visited. The camera keeps the whole
// screen, and leans in only to do or read something small (Oct 17). Pure.

import { clamp, ease, mix, seg, spring, step, track, window01, type Key } from "./ease";
import { noise } from "./noise";
import { bars, islandPath, outlineAt, rimPath, type OutlineKey } from "./island";
import { level, lineOpacity, shown } from "./speech";
import type { Aim } from "./camera";
import { AGENT_ROW, BEATS, BOARDS, CHAPTERS, DAY, DRAFT, IN, LINES, PANEL, POS, REFS, T, WIN, at, rowsOf, type KeyId, type Rect } from "./content";
import { dragRect, pointerAt, type Pt } from "./pointer";
import { CAPTURE, NOTCH, OUTLINE, RING, SPRING, STAGE, glassAt, type Outline } from "./tokens";

/** What one part of the picture is doing. x/y/s/r/sx/sy make its transform; o its opacity; w/h its size; st its
 *  data-state; text its words; clip its clip-path; d an SVG path; v CSS variables. */
export type P = {
  o?: number; x?: number; y?: number; s?: number; sx?: number; sy?: number; r?: number; w?: number; h?: number; z?: number;
  text?: string; st?: string; clip?: string; d?: string; blur?: number; v?: Record<string, string | number>;
};
export type Frame = { t: number; chapter: number; shot: string; aim: Aim; k: Record<string, P> };
export type Options = { reduced?: boolean };

export const WIDE: Aim = { cx: STAGE.w / 2, cy: STAGE.h / 2, z: 1, minW: 600, minH: 400 };
const aim = (cx: number, cy: number, z: number, minW = 640, minH = 420): Aim => ({ cx, cy, z, minW, minH });
type AimKey = Key<number[]>;
const aimKey = (at: number, a: Aim, curve = ease.sine): AimKey => ({ at, v: [a.cx, a.cy, a.z, a.minW, a.minH], ease: curve });
const aimOf = (keys: AimKey[], t: number, reduced?: boolean): Aim => {
  const v = reduced ? step(keys.map((k) => ({ at: k.at, v: k.v })), t).v : track(keys, t);
  return { cx: v[0], cy: v[1], z: v[2], minW: v[3], minH: v[4] };
};
const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), w: mix(a.w, b.w, p), h: mix(a.h, b.h, p) });

/** Where the camera leans in, each only while something small is done or read (1.3–1.45×, never more). */
const SHOT = {
  /** the notch, the reference board and the Studio Nord folder: the first two captures land in view */
  caps: aim(905, 368, 1.3, 1050, 680),
  /** Dana's brief, in Mail */
  brief: aim(760, 720, 1.45, 900, 600),
  /** Choose chat, and the panels under the notch */
  isl: aim(735, 230, 1.4, 900, 520),
  panel: aim(735, 290, 1.4, 900, 560),
  /** the reply, in Mail */
  mail: aim(1150, 800, 1.4, 900, 560),
} as const;

const S = BEATS;
export const press = 0.2; // a key acts when it is let go (KeyMonitors.swift): the island answers a moment after its cap

/** The bar's stack (DSP-01): the first capture in front, 14 pt in; two more peek out behind, their right edges 5 pt
 *  further each, 92 % and 84 % the size (REFERENT_STACK.md). */
const BAR_LEFT = STAGE.w / 2 - OUTLINE.bar.w / 2;
export const STACK: Rect[] = [
  { x: BAR_LEFT + 14, y: 40, w: 40, h: 28 },
  { x: BAR_LEFT + 14 + 40 + 5 - 36.8, y: 41.1, w: 36.8, h: 25.8 },
  { x: BAR_LEFT + 14 + 40 + 10 - 33.6, y: 42.2, w: 33.6, h: 23.5 },
];
/** Where the waveform sits as the stack fills (ReferentStack.swift waveX): centred, then 86 / 88.5 / 91 pt in. */
export const WAVE_X = [62, 86, 88.5, 91];
/** A whole-screen capture lifts from the screen inset 40 pt (WorkbenchModel+Attach.swift). */
export const SCREEN: Rect = { x: CAPTURE.screenInset, y: CAPTURE.screenInset, w: STAGE.w - 2 * CAPTURE.screenInset, h: STAGE.h - 2 * CAPTURE.screenInset };

// ———————————————————————————— the island, over the whole film
const I = (at: number, to: Outline, dur: number): OutlineKey => ({ at, to, dur });
const BOARD = (id: string) => OUTLINE.board(rowsOf(BOARDS[id]), BOARDS[id].sections.length);
const B1 = S.B1, B2 = S.B2, SC = S.C;
const ISLAND: OutlineKey[] = [
  I(0, OUTLINE.rest, 0),
  I(T.B1 + B1.fn + press, OUTLINE.bar, SPRING.barOpen),
  I(T.B1 + B1.choose, OUTLINE.choose, SPRING.resize),
  I(T.B1 + B1.board, BOARD("b1"), SPRING.resize),
  I(T.B1 + B1.rest, OUTLINE.rest, SPRING.close),
  // minutes later the work is done: the pointer rests on the notch, the board opens, its row opens the session
  I(T.B1 + B1.hover, BOARD("b1d"), SPRING.open),
  I(T.B1 + B1.click, OUTLINE.panel(PANEL.b1.h), SPRING.resize),
  I(T.B1 + B1.esc + press, OUTLINE.rest, SPRING.close),
  I(T.B2 + B2.fn + press, OUTLINE.bar, SPRING.barOpen),
  I(T.B2 + B2.choose, OUTLINE.choose, SPRING.resize),
  I(T.B2 + B2.board, BOARD("b2"), SPRING.resize),
  I(T.B2 + B2.rest, OUTLINE.rest, SPRING.close),
  // the draft came back within 8 s of Send, so it opens by itself
  I(T.B2 + B2.answer, OUTLINE.panel(PANEL.b2.h), SPRING.open),
  I(T.B2 + B2.esc + press, OUTLINE.rest, SPRING.close),
  I(T.C1 + SC.fn + press, OUTLINE.bar, SPRING.barOpen),
  I(T.C1 + SC.choose, OUTLINE.chooseBare, SPRING.resize),
  I(T.C1 + SC.send, BOARD("c2a"), SPRING.resize),
  I(T.D0, OUTLINE.rest, 0),
];

/** When each of the island's contents shows: [from, to) in film seconds, and how fast it leaves (it rides the
 *  outline's next spring). */
export type Span = [number, number, number?];
const SLOTS: Record<string, Span[]> = {
  voice: [[T.B1 + B1.fn + press, T.B1 + B1.done + press], [T.B2 + B2.fn + press, T.B2 + B2.done + press], [T.C1 + SC.fn + press, T.C1 + SC.done + press]],
  trans: [[T.B1 + B1.done + press, T.B1 + B1.choose, 0.3], [T.B2 + B2.done + press, T.B2 + B2.choose, 0.3], [T.C1 + SC.done + press, T.C1 + SC.choose, 0.3]],
  "choose:b1": [[T.B1 + B1.choose, T.B1 + B1.board, 0.3]],
  "choose:b2": [[T.B2 + B2.choose, T.B2 + B2.board, 0.3]],
  "choose:c2": [[T.C1 + SC.choose, T.C1 + SC.send, 0.3]],
  "board:b1": [[T.B1 + B1.board, T.B1 + B1.rest, 0.24]],
  "board:b1d": [[T.B1 + B1.hover, T.B1 + B1.click, 0.2]],
  "answer:b1": [[T.B1 + B1.click, T.B1 + B1.esc + press, 0.24]],
  "board:b2": [[T.B2 + B2.board, T.B2 + B2.rest, 0.24]],
  "answer:b2": [[T.B2 + B2.answer, T.B2 + B2.esc + press, 0.24]],
  "board:c2a": [[T.C1 + SC.send, T.D0, 0.3]],
};

/** A content slot comes in after its outline starts (a panel's 0.08 s then 0.2 s; the voice bar's 0.02 s then 0.1 s),
 *  from 4 pt of blur at 97 %, anchored at the top; it leaves on its outline's next spring. */
export function slotP(id: string, spans: Span[], t: number, reduced?: boolean): P {
  const bar = id === "voice" || id === "trans";
  const delay = bar ? SPRING.barContentDelay : SPRING.contentDelay, dur = bar ? SPRING.barContent : SPRING.content;
  for (const [a, b, out = 0.15] of spans) {
    if (t < a || t >= b + out) continue;
    const pin = ease.out(seg(t, a + delay, a + delay + dur));
    const pout = 1 - ease.out(seg(t, b, b + out));
    const o = Math.min(pin, pout);
    if (reduced) return { o };
    return { o, s: mix(0.97, 1, pin), blur: mix(4, 0, pin) };
  }
  return { o: 0 };
}
export const live = (spans: Span[], t: number) => spans.find(([a, b]) => t >= a && t < b);

// ———————————————————————————— helpers that write into a frame
export type Ctx = { f: Frame; t: number; reduced?: boolean };
export const set = (c: Ctx, key: string, p: P) => { c.f.k[key] = { ...(c.f.k[key] ?? {}), ...p }; };
const win = (c: Ctx, id: keyof typeof WIN, pos: { x: number; y: number }, o = 1, z = 1, s = 1) => set(c, `w:${id}`, { x: pos.x, y: pos.y, o, z, s });
/** The keys a shot presses, in order, each at the moment it goes down (film seconds); a third number is a second
 *  press of the same cap (⌘ ⌘). A cap shows a moment before its press, goes down as it is pressed, and stays until
 *  the next cap comes or `hold` runs out: long enough to read. */
export type Press = [KeyId, number, number?];
export function keys(c: Ctx, presses: Press[], hold = 1.9) {
  presses.forEach(([id, at, again], i) => {
    const next = presses[i + 1]?.[1] ?? Infinity;
    const end = Math.min((again ?? at) + hold, next - 0.35);
    const o = window01(c.t, at - 0.35, end, 0.2, 0.25);
    const down = (c.t >= at && c.t < at + 0.2) || (again !== undefined && c.t >= again && c.t < again + 0.2);
    if (o > 0) set(c, `key:${id}`, { o, st: down ? "down" : "up" });
  });
}
/** A click, made visible: a small ring that opens where the pointer pressed. */
export function clickAt(c: Ctx, at: number, p: Pt) {
  if (c.t < at || c.t > at + 0.45) return;
  const q = seg(c.t, at, at + 0.45);
  set(c, "click", { x: p.x, y: p.y, s: mix(0.5, 1.25, ease.out(q)), o: 1 - q });
}
export const caption = (c: Ctx, id: string, a: number, b: number) => { const o = window01(c.t, a, b, 0.4, 0.4); if (o > 0) set(c, `cap:${id}`, { o }); };
export const pointer = (c: Ctx, p: Pt, kind: string, o = 1) => { if (o > 0) set(c, "cursor", { x: p.x, y: p.y, o, st: kind }); };
export const glow = (c: Ctx, key: string, a: number) => { const o = window01(c.t, a, a + 1.1, 0.35, 0.6); if (o > 0) set(c, key, { o }); };

/** A capture's flight from where it was taken into its place in the stack (the film's 0.6 s; the app's spring). */
export function flight(c: Ctx, key: string, kind: string, from: Rect, start: number, slot: number) {
  if (c.t < start || c.t > start + CAPTURE.flight + 0.05 || c.reduced) return;
  const p = spring(seg(c.t, start, start + CAPTURE.flight));
  const r = lerpRect(from, STACK[slot], p);
  // it lifts off what it was taken from: the picture comes up over the first quarter of the flight
  set(c, key, { x: r.x, y: r.y, w: r.w, h: r.h, o: clamp(p * 4), st: kind, v: { "--rad": `${mix(4, 6, p).toFixed(2)}px` } });
}

/** The stack in the bar, the waveform making room for it, and the flights that fill it (`own`: the shot flies it). */
export function stack(c: Ctx, items: { kind: string; at: number; from: Rect; own?: boolean }[]) {
  let n = 0, waveFrom = WAVE_X[0], waveAt = -1;
  items.forEach((it, i) => {
    if (!it.own) flight(c, `fl:${i}`, it.kind, it.from, it.at, i);
    if (c.t >= it.at) { waveFrom = WAVE_X[n]; n++; waveAt = it.at; }
    if (c.t >= it.at + CAPTURE.flight) set(c, `vb:t${i}`, { o: i === 0 ? 1 : 0.6, st: it.kind });
  });
  const x = waveAt < 0 ? WAVE_X[0] : mix(waveFrom, WAVE_X[Math.min(n, 3)], c.reduced ? 1 : spring(seg(c.t, waveAt, waveAt + SPRING.wave)));
  set(c, "vb:wave", { x: x - WAVE_X[0] });
}

function island(c: Ctx) {
  const o = outlineAt(ISLAND, c.t);
  const x0 = STAGE.w / 2 - o.w / 2;
  const g = glassAt(o.h);
  const path = islandPath(o);
  // the glass is the body (a backdrop blur is not clipped by a path); the two small ears are drawn apart
  set(c, "is:glass", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h + 6, o: g, v: { "--br": `${o.br.toFixed(1)}px` } });
  set(c, "is:ears", { x: x0, w: o.w, h: o.tr + 1, o: g, d: earsPath(o) });
  set(c, "is:rim", { x: x0, w: o.w, h: o.h, o: g, d: rimPath(o) });
  set(c, "is:clip", { clip: `path("${pathAt(path, x0)}")` });
  for (const [id, spans] of Object.entries(SLOTS)) set(c, `is:${id}`, slotP(id, spans, c.t, c.reduced));
  // a board's working ring turns with the clock: the clock goes to the board shown, and only there (on the film's root
  // it would restyle every part of the film each frame: Safari on a phone ran out of memory repainting them, Oct 18)
  for (const [id, spans] of Object.entries(SLOTS)) if (id.startsWith("board:") && live(spans, c.t)) set(c, `is:${id}`, { v: { "--t": c.t.toFixed(3) } });
  // the voice bar's waveform moves with the words (no glow under the notch: Yulun, Oct 18)
  const lv = level(LINES, c.t);
  if (live(SLOTS.voice, c.t)) {
    bars(lv, c.t).forEach((h, i) => set(c, `vb:b${i}`, { h }));
  }
  // Transcribing: the ellipsis lights in turn
  const tr = live(SLOTS.trans, c.t);
  if (tr) {
    set(c, "tr:dots", { st: String(Math.floor(c.t * 3) % 3) });
  }
}
/** The two concave ears where the island meets the screen's edge. */
export const earsPath = (o: Outline) => `M0,0 Q${o.tr},0 ${o.tr},${o.tr} L${o.tr},0 Z M${o.w},0 Q${o.w - o.tr},0 ${o.w - o.tr},${o.tr} L${o.w - o.tr},0 Z`;
export const pathAt = (d: string, dx: number) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100},${y}`);

function subtitles(c: Ctx) {
  for (const l of LINES) {
    const o = lineOpacity(l, c.t);
    if (o <= 0) continue;
    set(c, `sub:${l.id}`, { o });
    const n = shown(l, c.t);
    for (let i = 0; i < l.words.length; i++) set(c, `sw:${l.id}:${i}`, { o: i < n ? clamp((c.t - l.words[i].at) / 0.12) : 0 });
  }
}

// ———————————————————————————— the paper layer: cards and the world
// the paper's notch shows only once the paper has nearly covered the screen, so two notches never overlap
function paper(c: Ctx, o: number) { set(c, "paper", { o }); set(c, "pnotch", { o: clamp((o - 0.55) / 0.45) }); }
function card(c: Ctx, key: string, a: number, b: number, rise = 8) {
  const o = window01(c.t, a, b, 0.6, 0.45);
  if (o <= 0) return;
  set(c, key, { o, y: c.reduced ? 0 : mix(rise, 0, ease.out(seg(c.t, a, a + 0.9))) });
}

/** The opening: what the product is, in one line, on paper, out of the dark. */
function A0(c: Ctx) {
  paper(c, 1);
  card(c, "cd:title", T.A0 + 0.35, T.B1 - 0.05);
  card(c, "cd:titleSmall", T.A0 + 0.95, T.B1 - 0.05, 4);
  set(c, "fade", { o: 1 - ease.out(seg(c.t, 0, 0.7)) });
}

/** The paper gives way to the desk. */
function dissolve(c: Ctx) {
  if (c.t >= T.B1 && c.t < T.B1 + 0.7) paper(c, 1 - ease.inOut(seg(c.t, T.B1, T.B1 + 0.6)));
}

// ———————————————————————————— Today, look-dev: pointing three times, in one sentence, and the scene changes
const D3 = POS.desk3;
const fileAt = (col: number, row: number) => at(D3.finder, IN.finder.item(col, row));
const thumbOf = (r: Rect): Rect => ({ x: r.x + 8, y: r.y, w: 84, h: 56 });
/** Blender's three changes, as the agent makes them: 0 → 1 over each span. */
const ramp = (c: Ctx, span: readonly number[]) => (c.reduced ? (c.t >= T.B1 + span[1] ? 1 : 0) : ease.inOut(seg(c.t, T.B1 + span[0], T.B1 + span[1])));

/** The windows of the look-dev desk, as they stand in both of Today's scenes. */
function desk3(c: Ctx) {
  set(c, "desk", { o: 1 });
  win(c, "blender", D3.blender, 1, 2);
  win(c, "board", D3.board, 1, 3);
  win(c, "finder", D3.finder, 1, 3);
  win(c, "mail", D3.mail, 1, 4);
  const g = ramp(c, B1.glaze), l = ramp(c, B1.light), cam = ramp(c, B1.cam);
  set(c, "bl", { v: { "--g": g.toFixed(3), "--l": l.toFixed(3), "--c": cam.toFixed(3) } });
  if (c.t >= T.B1 + B1.glaze[0] + 0.3) set(c, "bl:rough", { text: "0.350" });
  if (c.t >= T.B1 + B1.light[0] + 0.3) set(c, "bl:hdri", { text: "golden_hour_loft.hdr" });
  if (c.t >= T.B1 + B1.cam[0] + 0.3) { set(c, "bl:focal", { text: "50 mm" }); set(c, "bl:res", { text: "1080 × 1350 px" }); }
  // the rendered view refines after each change, as Cycles' viewport does
  const noise = Math.max(...[B1.glaze, B1.light, B1.cam].map((sp) => window01(c.t, T.B1 + sp[1] - 0.1, T.B1 + sp[1] + 0.45, 0.05, 0.35)));
  if (noise > 0) set(c, "bl:noise", { o: noise * 0.55 });
  if (c.t >= T.B1 + B1.render) set(c, "fd:v3", { o: c.reduced ? 1 : ease.out(seg(c.t, T.B1 + B1.render, T.B1 + B1.render + 0.4)) });
}
/** A file dragged from Finder: the picture of it the pointer carries (the thumbnail, a little smaller, see-through),
 *  held where it was grabbed. */
const DRAG = { w: 70, h: 47, o: 0.82 };
/** Taken words keep the accent's highlight over their lines, a little outset, until the request is sent (FoveaV1
 *  WorkbenchTokens+Input: takenMarkOpacity 0.32, takenMarkOutset 1.5). */
const TAKEN_OUTSET = 1.5;

function B1shot(c: Ctx) {
  const u = c.t - T.B1, s = B1, B = T.B1;
  desk3(c);
  keys(c, [["fn", B + s.fn], ["cmd", B + s.cmd], ["fnDone", B + s.done], ["ret", B + s.ret], ["esc", B + s.esc]]);
  // the three things pointed at, on the screen
  const glaze = at(D3.board, IN.board.glaze);
  const hdr = fileAt(0, 0), hdrThumb = thumbOf(hdr);
  const brief = at(D3.mail, IN.mail.brief);
  const gA = { x: glaze.x, y: glaze.y }, gB = { x: glaze.x + glaze.w, y: glaze.y + glaze.h };
  const tA = { x: brief.x, y: brief.y + brief.h / 2 }, tB = { x: brief.x + brief.w, y: brief.y + brief.h / 2 };
  /** the finished row on the board the notch opens: the first, under the board's 42 pt top */
  const row = { x: 700, y: 65 };
  /** where the file is grabbed (near its picture's corner, so the picture hangs below and right of the pointer, as a
   *  drag image does) and where it is let go: over the voice bar's right, clear of the well's words */
  const grabAt = { x: hdrThumb.x + 14, y: hdrThumb.y + 12 }, dropAt = { x: 812, y: 52 };
  const p = pointerAt({ x: 1180, y: 600 }, [
    { at: B + 2.9, to: gA, dur: 0.7 },
    { at: B + s.down, to: gB, dur: s.up - s.down - 0.05, bend: 0.03 },
    { at: B + 5.4, to: grabAt, dur: 0.55 },
    { at: B + s.drag[0], to: dropAt, dur: s.drag[1] - s.drag[0], bend: 0.1 },
    { at: B + 8.3, to: tA, dur: 0.8 },
    { at: B + s.tdown, to: tB, dur: s.tup - s.tdown - 0.05, bend: 0 },
    { at: B + 11.0, to: { x: 980, y: 600 }, dur: 0.7 },
    { at: B + 21.3, to: { x: 735, y: 18 }, dur: 0.8 },
    { at: B + 22.6, to: row, dur: 0.45 },
    { at: B + 23.6, to: { x: 1180, y: 560 }, dur: 0.8 },
  ], c.t);
  // ⌘ turns the pointer into the crosshair until its region is taken; over the brief's words it is the I-beam
  const kind = u >= s.cmd + press && u < s.up ? "cross" : u >= s.tdown - 0.35 && u < s.tup + 0.15 ? "ibeam" : "arrow";
  pointer(c, p, kind, Math.max(window01(c.t, B + 2.6, B + 12.4, 0.3, 0.4), window01(c.t, B + 21.1, B + 24.3, 0.3, 0.4)));
  clickAt(c, B + s.grab, p);
  clickAt(c, B + s.click, p);
  // ⌘: the region follows the pointer, is held a moment once let go, then its picture lifts and flies
  if (u >= s.down && u < s.lift + 0.15) {
    const r = dragRect(gA, u < s.up ? p : gB);
    set(c, "sel", { x: r.x, y: r.y, w: r.w, h: r.h, o: u < s.lift ? 1 : 1 - seg(u, s.lift, s.lift + 0.15) });
  }
  // the light: the file is grabbed in Finder and dragged onto the notch, which lights as a well ("Drop to take it");
  // let go there, it flies into the stack
  const grabOff = { x: grabAt.x - hdrThumb.x - 2, y: grabAt.y - hdrThumb.y - 2 };
  const dropRect: Rect = { x: dropAt.x - grabOff.x, y: dropAt.y - grabOff.y, w: DRAG.w, h: DRAG.h };
  if (u >= s.grab + 0.08 && u < s.drop && !c.reduced) {
    set(c, "fl:drag", { x: p.x - grabOff.x, y: p.y - grabOff.y, w: DRAG.w, h: DRAG.h, o: DRAG.o * ease.out(seg(u, s.grab + 0.08, s.grab + 0.2)), st: "hdr" });
  } else if (u >= s.drop && u < s.drop + CAPTURE.flight + 0.05 && !c.reduced) {
    const r = lerpRect(dropRect, STACK[1], spring(seg(u, s.drop, s.drop + CAPTURE.flight)));
    set(c, "fl:drag", { x: r.x, y: r.y, w: r.w, h: r.h, o: mix(DRAG.o, 1, seg(u, s.drop, s.drop + 0.2)), st: "hdr", v: { "--rad": "6px" } });
  }
  const well = window01(c.t, B + s.well, B + s.drop + 0.15, 0.12, 0.15);
  if (well > 0) set(c, "vb:drop", { o: well });
  // the brief: its words selected with a drag, no key; a moment after, Fovea takes them and its highlight stays on
  // them until the request is sent
  if (u >= s.tdown && u < s.board + 0.35) {
    const taken = u >= s.take;
    const x1 = u < s.tup ? p.x : tB.x, i = taken ? TAKEN_OUTSET : 0;
    const r = { x: brief.x - 2 - i, y: brief.y - i, w: Math.max(2, x1 - brief.x + 2) + 2 * i, h: brief.h + 2 * i };
    set(c, "mk:text", { ...r, o: 1 - seg(u, s.board, s.board + 0.35), st: taken ? "taken" : "sel" });
  }
  stack(c, [{ kind: "glaze", at: B + s.lift, from: glaze }, { kind: "hdr", at: B + s.drop, from: dropRect, own: true }, { kind: "brief", at: B + s.textFly, from: brief }]);
  // while the file is over the notch, its drop state stands in place of the waveform (MockIsland: dropping)
  if (well > 0) set(c, "vb:wave", { o: 1 - well });
  // the chat Fovea picked for it; then the agent's steps, and the changes in the viewport as each lands
  glow(c, "ch:b1glow", B + s.choose + 0.35);
  set(c, "step:b1", { st: u < s.step1 ? "0" : u < s.step2 ? "1" : "2" });
  glow(c, "bl:g0", B + s.glaze[0] + 0.2); glow(c, "bl:g2", B + s.cam[0] + 0.2);
  // the agent's time, shown faster than it ran (the answer says how long it took)
  const fast = window01(c.t, B + s.board + 0.3, B + s.click, 0.3, 0.3);
  if (fast > 0) set(c, "tag:fast", { o: fast });
  c.f.aim = aimOf([
    aimKey(B, WIDE), aimKey(B + s.push[0], WIDE), aimKey(B + s.push[1], SHOT.caps),
    aimKey(B + s.pan[0], SHOT.caps), aimKey(B + s.pan[1], SHOT.brief),
    aimKey(B + s.back[0], SHOT.brief), aimKey(B + s.back[1], WIDE),
    aimKey(B + s.toChoose[0], WIDE), aimKey(B + s.toChoose[1], SHOT.isl),
    aimKey(B + s.wide[0], SHOT.isl), aimKey(B + s.wide[1], WIDE),
    aimKey(B + s.toNotch[0], WIDE), aimKey(B + s.toNotch[1], SHOT.panel),
    aimKey(B + s.out[0], SHOT.panel), aimKey(B + s.out[1], WIDE),
  ], c.t, c.reduced);
}

// ———————————————————————————— Today, everyday: the whole screen, "Send this to Dana.", a reply in the Mail that's open
/** The reply's words as the agent types them in: each paragraph up to where the typing has reached. */
function typed(c: Ctx, a: number, b: number) {
  const total = DRAFT.body.reduce((n, p) => n + p.length, 0);
  const n = c.reduced ? total : Math.floor(seg(c.t, a, b) * total);
  let from = 0;
  DRAFT.body.forEach((p, i) => { set(c, `ml:b${i}`, { text: p.slice(0, clamp(n - from, 0, p.length)) }); from += p.length; });
}

function B2shot(c: Ctx) {
  const u = c.t - T.B2, s = B2, B = T.B2;
  desk3(c);
  keys(c, [["fn", B + s.fn], ["cmd2", B + s.cmd2[0], B + s.cmd2[1]], ["fnDone", B + s.done], ["ret", B + s.ret], ["esc", B + s.esc]]);
  // ⌘ ⌘: the whole screen. A flash; the picture lifts from the screen inset 40 pt, then flies into the bar
  const fl = window01(c.t, B + s.cap, B + s.cap + CAPTURE.flash, 0.02, CAPTURE.flash - 0.02);
  if (fl > 0) set(c, "flash:screen", { o: fl * 0.35 });
  if (u >= s.cap && u < s.fly + CAPTURE.flight + 0.05 && !c.reduced) {
    const p = u < s.fly ? 0 : spring(seg(u, s.fly, s.fly + CAPTURE.flight));
    const r = lerpRect(SCREEN, STACK[0], p);
    set(c, "scr:fly", { x: r.x, y: r.y, w: r.w, h: r.h, o: ease.out(seg(u, s.cap, s.cap + 0.2)), v: { "--sc": (r.w / STAGE.w).toFixed(4), "--rad": `${mix(10, 6, p).toFixed(2)}px` } });
  }
  stack(c, [{ kind: "screen", at: B + s.fly, from: SCREEN, own: true }]);
  glow(c, "ch:b2glow", B + s.choose + 0.35);
  set(c, "step:b2", { st: u < s.step1 ? "0" : "1" });
  // the Mail that is already open makes room beside Dana's message, and the reply is typed in, the render attached
  const sp = c.reduced ? (u >= s.reply[0] ? 1 : 0) : ease.inOut(seg(u, s.reply[0], s.reply[1]));
  if (sp > 0) set(c, "ml:read", { v: { "--sp": sp.toFixed(3) } });
  if (u >= s.reply[0] && u < s.type[1]) typed(c, B + s.type[0], B + s.type[1]);
  const att = c.reduced ? (u >= s.attach ? 1 : 0) : ease.out(seg(u, s.attach, s.attach + 0.35));
  if (att > 0) set(c, "ml:att", { o: att, y: mix(6, 0, att) });
  const fast = window01(c.t, B + s.board + 0.3, B + s.answer, 0.3, 0.3);
  if (fast > 0) set(c, "tag:fast", { o: fast });
  caption(c, "attach", B + s.caption[0], B + s.caption[1]);
  c.f.aim = aimOf([
    aimKey(B, WIDE), aimKey(B + s.toChoose[0], WIDE), aimKey(B + s.toChoose[1], SHOT.isl),
    aimKey(B + s.wide[0], SHOT.isl), aimKey(B + s.wide[1], WIDE),
    aimKey(B + s.toMail[0], WIDE), aimKey(B + s.toMail[1], SHOT.mail),
    aimKey(B + s.toNotch[0], SHOT.mail), aimKey(B + s.toNotch[1], SHOT.panel),
    aimKey(B + s.out[0], SHOT.panel), aimKey(B + s.out[1], WIDE),
  ], c.t, c.reduced);
  paper(c, ease.inOut(seg(c.t, T.C0 - 0.5, T.C0)));
}

// ———————————————————————————— Soon: the eyes pick what is meant; Fovea picks the session and the model
/** Two cards: the eyes, then every agent you have running, as one. */
function C0card(c: Ctx) {
  paper(c, c.t < T.C1 ? 1 : 1 - ease.inOut(seg(c.t, T.C1, T.C1 + 0.6)));
  card(c, "cd:eyes", T.C0 + 0.1, T.C0 + 3.5);
  card(c, "cd:eyesSmall", T.C0 + 0.7, T.C0 + 3.5, 4);
  const ro = window01(c.t, T.C0 + 1.2, T.C0 + 3.5, 0.35, 0.45);
  if (ro > 0) set(c, "cd:eyesRing", { o: ro });
  card(c, "cd:agents", T.C0 + 3.8, T.C1 - 0.05);
  card(c, "cd:agentsSmall", T.C0 + 4.3, T.C1 - 0.05, 4);
}

const chartC = centre(at(POS.desk2.chat, IN.chat.chart));
const prsC = centre(at(POS.desk2.browser, IN.browser.prs));
type Fix = { at: number; x: number; y: number };
/** Where the eyes rest while the person talks (a fixation every 0.4–0.9 s; the ring glides 0.42 s between them). */
const GAZE: Fix[] = [
  { at: T.C1 + 1.6, ...chartC },
  { at: T.C1 + 2.3, x: prsC.x - 140, y: prsC.y - 70 },
  { at: T.C1 + 2.9, x: chartC.x + 30, y: chartC.y - 20 },
  { at: T.C1 + 4.05, x: prsC.x - 60, y: prsC.y },
];
function gaze(fixes: Fix[], t: number, glide: number, reduced?: boolean) {
  const { index } = step(fixes.map((fx) => ({ at: fx.at, v: fx })), t);
  const cur = fixes[index], prev = fixes[Math.max(0, index - 1)];
  const p = reduced ? 1 : ease.inOut(seg(t, cur.at, cur.at + glide));
  const k = reduced ? 0 : RING.tremor;
  return { x: mix(prev.x, cur.x, p) + noise(11, t, RING.tremorHz) * k, y: mix(prev.y, cur.y, p) + noise(23, t, RING.tremorHz) * k };
}

/** The thinking ring in Soon's chat pill: r 7.5 in an 18 pt box. */
const RING_C = +(2 * Math.PI * 7.5).toFixed(2);

/** Soon's attachments, opened: the pile fans into a numbered row; the second grows to its close look and back. */
const PILE = { x: 473, y: 93 };
const CARD2: Rect = { x: REFS.row.x + 10 + 102 + 10, y: REFS.row.y + 10, w: 132, h: 60 };
function refs(c: Ctx) {
  const s = SC, B = T.C1, u = c.t - B;
  const rowO = Math.max(window01(c.t, B + s.fan, B + s.click + 0.2, 0.25, 0.2), window01(c.t, B + s.back + 0.05, B + s.fold + 0.15, 0.2, 0.15));
  if (rowO > 0) set(c, "c2:row", { o: rowO, s: c.reduced ? 1 : mix(0.96, 1, ease.out(seg(u, s.fan, s.fan + 0.4))) });
  if (u >= s.click && u < s.back + 0.3) {
    const grow = c.reduced ? (u < s.back ? 1 : 0) : u < s.back ? spring(seg(u, s.click, s.click + 0.3)) : 1 - spring(seg(u, s.back, s.back + 0.25));
    const r = lerpRect(CARD2, REFS.look, grow);
    set(c, "c2:look", { x: r.x, y: r.y, w: r.w, h: r.h, o: Math.min(1, grow * 3), v: { "--k": (r.w / REFS.look.w).toFixed(4) } });
  }
}

function C(c: Ctx) {
  const u = c.t - T.C1, s = SC, B = T.C1;
  set(c, "desk", { o: 1 });
  win(c, "chat", POS.desk2.chat, 1, 2);
  win(c, "browser", POS.desk2.browser, 1, 3);
  set(c, "br:tab", { st: "prs" });
  set(c, "tag:soon", { o: window01(c.t, T.C0 + 0.3, T.D0 - 0.3, 0.5, 0.4) });
  // the ring lives as long as the voice bar: from fn ⌃ to fn ⌃; its label stays until "these" has landed
  const g = gaze(GAZE, c.t, RING.glide, c.reduced);
  const ringOn = window01(c.t, B + s.fn + press, B + s.done + press, 0.25, 0.3);
  if (ringOn > 0) set(c, "ring", { x: g.x, y: g.y, o: ringOn });
  set(c, "ringLabel", { o: window01(c.t, B + s.label[0], B + s.label[1], 0.3, 0.4) });
  keys(c, [["fn", B + s.fn], ["fnDone", B + s.done], ["back", B + s.back]]);
  // "this" and "these" land on what the eyes are on: it is marked, then flies into the stack
  const chart = at(POS.desk2.chat, IN.chat.chart), prs = at(POS.desk2.browser, IN.browser.prs);
  const gm = (r: Rect, a: number, b: number) => { const o = window01(c.t, a, b, 0.12, 0.15); if (o > 0) set(c, "gazeMark", { x: r.x - 6, y: r.y - 6, w: r.w + 12, h: r.h + 12, o }); };
  gm(chart, B + 3.4, B + 4.42); gm(prs, B + 4.42, B + 5.6);
  stack(c, [{ kind: "chart", at: B + 3.95, from: chart }, { kind: "prs", at: B + 4.85, from: prs }]);
  // Choose chat decides by itself, in the chat's own pill (kept at the chat's width, as the app keeps it): a ring
  // circles where the chat's icon will be while Fovea thinks, a turn a second, filling as it goes; full, it gives way
  // to the chat. Then the model.
  set(c, "ch:c2", { st: u < s.settle ? "choosing" : u < s.model ? "settled" : "routed" });
  const fill = c.reduced ? 1 : ease.inOut(seg(u, s.think[0], s.think[1]));
  const turn = c.reduced ? 0 : (Math.max(0, u - s.think[0]) * 360) % 360;
  const pick = c.reduced ? (u >= s.settle ? 1 : 0) : ease.out(seg(u, s.settle, s.settle + 0.3));
  set(c, "ch:c2ring", { o: 1 - pick, v: { "--da": `${(Math.max(0.08, fill) * RING_C).toFixed(2)} ${RING_C}`, "--rot": `${turn.toFixed(1)}deg` } });
  set(c, "ch:c2wait", { o: 1 - pick });
  set(c, "ch:c2pick", { o: pick, s: mix(0.94, 1, pick) });
  glow(c, "ch:c2glow", B + s.settle);
  glow(c, "ch:c2mglow", B + s.model);
  const tag = (k: string, a: number) => { const o = window01(c.t, a, B + s.point + 0.3, 0.3, 0.3); if (o > 0) set(c, k, { o, y: mix(-4, 0, ease.out(seg(c.t, a, a + 0.4))) }); };
  tag("rt:session", B + s.settle + 0.1); tag("rt:model", B + s.model + 0.1);
  // before it sends, the pointer opens what it is sending: the pile, then the merged pull requests up close
  const card2 = centre(CARD2);
  const p = pointerAt({ x: 900, y: 520 }, [
    { at: B + s.point, to: PILE, dur: 0.65 },
    { at: B + s.toCard, to: card2, dur: 0.35 },
    { at: B + s.leave, to: { x: 900, y: 420 }, dur: 0.45 },
  ], c.t);
  pointer(c, p, "arrow", window01(c.t, B + s.point - 0.2, B + s.leave + 0.6, 0.25, 0.3));
  clickAt(c, B + s.click, p);
  refs(c);
  caption(c, "choose", B + s.caption[0], B + s.caption[1]);
  c.f.aim = aimOf([
    aimKey(B, WIDE), aimKey(B + s.toChoose[0], WIDE), aimKey(B + s.toChoose[1], SHOT.panel), aimKey(T.D0, SHOT.panel),
  ], c.t, c.reduced);
  paper(c, ease.inOut(seg(c.t, T.D0 - 0.5, T.D0)));
}

// ———————————————————————————— Next: the bar, the eyes in the world, memory, the last line
function next(c: Ctx) {
  paper(c, 1);
  set(c, "tag:next", { o: window01(c.t, T.D0 + 0.3, T.D1 + 0.2, 0.5, 0.4) });
  card(c, "cd:next", T.D0 + 0.1, T.D1 - 0.05);
  let notch = 1, slide = 0;
  // D1: the notch slides down and becomes the bar
  if (c.t >= T.D1 - 0.1 && c.t < T.D2 + 0.6) {
    const u = c.t - T.D1;
    slide = c.reduced ? (u > 0.6 ? 1 : 0) : ease.inOut(seg(u, 0.1, 1.0));
    notch = 1 - seg(u, 0.75, 1.05);
    const bo = Math.min(ease.out(seg(u, 0.7, 1.2)), 1 - seg(c.t, T.D2 - 0.45, T.D2));
    set(c, "bar", { o: bo, s: c.reduced ? 1 : mix(1, 1.04, seg(u, 0.7, 3.4)) });
    card(c, "cd:bar", T.D1 + 1.0, T.D2 - 0.05, 6);
    card(c, "cd:barSmall", T.D1 + 1.3, T.D2 - 0.05, 4);
  }
  // D2: something you wear (and what it is not), then the world through the eyes (the wearable is only the point of view)
  if (c.t >= T.D2 - 0.1 && c.t < T.D3 + 0.7) {
    const u = c.t - T.D2;
    notch = 0;
    // the card first, whole long enough for both its lines, and gone before the photograph comes up in its place
    card(c, "cd:wear", T.D2 + 0.1, T.D2 + 3.6, 6);
    card(c, "cd:wearSmall", T.D2 + 0.6, T.D2 + 3.6, 4);
    const o1 = Math.min(ease.out(seg(u, 3.5, 4.0)), 1 - ease.inOut(seg(u, 6.7, 7.3)));
    if (o1 > 0) set(c, "ph:1", { o: o1, s: c.reduced ? 1 : mix(1, 1.05, seg(u, 3.5, 7.3)) });
    const fx = [{ at: 4.0, x: 50, y: 58 }, { at: 4.5, x: 54, y: 44 }, { at: 5.5, x: 50, y: 40 }].map((f) => ({ at: T.D2 + f.at, x: f.x, y: f.y }));
    const g = gaze(fx, c.t, RING.glide, c.reduced);
    const ro = Math.min(o1, window01(c.t, T.D2 + 4.0, T.D2 + 6.7, 0.3, 0.3));
    if (ro > 0) set(c, "ph:1ring", { o: ro, v: { "--rx": `${g.x.toFixed(2)}%`, "--ry": `${g.y.toFixed(2)}%` } });
  }
  // D3: the day as Fovea lived it with you, carried up into the notch, and from it to every agent you use
  if (c.t >= T.D3 - 0.1 && c.t < T.E + 0.4) {
    const u = c.t - T.D3;
    notch = ease.out(seg(u, 0, 0.6));
    const lineO = 1 - seg(u, 2.9, 3.2);
    if (lineO > 0) set(c, "dayLine", { o: lineO * 0.9, sx: c.reduced ? 1 : Math.max(0.001, ease.inOut(seg(u, 0.2, 1.8))) });
    DAY.forEach((_, i) => {
      const pin = ease.out(seg(u, 0.3 + i * 0.3, 0.7 + i * 0.3));
      const up = c.reduced ? (u > 3.4 ? 1 : 0) : ease.inOut(seg(u, 3.0 + i * 0.05, 3.7 + i * 0.05));
      set(c, `mem:${i}`, { o: pin * (1 - seg(up, 0.75, 1)), v: { "--up": up.toFixed(3), "--pin": pin.toFixed(3) } });
      if (pin * lineO > 0) set(c, `memt:${i}`, { o: pin * lineO });
    });
    card(c, "cd:saw", T.D3 + 0.8, T.D3 + 3.3, 4);
    AGENT_ROW.forEach((_, i) => {
      const a = T.D3 + 3.9 + i * 0.08;
      const q = seg(c.t, a, a + 0.6);
      if (q > 0 && q < 1 && !c.reduced) set(c, `adot:${i}`, { o: 1, v: { "--q": ease.inOut(q).toFixed(3) } });
      const tile = Math.min(ease.out(seg(c.t, a + 0.55, a + 0.85)), 1 - seg(c.t, T.E - 0.5, T.E));
      if (tile > 0) { set(c, `agent:${i}`, { o: tile, s: mix(0.88, 1, tile) }); set(c, `agentName:${i}`, { o: tile * 0.9 }); }
    });
    card(c, "cd:you", T.D3 + 4.5, T.E - 0.05, 6);
  }
  // E: the last line
  if (c.t >= T.E - 0.1) {
    card(c, "cd:last", T.E + 0.2, T.END + 5, 8);
    set(c, "endRing", { o: window01(c.t, T.E + 1.3, T.E + 3.4, 0.35, 0.6) });
  }
  set(c, "pnotch", { o: notch, v: { "--slide": slide.toFixed(3) } });
}

/** Everything at t. */
export function evaluate(t: number, opts: Options = {}): Frame {
  const tt = clamp(t, 0, T.END);
  const chapter = step(CHAPTERS.map((ch, i) => ({ at: ch.at, v: i })), tt).v;
  const f: Frame = { t: tt, chapter, shot: "", aim: WIDE, k: {} };
  const c: Ctx = { f, t: tt, reduced: opts.reduced };
  if (tt < T.B1) { f.shot = "A0"; A0(c); }
  else if (tt < T.B2) { f.shot = "B1"; B1shot(c); }
  else if (tt < T.C0) { f.shot = "B2"; B2shot(c); }
  else if (tt < T.C1) { f.shot = "C0"; }
  else if (tt < T.D0) { f.shot = "C"; C(c); }
  else { f.shot = tt < T.D1 ? "D0" : tt < T.D2 ? "D1" : tt < T.D3 ? "D2" : tt < T.E ? "D3" : "E"; }
  dissolve(c);
  // Today's answers are simulated in 1.0: the tag stays as long as the desk under it does, and goes with it
  if (tt >= T.B1 && tt < T.C0) set(c, "tag:preview", { o: Math.min(ease.out(seg(tt, T.B1 + 0.6, T.B1 + 1.1)), 1 - (f.k.paper?.o ?? 0)) });
  if (tt >= T.C0 && tt < T.C1 + 0.7) C0card(c);
  if (tt >= T.D0 - 0.05) next(c);
  if (tt >= T.B1 && tt < T.D0) island(c);
  subtitles(c);
  return f;
}

export { DURATION, CHAPTERS, BEATS } from "./content";
export { NOTCH };
