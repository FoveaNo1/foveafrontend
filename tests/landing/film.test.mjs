import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTs } from "./load-ts.mjs";

// The demo film (lib/landing/film): what it shows at any moment is a pure function of time, so it can be checked
// without a screen.
const { evaluate, WIDE } = loadTs("lib/landing/film/film.ts");
const { T, DURATION, CHAPTERS, CARDS, LINES, BEATS, CHOOSE, ANSWER, AGENT_ROW, line } = loadTs("lib/landing/film/content.ts");
const { fitCamera } = loadTs("lib/landing/film/camera.ts");
const { spring } = loadTs("lib/landing/film/ease.ts");
const { outlineAt } = loadTs("lib/landing/film/island.ts");
const { OUTLINE, DISPATCH, SPRING, CAPTURE } = loadTs("lib/landing/film/tokens.ts");
const { FilmPlayer } = loadTs("lib/landing/film/player.ts");
const { BookCopy } = loadTs("lib/landing/bookCopy.ts");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const o = (f, k) => f.k[k]?.o ?? 0;
const times = (step = 0.05, from = 0, to = DURATION) => { const out = []; for (let t = from; t <= to; t += step) out.push(+t.toFixed(3)); return out; };

test("the same moment is always the same frame", () => {
  for (const t of [0, 3.3, 12.4, 24.4, 33.1, 47.5, 58.6, 66.2, 75.5, 84.2, 92.0, 99.5]) assert.equal(JSON.stringify(evaluate(t)), JSON.stringify(evaluate(t)));
});

test("it runs about a minute and forty, in three chapters in order: Today, Soon, Next", () => {
  // Oct 17: no Before; the opening line says what the product is and belongs to Today
  assert.ok(Math.abs(DURATION - 101) <= 6, `${DURATION}`);
  assert.equal(JSON.stringify(CHAPTERS.map((c) => c.title)), JSON.stringify(["Today", "Soon", "Next"]));
  assert.equal(CHAPTERS[0].at, 0);
  for (let i = 1; i < CHAPTERS.length; i++) assert.ok(CHAPTERS[i].at > CHAPTERS[i - 1].at && CHAPTERS[i].at < DURATION);
});

test("the gaze ring only appears after the 'soon' card, and always under the Coming soon tag on the desk", () => {
  for (const t of times()) {
    const f = evaluate(t);
    if (t < T.C0) {
      assert.equal(o(f, "ring"), 0, `ring at ${t}`);
      assert.equal(o(f, "ph:1ring") + o(f, "cd:eyesRing"), 0, `a ring at ${t}`);
    }
    if (o(f, "ring") > 0.05) assert.ok(o(f, "tag:soon") > 0.5, `ring without the tag at ${t}`);
  }
});

test("Today's agent work is marked as sped up while it plays faster than it ran", () => {
  assert.ok(o(evaluate(T.B1 + 18), "tag:fast") > 0.5);
  assert.ok(o(evaluate(T.B2 + 9.5), "tag:fast") > 0.5);
});

test("the eyes are introduced as a way of capturing attention, not a cursor", () => {
  assert.match(CARDS.eyes.small, /^Not a cursor/);
});

test("what Today shows as coming back is marked In preview: in 1.0 those answers are simulated", () => {
  for (const t of times()) {
    if (t < T.B1 || t >= T.C0) continue;
    const f = evaluate(t);
    const desk = 1 - o(f, "paper");
    const result = Object.keys(f.k).some((k) => /^is:(board|answer|session)/.test(k) && o(f, k) * desk > 0.05);
    if (result) assert.ok(o(f, "tag:preview") >= desk - 0.01, `a result without the tag at ${t}`);
  }
});

// Pace: the reviewers asked twice for more time to read. Each thing to read stays whole long enough.
const held = (key, min, step = 0.05, from = 0, to = DURATION) => {
  const keys = [].concat(key);
  let run = 0, best = 0;
  for (const t of times(step, from, to)) { const f = evaluate(t); run = keys.some((k) => o(f, k) > 0.95) ? run + step : 0; best = Math.max(best, run); }
  return best >= min - 1e-6 ? true : best;
};

