import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The first screen's scene (lib/landing/film/hero.ts): Fovea 1.0's notch as the film draws it, the whole screen
// taken, Yulun's words said and sent, nothing glowing under the notch.
const { HB, HERO_LINE, HERO_SPEECH, heroAt, heroOutline } = loadTs("lib/landing/film/hero.ts");
const { CAPTURE, OUTLINE, STAGE } = loadTs("lib/landing/film/tokens.ts");
const { STACK } = loadTs("lib/landing/film/film.ts");

const near = (a, b, eps = 0.5) => Math.abs(a - b) <= eps;
const times = (step = 0.05) => Array.from({ length: Math.ceil(HB.end / step) + 1 }, (_, i) => Math.min(HB.end, i * step));

test("the words are Yulun's, said in order, all of them before fn ⌃ is pressed again", () => {
  assert.equal(HERO_LINE, "The future of human agent interaction is here.");
  assert.equal(HERO_SPEECH.plain, HERO_LINE);
  for (let i = 1; i < HERO_SPEECH.words.length; i++) assert.ok(HERO_SPEECH.words[i].at > HERO_SPEECH.words[i - 1].at);
  assert.ok(HERO_SPEECH.end <= HB.done, `${HERO_SPEECH.end} > ${HB.done}`);
});

test("the notch is the app's: only the notch at rest, the voice bar 192 × 76, Choose chat, the board 400 wide", () => {
  const rest = heroOutline(0.2), bar = heroOutline(HB.say), choose = heroOutline(HB.choose + 1), board = heroOutline(HB.ret + 1.5), end = heroOutline(HB.end);
  assert.deepEqual([rest.w, rest.h], [OUTLINE.rest.w, OUTLINE.rest.h]);
  assert.ok(near(bar.w, 192) && near(bar.h, 76), JSON.stringify(bar));
  assert.ok(near(choose.w, OUTLINE.choose.w) && near(choose.h, OUTLINE.choose.h), JSON.stringify(choose));
  assert.ok(near(board.w, 400) && near(board.h, 96), JSON.stringify(board));
  assert.ok(near(end.w, rest.w) && near(end.h, rest.h), JSON.stringify(end));
  assert.equal(heroAt(0.2).k["is:glass"].o, 0);
});

test("⌘ ⌘ takes the whole screen: it lifts from the screen inset 40 pt and lands in the bar's first card", () => {
  const lifted = heroAt(HB.cap + 0.3).k["scr:fly"];
  assert.ok(near(lifted.x, CAPTURE.screenInset) && near(lifted.y, CAPTURE.screenInset) && near(lifted.w, STAGE.w - 2 * CAPTURE.screenInset), JSON.stringify(lifted));
  const landed = heroAt(HB.fly + CAPTURE.flight).k["scr:fly"];
  for (const k of ["x", "y", "w", "h"]) assert.ok(near(landed[k], STACK[0][k], 1), `${k}: ${landed[k]} vs ${STACK[0][k]}`);
  assert.equal(heroAt(HB.fly + CAPTURE.flight + 0.1).k["vb:t0"].o, 1);
});

test("each key shows whole for at least a second, in the order the app takes them", () => {
  const firstWhole = {};
  for (const id of ["fn", "cmd2", "fnDone", "ret"]) {
    let whole = 0;
    for (const t of times()) if ((heroAt(t).k[`key:${id}`]?.o ?? 0) > 0.95) { whole += 0.05; firstWhole[id] ??= t; }
    assert.ok(whole >= 1, `${id}: ${whole.toFixed(2)} s`);
  }
  assert.ok(firstWhole.fn < firstWhole.cmd2 && firstWhole.cmd2 < firstWhole.fnDone && firstWhole.fnDone < firstWhole.ret, JSON.stringify(firstWhole));
});

test("nothing glows under the notch, and the scene ends at rest with nothing over the desktop", () => {
  for (const t of times(0.1)) for (const k of Object.keys(heroAt(t).k)) assert.ok(!/aura/.test(k), `${k} at ${t}`);
  const f = heroAt(HB.end).k;
  for (const k of ["is:voice", "is:trans", "is:choose", "is:board"]) assert.equal(f[k].o, 0, k);
  for (const k of Object.keys(f)) if (/^(key|sub|scr|flash):/.test(k)) assert.ok(!(f[k].o > 0), k);
});

test("under Reduce Motion the one still is the session on the board, nothing in flight", () => {
  const f = heroAt(HB.still, { reduced: true }).k;
  assert.ok(f["is:board"].o > 0.99);
  assert.equal(f["scr:fly"], undefined);
});

test("on a frame of another shape the capture is a picture of what the frame shows, inset 40 pt", () => {
  const screen = { x: 325, y: 0, w: 820, h: 1773 };
  const r = heroAt(HB.cap + 0.3, { screen }).k["scr:fly"];
  assert.ok(near(r.x, 365) && near(r.y, 40) && near(r.w, 740) && near(r.h, 1693), JSON.stringify(r));
});

test("the scene says when a panel is open under the notch, and only then", () => {
  assert.equal(heroAt(HB.say).k.hd.st, "");
  assert.equal(heroAt(HB.choose + 1).k.hd.st, "open");
  assert.equal(heroAt(HB.ret + 1.5).k.hd.st, "open");
  assert.equal(heroAt(HB.end).k.hd.st, "");
});

test("nothing but its open state is written to the scene's root (a value there restyles the whole scene each frame)", () => {
  for (let t = 0; t <= HB.end; t += 0.25) assert.equal(heroAt(t).k.hd.v, undefined, `a value on the root at ${t}`);
});
