// Time, shaped: the page's three curves (app/(landing)/book.css --ease-*), the app's critically damped spring, and
// the small helpers every shot uses. Pure; no DOM.

export const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Progress 0…1 of t through [a, b]. */
export const seg = (t: number, a: number, b: number) => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));

/** A CSS cubic-bezier as a function of progress (Newton steps, then bisection). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let u = p;
    for (let i = 0; i < 6; i++) {
      const e = sx(u) - p, d = dx(u);
      if (Math.abs(e) < 1e-5) return sy(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0, hi = 1;
    u = p;
    for (let i = 0; i < 20; i++) {
      const e = sx(u) - p;
      if (Math.abs(e) < 1e-5) break;
      if (e > 0) hi = u; else lo = u;
      u = (lo + hi) / 2;
    }
    return sy(u);
  };
}

export const ease = {
  /** --ease-out: things arriving, every response (easeOutQuint). */
  out: bezier(0.23, 1, 0.32, 1),
  /** --ease-in-out: things moving across the screen; the camera. */
  inOut: bezier(0.77, 0, 0.175, 1),
  /** --ease-drawer: the sheet's curve. */
  drawer: bezier(0.32, 0.72, 0, 1),
  /** A gentle in-out for long camera moves (easeInOutSine), so a push never lurches. */
  sine: (p: number) => -(Math.cos(Math.PI * clamp(p)) - 1) / 2,
  linear: (p: number) => clamp(p),
};

const SPRING_END = 1 - (1 + 2 * Math.PI) * Math.exp(-2 * Math.PI);
/** SwiftUI's interpolatingSpring(duration:, bounce: 0): critically damped, no overshoot, normalised to end at 1. */
export const spring = (p: number) => {
  const s = clamp(p);
  return (1 - (1 + 2 * Math.PI * s) * Math.exp(-2 * Math.PI * s)) / SPRING_END;
};

/** In, hold, out: 0 → 1 over [a, a + fadeIn], 1 until b − fadeOut, then → 0 at b. */
export function window01(t: number, a: number, b: number, fadeIn = 0.4, fadeOut = 0.4, curve = ease.out) {
  if (t <= a || t >= b) return 0;
  const i = fadeIn > 0 ? curve(seg(t, a, a + fadeIn)) : 1;
  const o = fadeOut > 0 ? 1 - ease.inOut(seg(t, b - fadeOut, b)) : 1;
  return Math.min(i, o);
}

export type Key<T> = { at: number; v: T; ease?: (p: number) => number };

/** A track of numbers or tuples: holds the first value before its first key, the last after its last, and moves
 *  between keys on the arriving key's curve (the camera's default is a sine in-out). */
export function track(keys: Key<number>[], t: number): number;
export function track(keys: Key<number[]>[], t: number): number[];
export function track(keys: Key<number | number[]>[], t: number): number | number[] {
  if (t <= keys[0].at) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.at) return last.v;
  let i = 1;
  while (keys[i].at < t) i++;
  const a = keys[i - 1], b = keys[i];
  const p = (b.ease ?? ease.sine)(seg(t, a.at, b.at));
  if (typeof a.v === "number") return mix(a.v, b.v as number, p);
  return (a.v as number[]).map((x, j) => mix(x, (b.v as number[])[j], p));
}

/** The last step at or before t, and how long it has been on. */
export function step<T>(steps: { at: number; v: T }[], t: number): { v: T; since: number; at: number; index: number } {
  let i = 0;
  while (i + 1 < steps.length && steps[i + 1].at <= t) i++;
  return { v: steps[i].v, since: t - steps[i].at, at: steps[i].at, index: i };
}
