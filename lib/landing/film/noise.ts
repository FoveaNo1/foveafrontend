// Seeded noise, so every wobble in the film (the gaze ring's tremor, the waveform's flutter) is the same every time
// it plays and every time it is seeked. Pure.

/** A 32-bit integer hash of (seed, i), as a number in [0, 1). */
export function hash(seed: number, i: number): number {
  let h = (seed * 374761393 + i * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth 1D value noise in [-1, 1]: `rate` new values a second, eased between. */
export function noise(seed: number, t: number, rate = 10): number {
  const x = t * rate, i = Math.floor(x), f = x - i;
  const s = f * f * (3 - 2 * f);
  return (hash(seed, i) * (1 - s) + hash(seed, i + 1) * s) * 2 - 1;
}
