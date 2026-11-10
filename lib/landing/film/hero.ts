// The first screen's scene (Oct 18): a Mac's desktop, the chosen picture its wallpaper, and Fovea doing what it does,
// once, on arrival, with its notch as the app draws it since Nov 8 (notch.ts): fn ⌃ asks your agent, Wings opens,
// "Listening", its corner lit in Sea Glass; ⌘ ⌘ takes the whole screen, a flash, and its picture goes to the notch in
// one move and is the first card of the bar's pile; "The future of human agent interaction is here." is said; fn ⌃
// again, Transcribing and its ring; Choose chat at its usual size, the chat already picked; enter sends; the board
// (Focus) holds the session at work for 3 s, then the notch rests. Each key shows as the film shows it, the words as
// its subtitles. Pure: the scene at t.
// components/book/heroes/HeroDesk.tsx plays it once; under Reduce Motion it shows one still, the session on the board.

import { clamp, seg, window01 } from "./ease";
import { outlineAt, type OutlineKey } from "./island";
import { lineOpacity, shown, speak } from "./speech";
import { CAPTURE, NOTCH, SPRING, STAGE } from "./tokens";
import { WIDE, glow, keys, live, press, set, type Ctx, type Frame, type Span } from "./film";
import { FOCUS, MOVE, NOUT, SIDE, barAt, bodyOf, boardH, chooseH, moveAt, notch, pile, pileSlot, pileW, wings } from "./notch";
import type { Agent, Rect } from "./content";

/** What is said (Yulun's words, Oct 18). */
export const HERO_LINE = "The future of human agent interaction is here.";
/** Where it goes: the chat Fovea picks (the agent working on the landing page), and what the session is doing on the
 *  board once it is sent. */
export const HERO_CHAT: { agent: Agent; name: string; step: string } = {
  agent: "claude-code",
  name: "Landing page",
  step: "Reading the screenshot",
};

/** The scene's beats, seconds from arrival. */
export const HB = {
  /** fn ⌃: Wings opens as the key is let go */
  fn: 0.8,
  /** ⌘ ⌘: the whole screen (the second press within 0.35 s) */
  cmd2: [2.2, 2.45],
  /** the flash… */
  cap: 2.65,
  /** …and the picture's one move into the bar's pile */
  fly: 2.75,
  /** the words, one every 0.32 s */
  say: 3.95,
  /** fn ⌃ again: Transcribing */
  done: 6.85,
  /** Choose chat, the chat already picked */
  choose: 7.95,
  /** enter sends; the board holds the session 3 s, then the notch rests */
  ret: 9.3,
  close: 12.5,
  end: 12.8,
  /** under Reduce Motion, the one still: the session on the board */
  still: 10.4,
} as const;

/** The words, as the film times speech. */
export const HERO_SPEECH = speak("hero", HB.say, HERO_LINE);

/** When the picture lands as the pile's first card. The bar makes room for it as it leaves (on the island's spring,
 *  over before it lands). */
const LANDED = HB.fly + MOVE.dur;
const ROOM = 0.22;
const I = (at: number, to: OutlineKey["to"], dur: number): OutlineKey => ({ at, to, dur });
const ISLAND: OutlineKey[] = [
  I(0, NOUT.rest, 0),
  I(HB.fn + press, NOUT.wings(SIDE.listen), SPRING.barOpen),
  I(HB.fly, NOUT.wings(pileW(1)), ROOM),
  I(HB.done + press, NOUT.wings(SIDE.trans, SIDE.ring), SPRING.resize),
  I(HB.choose, NOUT.panel(chooseH(1)), SPRING.open),
  I(HB.ret + press, NOUT.board(boardH(FOCUS.card.task, 2, 1)), SPRING.resize),
  I(HB.close, NOUT.rest, SPRING.close),
];
/** The bar listening, then transcribing; the panels that open under the notch. */
const VOICE: Span[] = [[HB.fn + press, HB.done + press]];
const TRANS: Span[] = [[HB.done + press, HB.choose, 0.2]];
export const HERO_SLOTS: Record<"sent" | "board", Span[]> = {
  sent: [[HB.choose, HB.ret + press, 0.3]],
  board: [[HB.ret + press, HB.close, 0.24]],
};

