import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

const { bindReferences, requestParts } = loadTs("lib/landing/engine/binding.ts");
const { feedKey, flushMeta, initialGesture, Gesture } = loadTs("lib/landing/engine/gestures.ts");
const { initialState, reduce, snap, Timing } = loadTs("lib/landing/engine/reducer.ts");
const { instruction } = loadTs("lib/landing/engine/instruction.ts");
const { outlineFor, springDuration, springEasing } = loadTs("lib/landing/engine/geometry.ts");
const { DemoEngine } = loadTs("lib/landing/engine/runtime.ts");
const { SCENARIOS, nextScenario } = loadTs("lib/landing/scenarios/index.ts");

const plain = (v) => JSON.parse(JSON.stringify(v));

// ── Binding ────────────────────────────────────────────────────────────────────────────────────

test("“this one … that one” bind to the referents in the order they were taken", () => {
  const text = "Make this one line up with that one.";
  const b = plain(bindReferences(text, 2));
  assert.deepEqual(b.map((x) => [text.slice(x.start, x.end), x.referent]), [["this one", 1], ["that one", 2]]);
});

test("“these” takes every referent, and “this week” is not deictic", () => {
  const text = "Draft this week's update from these.";
  const b = plain(bindReferences(text, 3));
  assert.deepEqual(b.map((x) => x.referent), [1, 2, 3]);
  assert.ok(b.every((x) => text.slice(x.start, x.end) === "these"));
});

test("an ordinal binds to its referent and “this one” takes what is left", () => {
  const text = "Make the ears on this one match, and use the spacing from the second one.";
  const b = plain(bindReferences(text, 2));
  assert.deepEqual(b.map((x) => [text.slice(x.start, x.end), x.referent]), [["this one", 1], ["the second one", 2]]);
});

test("“that” as a conjunction binds nothing; no referents, no bindings", () => {
  assert.equal(bindReferences("Tell her that it works.", 1).length, 0);
  assert.equal(bindReferences("Make this one red.", 0).length, 0);
});

test("request parts carry the referent numbers of their words", () => {
  const text = "Make this one line up with that one.";
  const parts = plain(requestParts(text, bindReferences(text, 2)));
  assert.deepEqual(parts, ["Make ", { text: "this one", referents: [1] }, " line up with ", { text: "that one", referents: [2] }, "."]);
});

// ── Keys ───────────────────────────────────────────────────────────────────────────────────────

const keys = (seq) => {
  let state = initialGesture;
  const events = [];
  let flushAt;
  for (const k of seq) {
    if (k.flush) {
      const f = flushMeta(state, k.at);
      state = f.state;
      events.push(...f.events);
      continue;
    }
    const r = feedKey(state, k);
    state = r.state;
    events.push(...r.events);
    flushAt = r.flushAt ?? flushAt;
  }
  return { events: plain(events).map((e) => e.type), flushAt };
};

test("a bare ⌃ tap is fn ⌃: a request", () => {
  assert.deepEqual(keys([{ kind: "down", key: "Control", at: 0 }, { kind: "up", key: "Control", at: 90 }]).events, ["KEY_REQUEST"]);
});

test("⌃ held too long, or with another key, is not a tap", () => {
  assert.deepEqual(keys([{ kind: "down", key: "Control", at: 0 }, { kind: "up", key: "Control", at: Gesture.tap + 50 }]).events, []);
  assert.deepEqual(
    keys([{ kind: "down", key: "Control", at: 0 }, { kind: "down", key: "c", at: 20 }, { kind: "up", key: "Control", at: 80 }]).events,
    [],
  );
});

test("⌘ once arms a region (after the double-press window); ⌘ twice is the whole screen", () => {
  const once = keys([{ kind: "down", key: "Meta", at: 0 }, { kind: "up", key: "Meta", at: 60 }]);
  assert.deepEqual(once.events, []);
  assert.equal(once.flushAt, 60 + Gesture.double);
  assert.deepEqual(
    keys([{ kind: "down", key: "Meta", at: 0 }, { kind: "up", key: "Meta", at: 60 }, { flush: true, at: 60 + Gesture.double }]).events,
    ["ARM_REGION"],
  );
  assert.deepEqual(
    keys([
      { kind: "down", key: "Meta", at: 0 },
      { kind: "up", key: "Meta", at: 60 },
      { kind: "down", key: "Meta", at: 200 },
      { kind: "up", key: "Meta", at: 260 },
    ]).events,
    ["WHOLE_SCREEN"],
  );
});

test("return sends, esc steps out; a held key's repeats are ignored", () => {
  assert.deepEqual(keys([{ kind: "down", key: "Enter", at: 0 }, { kind: "down", key: "Escape", at: 10 }]).events, ["SEND", "ESC"]);
  assert.deepEqual(keys([{ kind: "down", key: "Enter", at: 0, repeat: true }]).events, []);
});

// ── Reducer ────────────────────────────────────────────────────────────────────────────────────

