"use client";

import { useEffect, useRef } from "react";
import { KEYS } from "../../../lib/landing/film/content";
import { HB, HERO_CHAT, HERO_LINE, HERO_SPEECH, heroAt } from "../../../lib/landing/film/hero";
import { STAGE } from "../../../lib/landing/film/tokens";
import type { Scene } from "../../../lib/landing/pictures";
import { Brain, Chevron, StepLine, Up } from "../film/Island";
import { Mark } from "../film/Minis";
import { makeRenderer } from "../film/renderer";
import "../film/film.css";

// The first screen's Mac (Oct 18): the chosen picture as its desktop, and Fovea's island at its notch doing what it
// does once (lib/landing/film/hero.ts), drawn with the film's own parts and styles so the notch is exactly the
// film's, which is the app's: the glass and its ears, the black notch on top, the voice bar's picture and nine bars,
// Transcribing, Choose chat, the board. The island is drawn in a 1470 × 956-point screen scaled to its frame
// (deskFit: the frame's width, a phone leaning in on the notch as the film does; or, with `cover`, the whole of a
// frame of any shape, as the page's first screen is); the picture and the menu bar always cover the frame, and the
// whole-screen capture is a picture of what the frame shows. The keys and the words sit over it at the frame's own
// size. The clock runs only while the page is in front, from when the picture has loaded; `at` holds it at a moment
// instead (the review routes' ?t=), and `from` starts it at one (the reader come back to the page, Oct 20).

const PRESSED = ["fn", "cmd2", "fnDone", "ret"] as const;

/** The island's scale in a frame W × H and where the screen sits: the frame's width (on a phone leaning in on the
 *  notch, as the film does), or with `cover` the whole frame (a phone still leans in, so the island can be read); the
 *  notch is always at the top centre. Also what of the screen the frame shows, in its points. */
export function deskFit(W: number, H: number, cover = false) {
  const lean = Math.min(3, Math.max(1, 700 / W));
  const s = cover && W >= 700 ? Math.max(W / STAGE.w, H / STAGE.h) : (W / STAGE.w) * lean;
  const tx = W / 2 - (STAGE.w / 2) * s;
  return { s, tx, ty: 0, screen: { x: -tx / s, y: 0, w: W / s, h: H / s } };
}

const src = (pic: Scene, w: number) => `${pic.src}?format=webp&w=${w}`;

/** A capture's picture of the screen: the picture as the frame shows it, the menu bar along its top. */
const Shot = ({ pic, strip }: { pic: Scene; strip?: boolean }) => (
  <span className="hd-shot">
    {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in picture, hotlinked (lib/landing/pictures.ts) */}
    <img src={src(pic, 900)} alt="" style={pic.pos ? { objectPosition: pic.pos } : undefined} />
    {strip && <i />}
  </span>
);
const Card = ({ pic }: { pic: Scene }) => <span data-m="screen" className="m-screen"><Shot pic={pic} /></span>;

function Island({ pic }: { pic: Scene }) {
  return (
    <div className="isl">
      <div data-k="is:glass" className="is-glass" />
      <svg data-k="is:ears" className="is-ears" aria-hidden="true"><path /></svg>
      <svg data-k="is:rim" className="is-rim" aria-hidden="true"><path /></svg>
      <div data-k="is:clip" className="is-clip">
        <div data-k="is:voice" className="slot s-voice">
          <span className="stack"><span data-k="vb:t0" className="mini th th0" data-state="screen"><Card pic={pic} /></span></span>
          <span data-k="vb:wave" className="wave">{Array.from({ length: 9 }, (_, i) => <i key={i} data-k={`vb:b${i}`} />)}</span>
        </div>
        <div data-k="is:trans" className="slot s-trans">
          <p>Transcribing<span data-k="tr:dots" className="ell"><i /><i /><i /></span></p>
        </div>
        <div data-k="is:choose" className="slot s-choose">
          <div className="cwrap">
            <p className="creq">{HERO_LINE}</p>
            <div className="row">
              <span className="pile"><span className="mini" data-state="screen" style={{ ["--i" as string]: 0, zIndex: 3 }}><Card pic={pic} /></span></span>
              <span className="pills">
                <span className="pill chat">
                  <span data-k="ch:glow" className="glow" />
                  <span className="settled"><Mark agent={HERO_CHAT.agent} /><span className="name">{HERO_CHAT.name}</span><Chevron /></span>
                </span>
                <span className="pill model"><Brain />Auto<Chevron /></span>
                <span className="send"><Up /></span>
              </span>
            </div>
            <div className="sug">
              <span className="lab">Suggested</span>
              {HERO_CHAT.chips.map((ch, i) => <span key={ch.name} className={`chip${i === 0 ? " on" : ""}`}><Mark agent={ch.agent} size={14} />{ch.name}</span>)}
            </div>
          </div>
        </div>
        <div data-k="is:board" className="slot s-board">
          <div className="bsec">
            <div className="brow" data-state="working">
              <span className="ic"><Mark agent={HERO_CHAT.agent} size={26} /><span className="badge" /></span>
              <span className="tx"><b>{HERO_CHAT.name}</b><span className="steps one"><StepLine s={HERO_CHAT.step} /></span></span>
              <span className="tm">now</span>
            </div>
          </div>
        </div>
      </div>
      <div className="is-notch" />
    </div>
  );
}

