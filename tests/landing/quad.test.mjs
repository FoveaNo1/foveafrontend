import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The flat box laid onto a photograph's laptop screen (lib/landing/quad.ts).
const { homography, apply, matrix3d, rectQuad } = loadTs("lib/landing/quad.ts");

const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test("the box's corners land on the quad's corners", () => {
  const q = [{ x: 426, y: 186 }, { x: 981, y: 191 }, { x: 1025, y: 555 }, { x: 461, y: 570 }];
  const H = homography(1092, 710, q);
  [[0, 0], [1092, 0], [1092, 710], [0, 710]].forEach(([x, y], i) => {
    const p = apply(H, { x, y });
    assert.ok(close(p.x, q[i].x, 1e-6) && close(p.y, q[i].y, 1e-6), `${i}: ${p.x},${p.y}`);
  });
});

test("a rectangle onto itself, scaled, is a plain scale and move", () => {
  const H = homography(100, 50, rectQuad(10, 20, 200, 100));
  assert.ok(close(H[0], 2) && close(H[4], 2) && close(H[2], 10) && close(H[5], 20) && close(H[6], 0) && close(H[7], 0));
  assert.match(matrix3d(100, 50, rectQuad(0, 0, 100, 50)), /^matrix3d\(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1\)$/);
});
