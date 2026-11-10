import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The landing page's words (lib/landing/bookCopy.ts) and the film's label (lib/landing/demo.ts).
const { BookCopy } = loadTs("lib/landing/bookCopy.ts");
const { Demo } = loadTs("lib/landing/demo.ts");

const strings = (v, out = []) => (typeof v === "string" ? out.push(v) : v && typeof v === "object" && Object.values(v).forEach((x) => strings(x, out)), out);

test("no empty strings and no exclamation marks", () => {
  for (const s of strings(BookCopy)) {
    assert.ok(s.trim().length > 0, "empty string");
    assert.doesNotMatch(s, /!/, s);
  }
});

test("nothing says Fovea isn't making glasses (Nov 9, Yulun: the team is considering them)", () => {
  const { LandingCopy } = loadTs("lib/landing/copy.ts");
  const { CARDS } = loadTs("lib/landing/film/content.ts");
  const { FILM_VIDEO_TRANSCRIPT } = loadTs("lib/landing/film/video.ts");
  for (const s of [...strings(BookCopy), ...strings(LandingCopy), ...strings(CARDS), FILM_VIDEO_TRANSCRIPT]) {
    assert.doesNotMatch(s, /\bnot\b[^.:]*\bglasses\b/i, s);
  }
});

test("the film's label says how long it runs", () => {
  assert.match(Demo.length, /^\d:\d\d$/);
});
