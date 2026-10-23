// Fovea 1.0's island, as numbers: its outline as an SVG path (a port of IslandShape.swift via
// lib/landing/engine/islandPath.ts), its outline over time on the app's springs (an interrupted spring starts from
// where the outline was), and the nine-bar waveform. Pure.

import { clamp, mix, spring } from "./ease";
import { noise } from "./noise";
import type { Outline } from "./tokens";

const r = (n: number) => Math.round(n * 100) / 100;

/** The outline as a closed path in its own box (w × h): concave ears that fuse into the top edge, straight sides,
 *  round bottom corners. */
export function islandPath({ w, h, tr: t0, br: b0 }: Outline): string {
  const tr = Math.max(0, Math.min(t0, w / 2));
  const br = Math.max(0, Math.min(b0, h - tr, w / 2 - tr));
  return [
    "M0,0",
    tr > 0 ? `Q${r(tr)},0 ${r(tr)},${r(tr)}` : "",
    `L${r(tr)},${r(h - br)}`,
    `Q${r(tr)},${r(h)} ${r(tr + br)},${r(h)}`,
    `L${r(w - tr - br)},${r(h)}`,
    `Q${r(w - tr)},${r(h)} ${r(w - tr)},${r(h - br)}`,
    `L${r(w - tr)},${r(tr)}`,
    tr > 0 ? `Q${r(w - tr)},0 ${r(w)},0` : "",
    "Z",
  ].filter(Boolean).join(" ");
}

/** The same outline without its top edge: the rim the glass draws on its sides and foot only. */
export const rimPath = (o: Outline) => islandPath(o).replace(/ Z$/, "");

const lerp = (a: Outline, b: Outline, p: number): Outline => ({ w: mix(a.w, b.w, p), h: mix(a.h, b.h, p), tr: mix(a.tr, b.tr, p), br: mix(a.br, b.br, p) });

export type OutlineKey = { at: number; to: Outline; dur: number };

/** Where the outline is at t, given its changes in order. Each change springs from wherever the outline was when it
 *  began, so a change that interrupts another never jumps. */
export function outlineAt(keys: OutlineKey[], t: number): Outline {
  let from = keys[0].to, to = keys[0].to, at = keys[0].at, dur = 0;
  for (let i = 1; i < keys.length && keys[i].at <= t; i++) {
    from = lerp(from, to, dur > 0 ? spring((keys[i].at - at) / dur) : 1);
    to = keys[i].to;
    at = keys[i].at;
    dur = keys[i].dur;
  }
  return lerp(from, to, dur > 0 ? spring((t - at) / dur) : 1);
}

/** The voice bar's nine bars (VOICE_BAR.md): 4 pt wide, 5.33 pt at rest, 20 at the most; the voice lifts the middle on
 *  a bell (spread 0.4, gain 1.25) and the edges barely move. Stepped at 40 fps, as the app draws them. */
export function bars(level: number, t: number, seed = 7): number[] {
  const tt = Math.floor(t * 40) / 40;
  const out: number[] = [];
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) / 4;
    const bell = Math.exp(-(x * x) / (2 * 0.4 * 0.4));
    const flutter = 0.72 + 0.28 * noise(seed + i * 13, tt, 11);
    out.push(5.33 + (20 - 5.33) * clamp(level * 1.25 * bell * flutter));
  }
  return out;
}

