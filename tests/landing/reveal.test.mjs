import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The word reveal (lib/landing/reveal.ts): the words keep the text, and however long the line, its
// last word starts within the cap.
const { splitWords, wordDelay } = loadTs("lib/landing/reveal.ts");
const { Reveal } = loadTs("lib/landing/tokens.ts");
const { LandingCopy } = loadTs("lib/landing/copy.ts");

test("the words put back together are the text, exactly", () => {
  for (const p of LandingCopy.pages) {
    for (const t of [p.title, ...p.blocks.filter((b) => b.kind === "p").map((b) => b.text)]) {
      assert.equal(splitWords(t).join(" "), t);
    }
  }
});

test("a long line is squeezed so its last word starts within the cap", () => {
  assert.equal(wordDelay(0, 10), 0);
  assert.equal(wordDelay(3, 10), Math.round(3 * Reveal.wordStagger * 1000) / 1000);
  assert.ok(wordDelay(99, 100) <= Reveal.maxSpread + 1e-9);
  assert.equal(wordDelay(0, 1), 0);
});
