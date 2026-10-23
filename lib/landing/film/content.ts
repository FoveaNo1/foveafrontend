// What the film shows and says, shared by the timeline (film.ts) and the picture (components/book/film). The cards'
// words are the landing page's own (lib/landing/bookCopy.ts) and hellofovea.com's four promises; the lines the
// person says are the film's. Windows have fixed sizes and fixed inner layouts, so every place the film points at
// (a glaze, a file, a line of words) is known here in points, and so is every beat. What the island shows follows
// Fovea 1.0 (app-ui-v1 FoveaV1, its pictures in handoff/Fovea-1.0-design-pictures). Pure.

import { BookCopy } from "../bookCopy";
import { speak, type Line } from "./speech";

export type Rect = { x: number; y: number; w: number; h: number };
export type Agent = "claude-code" | "codex" | "fovea" | "grok-bot";

/** How long each part lasts (seconds), and from that, when each begins (Oct 17). One line on paper, then Today:
 *  graphical work in Blender and an everyday email; then Soon and Next. */
const LEN = { A0: 4.4, B1: 29.4, B2: 19.0, C0: 7.4, C1: 21.1, D0: 2.6, D1: 3.4, D2: 7.0, D3: 7.6, E: 3.8 };
const ORDER = ["A0", "B1", "B2", "C0", "C1", "D0", "D1", "D2", "D3", "E"] as const;
export const T = (() => {
  const t = {} as Record<(typeof ORDER)[number] | "END", number>;
  let at = 0;
  for (const k of ORDER) { t[k] = Math.round(at * 100) / 100; at += LEN[k]; }
  t.END = Math.round(at * 100) / 100;
  return t;
})();

export const DURATION = T.END;

/** The opening line belongs to Today: it says what the product is, then the film shows it. */
export const CHAPTERS = [
  { at: T.A0, title: "Today" },
  { at: T.C0, title: "Soon" },
  { at: T.D0, title: "Next" },
] as const;

/** Each part's beats, in seconds from the part's start (film.ts plays them; the spoken lines wait on them). A key acts
 *  when it is let go, 0.2 s after its press (KeyMonitors.swift). Pairs are [from, to]. */
export const BEATS = {
  /** Today, look-dev: the whole screen first; one sentence while taking three things, each slow enough to follow, as
   *  Fovea takes them (Oct 18, Yulun's keys): ⌘ and a drag, a glaze on the board; a light,
   *  dragged from Finder onto the notch ("Drop to take it"); the brief's words in Mail, just selected (no key), which
   *  keep the accent's highlight until the request is sent. Choose chat; Return; the agent changes the scene in front
   *  of you; the work takes minutes, so its answer waits on the board, and is opened from the notch. */
  B1: {
    fn: 2.0, push: [2.4, 3.2], cmd: 3.4, down: 3.75, up: 4.75, lift: 5.15,
    grab: 6.05, drag: [6.15, 7.2], well: 6.95, drop: 7.3,
    pan: [7.9, 8.8], and: 8.9, tdown: 9.3, tup: 10.5, take: 10.7, textFly: 10.9, back: [10.5, 11.3],
    done: 12.3, toChoose: [13.6, 14.4], choose: 13.9, ret: 16.25, board: 16.45, wide: [16.2, 17.0],
    step1: 17.7, step2: 18.7, glaze: [17.0, 18.0], light: [18.2, 19.2], cam: [19.5, 20.4], render: 21.0,
    rest: 19.45, toNotch: [21.6, 22.4], hover: 22.1, click: 23.25, esc: 27.8, out: [27.8, 28.6],
  },
  /** Today, everyday: ⌘ ⌘ takes the whole screen (Dana's email is on it); one sentence; the reply is drafted in the
   *  Mail that is already open; back within 8 s, the answer opens by itself. */
  B2: {
    fn: 0.95, cmd2: [1.8, 2.05], cap: 2.25, fly: 2.7, done: 4.2, toChoose: [5.5, 6.3], choose: 5.8, ret: 7.65,
    board: 7.85, wide: [7.8, 8.6], step1: 8.9, reply: [8.9, 9.4], type: [9.5, 11.9], attach: 11.5,
    toMail: [10.2, 11.0], rest: 10.85, answer: 12.4, toNotch: [12.5, 13.3], esc: 16.7, out: [16.7, 17.5],
    caption: [17.2, 18.6],
  },
  /** Soon: the eyes pick what is meant; Fovea picks the chat by itself (`think`: a ring circles where the chat will
   *  be, then the chat appears in its place), then the model; the pointer opens the attachments (the numbered row,
   *  then the second one up close), and it sends. */
  C: {
    fn: 1.4, label: [1.8, 5.8], done: 7.0, toChoose: [8.3, 9.1], choose: 8.6, think: [8.85, 10.65], settle: 10.7, model: 11.7,
    point: 13.1, fan: 13.85, toCard: 14.1, click: 14.55, back: 16.95, leave: 17.25, fold: 17.45, send: 18.0,
    caption: [18.8, 20.6],
  },
} as const;

