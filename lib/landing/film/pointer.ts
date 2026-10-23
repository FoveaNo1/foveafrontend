// The pointer, as a hand moves it: each move starts at a time, takes as long as a person takes to cover that distance
// (Fitts's law, unhurried), follows a slight arc, and speeds up and slows down the way a hand does (minimum jerk,
// Flash & Hogan 1985). Everything a drag makes on screen (a text selection, a screenshot's rectangle, a thumbnail
// carried across) is read from this one position, so it can never drift from the pointer. Pure.

import { clamp, mix } from "./ease";

export type Pt = { x: number; y: number };
/** A move to `to`, starting at `at` (film seconds). `dur` overrides the hand's own time; `bend` arcs the path (a
 *  fraction of the distance, to the left of travel when positive). */
export type Move = { at: number; to: Pt; dur?: number; bend?: number };

/** How a hand's speed rises and falls over one movement. */
export const minJerk = (s: number) => {
  const x = clamp(s);
  return x * x * x * (10 - 15 * x + 6 * x * x);
};

/** How long an unhurried person takes to move the pointer this far: a third of a second to start, a little more for
 *  every doubling of the distance. A film needs the eye to keep up, so this is slower than a practised hand. */
export const reach = (d: number) => 0.4 + 0.17 * Math.log2(d / 24 + 1);

const along = (a: Pt, b: Pt, bend: number, p: number): Pt => {
  // a quadratic arc: the control point sits off the straight line by `bend` of its length
  const dx = b.x - a.x, dy = b.y - a.y;
  const cx = (a.x + b.x) / 2 - dy * bend, cy = (a.y + b.y) / 2 + dx * bend;
  const u = 1 - p;
  return { x: u * u * a.x + 2 * u * p * cx + p * p * b.x, y: u * u * a.y + 2 * u * p * cy + p * p * b.y };
};

/** Where the pointer is at t, from where it starts and the moves it makes (in order of their start). */
export function pointerAt(start: Pt, moves: Move[], t: number): Pt {
  let pos = start;
  for (const m of moves) {
    if (t < m.at) return pos;
    const d = Math.hypot(m.to.x - pos.x, m.to.y - pos.y);
    const dur = m.dur ?? reach(d);
    if (t < m.at + dur) return along(pos, m.to, m.bend ?? 0.06, minJerk((t - m.at) / dur));
    pos = m.to;
  }
  return pos;
}

/** When the last of these moves comes to rest: handy for timing the click that follows. */
export function arrives(start: Pt, moves: Move[]): number {
  let pos = start, end = 0;
  for (const m of moves) {
    const dur = m.dur ?? reach(Math.hypot(m.to.x - pos.x, m.to.y - pos.y));
    end = m.at + dur;
    pos = m.to;
  }
  return end;
}

/** The rectangle between where a drag began and where the pointer is now. */
export const dragRect = (a: Pt, p: Pt) => ({ x: Math.min(a.x, p.x), y: Math.min(a.y, p.y), w: Math.abs(p.x - a.x), h: Math.abs(p.y - a.y) });

export const lerpPt = (a: Pt, b: Pt, p: number): Pt => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p) });