const layoutBug = SCENARIOS.layoutBug;
const targets = [
  { ...layoutBug.targets[0], rect: { x: 600, y: 590, width: 96, height: 32 } },
  { ...layoutBug.targets[1], rect: { x: 344, y: 582, width: 87, height: 30 } },
];
const ctx = (now = 0) => ({ now, scenario: layoutBug, targets });

function run(events, start = initialState("layoutBug", "try")) {
  let state = start;
  const effects = [];
  let now = 0;
  for (const e of events) {
    now += 100;
    const r = reduce(state, e, ctx(now));
    state = r.state;
    effects.push(...r.effects);
  }
  return { state: plain(state), effects: plain(effects) };
}

const take = (r) => [
  { type: "ARM_REGION" },
  { type: "SEL_START", at: { x: r.x - 5, y: r.y - 5 } },
  { type: "SEL_MOVE", at: { x: r.x + 20, y: r.y + 10 } },
  { type: "SEL_END", at: { x: r.x + r.width + 5, y: r.y + r.height + 5 } },
];

test("fn ⌃ starts a request; ⌘ and a drag take a region, snapped to what it covers", () => {
  const { state, effects } = run([{ type: "KEY_REQUEST" }, ...take(targets[0].rect)]);
  assert.equal(state.phase, "voice");
  assert.equal(state.referents.length, 1);
  assert.equal(state.referents[0].targetId, "button-lake");
  assert.equal(state.referents[0].index, 1);
  assert.equal(state.armed, false);
  assert.ok(effects.some((e) => e.type === "flight"));
});

test("a drag smaller than 12 pt is a click: nothing is taken and ⌘ stays pressed", () => {
  const { state } = run([
    { type: "KEY_REQUEST" },
    { type: "ARM_REGION" },
    { type: "SEL_START", at: { x: 10, y: 10 } },
    { type: "SEL_END", at: { x: 15, y: 14 } },
  ]);
  assert.equal(state.referents.length, 0);
  assert.equal(state.armed, true);
});

test("fn ⌃ again transcribes for 1.4 s, then Choose chat binds the words to the referents", () => {
  const before = run([
    { type: "KEY_REQUEST" },
    ...take(targets[0].rect),
    ...take(targets[1].rect),
    { type: "SAY", text: "Make this one line up with that one.", final: true },
    { type: "KEY_REQUEST" },
  ]);
  assert.equal(before.state.phase, "transcribing");
  assert.ok(before.effects.some((e) => e.type === "schedule" && e.id === "transcribe" && e.ms === Timing.transcribe));
  const after = reduce(before.state, { type: "TRANSCRIBED" }, ctx(2000));
  assert.equal(after.state.phase, "choose");
  assert.deepEqual(plain(after.state.bindings).map((b) => b.referent), [1, 2]);
});

test("nothing heard and nothing taken: “Didn't catch that.” and back to rest", () => {
  const { state } = run([{ type: "KEY_REQUEST" }, { type: "KEY_REQUEST" }, { type: "TRANSCRIBED" }]);
  assert.equal(state.phase, "silent");
});

test("return sends: the board shows for 3 s while the agent's beats play; the change lands with the edit", () => {
  let { state } = run([
    { type: "KEY_REQUEST" },
    ...take(targets[0].rect),
    { type: "SAY", text: "Fix this.", final: true },
    { type: "KEY_REQUEST" },
    { type: "TRANSCRIBED" },
  ]);
  const sent = reduce(state, { type: "SEND" }, ctx(1000));
  assert.equal(sent.state.phase, "board");
  assert.equal(sent.state.session.state, "working");
  assert.ok(plain(sent.effects).some((e) => e.id === "boardHold" && e.ms === Timing.boardHold));
  state = sent.state;
  const beat1 = reduce(state, { type: "AGENT_BEAT" }, ctx(2200));
  assert.equal(beat1.state.landed, false);
  const beat2 = reduce(beat1.state, { type: "AGENT_BEAT" }, ctx(4400));
  assert.equal(beat2.state.landed, true, "lands when the edit is done");
  const done = reduce(beat2.state, { type: "AGENT_BEAT" }, ctx(6000));
  assert.equal(done.state.session.state, "complete");
  assert.equal(done.state.phase, "chat", "a quick answer opens by itself");
});

test("a slow answer waits on the board instead of opening by itself", () => {
  let { state } = run([{ type: "KEY_REQUEST" }, ...take(targets[0].rect), { type: "SAY", text: "Fix this.", final: true }, { type: "KEY_REQUEST" }, { type: "TRANSCRIBED" }]);
  state = reduce(state, { type: "SEND" }, ctx(0)).state;
  state = reduce(state, { type: "BOARD_HOLD_END" }, ctx(3000)).state;
  for (let i = 0; i < 3; i++) state = reduce(state, { type: "AGENT_BEAT" }, ctx(Timing.quickLimit + 1000 + i)).state;
  assert.equal(state.session.state, "complete");
  assert.equal(state.phase, "silent");
  // The pointer on the notch opens the board, never empty.
  assert.equal(reduce(state, { type: "HOVER", on: true }, ctx(20000)).state.phase, "board");
});

