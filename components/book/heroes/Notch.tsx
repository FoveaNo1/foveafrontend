"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BookCopy as c } from "../../../lib/landing/bookCopy";
import { Pictures, sized } from "../../../lib/landing/book";
import { ease, mix, seg } from "../../../lib/landing/film/ease";
import Pin, { type PinVars, type Stage } from "./Pin";
import { After, HeroFilm, LINE, box, n, opening, px } from "./shared";

// The page's first screen (Oct 17, chosen from six at /hero): a Mac's menu bar, its notch in the middle, the line.
// Scrolling, the notch grows down and out until it is the film's frame (no glow along its foot, Oct 18) (a
// clip-path from the notch's box to the frame's: Screen Studio's recording that settles into its place, run the
// other way), and the film plays from its first scene. Every frame of it is a pure function of how far through the
// held stretch of scroll the reader is (Pin).
//
// The picture (Oct 17, the dancer, a stand-in: lib/landing/book.ts), three ways, each at /hero/notch-<look>:
// - wallpaper: the screen is a Mac's, the dancer its wallpaper, on a rounded panel on the paper; the film's frame
//   grows over it and plays on it, the picture a mat round the film (Cursor's and Dia's product on a painting).
// - plate: the dancer as a plate facing the line, like a book's frontispiece; the notch's black grows over both.
// - pointed: the dancer large on the paper; the notch opens to listen, a hand drags round her with ⌘, the picture
//   flies up into the notch, and the notch opens into the film (the product, shown on the picture itself).

export type NotchLook = "plain" | "wallpaper" | "plate" | "pointed";

type Box = { x: number; y: number; w: number; h: number; rt: number; rb: number };
const lerpBox = (a: Box, b: Box, p: number): Box => ({ x: mix(a.x, b.x, p), y: mix(a.y, b.y, p), w: mix(a.w, b.w, p), h: mix(a.h, b.h, p), rt: mix(a.rt, b.rt, p), rb: mix(a.rb, b.rb, p) });
const clip = (b: Box, st: Stage) =>
  `inset(${px(b.y)} ${px(st.w - b.x - b.w)} ${px(st.h - b.y - b.h)} ${px(b.x)} round ${px(b.rt)} ${px(b.rt)} ${px(b.rb)} ${px(b.rb)})`;

/** The voice bar, as the app opens it (192 × 76, its foot 14 round), and where the first capture sits in it. */
const BAR = { w: 192, h: 76, rb: 14 };
const SLOT = { dx: 14, y: 40, w: 40, h: 28 };
/** Pointed: what the hand takes, as fractions of the picture (round the dancer), and where it starts and ends. */
const TAKE = { x0: 0.19, y0: 0.13, x1: 0.58, y1: 0.89 };
const PHOTO = sized(Pictures.dancer.src, 1600);

