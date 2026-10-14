import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs, readProjectFile } from "./load-ts.mjs";

const { islandPath, restingOutline } = loadTs("lib/landing/engine/islandPath.ts");
const { loopPoint, lassoPath, Lasso } = loadTs("lib/landing/engine/lasso.ts");
const tokens = loadTs("lib/landing/tokens.ts");

test("the resting island is the notch with a 6 pt ear each side: 212 × 32", () => {
  assert.equal(restingOutline.width, tokens.Display.notchWidth + 2 * tokens.Island.ear);
  assert.equal(restingOutline.height, tokens.Display.notchHeight);
  assert.equal(
    islandPath(restingOutline),
    "M0,0 Q6,0 6,6 L6,18 Q6,32 20,32 L192,32 Q206,32 206,18 L206,6 Q206,0 212,0 Z",
  );
});

test("Choose chat's outline: 660 wide, ears of 19, foot of 32 (Spacious)", () => {
  const d = islandPath({ width: tokens.V2.width, height: 230, topRadius: tokens.Island.openTopRadius, bottomRadius: tokens.V2.bottomRadius });
  assert.match(d, /^M0,0 Q19,0 19,19 L19,198 Q19,230 51,230 L609,230 Q641,230 641,198 L641,19 Q641,0 660,0 Z$/);
});

test("radii are clamped to the shape, as IslandShape.path(in:) clamps them", () => {
  const d = islandPath({ width: 20, height: 10, topRadius: 40, bottomRadius: 40 });
  // tr ≤ w/2 = 10; br ≤ min(h, w/2 − tr) = 0.
  assert.equal(d, "M0,0 Q10,0 10,10 L10,10 Q10,10 10,10 L10,10 Q10,10 10,10 L10,10 Q10,0 20,0 Z");
});

test("the hand loop goes a little past one turn and closes in as it comes round", () => {
  assert.equal(Lasso.turns, 1.12);
  const o = { cx: 0, cy: 0, rx: 10, ry: 10, seed: 0 };
  const start = loopPoint(o, 0);
  const end = loopPoint(o, 1);
  const r = (p) => Math.hypot(p.x, p.y);
  assert.ok(r(end) < r(start), "ends inside where it began");
  assert.ok(lassoPath(o).startsWith("M"));
  assert.equal(lassoPath(o, 0.5, 0.5), "");
});

test("landing.css declares the same colors as tokens.ts", () => {
  const css = readProjectFile("app/(landing)/landing.css");
  const value = (name) => css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim();
  const S = tokens.Site;
  const pairs = {
    ground: S.ground,
    card: S.card,
    text: S.text,
    "text-2": S.secondary,
    "text-3": S.tertiary,
    fill: S.fill,
    line: S.line,
  };
  for (const [name, hex] of Object.entries(pairs)) assert.equal(value(name)?.toLowerCase(), hex.toLowerCase(), name);
  assert.equal(value("ink").toLowerCase(), tokens.Colors.ink.toLowerCase());
  assert.equal(value("paper").toLowerCase(), tokens.Colors.paper.toLowerCase());
  assert.equal(value("accent").toLowerCase(), tokens.Colors.accent.toLowerCase());
  assert.equal(value("ink-2"), `rgb(12 12 12 / ${tokens.Colors.inkSecondary})`);
  assert.equal(value("ink-3"), `rgb(12 12 12 / ${tokens.Colors.inkTertiary})`);
  assert.equal(value("hair"), `rgb(12 12 12 / ${tokens.Colors.hairline})`);
  assert.equal(value("needs").toLowerCase(), tokens.Native.needsYou.toLowerCase());
  assert.equal(value("failed").toLowerCase(), tokens.Native.failed.toLowerCase());
  assert.equal(value("done").toLowerCase(), tokens.Native.done.toLowerCase());
});