test("every card stays whole long enough to read", () => {
  for (const k of ["cd:title", "cd:titleSmall", "cd:eyes", "cd:eyesSmall", "cd:agents", "cd:agentsSmall", "cd:next", "cd:bar", "cd:wear", "cd:wearSmall", "cd:you", "cd:last"]) assert.equal(held(k, 1.25), true, k);
});

test("every spoken line, once whole, stays on screen", () => {
  for (const l of LINES) {
    const last = `sw:${l.id}:${l.words.length - 1}`;
    let run = 0, best = 0;
    for (const t of times(0.05)) { const f = evaluate(t); run = o(f, last) > 0.95 && o(f, `sub:${l.id}`) > 0.95 ? run + 0.05 : 0; best = Math.max(best, run); }
    assert.ok(best >= 1.15, `${l.id} whole for only ${best.toFixed(2)} s`);
  }
});

test("every result the agent sends back holds: long enough to read, a board as long as the app holds it", () => {
  for (const k of ["is:answer:b1", "is:answer:b2"]) assert.equal(held(k, 3.5, 0.1), true, k);
  // the app holds the board 3 s after Send; its content takes its delay and fade of that
  const board = DISPATCH.boardHold - SPRING.contentDelay - SPRING.content;
  for (const k of ["is:board:b1", "is:board:b2", "is:board:c2a"]) assert.equal(held(k, board, 0.1), true, k);
});

test("the look-dev's answer waits on the board, and the draft's opens by itself (within 8 s of Send)", () => {
  // Blender work takes minutes: the board opens on the notch first, then its row opens the session
  const first = (k, from, to) => times(0.05, from, to).find((t) => o(evaluate(t), k) > 0.05);
  const b1 = first("is:answer:b1", T.B1, T.B2), board = first("is:board:b1d", T.B1, T.B2);
  assert.ok(board !== undefined && b1 !== undefined && board < b1, "the board before the session");
  const sent = T.B2 + BEATS.B2.ret, draft = first("is:answer:b2", T.B2, T.C0);
  assert.ok(draft - sent <= DISPATCH.quickLimit, `the draft opened ${(draft - sent).toFixed(2)} s after Send`);
});

test("a caption waits until its result has been read for a while", () => {
  const first = (k) => times(0.05).find((t) => o(evaluate(t), k) > 0.05);
  assert.ok(first("cap:attach") - first("is:answer:b2") >= 1.2, "attach");
});

test("the agent is told only what it can see: in Blender nobody names Dana; she is named once the screen shows her", () => {
  for (const s of [line("vase").plain, CHOOSE.b1.request, ANSWER.question, ANSWER.lead, ANSWER.close, ...ANSWER.rows.flat()]) assert.doesNotMatch(s, /Dana/, s);
  assert.match(line("send").plain, /Dana/);
  assert.deepEqual([...CHOOSE.b2.kinds], ["screen"]);
});

test("each 'this' is said as its capture is made", () => {
  const vase = line("vase").words.filter((w) => w.mark === "capture").map((w) => w.at);
  const made = [T.B1 + BEATS.B1.up, T.B1 + BEATS.B1.drop, T.B1 + BEATS.B1.tup];
  vase.forEach((at, i) => assert.ok(Math.abs(at - made[i]) <= 0.1, `this #${i + 1} at ${at}, made at ${made[i]}`));
});

test("every rectangle a drag draws has its moving corner exactly at the pointer", () => {
  let seen = 0;
  for (const t of times(0.02)) {
    const f = evaluate(t), p = f.k.cursor;
    for (const k of ["sel"]) {
      const r = f.k[k];
      if (!r || !(r.o > 0) || !p) continue;
      seen++;
      const xs = [r.x, r.x + r.w], ys = [r.y, r.y + r.h];
      assert.ok(xs.some((x) => Math.abs(x - p.x) < 0.5) && ys.some((y) => Math.abs(y - p.y) < 0.5), `${k} apart from the pointer at ${t}`);
    }
  }
  assert.ok(seen > 20, "no drags seen");
});

