// The hand loop: Fovea's circle round what you mean. A port of LassoRenderer.loopPoint
// (app-ui-v1/FoveaV1/Sources/FoveaIsland/MockDesktop/AgentThinking.swift) with
// WorkbenchTokens.Lasso: a little past one turn so it overlaps where it closes; its radius wavers by
// its second and third harmonics, as a hand's does, and closes in a little as it comes round.

export const Lasso = {
  turns: 1.12,
  waver2: 0.05,
  waver3: 0.03,
  shrink: 0.06,
} as const;

export type LassoOptions = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Where the loop starts (radians); -π/2 − 0.5 begins up and to the left. */
  start?: number;
  /** Turns the waver, so no two loops are quite alike. */
  seed?: number;
  turns?: number;
};

export function loopPoint(o: LassoOptions, s: number): { x: number; y: number } {
  const start = o.start ?? -Math.PI / 2 - 0.5;
  const turns = o.turns ?? Lasso.turns;
  const theta = start + 2 * Math.PI * turns * s;
  const k = 1 + Lasso.waver2 * Math.sin(2 * theta + (o.seed ?? 0)) + Lasso.waver3 * Math.sin(3 * theta + 1.1) - Lasso.shrink * s;
  return { x: o.cx + Math.cos(theta) * k * o.rx, y: o.cy + Math.sin(theta) * k * o.ry };
}

/** The loop as an SVG path, from 0 to 1 of its length. */
export function lassoPath(o: LassoOptions, from = 0, to = 1): string {
  if (to <= from) return "";
  const turns = o.turns ?? Lasso.turns;
  const n = Math.max(2, Math.round((to - from) * turns * 90));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const p = loopPoint(o, from + ((to - from) * i) / n);
    pts.push(`${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`);
  }
  return pts.join(" ");
}
