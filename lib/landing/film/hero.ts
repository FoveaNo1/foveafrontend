// The first screen's scene (Oct 18): a Mac's desktop, the chosen picture its wallpaper, and Fovea doing what it does,
// once, on arrival. It is drawn with the film's own parts and numbers, so the notch is Fovea 1.0's as the film draws it
// (tokens.ts, island.ts; FoveaV1 WorkbenchTokens.swift and the pictures DSP-01, -02, -03, -10): fn ⌃ opens the voice
// bar; ⌘ ⌘ takes the whole screen, a flash, and its picture flies into the bar; "The future of human agent interaction
// is here." is said; fn ⌃ again, Transcribing; Choose chat, the chat already picked; Return sends; the board holds the
// session at work for 3 s, then the notch closes. Each key shows as the film shows it, the words as its subtitles, and
// nothing glows under the notch (Yulun, Oct 18). Pure: the scene at t. components/book/heroes/HeroDesk.tsx plays it once;
// under Reduce Motion it shows one still, the session on the board.

import { clamp, ease, mix, seg, spring, window01 } from "./ease";
import { bars, islandPath, outlineAt, rimPath, type OutlineKey } from "./island";
import { level, lineOpacity, shown, speak } from "./speech";
import { CAPTURE, OUTLINE, SPRING, STAGE, glassAt } from "./tokens";
import { STACK, WAVE_X, WIDE, earsPath, glow, keys, lerpRect, live, pathAt, press, set, slotP, type Ctx, type Frame, type Span } from "./film";
import type { Agent, Rect, Step } from "./content";

/** What is said (Yulun's words, Oct 18). */
export const HERO_LINE = "The future of human agent interaction is here.";
/** Where it goes: the chat Fovea picks (the agent working on the landing page), the others it suggests, and what the
 *  session is doing on the board once it is sent. */
export const HERO_CHAT: { agent: Agent; name: string; chips: { agent: Agent; name: string }[]; step: Step } = {
  agent: "claude-code",
  name: "Landing page",
  chips: [{ agent: "claude-code", name: "Landing page" }, { agent: "codex", name: "Pricing page" }, { agent: "claude-code", name: "New chat" }],
  step: { glyph: "read", verb: "Reading", obj: "the screenshot" },
};

/** The scene's beats, seconds from arrival. */
export const HB = {
  /** fn ⌃: the voice bar opens as the key is let go */
  fn: 0.8,
  /** ⌘ ⌘: the whole screen (the second press within 0.35 s) */
  cmd2: [2.2, 2.45],
  /** the flash, and the picture lifting from the screen inset 40 pt… */
  cap: 2.65,
  /** …which flies into the bar (CAPTURE.flight) */
  fly: 3.1,
  /** the words, one every 0.32 s */
  say: 3.95,
  /** fn ⌃ again: Transcribing */
  done: 6.85,
  /** Choose chat, the chat already picked */
  choose: 7.95,
  /** Return sends; the board holds the session 3 s, then the notch closes */
  ret: 9.3,
  close: 12.5,
  end: 12.8,
  /** under Reduce Motion, the one still: the session on the board */
  still: 10.4,
} as const;

/** The words, as the film times speech. */
export const HERO_SPEECH = speak("hero", HB.say, HERO_LINE);

