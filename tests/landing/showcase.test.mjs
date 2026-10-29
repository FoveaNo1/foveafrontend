import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The showcase after the film (lib/landing/film/showcase.ts): three scenes, each one thing Fovea does today, drawn on a
// Mac's whole screen in dark mode with the notch as FoveaV1 draws it since Oct 28 (notch.ts: Wings, the Halo, the
// Sentence, one board, a session popping up by itself). Pure functions of time, so they can be checked without a
// screen.
const {
  SCENES, REST, SC_KEYS, showFit, PB, PT, DROP_AT, PT_R1, PT_R2, ptButton, POINT_LINE, POINT_CHAT, P_SLOTS, P_VOICE, P_TRANS, P_LANDS,
  NB, NA, NP, NQ, N_RUN, N_GRAB, N_DROP, PULL, MORE_LINE, pulledAt, N_VOICE, N_TRANS,
  TB, TK, TK_REGION, TALK, TALK_DROP, TALK_ADD, TALK_OUT, T_VOICE, T_TRANS, pointerOf, pointOutline, talkOutline,
} = loadTs("lib/landing/film/showcase.ts");
const { NOUT, SIDE, pileW, sentenceH, boardH, auroraAt, DROP_ZONE } = loadTs("lib/landing/film/notch.ts");
const { STAGE, SPEECH, NOTCH } = loadTs("lib/landing/film/tokens.ts");
const { CARDS, KEYS } = loadTs("lib/landing/film/content.ts");
const { BookCopy } = loadTs("lib/landing/bookCopy.ts");

const o = (f, k) => f.k[k]?.o ?? 0;
const times = (len, step = 0.05) => Array.from({ length: Math.floor(len / step) + 1 }, (_, i) => +(i * step).toFixed(3));
const near = (a, b, eps = 0.5) => Math.abs(a - b) <= eps;
const same = (a, b, eps = 0.5) => ["w", "h", "tr", "br"].every((k) => near(a[k], b[k], eps));
const inside = (r, outer) => r.x >= outer.x && r.y >= outer.y && r.x + r.w <= outer.x + outer.w && r.y + r.h <= outer.y + outer.h;
/** The longest stretch a part stays whole (opacity > .95) in a scene. */
const held = (id, key, step = 0.05) => {
  let run = 0, best = 0;
  for (const t of times(SCENES[id].len, step)) { run = o(SCENES[id].at(t), key) > 0.95 ? run + step : 0; best = Math.max(best, run); }
  return best;
};
/** The island's glass box at t (x, w, h from the frame). */
const glass = (id, t) => SCENES[id].at(t).k["is:glass"];
const words = (line, idx) => idx.map((i) => line.words[i].text).join(" ");

test("the copy: Yulun's words, a draft title for the second item, words for a screen reader", () => {
  const s = BookCopy.showcase;
  assert.deepEqual([...s.items].map((i) => i.id), ["point", "notch", "talk"]);
  for (const i of s.items) {
    assert.ok(i.title && i.text && i.label, i.id);
    assert.ok(i.id in SCENES, i.id);
  }
  assert.equal(s.items[0].title, "Stay in the window.");
  assert.equal(s.items[0].text, "Take any attachments, talk to your Codex or Claude Code through Fovea.");
  assert.match(s.items[1].text, /Claude Code and Codex/);
  assert.equal(s.items[2].title, "Talk, and it cleans up for you.");
  assert.equal(s.items[2].text, "Press fn and think out loud: change your mind, come back to a point, and add attachments.", "Yulun's words (Oct 27)");
  assert.match(s.items[1].label, /pops up from the notch/);
  assert.match(s.items[1].label, /pulled out of the notch/);
  assert.match(s.items[0].label, /drop zone/);
});

