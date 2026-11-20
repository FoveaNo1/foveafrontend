"use client";

import { useEffect, useRef } from "react";
import { REST, SCENES, showFit, type SceneId } from "../../../lib/landing/film/showcase";
import { makeRenderer } from "../film/renderer";
import { VIEWS } from "./scenes";
import "../film/film.css";

// One of the showcase's scenes in its frame (lib/landing/film/showcase.ts says what happens; scenes.tsx draws it):
// a Mac's whole screen, scaled to the frame, the keys and words over it at the frame's own size (on a phone, in the
// strip under it). It plays while the page says so (`play`: its item is the one in view), from the desk at rest, and
// loops through the dark; told to stop, it holds where it was. Before it first plays it rests on the desk. The clock moves only while
// frames come, so a page in the background holds it. Under Reduce Motion it shows one still that says what it does.

type Props = { id: SceneId; play: boolean; label: string };

export default function Demo({ id, play, label }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const wanted = useRef(play);
  const control = useRef<((on: boolean) => void) | null>(null);

  useEffect(() => {
    const el = root.current, w = world.current;
    if (!el || !w) return;
    const scene = SCENES[id];
    const renderer = makeRenderer(el);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fit = showFit(1, 1), t = reduced ? scene.still : REST, raf = 0, last = 0;
    const draw = () => renderer.apply(scene.at(t, { reduced }), w, fit);
    const tick = (now: number) => {
      if (last) t = (t + Math.min(0.1, (now - last) / 1000)) % scene.len;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      const W = el.clientWidth || 1, H = el.clientHeight || 1;
      fit = showFit(W, H);
      el.style.setProperty("--fw", `${W}px`);
      el.style.setProperty("--fh", `${H}px`);
      if (!raf) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    // each time it is told to play, it plays from the desk at rest
    control.current = (on: boolean) => {
      if (reduced) return;
      if (on && !raf) { t = REST; last = 0; raf = requestAnimationFrame(tick); }
      else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    control.current(wanted.current);
    // in development, a handle to hold a scene at any moment (as window.foveaFilm is for the film)
    const dev = process.env.NODE_ENV !== "production" ? ((window as unknown as { foveaScenes?: Record<string, unknown> }).foveaScenes ??= {}) : null;
    if (dev) dev[id] = { seek: (at: number) => { cancelAnimationFrame(raf); raf = 0; t = at; draw(); }, len: scene.len };
    return () => { cancelAnimationFrame(raf); ro.disconnect(); control.current = null; if (dev) delete dev[id]; };
  }, [id]);

  useEffect(() => { wanted.current = play; control.current?.(play); }, [play]);

  const { World, Over } = VIEWS[id];
  return (
    <div ref={root} className={`film sc sc-${id}`} role="img" aria-label={label}>
      <div ref={world} className="f-world"><World /></div>
      <Over />
      <span data-k="dip" className="sc-dip" />
    </div>
  );
}
