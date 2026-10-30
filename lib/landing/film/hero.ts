// The first screen's scene (Oct 18): a Mac's desktop, the chosen picture its wallpaper, and Fovea doing what it does,
// once, on arrival, with its notch as FoveaV1 draws it since Oct 28 (notch.ts: Wings, the Halo, the Sentence, one
// board): fn ⌃ opens Wings, "Listening"; ⌘ ⌘ takes the whole screen, a flash, and its picture flies into the bar's
// pile; "The future of human agent interaction is here." is said; fn ⌃ again, Transcribing and its ring; Choose
// chat's sentence, the chat already picked; Return sends; the board holds the session at work for 3 s, then the notch
// rests. Each key shows as the film shows it, the words as its subtitles. Pure: the scene at t.
// components/book/heroes/HeroDesk.tsx plays it once; under Reduce Motion it shows one still, the session on the board.

import { clamp, ease, mix, seg, spring, window01 } from "./ease";
import { outlineAt, type OutlineKey } from "./island";
import { lineOpacity, shown, speak } from "./speech";
import { CAPTURE, NOTCH, SPRING, STAGE } from "./tokens";
import { WIDE, glow, keys, lerpRect, live, press, set, type Ctx, type Frame, type Span } from "./film";
import { NOUT, SIDE, barAt, bodyOf, boardH, notch, pileSlot, pileW, sentenceH, wings } from "./notch";
import type { Agent, Rect, Step } from "./content";

/** What is said (Yulun's words, Oct 18). */
export const HERO_LINE = "The future of human agent interaction is here.";
/** Where it goes: the chat Fovea picks (the agent working on the landing page), and what the session is doing on the
 *  board once it is sent. */
export const HERO_CHAT: { agent: Agent; name: string; step: Step } = {
  agent: "claude-code",
  name: "Landing page",
  step: { glyph: "read", verb: "Reading", obj: "the screenshot" },
};

/** The scene's beats, seconds from arrival. */
export const HB = {
  /** fn ⌃: Wings opens as the key is let go */
  fn: 0.8,
  /** ⌘ ⌘: the whole screen (the second press within 0.35 s) */
  cmd2: [2.2, 2.45],
  /** the flash, and the picture lifting from the screen inset 40 pt… */
  cap: 2.65,
  /** …which flies into the bar's pile (CAPTURE.flight) */
  fly: 3.1,
  /** the words, one every 0.32 s */
  say: 3.95,
  /** fn ⌃ again: Transcribing */
  done: 6.85,
  /** Choose chat, the chat already picked */
  choose: 7.95,
  /** Return sends; the board holds the session 3 s, then the notch rests */
  ret: 9.3,
  close: 12.5,
  end: 12.8,
  /** under Reduce Motion, the one still: the session on the board */
  still: 10.4,
} as const;

/** The words, as the film times speech. */
export const HERO_SPEECH = speak("hero", HB.say, HERO_LINE);

/** When the picture has landed: the bar's left is the pile from then. */
const LANDED = HB.fly + CAPTURE.flight;
const I = (at: number, to: OutlineKey["to"], dur: number): OutlineKey => ({ at, to, dur });
const ISLAND: OutlineKey[] = [
  I(0, NOUT.rest, 0),
  I(HB.fn + press, NOUT.wings(SIDE.listen), SPRING.barOpen),
  I(LANDED, NOUT.wings(pileW(1)), SPRING.resize),
  I(HB.done + press, NOUT.wings(SIDE.trans, SIDE.ring), SPRING.resize),
  I(HB.choose, NOUT.panel(sentenceH(1)), SPRING.open),
  I(HB.ret + press, NOUT.board(boardH(1)), SPRING.resize),
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
 *  that, and lifts from it inset 40 pt. */
export function heroAt(t: number, opts: { reduced?: boolean; screen?: Rect } = {}): Frame {
  const f: Frame = { t, chapter: 0, shot: "hero", aim: WIDE, k: {} };
  const c: Ctx = { f, t, reduced: opts.reduced };
  // the scene says when the island is out past the notch (a phone's top bar steps aside for it); the board's working
  // ring turns with the clock, given to the board alone (on the root it would restyle the whole scene each frame)
  const o = heroOutline(t);
  set(c, "hd", { st: o.w > NOUT.rest.w + 1 || o.h > NOTCH.h + 1 ? "open" : "" });
  keys(c, [["fn", HB.fn], ["cmd2", HB.cmd2[0], HB.cmd2[1]], ["fnDone", HB.done], ["ret", HB.ret]]);

  // the island: the notch at rest, Wings while it listens and transcribes, the sentence, the board
  notch(c, ISLAND, HERO_SLOTS);
  const body = bodyOf(o);
  wings(c, "wb", body, barAt(t, VOICE, TRANS, [HERO_SPEECH], { pileAt: LANDED, reduced: opts.reduced }));
  if (live(HERO_SLOTS.board, t)) set(c, "is:board", { v: { "--t": t.toFixed(3) } });

  // ⌘ ⌘: a flash; the picture of the whole screen lifts from the screen inset 40 pt, then flies into the bar's pile
  const fl = window01(t, HB.cap, HB.cap + CAPTURE.flash, 0.02, CAPTURE.flash - 0.02);
  if (fl > 0) set(c, "flash:screen", { o: fl * 0.35 });
  if (t >= HB.cap && t < LANDED + 0.05 && !opts.reduced) {
    const sc = opts.screen ?? { x: 0, y: 0, w: STAGE.w, h: STAGE.h }, i = CAPTURE.screenInset;
    const from: Rect = { x: sc.x + i, y: sc.y + i, w: sc.w - 2 * i, h: sc.h - 2 * i };
    const p = t < HB.fly ? 0 : spring(seg(t, HB.fly, LANDED));
    const r = lerpRect(from, pileSlot(0, body), p);
    // the picture keeps the menu bar along its top, at the picture's own scale
    set(c, "scr:fly", { x: r.x, y: r.y, w: r.w, h: r.h, o: ease.out(seg(t, HB.cap, HB.cap + 0.2)), v: { "--strip": `${((MENU * r.w) / sc.w).toFixed(2)}px`, "--rad": `${mix(10, 4.5, p).toFixed(2)}px` } });
  }
  if (t >= LANDED) set(c, "wb:c0", { o: 1 });

  // Choose chat: the chat it belongs to is already picked, and lit a moment; Send goes down with Return
  glow(c, "ch:glow", HB.choose + 0.35);
  if (t >= HB.ret && t < HB.ret + press) set(c, "is:sent:send", { st: "down" });

  // the words, as subtitles, each as it is said
  const lo = lineOpacity(HERO_SPEECH, t);
  if (lo > 0) {
    set(c, "sub:hero", { o: lo });
    const n = shown(HERO_SPEECH, t);
    HERO_SPEECH.words.forEach((w, i) => set(c, `sw:hero:${i}`, { o: i < n ? clamp((t - w.at) / 0.12) : 0 }));
  }
  return f;
}