test("the same moment is always the same frame, and every scene loops through the dark", () => {
  for (const [id, sc] of Object.entries(SCENES)) {
    for (const t of [0.3, 2, sc.len / 2, sc.len - 0.2]) assert.equal(JSON.stringify(sc.at(t)), JSON.stringify(sc.at(t)), `${id} ${t}`);
    assert.equal(o(sc.at(0), "dip"), 1, `${id} comes up out of the dark`);
    assert.equal(o(sc.at(REST), "dip"), 0, `${id} rests on the desk`);
    assert.ok(o(sc.at(sc.len - 0.01), "dip") > 0.95, `${id} goes back into the dark`);
    assert.ok(sc.still > REST && sc.still < sc.len - 0.5, `${id}'s still is inside the scene`);
    // the notch is at rest, black, where the loop meets itself
    for (const t of [REST, sc.len - 0.05]) {
      assert.equal(o(sc.at(t), "is:glass"), 0, `${id} ${t}: no glass`);
      assert.equal(o(sc.at(t), "is:blk"), 1, `${id} ${t}: the notch's black`);
      assert.ok(near(sc.at(t).k["is:blk"].w, NOTCH.w), `${id} ${t}: the notch's width`);
    }
  }
});

test("a frame shows the whole screen, so the notch is the size it is on a real Mac; a phone's has a strip under it", () => {
  // the frames' own shapes: the screen's, and a phone's taller one
  for (const [W, H] of [[913, 913 * 956 / 1470], [760, 760 * 956 / 1470], [358, 358 * 1530 / 1470]]) {
    const { s, tx, ty } = showFit(W, H);
    assert.equal(ty, 0, "the menu bar at the frame's top edge");
    assert.ok(STAGE.w * s <= W + 0.01 && STAGE.h * s <= H + 0.01, `${W}: the whole screen shows`);
    assert.ok(near(STAGE.w * s, W, 0.01), `${W}: edge to edge`);
    assert.ok(near(tx + (STAGE.w / 2) * s, W / 2, 0.01), `${W}: the notch centred`);
    // the notch takes the share of the frame's width it takes of a 13-inch MacBook Air's screen
    assert.ok(near((NOTCH.w * s) / W, 180 / 1470, 0.001), `${W}`);
  }
  assert.ok(showFit(358, 358 * 1530 / 1470).s * STAGE.h < 358 * 1530 / 1470 - 100, "a phone's strip under the screen");
});

test("every key shown is whole long enough to read, and says what it does there", () => {
  const caps = { point: ["fn", "cmd", "fnDone", "toCodex"], notch: ["more", "moreDone"], talk: ["vf", "cmd", "vfDone"] };
  for (const [id, keys] of Object.entries(caps)) for (const k of keys) assert.ok(held(id, `key:${k}`) >= 0.8, `${id} ${k}: ${held(id, `key:${k}`)}`);
  assert.equal(SC_KEYS.toCodex.label, "to your Codex");
  assert.deepEqual([...SC_KEYS.toCodex.caps], ["enter"], "the key that sends is enter (Yulun, Oct 25), not return");
  assert.deepEqual([...SC_KEYS.vf.caps], ["fn"], "Voiceflow is fn alone");
  assert.deepEqual([...SC_KEYS.fn.caps], ["fn", "⌃"], "a request to an agent is fn ⌃, as in the film");
});

test("the words are said in order, each ending before its fn ends it, and stay whole long enough to read", () => {
  for (const [line, end] of [[POINT_LINE, PB.done], [MORE_LINE, NB.moreDone], [TALK[TALK.length - 1], TB.done]]) {
    for (let i = 1; i < line.words.length; i++) assert.ok(line.words[i].at > line.words[i - 1].at, line.id);
    assert.ok(line.end <= end, `${line.id}: ${line.end} > ${end}`);
  }
  // talking out loud: one line after another, never over each other
  for (let i = 1; i < TALK.length; i++) assert.ok(TALK[i].start >= TALK[i - 1].end + 0.2, TALK[i].id);
  assert.ok(held("point", `sw:point:${POINT_LINE.words.length - 1}`) >= SPEECH.hold, "point");
  assert.ok(held("notch", `sw:more:${MORE_LINE.words.length - 1}`) >= SPEECH.hold, "notch");
  assert.ok(held("talk", `sw:t4:${TALK[3].words.length - 1}`) >= 4, "talk: everything said stays up to compare");
});

