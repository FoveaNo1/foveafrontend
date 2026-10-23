"use client";

import { useEffect, useRef } from "react";
import { fitCamera } from "../../../lib/landing/film/camera";
import { CHAPTERS, DURATION } from "../../../lib/landing/film/content";
import { evaluate } from "../../../lib/landing/film/film";
import { FilmPlayer } from "../../../lib/landing/film/player";
import Desk, { Marks } from "./Desk";
import Island from "./Island";
import { Over, PaperLayer } from "./Paper";
import { makeRenderer } from "./renderer";
import "./film.css";

// The demo film, drawn live: a 13-inch Mac's screen (the desk and Fovea's island) seen through a camera, and over it
// the film's paper and words, sized to whatever frame holds it. lib/landing/film/film.ts says what everything does at
// each moment; this builds the picture once and applies those moments. The page that plays it gets a <video>-like
// handle through onReady (components/book/InlineFilm.tsx).

type Props = {
  onReady?: (player: FilmPlayer) => void;
  /** Start here, paused (the development page, ?film=). */
  at?: number;
  debug?: boolean;
};

export default function Film({ onReady, at, debug = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const dbg = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  useEffect(() => { ready.current = onReady; }, [onReady]);

  useEffect(() => {
    const el = root.current, w = world.current;
    if (!el || !w) return;
    const renderer = makeRenderer(el);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = { w: el.clientWidth || 1, h: el.clientHeight || 1 };
    let lastT = at ?? 0;

    const render = (t: number) => {
      lastT = t;
      const frame = evaluate(t, { reduced });
      renderer.apply(frame, w, fitCamera(frame.aim, size.w, size.h));
      if (dbg.current) dbg.current.textContent = `${t.toFixed(2)} s · ${frame.shot} · ${CHAPTERS[frame.chapter].title}`;
    };
    const resize = () => {
      size = { w: el.clientWidth || 1, h: el.clientHeight || 1 };
      el.style.setProperty("--fw", `${size.w}px`);
      el.style.setProperty("--fh", `${size.h}px`);
      render(lastT);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const player = new FilmPlayer({
      duration: DURATION,
      chapters: CHAPTERS,
      render,
      clock: { now: () => performance.now(), raf: (cb) => requestAnimationFrame(cb), caf: (id) => cancelAnimationFrame(id) },
    });
    if (at !== undefined) player.seek(at);
    player.start();
    if (process.env.NODE_ENV !== "production") (window as unknown as { foveaFilm?: FilmPlayer }).foveaFilm = player;
    ready.current?.(player);

    const onVisibility = () => { if (document.hidden) player.pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    let onKey: ((e: KeyboardEvent) => void) | null = null;
    if (debug) {
      onKey = (e: KeyboardEvent) => {
        if (e.key === ",") player.seek(player.currentTime - 1 / 30);
        if (e.key === ".") player.seek(player.currentTime + 1 / 30);
      };
      addEventListener("keydown", onKey);
    }
    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (onKey) removeEventListener("keydown", onKey);
      player.destroy();
    };
  }, [at, debug]);

  return (
    <div ref={root} className="film" data-k="root" aria-hidden="true">
      <div ref={world} className="f-world">
        <Desk />
        <Island />
        <Marks />
      </div>
      <PaperLayer />
      <Over />
      {debug && <div ref={dbg} className="f-debug" />}
    </div>
  );
}