test("a selection across words (no key) marks them up to the pointer, and no further", () => {
  let seen = 0;
  for (const t of times(0.02, T.B1 + BEATS.B1.tdown + 0.05, T.B1 + BEATS.B1.tup - 0.05)) {
    const f = evaluate(t), m = f.k["mk:text"], p = f.k.cursor;
    if (!m || !(m.o > 0) || !p) continue;
    seen++;
    assert.ok(Math.abs(m.x + m.w - p.x) < 0.5, `the mark apart from the pointer at ${t}`);
  }
  assert.ok(seen > 10, "no selection seen");
});

test("each capture is slow enough to follow: its mark whole for a second, its flight landing with the notch in view", () => {
  assert.equal(held("sel", 1.0, 0.02, T.B1, T.B2), true, "the ⌘ region");
  assert.equal(held("mk:text", 1.0, 0.02, T.B1, T.B2), true, "the selected words");
  assert.equal(held("vb:drop", 0.25, 0.02, T.B1, T.B2), true, "the well a dragged file lights");
  const b = BEATS.B1;
  const landings = [b.lift, b.drop, b.textFly].map((s) => T.B1 + s + CAPTURE.flight).concat([T.B2 + BEATS.B2.fly + CAPTURE.flight]);
  for (const L of landings) {
    const { s, tx, ty } = fitCamera(evaluate(L).aim, 1000, 650);
    const top = -ty / s, left = -tx / s, right = (1000 - tx) / s;
    assert.ok(top <= 1 && left <= 735 - 96 && right >= 735 + 96, `the notch out of view when a capture lands at ${L}`);
  }
});

test("on a laptop the wide shot is the whole screen; a phone still leans in", () => {
  const wide = fitCamera(WIDE, 900, 585);
  assert.ok(Math.abs(wide.s - 900 / 1470) < 1e-3 && Math.abs(wide.tx) < 0.5 && Math.abs(wide.ty) < 0.5, JSON.stringify(wide));
  assert.ok(fitCamera(WIDE, 390, 488).s > 390 / 1470 * 1.5);
});

test("the camera keeps the whole screen, and leans in only a little, to do or read something", () => {
  let wide = 0, n = 0;
  for (const t of times(0.05)) {
    const z = evaluate(t).aim.z;
    assert.ok(z <= 1.5 + 1e-9, `${z.toFixed(2)}× at ${t}`);
    if (t >= T.B1 && t < T.C0) { n++; if (z <= 1.02) wide++; }
  }
  assert.ok(wide / n >= 0.35, `the whole screen ${(100 * wide / n).toFixed(0)}% of Today`);
  // each scene opens on the whole screen for at least two seconds
  for (const start of [T.B1, T.B2, T.C1]) for (const u of [0.2, 1.0, 1.9]) assert.equal(evaluate(start + u).aim.z, 1, `zoomed at ${start + u}`);
});

test("Soon: all your agents as one; Fovea picks the chat by itself, a ring thinking in its place, then the chat", () => {
  assert.match(CARDS.agents.text, /as one/);
  assert.match(CARDS.agents.small, /session/);
  const c2 = CHOOSE.c2, s = BEATS.C;
  // nothing is offered to pick from: no suggestions, no list of sessions
  assert.ok(!c2.chips || c2.chips.length === 0, "Soon's Choose chat offers chats to pick");
  assert.ok(s.think[1] - s.think[0] >= 1.5, "the thinking is long enough to read as thinking");
  // while it thinks: the ring circles and fills, never emptying; the chat not yet shown
  let fill = -1, turns = new Set();
  for (const t of times(0.05, T.C1 + s.think[0] + 0.05, T.C1 + s.think[1])) {
    const f = evaluate(t), ring = f.k["ch:c2ring"];
    assert.ok(ring.o > 0.95 && o(f, "ch:c2pick") < 0.05, `at ${t}`);
    const da = parseFloat(ring.v["--da"]);
    assert.ok(da >= fill - 1e-9, `the ring empties at ${t}`);
    fill = da; turns.add(Math.round(parseFloat(ring.v["--rot"]) / 90));
  }
  assert.ok(turns.size >= 4, "the ring circles");
  // then the chat, and the ring gone
  const after = evaluate(T.C1 + s.settle + 0.4);
  assert.ok(o(after, "ch:c2pick") > 0.95 && o(after, "ch:c2ring") < 0.05);
});

