"use client";

import { useRef, useState } from "react";
import { ease, mix, seg } from "../../../lib/landing/film/ease";
import type { Laptop } from "../../../lib/landing/pictures";
import { bbox, lerpQuad, matrix3d, rectQuad, type Quad } from "../../../lib/landing/quad";
import Pin, { type PinVars } from "./Pin";
import { After, HeroFilm, Top, box, n, opening, px } from "./shared";

// Into the screen (Oct 17, after Mercury): a photograph of a laptop in a calm room; on its screen, the film's first
// screen, the line ("Stay in your window. Talk to any agent from the notch.") set as the film sets it. Scrolling, the
// camera moves into the laptop until its screen is the film's frame, and the film plays on from there. The film is
// drawn at its own size and laid onto the photograph's screen by a homography (lib/landing/quad.ts), so its words stay
// sharp however small, and it lines up with the screen however the laptop is turned. Every frame is a pure function
// of how far through the held stretch of scroll the reader is (Pin).

/** Where the film shows before it plays, and where it plays on from: its first screen, the line whole (A0's card has
 *  risen and settled by 1.3 s). */
const POSTER = 1.3;

export default function Screen({ pic }: { pic: Laptop }) {
  const frame = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const vars: PinVars = (k, st): Record<string, string | number> => {
    const filmEl = frame.current?.querySelector(".inline-film") as HTMLElement | null;
    const F = box(filmEl, st.el);
    if (!F.w) return {};
    const phone = st.w < 640;
    // the photograph's screen, in picture pixels
    const Qi = pic.screen.map(([x, y]) => ({ x: x * pic.w, y: y * pic.h })) as Quad;
    const bi = bbox(Qi);
    const ci = { x: bi.x + bi.w / 2, y: bi.y + bi.h / 2 };
    // the first framing: the photograph covers the stage, the screen as near the middle as the photograph allows; on
    // a phone it is a band across the middle, the screen four fifths of the width
    const cover = Math.max(st.w / pic.w, st.h / pic.h);
    const s0 = phone ? (0.8 * st.w) / bi.w : cover;
    const want = { x: st.w / 2, y: phone ? st.h * 0.5 : st.h * 0.53 };
    let ox = want.x - ci.x * s0, oy = want.y - ci.y * s0;
    if (!phone) {
      ox = Math.min(0, Math.max(st.w - pic.w * s0, ox));
      oy = Math.min(0, Math.max(st.h - pic.h * s0, oy));
    }
    const c0 = { x: ox + ci.x * s0, y: oy + ci.y * s0 };
    // the last: the screen is the film's frame
    const s1 = s0 * (F.w / (bi.w * s0));
    const cF = { x: F.x + F.w / 2, y: F.y + F.h / 2 };
    const e = ease.inOut(seg(k, 0.04, 0.86));
    // the zoom moves evenly in scale, as a camera does
    const s = Math.exp(mix(Math.log(s0), Math.log(s1), e));
    const c = { x: mix(c0.x, cF.x, e), y: mix(c0.y, cF.y, e) };
    const px0 = c.x - ci.x * s, py0 = c.y - ci.y * s;
    // the film rides the photograph's screen, and settles into its own rectangle as the zoom ends
    const onPhoto = Qi.map((p) => ({ x: px0 + p.x * s, y: py0 + p.y * s })) as Quad;
    const Q = lerpQuad(onPhoto, rectQuad(F.x, F.y, F.w, F.h), ease.inOut(seg(k, 0.55, 0.86)));
    const rel = Q.map((p) => ({ x: p.x - F.x, y: p.y - F.y })) as Quad;
    const fade = ease.inOut(seg(k, 0.78, 0.96));
    return {
      "--ph-x": px(px0), "--ph-y": px(py0), "--ph-w": px(pic.w * s), "--ph-h": px(pic.h * s),
      "--ph-o": n(1 - fade), "--ph-blur": px(6 * fade),
      "--film-tf": matrix3d(F.w, F.h, rel),
      "--film-r": px(mix(3, 10, seg(k, 0.6, 0.9))), "--film-sh": n(seg(k, 0.7, 0.95)),
      "--bar-o": n(ease.out(seg(k, 0.9, 1))),
    };
  };

  return (
    <>
      <Pin length="150vh" vars={vars} onProgress={opening(setOpen)} className="hx-pin hx-screen-hero" label="Fovea">
        {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in photograph, hotlinked (lib/landing/pictures.ts) */}
        <img className="hx-room" src={`${pic.src}?format=webp&w=2560`} alt={pic.name} />
        <Top />
        <div ref={frame} className="hx-frame hx-onscreen"><HeroFilm play={open} start={POSTER} /></div>
      </Pin>
      <After />
    </>
  );
}