test("point: each 'this' is said as its capture is let go, and the spec as it is dropped", () => {
  const w = POINT_LINE.words;
  assert.equal(POINT_LINE.plain, "Line this up with this one, like the spec.");
  assert.equal(w[1].at, PB.up1);
  assert.equal(w[4].at, PB.up2);
  assert.equal(w[7].at, PB.drop);
  assert.deepEqual([...w].filter((x) => x.mark === "capture").map((x) => x.text), ["this", "this", "one,", "the", "spec."]);
});

test("point: ⌘ takes the button that sits low and the one that's right; the spec is let go in the drop zone", () => {
  assert.ok(inside(ptButton(1), PT_R1), "the low button is inside the first region");
  assert.ok(inside(ptButton(0), PT_R2), "the right one is inside the second");
  assert.equal(ptButton(1).y - ptButton(0).y, PT.low, "the middle button sits low");
  for (const r of [PT_R1, PT_R2]) assert.ok(inside(r, PT.win), "both are in the browser: the person stays in the window");
  // the region follows the pointer while ⌘ drags, and is gone once its picture flies
  const mid = PB.down1 + (PB.up1 - PB.down1) / 2;
  assert.ok(o(SCENES.point.at(mid), "sel") === 1);
  assert.equal(o(SCENES.point.at(PB.lift1 + 0.2), "sel"), 0);
  // dragged near the notch, the drop zone opens under the bar; over it, it lights; let go there, it closes
  assert.equal(SCENES.point.at(PB.near - 0.1).k.dz, undefined);
  const over = SCENES.point.at(PB.drop - 0.1);
  assert.ok(o(over, "dz") > 0.9 && over.k.dz.st === "on", JSON.stringify(over.k.dz));
  assert.equal(SCENES.point.at(PB.drop + 0.3).k.dz, undefined);
  assert.ok(inside({ x: DROP_AT.x, y: DROP_AT.y, w: 0, h: 0 }, DROP_ZONE), "let go over the drop zone");
  // all three in the bar's pile once they've landed, before fn ⌃ ends the request; the bar's left is the pile
  const bar = SCENES.point.at(PB.done - 0.1);
  for (const i of [0, 1, 2]) assert.ok(o(bar, `wb:c${i}`) > 0.5, `wb:c${i}`);
  assert.deepEqual([0, 1, 2].map((i) => bar.k[`wb:c${i}`].st), ["low", "ok", "spec"]);
  assert.ok(o(bar, "wb:pile") > 0.95 && o(bar, "wb:listen") < 0.05);
  assert.ok(same(pointOutline(PB.done - 0.1), NOUT.wings(pileW(3))), JSON.stringify(pointOutline(PB.done - 0.1)));
  assert.ok(P_LANDS.every((t, i) => i === 0 || t > P_LANDS[i - 1]));
});

