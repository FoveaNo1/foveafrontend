import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The pictures' looks (lib/landing/gradient.ts): five colours each, the effect's numbers in range,
// and the still fallback built from the same colours.
const { Presets, rgb, fallbackBackground } = loadTs("lib/landing/gradient.ts");

test("every look has five colours and its numbers in range", () => {
  for (const [name, p] of Object.entries(Presets)) {
    assert.equal(p.colors.length, 5, name);
    for (const c of p.colors) assert.match(c, /^#[0-9A-F]{6}$/i, name);
    for (const k of ["stripes", "band"]) assert.ok(p[k] >= 0 && p[k] <= 1, `${name}.${k}`);
    assert.ok(p.bandWidth > 0 && p.speed > 0, name);
  }
});

test("hex colours become 0…1 channels", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(rgb("#FF8000"))), [1, 128 / 255, 0]);
});

test("the fallback is the look's own colours", () => {
  const css = fallbackBackground(Presets.hero);
  for (const c of Presets.hero.colors) assert.ok(css.includes(c), c);
});
