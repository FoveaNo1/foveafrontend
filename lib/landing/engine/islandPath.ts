// The island's outline as an SVG path: concave "ears" at the top that fuse into the edge it hangs
// from, straight sides, convex bottom corners. A port of IslandShape.path(in:)
// (app-ui-v1/FoveaV1/Sources/FoveaIsland/MockDesktop/IslandShape.swift), itself after
// DynamicNotchKit's NotchShape (MIT, © Kai Azim). The width includes both ears.

export type IslandOutline = {
  width: number;
  height: number;
  topRadius: number;
  bottomRadius: number;
};

const r = (n: number) => Math.round(n * 100) / 100;

export function islandPath({ width: w, height: h, topRadius, bottomRadius }: IslandOutline): string {
  const tr = Math.max(0, Math.min(topRadius, w / 2));
  const br = Math.max(0, Math.min(bottomRadius, h, w / 2 - tr));
  const parts = [`M0,0`];
  if (tr > 0) parts.push(`Q${r(tr)},0 ${r(tr)},${r(tr)}`);
  parts.push(`L${r(tr)},${r(h - br)}`);
  parts.push(`Q${r(tr)},${r(h)} ${r(tr + br)},${r(h)}`);
  parts.push(`L${r(w - tr - br)},${r(h)}`);
  parts.push(`Q${r(w - tr)},${r(h)} ${r(w - tr)},${r(h - br)}`);
  parts.push(`L${r(w - tr)},${r(tr)}`);
  if (tr > 0) parts.push(`Q${r(w - tr)},0 ${r(w)},0`);
  parts.push("Z");
  return parts.join(" ");
}

/** The island at rest: the notch with its ears (212 × 32). In Native it is drawn black over the
 *  island's glass, as the hardware is (NativeSurface.swift). */
export const restingOutline: IslandOutline = { width: 212, height: 32, topRadius: 6, bottomRadius: 14 };
