import assert from "node:assert/strict";
import { test } from "node:test";
import { loadTs } from "./load-ts.mjs";

// The house rules for words (app-ui-v1/Prototypes/OnboardingCore/Copy.swift, AGENTS.md).
const { LandingCopy } = loadTs("lib/landing/copy.ts");
const { DMG_URL, REQUIREMENTS } = loadTs("lib/download.ts");

function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const all = strings(LandingCopy);

test("no exclamation marks", () => {
  for (const s of all) assert.doesNotMatch(s, /!/, s);
});

test("no prices, speed claims or metrics", () => {
  for (const s of all) {
    assert.doesNotMatch(s, /\$|\bfaster\b|\bsave(s|d)? time\b|\b\d+x\b|words per minute|streak/i, s);
  }
});

test("none of the nouns the product doesn't use", () => {
  for (const s of all) assert.doesNotMatch(s, /\b(clip|snippet|attachment)s?\b/i, s);
});

test("no demo: the page says where Fovea is going, starting with work", () => {
  const ids = LandingCopy.pages.map((p) => p.id);
  assert.deepEqual(JSON.parse(JSON.stringify(ids)), ["what", "today", "next", "context", "start"]);
  assert.equal(LandingCopy.pages[0].title, "Talk to your agents from the notch.");
  assert.equal(LandingCopy.pages[0].blocks[0].text, "Just for now.");
  assert.ok(!LandingCopy.pages.some((p) => p.blocks.some((b) => b.kind === "demo")));
});

test("eyes are “soon” and sending is “in preview” (nothing Fovea can't show)", () => {
  const words = strings(LandingCopy.pages).join(" ");
  assert.match(words, /soon, your eyes/);
  assert.match(words, /Claude Code and Codex, in preview/);
});

test("the why is context alone, not access", () => {
  const why = strings(LandingCopy.pages.find((p) => p.id === "context")).join(" ");
  assert.match(why, /context/);
  assert.doesNotMatch(why, /\b(buy|book|access)\b/i);
});

test("the download points at an https DMG and names what it needs", () => {
  assert.match(DMG_URL, /^https:\/\/updates\.hellofovea\.com\/.+\.dmg$/);
  assert.equal(REQUIREMENTS, "macOS 14 or later · Apple silicon");
});

test("the nav names the pages, one short word each", () => {
  const labels = LandingCopy.pages.map((p) => p.label);
  assert.deepEqual(JSON.parse(JSON.stringify(labels)), ["Fovea", "Today", "Next", "Why", "Start"]);
  for (const id of LandingCopy.nav.pages) assert.ok(LandingCopy.pages.some((p) => p.id === id), id);
});

test("the words Yulun wrote are unchanged", () => {
  const [what, today, next, context, start] = LandingCopy.pages;
  assert.equal(what.title, "Talk to your agents from the notch.");
  assert.equal(today.title, "Fovea starts in your workspace.");
  assert.equal(
    today.blocks[0].text,
    "Just your voice, and soon, your eyes, and tasks automatically assigned to the chat it belongs to. Look at it, say it, and get it done.",
  );
  assert.equal(today.blocks[1].text, "No tab switching. No manual re-explaining, copying, and pasting.");
  assert.equal(next.title, "Then any device. Then anywhere.");
  const list = next.blocks.find((b) => b.kind === "list");
  assert.equal(list.items[0].text, "A small bar that attaches to any computer, a laptop, a desktop or a tablet. All your gaze tracking data stay local.");
  assert.equal(context.title, "What personal agents are missing is you.");
  assert.equal(start.title, "Today, the notch. Next, everything you look at.");
});