test("point: the notch is the app's, and it goes to the person's own Codex, which lines the button up", () => {
  assert.ok(same(pointOutline(PB.fn + 0.5), NOUT.wings(SIDE.listen)), "Wings, Listening");
  assert.ok(same(pointOutline(PB.done + 0.6), NOUT.wings(SIDE.trans, SIDE.ring)), "Wings, Transcribing");
  assert.ok(same(pointOutline(PB.choose + 0.8), NOUT.panel(sentenceH(1))), "Choose chat's sentence");
  assert.ok(same(pointOutline(PB.ret + 1.2), NOUT.board(boardH(2, 2))), "the board: the greeting over two kinds of row");
  assert.ok(o(SCENES.point.at(PB.say + 0.5), "is:glass") === 0, "Wings is black, not glass");
  const sent = glass("point", PB.choose + 0.8);
  assert.ok(near(sent.w + 21, 516) && near(sent.h, sentenceH(1) + 6), JSON.stringify(sent));
  assert.equal(POINT_CHAT.agent, "codex");
  // Transcribing between the bar and Choose chat; the board holds three seconds as the app's does
  assert.ok(near(P_SLOTS.sent[0][0] - P_TRANS[0][0], 1.0, 0.05));
  assert.ok(near(P_VOICE[0][1], P_TRANS[0][0], 0.001), "Transcribing as listening ends");
  assert.ok(near(P_SLOTS.board[0][1] - P_SLOTS.board[0][0], 3, 0.05));
  // at work while the button is low; done, the button in line
  assert.equal(SCENES.point.at(PB.ret + 0.5).k["pt:row"].st, "working");
  assert.equal(SCENES.point.at(PB.fixed + 0.1).k["pt:row"].st, "done");
  assert.equal(SCENES.point.at(PB.ret).k["pt:low"].y, PT.low);
  assert.equal(SCENES.point.at(PB.fix[1] + 0.1).k["pt:low"].y, 0);
  assert.ok(held("point", "tag:fast") >= 1.5, "the sped-up work is said to be sped up");
});

test("notch: Claude Code's chat pops up asking, the run is allowed in place, and it goes; Codex's pops up done", () => {
  // nothing opened it: it pops up by itself, the session's own chat with what it asks
  assert.ok(near(glass("notch", NB.ask + 1).h, NA.h + 6));
  assert.ok(o(SCENES.notch.at(NB.ask + 1), "is:asks") > 0.95);
  // Run Tests is where the pointer clicks; allowed, it's back at work
  const at = SCENES.notch.at(NB.allow).k.cursor;
  assert.ok(near(at.x, N_RUN.x, 2) && near(at.y, N_RUN.y + 1, 2), JSON.stringify(at));
  assert.equal(SCENES.notch.at(NB.allow - 0.1).k["na:body"].st, "needs");
  assert.equal(SCENES.notch.at(NB.allowed + 0.1).k["na:body"].st, "working");
  assert.ok(NB.gone - NB.allowed >= 1.1 && NB.gone - NB.allowed <= 1.3, "answered, it goes 1.2 s later (POP_UP.md)");
  // then the island rests, until Codex's chat pops up with its answer
  assert.equal(o(SCENES.notch.at(NB.gone + 0.6), "is:glass"), 0);
  assert.ok(near(glass("notch", NB.done + 1).h, NP.h + 6));
  assert.ok(held("notch", "is:answer") >= 4, "the answer stays long enough to read");
});

test("notch: a follow-up by voice over the session, Wings on its glass beside the notch; both exchanges after", () => {
  const listen = SCENES.notch.at(NB.say + 0.5), trans = SCENES.notch.at(NB.moreDone + 0.5);
  assert.ok(o(listen, "wo") > 0.95 && o(listen, "wo:listen") > 0.95 && o(listen, "wo:wave") > 0.95 && o(listen, "wo:aur") > 0.95);
  assert.ok(o(trans, "wo:trans") > 0.95 && o(trans, "wo:ring") > 0.95);
  // the session stays where it was
  assert.equal(listen.k["an:body"]?.y, undefined);
  assert.ok(near(glass("notch", NB.say + 0.5).h, NP.h + 6));
  assert.ok(near(N_VOICE[0][1], N_TRANS[0][0], 0.001));
  // the question goes in: both exchanges, the request's bubble in the column the outline's gutter leaves, Stop in the bar
  assert.ok(near(glass("notch", NB.back + 1).h, NQ.h + 6));
  const asked = SCENES.notch.at(NB.back + 1);
  assert.ok(o(asked, "an:q2") > 0.95);
  assert.ok(near(asked.k["an:b1"].x, -NQ.gutter));
  assert.equal(asked.k["an:bar"].st, "working");
  assert.equal(SCENES.notch.at(NB.done + 1).k["an:bar"].st, "done");
  assert.equal(o(asked, "wo"), 0, "the bar is gone once the question is in");
});