test("the ring's label stays long enough to read", () => {
  assert.equal(held("ringLabel", 3.0, 0.05, T.C1, T.D0), true);
});

test("before Soon sends, the attachments open, and the second is held up close long enough to read", () => {
  assert.equal(held("c2:row", 0.6, 0.05, T.C1, T.D0), true, "the numbered row");
  assert.equal(held("c2:look", 2.0, 0.05, T.C1, T.D0), true, "the close look");
  const last = times(0.05, T.C1, T.D0).filter((t) => o(evaluate(t), "c2:look") > 0.05).pop();
  assert.ok(last < T.C1 + BEATS.C.send, "the close look is shut before it sends");
});

test("six personal agents, each its own icon", () => {
  assert.equal(JSON.stringify(AGENT_ROW.map((a) => a.name)), JSON.stringify(["Muse", "Claude Code", "Codex", "Grok Bot", "Instinct", "Manus"]));
  for (const a of AGENT_ROW) assert.ok(existsSync(path.join(root, "public", a.mark)), a.mark);
});

test("cards are the landing page's own words", () => {
  assert.equal(CARDS.next.text, BookCopy.s2.lead);
  assert.equal(CARDS.wear.text, BookCopy.s2.items[1][0]);
  assert.equal(CARDS.you.text, BookCopy.s3.title);
  assert.equal(CARDS.last.text, BookCopy.last);
});

test("spoken words appear in order, and never at the same time as a card", () => {
  for (const t of times(0.1)) {
    const f = evaluate(t);
    for (const l of LINES) {
      const shown = l.words.map((_, i) => o(f, `sw:${l.id}:${i}`) > 0);
      const first = shown.indexOf(false);
      if (first >= 0) assert.ok(shown.slice(first).every((s) => !s), `${l.id} out of order at ${t}`);
    }
    const speaking = LINES.some((l) => o(f, `sub:${l.id}`) > 0.05);
    const card = Object.keys(f.k).some((k) => k.startsWith("cd:") && k !== "cd:eyesRing" && o(f, k) > 0.05);
    const caption = Object.keys(f.k).some((k) => k.startsWith("cap:") && o(f, k) > 0.05);
    if (speaking && !["D2"].includes(f.shot)) assert.ok(!card, `a card and words at ${t}`);
    assert.ok(!(speaking && caption), `a caption and words at ${t}`);
  }
});

test("the camera, the island and the pointer move smoothly except at the cuts", () => {
  const cuts = [T.B1, T.B2, T.C0, T.C1, T.D0];
  let prev = evaluate(0);
  for (const t of times(0.01).slice(1)) {
    const f = evaluate(t);
    const nearCut = cuts.some((c) => Math.abs(t - c) < 0.02);
    if (!nearCut && f.shot === prev.shot) {
      assert.ok(Math.abs(f.aim.cx - prev.aim.cx) < 40 && Math.abs(f.aim.cy - prev.aim.cy) < 40 && Math.abs(f.aim.z - prev.aim.z) < 0.08, `camera jumps at ${t}`);
      const a = prev.k["is:glass"], b = f.k["is:glass"];
      // the app's springs are quick (a 0.24 s close from 880 wide), but never a jump
      if (a && b && a.o > 0.5 && b.o > 0.5) assert.ok(Math.abs(a.w - b.w) < 180, `island jumps at ${t}`);
    }
    prev = f;
  }
});

test("an interrupted spring starts where the outline was", () => {
  const keys = [{ at: 0, to: OUTLINE.rest, dur: 0 }, { at: 1, to: OUTLINE.choose, dur: 0.34 }, { at: 1.1, to: OUTLINE.bar, dur: 0.18 }];
  const before = outlineAt(keys, 1.0999), after = outlineAt(keys, 1.1001);
  assert.ok(Math.abs(before.w - after.w) < 2 && Math.abs(before.h - after.h) < 2);
  let last = -1;
  for (let p = 0; p <= 1; p += 0.01) { const v = spring(p); assert.ok(v >= last - 1e-9); last = v; }
  assert.ok(Math.abs(spring(1) - 1) < 1e-9);
});