const I = (at: number, to: OutlineKey["to"], dur: number): OutlineKey => ({ at, to, dur });
const ISLAND: OutlineKey[] = [
  I(0, OUTLINE.rest, 0),
  I(HB.fn + press, OUTLINE.bar, SPRING.barOpen),
  I(HB.choose, OUTLINE.choose, SPRING.resize),
  I(HB.ret + press, OUTLINE.board(1, 1), SPRING.resize),
  I(HB.close, OUTLINE.rest, SPRING.close),
];
export const HERO_SLOTS: Record<"voice" | "trans" | "choose" | "board", Span[]> = {
  voice: [[HB.fn + press, HB.done + press]],
  trans: [[HB.done + press, HB.choose, 0.3]],
  choose: [[HB.choose, HB.ret + press, 0.3]],
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
  // the scene says when a panel is open under the notch (a phone's top bar steps aside for it); the board's working
  // ring turns with the clock, given to the board alone (on the root it would restyle the whole scene each frame)
  const wide = heroOutline(t).w > OUTLINE.bar.w + 1;
  set(c, "hd", { st: wide ? "open" : "" });
  keys(c, [["fn", HB.fn], ["cmd2", HB.cmd2[0], HB.cmd2[1]], ["fnDone", HB.done], ["ret", HB.ret]]);

  // the island: its outline, glass, ears and rim, the contents each in its own time, the notch on top
  const o = heroOutline(t);
  const x0 = STAGE.w / 2 - o.w / 2, g = glassAt(o.h);
  set(c, "is:glass", { x: x0 + o.tr, w: o.w - 2 * o.tr, h: o.h + 6, o: g, v: { "--br": `${o.br.toFixed(1)}px` } });
  set(c, "is:ears", { x: x0, w: o.w, h: o.tr + 1, o: g, d: earsPath(o) });
  set(c, "is:rim", { x: x0, w: o.w, h: o.h, o: g, d: rimPath(o) });
  set(c, "is:clip", { clip: `path("${pathAt(islandPath(o), x0)}")` });
  for (const [id, spans] of Object.entries(HERO_SLOTS)) set(c, `is:${id}`, slotP(id, spans, t, opts.reduced));
  if (live(HERO_SLOTS.board, t)) set(c, "is:board", { v: { "--t": t.toFixed(3) } });
  if (live(HERO_SLOTS.voice, t)) bars(level([HERO_SPEECH], t), t).forEach((h, i) => set(c, `vb:b${i}`, { h }));
  if (live(HERO_SLOTS.trans, t)) set(c, "tr:dots", { st: String(Math.floor(t * 3) % 3) });

  // ⌘ ⌘: a flash; the picture of the whole screen lifts from the screen inset 40 pt, then flies into the bar
  const fl = window01(t, HB.cap, HB.cap + CAPTURE.flash, 0.02, CAPTURE.flash - 0.02);
  if (fl > 0) set(c, "flash:screen", { o: fl * 0.35 });
  if (t >= HB.cap && t < HB.fly + CAPTURE.flight + 0.05 && !opts.reduced) {
    const sc = opts.screen ?? { x: 0, y: 0, w: STAGE.w, h: STAGE.h }, i = CAPTURE.screenInset;
    const from: Rect = { x: sc.x + i, y: sc.y + i, w: sc.w - 2 * i, h: sc.h - 2 * i };
    const p = t < HB.fly ? 0 : spring(seg(t, HB.fly, HB.fly + CAPTURE.flight));
    const r = lerpRect(from, STACK[0], p);
    // the picture keeps the menu bar along its top, at the picture's own scale
    set(c, "scr:fly", { x: r.x, y: r.y, w: r.w, h: r.h, o: ease.out(seg(t, HB.cap, HB.cap + 0.2)), v: { "--strip": `${((MENU * r.w) / sc.w).toFixed(2)}px`, "--rad": `${mix(10, 6, p).toFixed(2)}px` } });
  }
  if (t >= HB.fly + CAPTURE.flight) set(c, "vb:t0", { o: 1 });
  // the waveform moves aside for it from the moment it starts flying
  const wx = t < HB.fly ? WAVE_X[0] : mix(WAVE_X[0], WAVE_X[1], opts.reduced ? 1 : spring(seg(t, HB.fly, HB.fly + SPRING.wave)));
  set(c, "vb:wave", { x: wx - WAVE_X[0] });

  // Choose chat: the chat it belongs to is already picked, and lit a moment
  glow(c, "ch:glow", HB.choose + 0.35);

  // the words, as subtitles, each as it is said
  const lo = lineOpacity(HERO_SPEECH, t);
  if (lo > 0) {
    set(c, "sub:hero", { o: lo });
    const n = shown(HERO_SPEECH, t);
    HERO_SPEECH.words.forEach((w, i) => set(c, `sw:hero:${i}`, { o: i < n ? clamp((t - w.at) / 0.12) : 0 }));
  }
  return f;
}