/** The cards, on paper. */
export const CARDS = {
  /** The film opens on what the product is, on paper, in one line. */
  title: { text: BookCopy.hero },
  eyes: { text: "And soon, your eyes.", small: "Not a cursor but a brand new way of capturing attention." },
  /** Session routing, coming with the eyes: every agent you have running answers as one being, and Fovea sends each
   *  request to the session it belongs to (Oct 17). */
  agents: { text: "And all your agents, as one.", small: "Fovea automatically routes the session and the model for you." },
  next: { text: BookCopy.s2.lead },
  bar: { text: BookCopy.s2.items[0][0], small: "A small bar that attaches to any computer, a laptop, a desktop or a tablet." },
  /** Not glasses: the team is making no more of them, so the card says so. */
  wear: { text: BookCopy.s2.items[1][0], small: "Not a pair of glasses. Not a ring. And not a necklace." },
  saw: { text: "what you saw, what you heard, what you said," },
  you: { text: BookCopy.s3.title },
  last: { text: BookCopy.last },
} as const;

/** hellofovea.com's four promises, as captions while nobody speaks. */
export const CAPTIONS = {
  attach: "Nothing to attach.",
  open: "Nothing to open.",
  chase: "Nothing to chase.",
  choose: "Nothing to choose.",
} as const;

/** What the person says, and when. [Brackets] mark words that point at a capture, {braces} where the eyes are. The
 *  agent hears only these words and what was taken, so nothing here names what isn't on screen in a capture: the
 *  brief's words are "this", and Dana is named only once a whole-screen capture shows her email. */
const B1 = BEATS.B1, B2 = BEATS.B2;
export const LINES: Line[] = [
  // each "this" is said as its capture is made; "and frame it like" while the camera moves to the brief
  speak("vase", T.B1 + 3.0, "Glaze it like [this,] light it with [this,] and frame it like [this.]",
    { 3: T.B1 + B1.up - 0.05, 7: T.B1 + B1.drop, 8: T.B1 + B1.and, 12: T.B1 + B1.tup }),
  speak("send", T.B2 + 2.0, "Send [this] to Dana.", { 1: T.B2 + B2.cap }),
  speak("maya", T.C1 + 3.3, "Add {this}, and {these}, to the update for Maya."),
  speak("trail", T.D2 + 4.1, "Save {this trail} for Saturday."),
];
export const line = (id: string) => LINES.find((l) => l.id === id)!;

/** The key caps the film shows, bottom centre, each with what it does there (Oct 18, Yulun, for the site: ⌘ once, a
 *  screenshot of the area selected; ⌘ twice, the whole screen). fn ⌃ toggles: one press to talk, the next when done.
 *  ⌘ takes part of the screen, one press and a drag; ⌘ pressed twice takes the whole screen. Words and files need no
 *  key: words selected while Fovea listens are taken, and a file dragged onto the notch. */
export const KEYS = {
  fn: { caps: ["fn", "⌃"], label: "talk" },
  fnDone: { caps: ["fn", "⌃"], label: "done" },
  cmd: { caps: ["⌘"], label: "part of the screen" },
  cmd2: { caps: ["⌘", "⌘"], label: "whole screen" },
  ret: { caps: ["return"], label: "send" },
  esc: { caps: ["esc"], label: "close" },
  back: { caps: ["esc"], label: "back" },
} as const;
export type KeyId = keyof typeof KEYS;

// ———————————————————————————— the windows (fixed sizes; where they stand)
export const WIN = {
  browser: { w: 1120, h: 760 },
  chat: { w: 560, h: 740 },
  /** Today: a look-dev afternoon. Blender on the left, the reference board and the Studio Nord folder on the right,
   *  Mail across the bottom (the reply is drafted inside it). */
  blender: { w: 930, h: 580 },
  board: { w: 496, h: 296 },
  finder: { w: 496, h: 296 },
  mail: { w: 1438, h: 306 },
} as const;
export type WinId = keyof typeof WIN;

/** Where the windows stand in each part. */
export const POS = {
  /** Today: Blender on the left, the reference board and the Studio Nord folder on the right, Mail across the bottom. */
  desk3: { blender: { x: 16, y: 44 }, board: { x: 958, y: 44 }, finder: { x: 958, y: 352 }, mail: { x: 16, y: 636 } },
  desk2: { chat: { x: 60, y: 130 }, browser: { x: 600, y: 110 } },
} as const;