/** The island's outline at t (for the page's tests and its stills). */
export const heroOutline = (t: number) => outlineAt(ISLAND, t);

/** The menu bar's height on the screen, in points (the notch's). */
const MENU = 32;

/** Everything the scene shows at t. `screen` is what of the screen the frame shows, in its points (the whole screen
 *  unless the frame is another shape, as a phone's or a wide window's is): the whole-screen capture is a picture of
 *  that, and goes from it inset 40 pt. */
export function heroAt(t: number, opts: { reduced?: boolean; screen?: Rect } = {}): Frame {
  const f: Frame = { t, chapter: 0, shot: "hero", aim: WIDE, k: {} };
  const c: Ctx = { f, t, reduced: opts.reduced };
  // the scene says when the island is out past the notch (a phone's top bar steps aside for it)
  const o = heroOutline(t);
  set(c, "hd", { st: o.w > NOUT.rest.w + 1 || o.h > NOTCH.h + 1 ? "open" : "" });
  keys(c, [["fn", HB.fn], ["cmd2", HB.cmd2[0], HB.cmd2[1]], ["fnDone", HB.done], ["ret", HB.ret]]);

  // the island: the notch at rest, Wings while it listens (lit: it's asking your agent) and transcribes, Choose chat,
  // the board
  notch(c, ISLAND, HERO_SLOTS);
  const body = bodyOf(o);
  wings(c, "wb", body, barAt(t, VOICE, TRANS, [HERO_SPEECH], { lit: true, pileAt: HB.fly, reduced: opts.reduced }));
  pile(c, "wb", [LANDED]);

  // ⌘ ⌘: a flash; the picture of the whole screen goes from the screen inset 40 pt into the bar's pile in one move
  const fl = window01(t, HB.cap, HB.cap + CAPTURE.flash, 0.02, CAPTURE.flash - 0.02);
  if (fl > 0) set(c, "flash:screen", { o: fl * 0.35 });
  if (t >= HB.fly && t < LANDED && !opts.reduced) {
    const sc = opts.screen ?? { x: 0, y: 0, w: STAGE.w, h: STAGE.h }, i = CAPTURE.screenInset;
    const from: Rect = { x: sc.x + i, y: sc.y + i, w: sc.w - 2 * i, h: sc.h - 2 * i };
    const r = moveAt(from, pileSlot(0, body), seg(t, HB.fly, LANDED));
    // the picture keeps the menu bar along its top, at the picture's own scale
    set(c, "scr:fly", { x: r.x, y: r.y, w: r.w, h: r.h, o: 1, v: { "--strip": `${((MENU * r.w) / sc.w).toFixed(2)}px`, "--rad": `${r.rad.toFixed(2)}px`, "--sh": r.shadow.toFixed(3) } });
  }

  // Choose chat: the chat it belongs to is already picked, and lit a moment; Send goes down with enter
  glow(c, "ch:glow", HB.choose + 0.35);
  if (t >= HB.ret && t < HB.ret + press) set(c, "is:sent:send", { st: "down" });

  // the board: the session just sent is the one in focus, at work
  if (live(HERO_SLOTS.board, t)) set(c, "hb:now", { o: 0.55 + 0.45 * Math.abs(Math.sin((t - HB.ret) * 2.6)) });

  // the words, as subtitles, each as it is said
  const lo = lineOpacity(HERO_SPEECH, t);
  if (lo > 0) {
    set(c, "sub:hero", { o: lo });
    const n = shown(HERO_SPEECH, t);
    HERO_SPEECH.words.forEach((w, i) => set(c, `sw:hero:${i}`, { o: i < n ? clamp((t - w.at) / 0.12) : 0 }));
  }
  return f;
}