test("notch: the chat is pulled out by its grab bar into a window, where its answer comes in", () => {
  const p = pointerOf.notch;
  // the pointer takes the grab bar, at the session's foot
  assert.ok(near(p(NB.grab).x, N_GRAB.x, 1) && near(p(NB.grab).y, N_GRAB.y, 1));
  assert.ok(N_GRAB.y > NQ.follow + 26 && N_GRAB.y < NQ.h);
  // nothing comes out until the bar is pulled past 28 pt below where it was taken
  assert.equal(o(SCENES.notch.at(NB.pull - 0.05), "pw:glass"), 0);
  assert.ok(p(NB.pull).y - N_GRAB.y >= PULL.threshold, `${p(NB.pull).y - N_GRAB.y}`);
  // out, it follows the pointer, its top 18 pt above it, the session behind it dimmed
  const t = (NB.pull + NB.drop) / 2, f = SCENES.notch.at(t);
  const r = pulledAt(p(t));
  assert.ok(near(f.k.pw.x, r.x, 0.01) && near(f.k.pw.y, r.y, 0.01));
  assert.ok(near(p(t).y - f.k.pw.y, PULL.grip, 0.01));
  assert.equal(o(f, "an:body"), 0.25);
  // let go, it stays where it was let go, whole, inside the screen; the notch is the board a moment, then rests
  const after = SCENES.notch.at(NB.drop + 1);
  const at = pulledAt(N_DROP);
  assert.ok(near(after.k.pw.x, at.x, 0.01) && near(after.k.pw.y, at.y, 0.01));
  assert.ok(o(after, "pw:glass") > 0.99 && o(after, "pw:body") > 0.99);
  assert.ok(inside(at, { x: 0, y: 32, w: STAGE.w, h: STAGE.h - 32 }), JSON.stringify(at));
  assert.ok(near(glass("notch", NB.drop + 1).h, boardH(2) + 6), "the board a moment");
  assert.equal(o(SCENES.notch.at(NB.rest + 0.6), "is:glass"), 0, "then the notch rests");
  // the answer comes in where it was at work, after the notch has rested, and stays to be read
  assert.equal(SCENES.notch.at(NB.answer - 0.1).k["pw:bar"].st, "working");
  assert.equal(SCENES.notch.at(NB.answer + 0.4).k["pw:bar"].st, "done");
  assert.ok(NB.answer > NB.rest);
  assert.ok(held("notch", "pw:a2") >= 2, "the answer in the window stays long enough to read");
});

test("talk: what's taken back goes, what's remembered last goes in the list, and the picture follows the words", () => {
  // the transcript: the video, struck as it's taken back and not before; the launch email, marked as it's said
  assert.equal(words(TALK[TALK_DROP.line], [...TALK_DROP.words]), "the demo video,");
  assert.equal(words(TALK[TALK_ADD.line], [...TALK_ADD.words]), "the launch email.");
  const k = (t, i) => SCENES.talk.at(t).k[`sw:t1:${i}`]?.st;
  assert.equal(k(TALK_DROP.at - 0.05, 8), "said");
  assert.equal(k(TALK_DROP.at + 0.05, 8), "x");
  assert.equal(SCENES.talk.at(TALK[3].words[7].at + 0.05).k["sw:t4:7"].st, "add");
  assert.equal(SCENES.talk.at(TALK[3].words[7].at - 0.05).k["sw:t4:7"], undefined, "a word not yet said isn't there");
  // what's written: the list in the order it was said, without what was taken back, with what was remembered last
  const said = TALK[0].plain.toLowerCase();
  const items = TALK_OUT.list.map((x) => x.toLowerCase());
  assert.ok(!items.some((x) => x.includes("video")), "the video is gone");
  assert.equal(items[items.length - 1], "the launch email", "the item remembered last is in the list");
  for (let i = 1; i < items.length - 1; i++) assert.ok(said.indexOf(items[i]) > said.indexOf(items[i - 1]), items[i]);
  // the words land only once cleaned up ("Thinking" and its ring in the bar), the picture after them
  assert.ok(near(T_TRANS[0][1] - T_TRANS[0][0], 1.1, 0.06));
  assert.ok(o(SCENES.talk.at(TB.done + 0.6), "wb:think") > 0.95 && o(SCENES.talk.at(TB.done + 0.6), "wb:ring") > 0.95);
  assert.ok(same(talkOutline(TB.done + 0.6), NOUT.wings(SIDE.think, SIDE.ring)));
  assert.equal(o(SCENES.talk.at(TB.paste - 0.05), "tk:text"), 0);
  assert.ok(o(SCENES.talk.at(TB.paste + 0.2), "tk:text") > 0.95);
  assert.ok(o(SCENES.talk.at(TB.paste + 0.1), "tk:shot") < 0.5 && o(SCENES.talk.at(TB.paste + 0.4), "tk:shot") > 0.95);
  assert.ok(held("talk", "tk:text") >= 4, "the written words stay long enough to read");
});