/** The merged pull requests in the browser's second tab (and in the captures of them). */
export const PRS = ["#482 Trail cards: one button style", "#479 Map links open in a new tab", "#476 Faster photo loading on trail pages", "#471 First-snow banner", "#468 Fix 404s on old trail links", "#465 Focus rings on cards"];

/** Inside each window, the places the film points at (window-local points). */
export const IN = {
  browser: {
    btnLeft: { x: 160, y: 498, w: 148, h: 38 },
    btnMid: { x: 540, y: 498, w: 148, h: 38 },
    /** How far the middle button sits low before the fix: enough to see at a glance. */
    low: 16,
    prs: { x: 56, y: 150, w: 760, h: 300 },
    tickets: { x: 56, y: 150, w: 760, h: 240 },
  },
  chat: { chart: { x: 36, y: 196, w: 392, h: 230 } },
  /** Today's windows (window-local). */
  board: { glaze: { x: 50, y: 178, w: 86, h: 80 } },
  finder: {
    /** The icon grid: a column every 116 from 150, a row every 118 from 62; each item 100 × 106. */
    item: (col: number, row: number) => ({ x: 150 + col * 116, y: 62 + row * 118, w: 100, h: 106 }),
  },
  mail: {
    /** "4:5, eye level, soft shadows" in the first line of Dana's message (measured in the browser: SF at 15 pt) */
    brief: { x: 623, y: 133, w: 194, h: 24 },
    /** The reply, once the reading pane makes room for it beside Dana's message. */
    reply: { x: 890, y: 52, w: 548, h: 254 },
  },
} as const;

/** A window-local rect, placed where its window stands. */
export const at = (win: { x: number; y: number }, r: Rect, dy = 0): Rect => ({ x: win.x + r.x, y: win.y + r.y + dy, w: r.w, h: r.h });

// ———————————————————————————— the island's contents

/** One step an agent is on (the board's second line): a glyph, the verb, its object (code in mono), the diff. */
export type Step = { glyph: "read" | "think" | "write" | "edit" | "run" | "add" | "fork"; verb: string; obj?: string; mono?: boolean; add?: string; del?: string };
export type Row = { agent: Agent; title: string; time: string; state: "working" | "done"; line?: string; steps?: Step[]; focus?: boolean };
/** A board: Done first, then Running, newest first in each (DispatchV2.swift v2BoardSections). */
export type Board = { id: string; sections: Row[][] };

const SNAPSHOT: Row = { agent: "codex", title: "Shop page copy", time: "12m", state: "done", line: "Ready to review." };
const PAYLOAD: Row = { agent: "codex", title: "Product photos", time: "20m", state: "working", steps: [{ glyph: "run", verb: "Renaming", obj: "24 files" }] };
const DRAFTED: Row = { agent: "claude-code", title: "Studio Nord vase", time: "2m", state: "done", line: "Drafted a reply to Dana." };
const UPDATE_ADD: Row = { agent: "claude-code", title: "Weekly update", time: "now", state: "working", steps: [{ glyph: "add", verb: "Adding", obj: "2 screenshots" }] };
const VASE = { agent: "claude-code" as Agent, title: "Studio Nord vase", time: "now", focus: true };

export const BOARDS: Record<string, Board> = {
  b1: { id: "b1", sections: [[SNAPSHOT], [
    { ...VASE, state: "working", steps: [
      { glyph: "edit", verb: "Sampling", obj: "the glaze" },
      { glyph: "edit", verb: "Lighting with", obj: "golden_hour_loft.hdr", mono: true },
      { glyph: "run", verb: "Framing", obj: "50 mm · 4:5" }] },
    PAYLOAD]] },
  /** The work done, minutes later: the board the notch shows when the pointer rests on it. */
  b1d: { id: "b1d", sections: [[{ ...VASE, state: "done", line: "Glazed, lit and framed." }, SNAPSHOT], [PAYLOAD]] },
  b2: { id: "b2", sections: [[SNAPSHOT], [
    { ...VASE, state: "working", steps: [{ glyph: "run", verb: "Exporting", obj: "vase_v3.png", mono: true }, { glyph: "write", verb: "Drafting", obj: "a reply in Mail" }] },
    PAYLOAD]] },
  c2a: { id: "c2a", sections: [[DRAFTED, SNAPSHOT], [{ ...UPDATE_ADD, focus: true }, PAYLOAD]] },
};
export const rowsOf = (b: Board) => b.sections.reduce((n, s) => n + s.length, 0);

/** Choose chat: the request, its captures, the chat Fovea picked, and the suggestions (DSP-03). Soon's has no
 *  suggestions: nothing is offered to pick from, since Fovea picks the chat by itself. */