test("the camera keeps what matters in a frame of any shape, and never shows past the screen", () => {
  const aim = { cx: 735, cy: 290, z: 1.35, minW: 700, minH: 560 };
  for (const [w, h] of [[1212, 788], [1280, 800], [900, 585], [366, 458], [390, 693]]) {
    const { s, tx, ty } = fitCamera(aim, w, h);
    assert.ok(tx <= 0.01 && ty <= 0.01 && tx + 1470 * s >= w - 0.01 && ty + 956 * s >= h - 0.01, `${w}×${h} shows past the edge`);
    if (w > 800) {
      const left = (0 - tx) / s, right = (w - tx) / s;
      assert.ok(left <= aim.cx - 300 && right >= aim.cx + 300, `${w}×${h} loses the subject`);
    }
  }
});

test("reduced motion: the camera holds still between its marks", () => {
  const a = evaluate(T.B1 + 1.5, { reduced: true }).aim, b = evaluate(T.B1 + 2.0, { reduced: true }).aim;
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});

test("the player plays, seeks, ends and starts again", () => {
  let now = 0, queued = null;
  const rendered = [];
  const p = new FilmPlayer({ duration: 2, chapters: [{ at: 0, title: "A" }, { at: 1, title: "B" }], render: (t) => rendered.push(t), clock: { now: () => now, raf: (cb) => { queued = cb; return 1; }, caf: () => { queued = null; } } });
  const seen = [];
  for (const e of ["play", "pause", "ended"]) p.addEventListener(e, () => seen.push(e));
  p.start();
  p.play();
  for (let i = 0; i < 30 && queued; i++) { now += 100; const cb = queued; queued = null; cb(); }
  assert.ok(p.ended && p.paused);
  assert.deepEqual(seen, ["play", "pause", "ended"]);
  assert.equal(p.chapterAt(1.5), 1);
  p.play();
  assert.equal(p.currentTime, 0);
  p.seek(1.2);
  assert.equal(p.currentTime, 1.2);
});

test("taking things (Oct 18): ⌘ once for the area selected, ⌘ twice the whole screen, no key for words or a file", () => {
  const { KEYS } = loadTs("lib/landing/film/content.ts");
  assert.deepEqual([...KEYS.cmd.caps], ["⌘"]);
  assert.deepEqual([...KEYS.cmd2.caps], ["⌘", "⌘"]);
  assert.equal("opt" in KEYS, false, "⌥ takes nothing in the film");
  const b = BEATS.B1;
  // the file is carried by the pointer from Finder onto the notch, and taken where it is let go
  let carried = 0;
  for (const t of times(0.02, T.B1 + b.grab + 0.2, T.B1 + b.drop - 0.02)) {
    const f = evaluate(t), d = f.k["fl:drag"], p = f.k.cursor;
    if (!d || !p) continue;
    carried++;
    assert.ok(p.x > d.x && p.x < d.x + d.w && p.y > d.y && p.y < d.y + d.h, `the file left behind at ${t}`);
  }
  assert.ok(carried > 20, "no drag seen");
  const atDrop = evaluate(T.B1 + b.drop - 0.02);
  assert.ok(atDrop.k.cursor.y < 76 && Math.abs(atDrop.k.cursor.x - 735) < 96, "let go away from the notch");
  // no key cap shows while the file or the words are taken
  for (const t of times(0.05, T.B1 + b.grab, T.B1 + b.tup)) {
    const f = evaluate(t);
    for (const k of Object.keys(f.k)) if (k.startsWith("key:") && k !== "key:fn" && k !== "key:cmd") assert.ok(!(f.k[k].o > 0), `${k} at ${t}`);
  }
  // the words stay highlighted, taken, until the request is sent
  assert.equal(evaluate(T.B1 + b.ret - 0.5).k["mk:text"].st, "taken");
});

test("nothing is written to the film's root as it plays: a value there restyles every part, and Safari on a phone ran out of memory repainting them (Oct 18)", () => {
  for (const t of times(0.5)) assert.equal(evaluate(t).k.root, undefined, `the root written at ${t}`);
});