test("talk: ⌘ takes the phone's banner while talking, and the words land in the email under the pointer", () => {
  const phone = TK.phone, screen = { x: phone.x + 9, y: phone.y + 9, w: phone.w - 18, h: phone.h - 18 };
  assert.ok(inside(TK_REGION, screen), "the region is the phone's screen alone");
  assert.ok(inside(TK.banner, TK_REGION), "and holds the whole banner");
  // "this" is said as the region is let go; its picture flies into the bar's pile while still listening
  assert.equal(TALK[2].words[7].at, TB.up);
  const bar = SCENES.talk.at(TB.done - 0.1);
  assert.ok(TB.lift < TB.done && o(bar, "wb:c0") > 0.95 && o(bar, "wb:pile") > 0.95);
  assert.equal(bar.k["wb:c0"].st, "banner");
  // the pointer is back over the email's words when they land (IslandLive.findLanding: the field under the pointer)
  const p = pointerOf.talk(TB.paste);
  const body = { x: TK.win.x + 14, y: TK.win.y + 130, w: TK.win.w - 28, h: TK.win.h - 144 };
  assert.ok(inside({ x: p.x, y: p.y, w: 0, h: 0 }, body), JSON.stringify(p));
  // the keys and the words over the screen sit under the email and the phone (a desktop frame)
  assert.ok(TK.win.y + TK.win.h <= STAGE.h * 0.68 && phone.y + phone.h <= STAGE.h * 0.68);
});

test("the light in the bar's corner: while it listens, Voiceflow and Dispatch alike; no aurora along the edge", () => {
  for (const [id, k, voice] of [["point", "wb", P_VOICE], ["notch", "wo", N_VOICE], ["talk", "wb", T_VOICE]]) {
    const [from, to] = voice[0];
    assert.ok(o(SCENES[id].at((from + to) / 2), `${k}:aur`) > 0.95, `${id}: lit while listening`);
    assert.ok(o(SCENES[id].at(to + 0.4), `${k}:aur`) < 0.01, `${id}: gone once it's done`);
    for (const t of times(SCENES[id].len, 0.25)) for (const key of Object.keys(SCENES[id].at(t).k)) assert.ok(!/^au/.test(key), `${id} ${t}: ${key}`);
  }
  // quiet, a little of it; the voice brightens and grows the lights
  const quiet = auroraAt(1, 0), loud = auroraAt(1, 1);
  assert.ok(loud.lights[0].o > quiet.lights[0].o + 0.3 && loud.lights[0].w > quiet.lights[0].w, JSON.stringify([quiet.lights[0], loud.lights[0]]));
  assert.ok(quiet.lights[0].o > 0.4, "never dark while it listens");
});

test("the film names the viewer's own agents: under its first line, at the first send, while the work runs", () => {
  assert.match(CARDS.title.small, /your own Claude Code and Codex/);
  assert.equal(KEYS.ret.label, "to your Claude Code");
});