export type Choose = { id: string; request: string; kinds: string[]; agent: Agent; chat: string; chips?: { agent: Agent; name: string }[] };
export const CHOOSE: Record<string, Choose> = {
  b1: { id: "b1", request: "Glaze it like this, light it with this, and frame it like this.", kinds: ["glaze", "hdr", "brief"], agent: "claude-code", chat: "Studio Nord vase",
    chips: [{ agent: "claude-code", name: "Studio Nord vase" }, { agent: "codex", name: "Shop page" }, { agent: "claude-code", name: "New chat" }] },
  b2: { id: "b2", request: "Send this to Dana.", kinds: ["screen"], agent: "claude-code", chat: "Studio Nord vase",
    chips: [{ agent: "claude-code", name: "Studio Nord vase" }, { agent: "codex", name: "Shop page" }, { agent: "claude-code", name: "New chat" }] },
  c2: { id: "c2", request: "Add this, and these, to the update for Maya.", kinds: ["chart", "prs"], agent: "claude-code", chat: "Weekly update" },
};

/** Soon's attachments, opened (V2FeedbackViews: the pile fans into a numbered row; a click grows one to its close
 *  look, "N · source"). Stage points: the row and the close look drop from the pile, over the panel. */
export const REFS = {
  /** two cards 60 tall in their own proportions (the chart 102 wide, the list 132, clamped at 2.2), 10 apart */
  row: { x: 440, y: 125, w: 264, h: 80 },
  look: { x: 440, y: 125, w: 580, h: 300 },
  items: [{ kind: "chart", label: "1 · Signups · Maya Lin" }, { kind: "prs", label: "2 · Merged pull requests" }],
} as const;

/** What comes back from Claude Code after the look-dev (DSP-16's panel), opened from the board. */
export const ANSWER = {
  agent: "claude-code" as Agent,
  chat: "Studio Nord vase",
  project: "studio-nord",
  question: "Glaze it like this, light it with this, and frame it like this.",
  worked: "Worked for 1 m 52 s",
  lead: "Done. Glazed in the terracotta from the board, lit with the loft, framed 4:5 at eye level.",
  head: ["Changed", "Now"],
  rows: [
    ["Glaze", "Terracotta #B4553A, roughness 0.35"],
    ["Light", "golden_hour_loft.hdr, strength 1.2"],
    ["Camera", "50 mm, eye level, 1080 × 1350"],
    ["Render", "vase_v3.png, in Studio Nord"],
  ],
  close: "Shadows are softer, as asked.",
  open: "Open vase_v3.png",
  openIn: "Open in Claude Code",
} as const;

/** The reply to Dana: drafted in Mail, and back in the notch as the app's draft is (DSP-18). Never sent for you. */
export const DRAFT = {
  agent: "claude-code" as Agent,
  chat: "Studio Nord vase",
  project: "studio-nord",
  question: "Send this to Dana.",
  worked: "Worked for 7 s",
  lead: "Here’s a reply to Dana, with the render attached:",
  to: "Dana Okafor",
  subject: "Re: Vase, first look",
  body: ["Hi Dana,", "Here’s the first look: 4:5, eye level, soft shadows, in the terracotta from the board.", "Best,"],
  attach: { name: "vase_v3.png", size: "412 KB" },
  open: "Open the draft in Mail",
  openIn: "Open in Claude Code",
} as const;

/** The session panels' layouts, top down (DSP-16 and DSP-18): each block's top within the panel, and the panel's
 *  height, which the island's outline follows. */
export const PANEL = {
  b1: { q: 94, worked: 126, lead: 158, th: 186, row: 210, close: 315, open: 344, bar: 382, follow: 420, grab: 466, h: 484 },
  b2: { q: 94, worked: 126, lead: 158, quote: 187, open: 353, bar: 391, follow: 429, grab: 475, h: 493 },
} as const;

/** The day, as Fovea lived it with you: what you looked at, and when (the film's own moments, plus a morning by the
 *  lake). They go up into the notch, and from it to every agent you use. */
export const DAY = [
  { id: "lake", at: "7:40" }, { id: "vase", at: "11:05" }, { id: "chart", at: "14:30" }, { id: "trail", at: "17:50" },
] as const;

/** The personal agents Fovea hands you to, each its own icon (public/landing/SOURCES.md). `own`: the picture is an
 *  app icon with its own shape, drawn as it is; otherwise it sits on a rounded tile. */
export const AGENT_ROW: { name: string; mark: string; own?: boolean }[] = [
  { name: "Muse", mark: "/landing/agents/muse.png", own: true },
  { name: "Claude Code", mark: "/landing/agents/claude-code.png", own: true },
  { name: "Codex", mark: "/landing/agents/codex.png", own: true },
  { name: "Grok Bot", mark: "/landing/agents/grok-bot.png", own: true },
  { name: "Instinct", mark: "/landing/agents/instinct.png" },
  { name: "Manus", mark: "/landing/agents/manus.svg" },
];