type Props = {
  pic: Scene; at?: number; label?: string; cover?: boolean;
  /** Where its clock starts (the moment it had reached when the reader left the page and came back, Oct 20). */
  from?: number;
  /** Told the clock's time as it moves. */
  onTime?: (t: number) => void;
};

export default function HeroDesk({ pic, at, label, cover, from, onTime }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const told = useRef(onTime);
  useEffect(() => { told.current = onTime; });
  useEffect(() => {
    const el = root.current, w = world.current;
    if (!el || !w) return;
    const renderer = makeRenderer(el);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = el.clientWidth || 1, H = el.clientHeight || 1, t = at ?? (reduced ? HB.still : Math.min(HB.end, Math.max(0, from ?? 0)));
    let raf = 0, last = 0, started = false;
    let fit = deskFit(W, H, cover);
    const draw = () => renderer.apply(heroAt(t, { reduced, screen: fit.screen }), w, fit);
    // the clock moves only while frames come (a page in the background holds it where it was)
    const tick = (now: number) => {
      raf = 0;
      if (last) t = Math.min(HB.end, t + Math.min(0.1, (now - last) / 1000));
      last = now;
      told.current?.(t);
      draw();
      if (t < HB.end) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (started || at !== undefined || reduced) return; started = true; raf = requestAnimationFrame(tick); };
    const resize = () => {
      W = el.clientWidth || 1;
      H = el.clientHeight || 1;
      fit = deskFit(W, H, cover);
      el.style.setProperty("--fw", `${W}px`);
      el.style.setProperty("--fh", `${H}px`);
      // the menu bar is the notch's height, at the island's scale
      el.style.setProperty("--mb", `${(32 * fit.s).toFixed(2)}px`);
      if (!raf) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    // it begins once the picture is there (or after a moment, whatever happens)
    const img = el.querySelector<HTMLImageElement>(".hd-wall");
    if (!img || img.complete) start(); else img.addEventListener("load", start, { once: true });
    const late = setTimeout(start, 2500);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(late); img?.removeEventListener("load", start); };
  }, [pic, at, cover, from]);

  return (
    <div ref={root} data-k="hd" className="film hd" role="img" aria-label={label ?? `A Mac’s screen. Fovea takes the whole screen at the notch, “${HERO_LINE}” is said, and it is sent to Claude Code.`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in picture, hotlinked (lib/landing/pictures.ts) */}
      <img className="hd-wall" src={src(pic, 2560)} alt="" style={pic.pos ? { objectPosition: pic.pos } : undefined} />
      <span className="hd-bar" />
      <span data-k="flash:screen" className="hd-flash" />
      <div ref={world} className="f-world">
        <span data-k="scr:fly" className="scr-fly"><Shot pic={pic} strip /></span>
        <Island pic={pic} />
      </div>
      <div className="over" aria-hidden="true">
        <div className="keys">
          {PRESSED.map((id) => (
            <span key={id} data-k={`key:${id}`} className="kc" data-state="up">
              {KEYS[id].caps.map((cap, i) => <kbd key={i} className={cap.length > 1 ? "wide" : ""}>{cap}</kbd>)}
              <em>{KEYS[id].label}</em>
            </span>
          ))}
        </div>
        <div className="subs">
          <p data-k="sub:hero" className="sub">
            {HERO_SPEECH.words.map((wd, i) => (
              <span key={i}><span data-k={`sw:hero:${i}`} className="w">{wd.text}</span>{i < HERO_SPEECH.words.length - 1 ? " " : ""}</span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
