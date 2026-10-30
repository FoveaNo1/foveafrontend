"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ease, mix, seg } from "../../../lib/landing/film/ease";
import type { Scene } from "../../../lib/landing/pictures";
import { here, keep, returning, settle } from "../../../lib/landing/place";
import HeroDesk, { deskFit } from "./HeroDesk";
import Pin, { type PinVars } from "./Pin";
import { After, HeroFilm, LINE, Top, box, n, opening, px } from "./shared";

// The desktop, pointed at (Oct 17, after Perplexity's Personal Computer and Mercury): a picture is a Mac's desktop,
// and on arrival Fovea does its one thing on it, once. Oct 18 (Yulun): the whole screen is taken and "The future of
// human agent interaction is here." is said; the notch is exactly the app's, drawn by the film's own parts (HeroDesk,
// lib/landing/film/hero.ts); no glow under the notch or the film. Two ways to hold it:
// - OnDesktop (the page's, Oct 18, with the sea, P7): the picture fills the first screen, the menu bar along its top
//   carrying "Fovea" and "Download for Mac", the line at its foot (nothing under it: Oct 21, Yulun); scrolling, the
//   notch grows into the film's frame over it and the picture gives way to the paper.
// - InFrame: on the paper, the line over the desktop in a frame; scrolling, the film takes the desktop's place in the
//   same frame, from its first screen.

/** The picture fills the first screen as a Mac's desktop, the page's own top bar in its menu bar, the line at its
 *  foot; scrolling, the notch grows into the film's frame (the hand-over chosen on Oct 17, Notch.tsx, with no glow),
 *  the picture gives way to the paper, and the film plays from its first screen. Come back to from another page
 *  (Oct 20), it opens where the reader left it: as far down, the scene and the film as they were. What follows it is
 *  the page's (Oct 24: the showcase, then the way in; components/book/Landing.tsx). */
export function OnDesktop({ pic, at }: { pic: Scene; at?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // where the reader was, if they are coming back (read once, as the page opens; nothing on the server)
  const [back] = useState(returning);
  useLayoutEffect(() => {
    here.y = back?.y ?? 0;
    here.hero = back?.hero ?? 0;
    here.film = back?.film;
    settle();
    // put them back where they were: now, and again just before the first paint, after the router has scrolled
    const to = (y: number) => scrollTo({ top: y, behavior: "instant" });
    let raf = 0;
    if (back) { to(back.y); raf = requestAnimationFrame(() => to(back.y)); }
    // keep the place up to date, and keep it on leaving: when this page goes (a link), when the tab does, and at
    // once on Back, before the browser puts the scroll where the other page had it
    let gone = false;
    const scrolled = () => { if (!gone) here.y = scrollY; };
    const pop = () => { if (location.pathname !== "/" && !gone) { keep(); gone = true; } };
    const hide = () => { if (!gone) keep(); };
    const show = (e: PageTransitionEvent) => { if (e.persisted) gone = false; };
    addEventListener("scroll", scrolled, { passive: true });
    addEventListener("popstate", pop, true);
    addEventListener("pagehide", hide);
    addEventListener("pageshow", show);
    return () => {
      cancelAnimationFrame(raf);
      if (!gone) keep();
      gone = true;
      removeEventListener("scroll", scrolled);
      removeEventListener("popstate", pop, true);
      removeEventListener("pagehide", hide);
      removeEventListener("pageshow", show);
    };
  }, [back]);
  const vars: PinVars = (k, st) => {
    const F = box(frame.current?.querySelector(".inline-film"), st.el);
    // the notch as the desktop draws it (180 × 32 points, at the island's scale), and the menu bar its height
    const { s } = deskFit(st.w, st.h, true), nw = 180 * s, nh = 32 * s, nx = (st.w - nw) / 2;
    const e = ease.inOut(seg(k, 0.1, 0.84));
    const top = mix(0, F.y, e), left = mix(nx, F.x, e);
    const right = st.w - mix(nx + nw, F.x + F.w, e), bottom = st.h - mix(nh, F.y + F.h, e);
    const rt = mix(0, 10, e), rb = mix(8 * s, 10, e);
    const gone = ease.inOut(seg(k, 0, 0.18));
    return {
      "--clip": `inset(${px(top)} ${px(right)} ${px(bottom)} ${px(left)} round ${px(rt)} ${px(rt)} ${px(rb)} ${px(rb)})`,
      "--shape-o": n(1 - seg(k, 0.95, 0.99)),
      "--film-o": n(ease.out(seg(k, 0.8, 0.95))),
      "--desk-o": n(1 - ease.inOut(seg(k, 0.6, 0.9))),
      "--fore-o": n(1 - gone), "--line-y": px(-24 * gone),
      "--bar-o": n(ease.out(seg(k, 0.9, 1))),
      "--menu-h": px(nh),
    };
  };
  return (
    <>
      <Pin length="130vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin hx-ondesk" label="Fovea">
        <div className="hx-desk-full"><HeroDesk pic={pic} at={at} cover from={back?.hero} onTime={(t) => { here.hero = t; }} /></div>
        <Top className="hx-desk-top" />
        <h1 className={`hx-foot-line hx-${pic.foot ?? "ink"}`}>{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
        <span className="hx-shape" aria-hidden="true" />
        <div ref={frame} className="hx-frame hx-late"><HeroFilm play={open} resume={back?.film} onPlace={(f) => { here.film = f; }} /></div>
      </Pin>
    </>
  );
}

/** On the paper: the line over a framed desktop, where the scene plays; scrolling, the desktop gives way to the film
 *  in the same frame, from its first screen (the line, settled). */
export function InFrame({ pic, at }: { pic: Scene; at?: number }) {
  const [open, setOpen] = useState(false);
  const vars: PinVars = (k) => ({
    "--film-o": n(ease.inOut(seg(k, 0.35, 0.85))),
    "--fore-o": n(1 - ease.inOut(seg(k, 0.3, 0.7))),
    "--bar-o": n(ease.out(seg(k, 0.85, 1))),
  });
  return (
    <>
      <Pin length="70vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin hx-inframe" label="Fovea">
        <Top />
        <h1 className="hx-frame-line">{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
        <div className="hx-frame hx-framed">
          <div className="hx-under"><HeroDesk pic={pic} at={at} /></div>
          <div className="hx-over"><HeroFilm play={open} start={1.3} /></div>
        </div>
      </Pin>
      <After />
    </>
  );
}
