import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The first screen's scene (lib/landing/film/hero.ts): Fovea's notch as FoveaV1 draws it since Oct 28 (notch.ts): the
// whole screen taken into Wings' pile, Yulun's words said and sent from Choose chat's sentence, the board a moment.
const { HB, HERO_LINE, HERO_SPEECH, heroAt, heroOutline } = loadTs("lib/landing/film/hero.ts");
const { CAPTURE, STAGE } = loadTs("lib/landing/film/tokens.ts");
const { NOUT, SIDE, pileW, sentenceH, boardH, pileSlot, bodyOf } = loadTs("lib/landing/film/notch.ts");

const near = (a, b, eps = 0.5) => Math.abs(a - b) <= eps;
const same = (o, want, eps = 0.5) => ["w", "h", "tr", "br"].every((k) => near(o[k], want[k], eps));
const times = (step = 0.05) => Array.from({ length: Math.ceil(HB.end / step) + 1 }, (_, i) => Math.min(HB.end, i * step));
const o = (t, k) => heroAt(t).k[k]?.o ?? 0;

test("the words are Yulun's, said in order, all of them before fn ⌃ is pressed again", () => {
  assert.equal(HERO_LINE, "The future of human agent interaction is here.");
  assert.equal(HERO_SPEECH.plain, HERO_LINE);
  for (let i = 1; i < HERO_SPEECH.words.length; i++) assert.ok(HERO_SPEECH.words[i].at > HERO_SPEECH.words[i - 1].at);
  assert.ok(HERO_SPEECH.end <= HB.done, `${HERO_SPEECH.end} > ${HB.done}`);
});

test("the notch is the app's: black at rest, Wings while it listens and transcribes, the sentence, the board", () => {
  const at = (t, want, what) => assert.ok(same(heroOutline(t), want), `${what}: ${JSON.stringify(heroOutline(t))}`);
  at(0.2, NOUT.rest, "at rest");
  at(HB.fn + 1, NOUT.wings(SIDE.listen), "Listening");
  at(HB.say + 0.5, NOUT.wings(pileW(1)), "the picture in its pile");
  at(HB.done + 1, NOUT.wings(SIDE.trans, SIDE.ring), "Transcribing");
  at(HB.choose + 1, NOUT.panel(sentenceH(1)), "Choose chat's sentence");
  at(HB.ret + 1.5, NOUT.board(boardH(1)), "the board");
  at(HB.end, NOUT.rest, "at rest again");
  // Wings is the menu bar's height and black; the glass, and the Halo in it, only for what opens under the notch
  for (const t of [0.2, HB.fn + 1, HB.done + 1]) {
    assert.equal(heroOutline(t).h, 32, `${t}`);
    assert.equal(o(t, "is:glass"), 0, `${t}: no glass`);
    assert.equal(o(t, "is:blk"), 1, `${t}: black`);
  }
  for (const t of [HB.choose + 1, HB.ret + 1.5]) assert.ok(o(t, "is:glass") > 0.99 && o(t, "is:halo") > 0.99 && o(t, "is:blk") < 0.01, `${t}`);
});

test("Wings says what it's doing: Listening, the screen's picture in its pile, then Transcribing and its ring", () => {
  const listen = HB.fn + 0.6, pile = HB.say + 0.5, trans = HB.done + 0.6;
  assert.ok(o(listen, "wb:listen") > 0.95 && o(listen, "wb:wave") > 0.95 && o(listen, "wb:pile") < 0.05);
  assert.ok(o(pile, "wb:pile") > 0.95 && o(pile, "wb:listen") < 0.05 && o(pile, "wb:c0") === 1);
  assert.ok(o(trans, "wb:trans") > 0.95 && o(trans, "wb:ring") > 0.95 && o(trans, "wb:wave") < 0.05 && o(trans, "wb:listen") < 0.05);
  // the bars move with the words: taller on a word than before the first is said
  const tallest = (t) => Math.max(...[0, 1, 2, 3, 4].map((i) => heroAt(t).k[`wb:b${i}`].h));
  assert.ok(tallest(HERO_SPEECH.words[2].at + 0.15) > tallest(listen) + 2);
  // the ring fills as the words are transcribed: past half (the arc's large flag) only near the end
  const large = (t) => heroAt(t).k["wb:arc"].d.split(" ")[3];
  assert.equal(large(HB.done + 0.3), "0");
  assert.equal(large(HB.choose - 0.15), "1");
});

test("⌘ ⌘ takes the whole screen: it lifts from the screen inset 40 pt and lands in Wings' pile", () => {
  const lifted = heroAt(HB.cap + 0.3).k["scr:fly"];
  assert.ok(near(lifted.x, CAPTURE.screenInset) && near(lifted.y, CAPTURE.screenInset) && near(lifted.w, STAGE.w - 2 * CAPTURE.screenInset), JSON.stringify(lifted));
  const t = HB.fly + CAPTURE.flight - 0.001, landed = heroAt(t).k["scr:fly"], slot = pileSlot(0, bodyOf(heroOutline(t)));
  for (const k of ["x", "y", "w", "h"]) assert.ok(near(landed[k], slot[k], 1), `${k}: ${landed[k]} vs ${slot[k]}`);
  assert.equal(heroAt(HB.fly + CAPTURE.flight + 0.1).k["wb:c0"].o, 1);
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

test("no aurora along the edge: the light sits in the bar's corner, only while it listens; the scene ends at rest", () => {
  const [from, to] = [HB.fn + 0.2, HB.done + 0.2];
  for (const t of times(0.1)) {
    for (const k of Object.keys(heroAt(t).k)) assert.ok(!/^au/.test(k), `${k} at ${t}`);
    if (t > from + 0.2 && t < to - 0.05) assert.ok(o(t, "wb:aur") > 0.95, `the corner lit at ${t}`);
    if (t > to + 0.25) assert.ok(o(t, "wb:aur") < 0.01, `the corner dark at ${t}`);
  }
  const f = heroAt(HB.end).k;
  for (const k of ["is:sent", "is:board"]) assert.equal(f[k].o, 0, k);
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

test("the scene says when the island is out past the notch, and only then", () => {
  assert.equal(heroAt(0.2).k.hd.st, "");
  assert.equal(heroAt(HB.say).k.hd.st, "open", "Wings is wider than the notch");
  assert.equal(heroAt(HB.choose + 1).k.hd.st, "open");
  assert.equal(heroAt(HB.ret + 1.5).k.hd.st, "open");
  assert.equal(heroAt(HB.end).k.hd.st, "");
});

test("nothing but its open state is written to the scene's root (a value there restyles the whole scene each frame)", () => {
  for (let t = 0; t <= HB.end; t += 0.25) assert.equal(heroAt(t).k.hd.v, undefined, `a value on the root at ${t}`);
});
