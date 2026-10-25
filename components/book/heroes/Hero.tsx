"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BookCopy as c } from "../../../lib/landing/bookCopy";
import { ease, mix, seg } from "../../../lib/landing/film/ease";
import type { FilmHandle } from "../../../lib/landing/film/player";
import { ROUND3, type HeroId } from "../../../lib/landing/heroes";
import { picture, type Laptop, type Scene } from "../../../lib/landing/pictures";
import { InFrame, OnDesktop } from "./Desktop";
import Screen from "./Screen";
import Notch from "./Notch";
import Pin, { type PinVars } from "./Pin";
import { After, HeroFilm as Film, LINE, START, Top, box, n, opening, px } from "./shared";

// Six first screens for the page (Oct 17, /hero/<id>; the notch, chosen, is in Notch.tsx and on the page), each
// opening on the one line and handing over to the film in its own way. Every hand-over is a pure function of how far through its held stretch of scroll the reader is (Pin),
// as the film is of time; the film begins past its own opening card (the page has just said the line) and plays once
// the hand-over is done. Each is learned from a page that does it well (lib/landing/heroes.ts, and the research in
// landing/research/hero-transitions-oct17.html).

// ———————————————————————————— 2 · The screening
/** The line, and the film waiting below it, a little small. The lights go down (paper to ink) while the film rises
 *  and grows to the middle of the screen; after it, the lights come back up for the book. */