export default function Notch({ look = "plain" }: { look?: NotchLook }) {
  const frame = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const vars: PinVars = (k, st) => {
    const f = box(frame.current?.querySelector(".inline-film"), st.el);
    const phone = st.w < 640;
    // the screen's top edge, where the notch hangs: the wallpaper's panel sits a little in from the page's edges
    const m = look === "wallpaper" ? (phone ? 8 : 12) : 0;
    const nw = phone ? 92 : Math.min(210, Math.max(150, st.w * 0.125));
    const notch: Box = { x: (st.w - nw) / 2, y: m, w: nw, h: 34, rt: 0, rb: 11 };
    const bar: Box = { x: (st.w - BAR.w) / 2, y: m, w: BAR.w, h: BAR.h, rt: 0, rb: BAR.rb };
    const film: Box = { x: f.x, y: f.y, w: f.w, h: f.h, rt: 10, rb: 10 };
    const v: Record<string, string | number> = { "--m": px(m) };

    let shape: Box, grow: number;
    if (look === "pointed") {
      // the notch opens to listen; the hand takes the dancer; the picture flies up; then the notch opens to the film
      const listen = ease.out(seg(k, 0.05, 0.13));
      grow = ease.inOut(seg(k, 0.64, 0.9));
      shape = lerpBox(lerpBox(notch, bar, listen), film, grow);
      const p = box(plate.current, st.el);
      const a = { x: p.x + TAKE.x0 * p.w, y: p.y + TAKE.y0 * p.h }, z = { x: p.x + TAKE.x1 * p.w, y: p.y + TAKE.y1 * p.h };
      const rest = { x: p.x + p.w * 0.94, y: p.y + p.h * 1.02 }, away = { x: st.w * 0.86, y: st.h * 0.96 };
      const reach = ease.inOut(seg(k, 0.13, 0.2)), drag = ease.inOut(seg(k, 0.2, 0.38)), leave = ease.inOut(seg(k, 0.44, 0.56));
      const hand = k < 0.2 ? { x: mix(rest.x, a.x, reach), y: mix(rest.y, a.y, reach) }
        : k < 0.44 ? { x: mix(a.x, z.x, drag), y: mix(a.y, z.y, drag) }
          : { x: mix(z.x, away.x, leave), y: mix(z.y, away.y, leave) };
      const cross = k >= 0.17 && k < 0.39;
      v["--hand-x"] = px(hand.x); v["--hand-y"] = px(hand.y);
      v["--hand-o"] = n(Math.min(ease.out(seg(k, 0.08, 0.13)), 1 - seg(k, 0.52, 0.58)));
      v["--arrow-o"] = cross ? 0 : 1; v["--cross-o"] = cross ? 1 : 0;
      // the region follows the hand while it drags, holds a moment, then its picture lifts off
      const sel = { x: a.x, y: a.y, w: Math.max(0, hand.x - a.x), h: Math.max(0, hand.y - a.y) };
      const held = k >= 0.38 ? { x: a.x, y: a.y, w: z.x - a.x, h: z.y - a.y } : sel;
      v["--sel-x"] = px(held.x); v["--sel-y"] = px(held.y); v["--sel-w"] = px(held.w); v["--sel-h"] = px(held.h);
      v["--sel-o"] = n(k >= 0.2 && k < 0.47 ? 1 - seg(k, 0.44, 0.47) : 0);
      // the flight: from the region to its place in the bar, the picture cut to what was taken
      const slot = { x: bar.x + SLOT.dx, y: m + SLOT.y, w: SLOT.w, h: SLOT.h };
      const fly = ease.inOut(seg(k, 0.44, 0.56));
      const fx = mix(a.x, slot.x, fly), fy = mix(a.y, slot.y, fly), fw = mix(z.x - a.x, slot.w, fly), fh = mix(z.y - a.y, slot.h, fly);
      // the picture inside it keeps the taken region's framing: scale the plate by the flight's width
      const sx = fw / (z.x - a.x), sy = fh / (z.y - a.y);
      v["--fly-x"] = px(fx); v["--fly-y"] = px(fy); v["--fly-w"] = px(fw); v["--fly-h"] = px(fh);
      v["--fly-bw"] = px(p.w * sx); v["--fly-bh"] = px(p.h * sy);
      v["--fly-bx"] = px(-(a.x - p.x) * sx); v["--fly-by"] = px(-(a.y - p.y) * sy);
      v["--fly-o"] = n(k >= 0.44 ? Math.min(ease.out(seg(k, 0.44, 0.47)), 1 - seg(k, 0.64, 0.7)) : 0);
      v["--fly-r"] = px(mix(2, 6, fly));
      // the bar's waveform, and the capture's key, while it listens
      v["--wave-o"] = n(Math.min(ease.out(seg(k, 0.12, 0.16)), 1 - seg(k, 0.62, 0.66)));
      v["--wave-x"] = px(mix(0, 22, ease.out(seg(k, 0.56, 0.6))));
      v["--key-o"] = n(Math.min(ease.out(seg(k, 0.15, 0.19)), 1 - seg(k, 0.4, 0.44)));
      v["--plate-o"] = n(1 - seg(k, 0.74, 0.86));
      v["--film-o"] = n(ease.out(seg(k, 0.86, 0.96)));
      v["--shape-o"] = n(1 - seg(k, 0.96, 0.995));
      const gone = ease.inOut(seg(k, 0.62, 0.72));
      v["--line-o"] = n(1 - gone); v["--line-y"] = px(-12 * gone); v["--line-b"] = px(4 * gone);
      v["--bar-o"] = n(ease.out(seg(k, 0.93, 1)));
    } else {
      grow = ease.inOut(seg(k, 0.06, 0.84));
      shape = lerpBox(notch, film, grow);
      v["--film-o"] = n(ease.out(seg(k, 0.8, 0.95)));
      v["--shape-o"] = n(1 - seg(k, 0.95, 0.99));
      // the line steps back as the notch comes for it; on the wallpaper it waits until the frame nears it
      const gone = look === "wallpaper" ? ease.inOut(seg(k, 0.18, 0.46)) : ease.inOut(seg(k, 0, 0.3));
      v["--line-o"] = n(1 - gone); v["--line-y"] = px(-40 * gone); v["--line-b"] = px(6 * gone);
      v["--bar-o"] = n(ease.out(seg(k, 0.9, 1)));
      if (look === "plate") v["--plate-o"] = n(1 - ease.inOut(seg(k, 0.3, 0.7)));
    }
    v["--clip"] = clip(shape, st);
    return v;
  };

  const photo = (cls: string) => (
    // eslint-disable-next-line @next/next/no-img-element -- a stand-in photograph, hotlinked (lib/landing/book.ts)
    <img className={cls} src={PHOTO} alt={Pictures.dancer.alt} width={1600} height={1600} />
  );

  return (
    <>
      <Pin length={look === "pointed" ? "210vh" : "130vh"} vars={vars} onProgress={opening(setOpen)} className={`hx-pin hx-look-${look}`} label="Fovea">
        {look === "wallpaper" && <div className="hx-screen" aria-hidden="true">{photo("hx-photo")}</div>}
        <header className="hx-menubar">
          <p className="name">Fovea</p>
          <Link href="/download" data-download="top">{c.download}</Link>
        </header>
        {look === "plate" && (
          <div className="hx-spread">
            <div ref={plate} className="hx-plate">{photo("hx-plate-img")}</div>
            <h1 className="hx-line hx-line-side">{LINE.map((s) => <span key={s}>{s}</span>)}</h1>
          </div>
        )}
        {look === "pointed" && <div ref={plate} className="hx-plate hx-plate-c">{photo("hx-plate-img")}</div>}
        <span className="hx-shape" aria-hidden="true" />
        {look === "pointed" && (
          <>
            <span className="hx-wave" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ ["--b" as string]: Math.exp(-(((i - 4) / 4) ** 2) / 0.32) }} />)}</span>
            <span className="hx-sel" aria-hidden="true" />
            <span className="hx-fly" aria-hidden="true" style={{ backgroundImage: `url("${PHOTO}")` }} />
            <span className="hx-hand" aria-hidden="true">
              <svg className="hx-arrow" viewBox="0 0 14 21" width="15" height="22"><path d="M1 1v15.4l3.9-3.5 2.6 6.1 2.6-1.1-2.6-6h5.1z" fill="#000" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
              <svg className="hx-cross" viewBox="0 0 22 22" width="22" height="22"><path d="M11 1v20M1 11h20" stroke="#000" strokeWidth="1.4" /><path d="M11 1v20M1 11h20" stroke="#fff" strokeWidth=".6" /></svg>
            </span>
            <span className="hx-key" aria-hidden="true"><kbd>⌘</kbd><em>part of the screen</em></span>
          </>
        )}
        {look !== "plate" && <h1 className={`hx-line${look === "wallpaper" ? " hx-line-corner" : look === "pointed" ? " hx-line-below" : ""}`}>{LINE.map((s) => <span key={s}>{s}</span>)}</h1>}
        <div ref={frame} className="hx-frame"><HeroFilm play={open} /></div>
      </Pin>
      <After />
    </>
  );
}