test("esc steps out one level: first the armed ⌘, then the request", () => {
  let { state } = run([{ type: "KEY_REQUEST" }, { type: "ARM_REGION" }]);
  state = reduce(state, { type: "ESC" }, ctx()).state;
  assert.equal(state.phase, "voice");
  assert.equal(state.armed, false);
  state = reduce(state, { type: "ESC" }, ctx()).state;
  assert.equal(state.phase, "silent");
});

test("a region near a target snaps to it; far from any, it stays as drawn", () => {
  const near = snap({ x: 595, y: 585, width: 106, height: 42 }, targets);
  assert.equal(near.target.id, "button-lake");
  const far = snap({ x: 10, y: 10, width: 80, height: 60 }, targets);
  assert.equal(far.target, undefined);
});

// ── Instructions ───────────────────────────────────────────────────────────────────────────────

test("Try mode says what comes next from the state alone", () => {
  const s = initialState("layoutBug", "try");
  assert.deepEqual(plain(instruction(s, layoutBug).keys), ["request"]);
  const voice = { ...s, phase: "voice" };
  assert.match(instruction(voice, layoutBug).text, /Press ⌘, then drag over the middle card's button/);
  const armed = { ...voice, armed: true };
  assert.equal(instruction(armed, layoutBug).take.id, "button-lake");
});

test("a target in another tab asks for that tab first", () => {
  const weekly = SCENARIOS.weeklyUpdate;
  const s = { ...initialState("weeklyUpdate", "try"), phase: "voice" };
  const tip = instruction(s, weekly);
  assert.equal(tip.openTab.index, 1);
  assert.match(tip.text, /Merged pull requests/);
});

// ── Geometry ───────────────────────────────────────────────────────────────────────────────────

test("each phase's outline and spring, after NotchGeometry and WorkbenchTokens", () => {
  assert.deepEqual(plain(outlineFor("silent")), { width: 212, height: 32, topRadius: 6, bottomRadius: 14, glass: 0 });
  assert.equal(outlineFor("voice").height, 76);
  assert.equal(outlineFor("choose").width, 660);
  assert.equal(outlineFor("board").width, 460);
  assert.equal(springDuration("silent", "voice"), 0.18);
  assert.equal(springDuration("voice", "silent"), 0.15);
  assert.equal(springDuration("transcribing", "choose"), 0.34);
  assert.equal(springDuration("choose", "board"), 0.3);
  assert.equal(springDuration("chat", "silent"), 0.24);
});

test("the spring easing is critically damped: it rises without overshoot and ends at 1", () => {
  const values = springEasing()
    .replace(/^linear\(|\)$/g, "")
    .split(", ")
    .map((p) => Number(p.split(" ")[0]));
  assert.equal(values[0], 0);
  assert.equal(values.at(-1), 1);
  for (let i = 1; i < values.length; i++) assert.ok(values[i] >= values[i - 1] && values[i] <= 1);
});

// ── The engine, headless ───────────────────────────────────────────────────────────────────────

function headless(id) {
  const tracked = [];
  const engine = new DemoEngine(id, (name, props) => tracked.push({ name, props }), false);
  const sc = SCENARIOS[id];
  sc.targets.forEach((t, i) => engine.targets.set(t.id, { x: 300 + i * 260, y: 500, width: 100, height: 34 }));
  engine.targets.set("tab-prs", { x: 900, y: 150, width: 200, height: 26 });
  engine.targets.set("tab-support", { x: 1120, y: 150, width: 200, height: 26 });
  return { engine, tracked };
}

for (const id of ["layoutBug", "weeklyUpdate", "formula"]) {
  test(`Watch plays ${id} through to its answer, the same every time`, () => {
    const { engine } = headless(id);
    engine.watch(id);
    engine.fastForward((s) => s.phase === "chat", 60000);
    const s = engine.state;
    assert.equal(s.phase, "chat");
    assert.equal(s.session.state, "complete");
    assert.ok(s.referents.length >= 1);
    assert.ok(s.bindings.length >= 1, "the words are bound to what was taken");
    if (SCENARIOS[id].beats.some((b) => b.lands)) assert.equal(s.landed, true);
  });
}

test("a visitor can take over in the middle (transcribing) and carry on from there", () => {
  const { engine, tracked } = headless("layoutBug");
  engine.watch("layoutBug");
  engine.fastForward((s) => s.phase === "transcribing");
  engine.takeOver();
  assert.equal(engine.state.mode, "try");
  engine.clock.advance(Timing.transcribe + 50);
  assert.equal(engine.state.phase, "choose", "the island's own timers keep running");
  engine.clock.advance(20000);
  assert.equal(engine.state.phase, "choose", "nothing sends by itself once the script has stopped");
  assert.ok(tracked.some((t) => t.name === "demo_takeover"));
});

test("Watch moves on through the scenarios in order", () => {
  assert.equal(nextScenario("layoutBug"), "weeklyUpdate");
  assert.equal(nextScenario("weeklyUpdate"), "formula");
  assert.equal(nextScenario("formula"), "layoutBug");
});