function Screening() {
  const frame = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const vars: PinVars = (k, st) => {
    const f = box(frame.current, st.el);
    const e = ease.inOut(seg(k, 0, 0.8));
    const gone = ease.inOut(seg(k, 0, 0.32));
    return {
      "--ty": px(mix(st.h * 0.6 - f.y, 0, e)), "--sc": n(mix(0.86, 1, e), 4),
      "--dim": n(ease.inOut(seg(k, 0.08, 0.72))),
      "--line-o": n(1 - gone), "--line-y": px(-30 * gone),
      "--bar-o": n(ease.out(seg(k, 0.88, 1))),
    };
  };
  return (
    <>
      <Pin length="120vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin" label="Fovea">
        <span className="hx-dimmer" aria-hidden="true" />
        <Top className="hx-fades" />
        <h1 className="hx-line">{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
        <div ref={frame} className="hx-frame"><Film play={open} /></div>
      </Pin>
      <div className="hx-lightsup" aria-hidden="true" />
      <After />
    </>
  );
}

// ———————————————————————————— 3 · Title page
/** Only the line, very large, inking in word by word. The title shrinks into the film's caption while the film
 *  rises from below into place under it. */
function Title() {
  const title = useRef<HTMLHeadingElement>(null), frame = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const vars: PinVars = (k, st) => {
    const f = box(frame.current?.querySelector(".inline-film"), st.el);
    const t = title.current;
    const fs = t ? parseFloat(getComputedStyle(t).fontSize) : 80, th = t?.offsetHeight ?? 160;
    const s1 = (st.w < 640 ? 17 : 21) / fs;
    const e = ease.inOut(seg(k, 0, 0.72));
    const y1 = f.y - 16 - (th * s1) / 2 - st.h / 2;
    const rise = ease.out(seg(k, 0.3, 0.95));
    return {
      "--t-y": px(mix(0, y1, e)), "--t-s": n(mix(1, s1, e), 4), "--t-c": `${(e * 100).toFixed(1)}%`,
      "--f-y": px(mix(st.h - f.y + 40, 0, rise)), "--f-o": n(ease.out(seg(k, 0.3, 0.55))),
      "--bar-o": n(ease.out(seg(k, 0.9, 1))),
    };
  };
  let w = 0;
  return (
    <>
      <Pin length="110vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin" label="Fovea">
        <Top />
        <h1 ref={title} className="hx-title">
          {LINE.map((s) => <span key={s}>{s.split(" ").map((word, i, all) => <span key={i} className="w" style={{ ["--i" as string]: w++ }}>{word}{i < all.length - 1 ? " " : ""}</span>)}</span>)}
        </h1>
        <div ref={frame} className="hx-frame"><Film play={open} /></div>
      </Pin>
      <After />
    </>
  );
}

// ———————————————————————————— 4 · Spec sheet
/** No hand-over: the line, the plain sentence and the keys at the left, the film already playing at the right. */
function Spec() {
  return (
    <section className="hx-spec" aria-label="Fovea">
      <Top />
      <div className="hx-spec-grid">
        <div className="hx-spec-copy">
          <p className="hx-kicker rise" style={{ ["--i" as string]: 0 }}>Fovea for Mac · in preview</p>
          <h1 className="hx-spec-line rise" style={{ ["--i" as string]: 1 }}>{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
          <p className="hx-spec-def rise" style={{ ["--i" as string]: 2 }}>{c.today.definition}</p>
          <ul className="hx-keys rise" style={{ ["--i" as string]: 3 }}>
            <li><span><kbd>fn</kbd><kbd>⌃</kbd></span>talk</li>
            <li><span><kbd>⌘</kbd></span>part of the screen</li>
            <li><span><kbd>⌘</kbd><kbd>⌘</kbd></span>whole screen</li>
          </ul>
          <p className="hx-dl left rise" style={{ ["--i" as string]: 4 }}>
            <Link className="lp-dl-btn" href="/download" data-download="hero">{c.download}</Link>
            <span>{c.requirements}</span>
          </p>
        </div>
        <div className="hx-spec-film rise" style={{ ["--i" as string]: 2 }}><Film /></div>
      </div>
    </section>
  );
}

// ———————————————————————————— 5 · Frosted
/** Soft grey. The film fills the screen behind frosted glass, moving softly, the line small over it. The pane
 *  shrinks into a card with soft corners and a soft shadow, then clears (after Apple Vision Pro's frosted sheet). */
function Frost() {
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<FilmHandle | null>(null);
  const restarted = useRef(false);
  const vars: PinVars = (k, st) => {
    const f = box(frame.current?.querySelector(".inline-film"), st.el);
    const sc0 = f.w && f.h ? Math.max(st.w / f.w, st.h / f.h) * 1.02 : 1.3;
    const e = ease.inOut(seg(k, 0, 0.62));
    const sc = mix(sc0, 1, e);
    const clear = ease.inOut(seg(k, 0.42, 0.95));
    const gone = ease.inOut(seg(k, 0.02, 0.3));
    return {
      "--oy": px(f.h / 2), "--ty": px(mix(st.h / 2 - (f.y + f.h / 2), 0, e)), "--sc": n(sc, 4),
      "--rad": px(mix(0, 26, e) / sc), "--shadow-o": n(e),
      "--blur": px(mix(30, 0, clear)), "--veil": n(mix(0.5, 0, clear)),
      "--copy-o": n(1 - gone), "--copy-y": px(-24 * gone), "--copy-pe": k > 0.3 ? "none" : "auto",
      "--bar-o": n(ease.out(seg(k, 0.9, 1))),
    };
  };
  // the film plays softly under the glass from the start; as the glass begins to clear (still blurred), it begins
  // again at the desk, once, so the reader meets it from its first scene
  const onProgress = (k: number) => {
    if (k > 0.4 && !restarted.current && player.current) { restarted.current = true; player.current.seek(START); }
  };
  return (
    <>
      <Pin length="140vh" vars={vars} onProgress={onProgress} className="hx-pin" label="Fovea">
        <Top />
        <div ref={frame} className="hx-frame"><Film play onPlayer={(p) => { player.current = p; }} /></div>
        <span className="hx-glass" aria-hidden="true" />
        <div className="hx-frost-copy">
          <h1 className="hx-frost-line">{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
          <p className="hx-frost-sub">Fovea for Mac, in preview.</p>
          <Link className="lp-dl-btn" href="/download" data-download="hero">{c.download}</Link>
        </div>
      </Pin>
      <After />
    </>
  );
}

// ———————————————————————————— 6 · On the desk
/** The line over a desk-coloured page, and the film lying back on it like a sheet of paper. It stands up to face
 *  you, its shadow tightening (after Things' tilted window). */
function Desk() {
  const frame = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const vars: PinVars = (k, st) => {
    const f = box(frame.current?.querySelector(".inline-film"), st.el);
    const e = ease.inOut(seg(k, 0, 0.84));
    const ty0 = st.h * 0.985 - (f.y + f.h);
    const ty = mix(ty0, 0, e);
    const gone = ease.inOut(seg(k, 0, 0.34));
    return {
      "--oy": px(f.h), "--ty": px(ty), "--rx": `${mix(58, 0, e).toFixed(2)}deg`, "--sc": n(mix(0.88, 1, e), 4), "--e": n(e),
      "--sh-y": px(f.y + f.h + ty), "--sh-w": px(f.w * 0.92), "--sh-o": n(1 - e),
      "--line-o": n(1 - gone), "--line-y": px(-24 * gone),
      "--bar-o": n(ease.out(seg(k, 0.9, 1))),
    };
  };
  return (
    <>
      <Pin length="110vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin" label="Fovea">
        <Top />
        <h1 className="hx-line">{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
        <span className="hx-desk-shadow" aria-hidden="true" />
        <div ref={frame} className="hx-frame"><Film play={open} /></div>
      </Pin>
      <After />
    </>
  );
}

export default function Hero({ id, pic, at }: { id: HeroId; pic?: string; at?: number }) {
  const r3 = ROUND3.find((h) => h.id === id);
  const chosen = picture(pic) ?? picture(r3?.pic);
  if (id === "screen") return <Screen pic={(chosen?.kind === "laptop" ? chosen : picture("blinds")) as Laptop} />;
  if (id === "desktop") return <><OnDesktop pic={(chosen?.kind === "scene" ? chosen : picture("green-hills")) as Scene} at={at} /><After /></>;
  if (id === "framed") return <InFrame pic={(chosen?.kind === "scene" ? chosen : picture("misty-hills")) as Scene} at={at} />;
  switch (id) {
    case "notch": return <Notch />;
    case "notch-wallpaper": return <Notch look="wallpaper" />;
    case "notch-plate": return <Notch look="plate" />;
    case "notch-pointed": return <Notch look="pointed" />;
    case "screening": return <Screening />;
    case "title": return <Title />;
    case "spec": return <Spec />;
    case "frost": return <Frost />;
    case "desk": return <Desk />;
  }
}
