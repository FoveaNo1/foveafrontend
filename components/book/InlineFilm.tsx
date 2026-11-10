"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { FilmHandle } from "../../lib/landing/film/player";
import { FILM_VIDEO, FILM_VIDEO_TRANSCRIPT } from "../../lib/landing/film/video";
import type { FilmPlace } from "../../lib/landing/place";

const FilmVideo = dynamic(() => import("./film/FilmVideo"), { ssr: false });

const REDUCE = "(prefers-reduced-motion: reduce)";
const isReduced = () => matchMedia(REDUCE).matches;
const onReduceChange = (cb: () => void) => { const m = matchMedia(REDUCE); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

// The demo film on the page. It loads as it nears the screen and plays silently (so it needs no permission) while
// the reader is with it: at least half of it in view, the page's word given (`play`, when a page opens onto it), and
// the page itself in front of them. How it plays (Oct 17, Yulun's rule):
// - Arriving at it by scrolling, it always starts from the beginning (`start`), never where it was left.
// - Leaving it, by scrolling away or by leaving the page (another tab or app), pauses it.
// - Coming back to the page while it is in view resumes it where it paused.
// Oct 17, again: every time it plays, it plays from its very first screen; at the end it stops there, and the
// viewer plays it again themselves (a replay mark shows). A click on it pauses and plays; the viewer's own pause
// holds until they play again or arrive at it afresh. Under Reduce Motion it waits to be played. With `controls`, under the frame: a bar
// in the film's parts, each named, that can be dragged to any moment (no button, no times). `from`/`to` loop one
// stretch of it instead (film seconds).
// Oct 20 (Yulun): coming back to the page from another, it is as it was left (`resume`): playing on from where it
// was, or held there, paused or ended, the first time the reader is with it again.
// Oct 25 (Yulun): the film is the recorded launch film (film/FilmVideo.tsx), played all the same ways; the film drawn
// live in the page (film/Film.tsx) is on no page any more. The recorded film has music,
// so it starts silent and a sound button sits in its corner, and the music's credit sits under the bar (CC BY 4.0).
// Where a browser won't play it by itself (iOS's Low Power Mode), it waits to be played.

type Cause = "view" | "page" | "word" | "ready";

type Props = {
  className?: string; label?: string; from?: number; to?: number; controls?: boolean;
  /** The page's word on whether the reader has reached the film (undefined: being in view is enough). */
  play?: boolean;
  /** Where it begins, every time the reader arrives at it (film seconds). */
  start?: number;
  onPlayer?: (p: FilmHandle) => void;
  /** As the reader left it, when they come back to the page (lib/landing/place.ts). */
  resume?: FilmPlace;
  /** Told how it is whenever that changes: playing, paused by the viewer, ended, or none of these (undefined). */
  onPlace?: (p: FilmPlace | undefined) => void;
};

export default function InlineFilm({ className = "", label = "The Fovea film", from = 0, to, controls = false, play, start, onPlayer, resume, onPlace }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLInputElement>(null);
  const player = useRef<FilmHandle | null>(null);
  const { chapters, duration } = FILM_VIDEO;
  // the reader's place: the film in view, the page's word, the page in front of them; and the viewer's own pause
  const inView = useRef(false);
  const word = useRef(play ?? true);
  const present = useRef(true);
  const blurred = useRef(false);
  const active = useRef(false);
  const held = useRef(false);
  const begin = useRef(start ?? from);
  useEffect(() => { begin.current = start ?? from; }, [start, from]);
  // as the reader left it, until they are with it again; how it is now; and who is told
  const pending = useRef(resume);
  const last = useRef<FilmPlace | undefined>(undefined);
  const told = useRef(onPlace);
  useEffect(() => { told.current = onPlace; });
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);
  // under Reduce Motion nothing plays by itself, so the frame offers to
  const still = useSyncExternalStore(onReduceChange, isReduced, () => false);
  // the viewer's own pause, for drawing (the ref is for the film's listeners)
  const [heldShown, setHeldShown] = useState(false);
  // at the end it stops, and offers to play again
  const [endedShown, setEndedShown] = useState(false);
  // a film with sound starts without it; the viewer turns it on
  const [sound, setSound] = useState<boolean | undefined>(undefined);
  const said = useId();
  const end = to ?? duration;

  /** Play, and if the browser won't let it play by itself, wait for the viewer as if they had paused it. */
  const go = useCallback((p: FilmHandle) => {
    p.play().catch((e: unknown) => {
      if ((e as { name?: string })?.name !== "NotAllowedError") return;
      held.current = true;
      setHeldShown(true);
    });
  }, []);

  /** The bar and its fill, written straight to the page (no render a frame). */
  const draw = useCallback(() => {
    const p = player.current;
    if (!p) return;
    const v = Math.max(0, Math.min(1, (p.currentTime - from) / (end - from)));
    // only where it is drawn: a value on the box would restyle the whole film every frame (Oct 18)
    track.current?.style.setProperty("--p", v.toFixed(4));
    line.current?.style.setProperty("--p", v.toFixed(4));
    if (bar.current) bar.current.value = String(Math.round(v * 1000));
  }, [from, end]);

  /** Whether the reader is with the film now, and what to do if that changed: arriving by scroll starts it from the
   *  beginning; coming back to the page resumes it; leaving pauses it. */
  const update = useCallback((cause: Cause) => {
    const p = player.current;
    const next = word.current && inView.current && present.current && !isReduced();
    if (!p) { active.current = false; return; }
    if (next && !active.current) {
      const r = pending.current;
      // come back to the page: as it was left, playing on from there, or held there (it was put there when ready)
      if (r) { pending.current = undefined; if (r.state === "playing") go(p); }
      else if (cause === "page") { if (!held.current && !p.ended) go(p); }
      else { held.current = false; p.seek(begin.current); go(p); }
    } else if (!next && active.current) p.pause();
    active.current = next;
  }, [go]);

  // mount the film once the frame is within a screen of the viewport; watch whether at least half of it shows
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted(true); near.disconnect(); } }, { rootMargin: "100% 0px" });
    near.observe(el);
    const view = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; update("view"); }, { threshold: 0.5 });
    view.observe(el);
    return () => { near.disconnect(); view.disconnect(); };
  }, [update]);

  // the page in front of the reader: shown, and its window in focus
  useEffect(() => {
    const look = () => { present.current = !document.hidden && !blurred.current; update("page"); };
    const blur = () => { blurred.current = true; look(); };
    const focus = () => { blurred.current = false; look(); };
    document.addEventListener("visibilitychange", look);
    addEventListener("blur", blur);
    addEventListener("focus", focus);
    return () => { document.removeEventListener("visibilitychange", look); removeEventListener("blur", blur); removeEventListener("focus", focus); };
  }, [update]);

  // the page's word, when it has one
  useEffect(() => { word.current = play ?? true; update("word"); }, [play, update]);

  // while it plays, the bar moves every frame
  useEffect(() => {
    if (!playing) { draw(); return; }
    let raf = 0;
    const tick = () => { draw(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, draw]);

  const onReady = useCallback((p: FilmHandle) => {
    // the film put up again (its player replaced, as React's Strict Mode does in development): it carries on as it was
    if (player.current && player.current !== p && !pending.current) pending.current = last.current;
    player.current = p;
    // how it is, for the page to keep: paused only because the reader went away counts as none of these
    const tell = () => {
      last.current = p.ended || p.currentTime >= p.duration ? { t: p.duration, state: "ended" }
        : !p.paused ? { t: p.currentTime, state: "playing" }
        : held.current ? { t: p.currentTime, state: "held" } : undefined;
      told.current?.(last.current);
    };
    // whenever it plays, the viewer's pause mark goes
    p.addEventListener("play", () => { setPlaying(true); setHeldShown(false); setEndedShown(false); tell(); });
    p.addEventListener("pause", () => { setPlaying(false); tell(); });
    // where the reader left it, if they have come back; otherwise where it begins
    const r = pending.current;
    p.seek(r ? r.t : begin.current);
    if (r) last.current = r;
    if (r?.state === "held") { held.current = true; setHeldShown(true); }
    if (r?.state === "ended") setEndedShown(true);
    // played once, it stops at its last frame; the viewer plays it again
    p.addEventListener("ended", () => { setEndedShown(true); tell(); });
    p.addEventListener("timeupdate", () => {
      if (to !== undefined && p.currentTime >= to) { p.seek(from); return; }
      setChapter(p.chapterAt());
      tell();
    });
    onPlayer?.(p);
    setSound(p.muted === undefined ? undefined : !p.muted);
    setChapter(p.chapterAt());
    draw();
    active.current = false;
    update("ready");
  }, [from, to, onPlayer, draw, update]);

  const toggle = () => {
    const p = player.current;
    if (!p) return;
    if (p.paused) { held.current = false; if (p.ended) p.seek(begin.current); go(p); } else { held.current = true; p.pause(); }
    setHeldShown(held.current);
  };
  const toggleSound = () => {
    const p = player.current;
    if (!p || p.muted === undefined) return;
    p.muted = !p.muted;
    setSound(!p.muted);
  };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = player.current;
    if (!p) return;
    p.seek(from + (Number(e.target.value) / 1000) * (end - from));
    setChapter(p.chapterAt());
    draw();
  };

  const playIcon = <svg viewBox="0 0 12 12" width="18" height="18" aria-hidden="true"><path d="M3 1.8v8.4c0 .5.5.8 1 .5l6.6-4.2c.4-.3.4-.8 0-1L4 1.3c-.5-.3-1 0-1 .5Z" /></svg>;
  const replayIcon = <svg className="if-again" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path d="M13.4 8.6A5.4 5.4 0 1 1 11.9 4.3" /><path d="M12.4 1.6v3.2H9.2" /></svg>;
  const soundIcon = (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path className="if-cone" d="M2.6 6.1h2.2l3.1-2.7c.3-.3.8-.1.8.4v8.4c0 .5-.5.7-.8.4L4.8 9.9H2.6c-.3 0-.6-.3-.6-.6V6.7c0-.3.3-.6.6-.6Z" />
      {sound ? <path d="M11 5.6a3.4 3.4 0 0 1 0 4.8M12.9 3.8a6 6 0 0 1 0 8.4" /> : <path d="M11.2 6.3l3.4 3.4M14.6 6.3l-3.4 3.4" />}
    </svg>
  );
  const m = FILM_VIDEO.music;

  return (
    <div className={`if-wrap ${className}`} role="group" aria-label={label} aria-describedby={said}>
      <div ref={box} className="inline-film if-rec">
        {mounted && <FilmVideo onReady={onReady} poster={still} />}
        <button type="button" className="if-hit" onClick={toggle} aria-label={playing ? "Pause the film" : endedShown ? "Play the film again" : "Play the film"}>
          {!playing && (endedShown ? <span className="if-play" aria-hidden="true">{replayIcon}</span> : (heldShown || still) && <span className="if-play" aria-hidden="true">{playIcon}</span>)}
        </button>
        {sound !== undefined && (
          <button type="button" className={`if-sound${sound ? " on" : ""}`} onClick={toggleSound} aria-pressed={sound} aria-label="Sound">{soundIcon}</button>
        )}
        {!controls && <span ref={line} className="if-line" aria-hidden="true" />}
      </div>
      {controls && (
        <div className="ifc">
          <span ref={track} className="ifc-track">
            <input ref={bar} className="ifc-bar" type="range" min={0} max={1000} defaultValue={0} onChange={seek}
              aria-label="Position in the film" aria-valuetext={chapters[chapter]?.title} />
            {/* the film's parts, each where it starts, named */}
            <span className="ifc-segs" aria-hidden="true">
              {chapters.map((c, i) => {
                const stop = chapters[i + 1]?.at ?? duration, w = (stop - c.at) / duration;
                return (
                  <span key={c.title} className={`ifc-seg${i === chapter ? " on" : ""}${w < 0.07 ? " narrow" : ""}`}
                    style={{ left: `${(c.at / duration) * 100}%`, width: `${w * 100}%`, ["--a" as string]: c.at / duration, ["--len" as string]: w }}>
                    <i /><b>{c.title}</b>
                  </span>
                );
              })}
            </span>
          </span>
          <p className="ifc-credit">
            Music: “{m.title}” by <a href={m.href} target="_blank" rel="noopener noreferrer">{m.by}</a>, <a href={m.licenseHref} target="_blank" rel="noopener noreferrer">{m.license}</a>
          </p>
        </div>
      )}
      <p id={said} className="if-sr">{FILM_VIDEO_TRANSCRIPT}</p>
    </div>
  );
}
