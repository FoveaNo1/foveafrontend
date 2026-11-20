"use client";

import { useEffect, useRef } from "react";
import { chapterOf, type FilmHandle } from "../../../lib/landing/film/player";
import { FILM_VIDEO } from "../../../lib/landing/film/video";

// The launch film, recorded (lib/landing/film/video.ts), played as the page played the drawn film: the page gets the
// same handle through onReady (components/book/InlineFilm.tsx) and its bar is the film's only control. It starts
// without sound, as a page may only play a film by itself silently; the viewer turns the sound on.

type Props = {
  onReady?: (film: FilmHandle) => void;
  /** Show the title card until it plays (where nothing plays by itself). */
  poster?: boolean;
};

export default function FilmVideo({ onReady, poster = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const ready = useRef(onReady);
  useEffect(() => { ready.current = onReady; }, [onReady]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const { duration, chapters } = FILM_VIDEO;
    const film: FilmHandle = {
      duration, chapters,
      get currentTime() { return v.currentTime; },
      get paused() { return v.paused; },
      get ended() { return v.ended; },
      get muted() { return v.muted; },
      set muted(m) { v.muted = !!m; },
      play: () => v.play(),
      pause: () => v.pause(),
      seek: (t) => { v.currentTime = Math.max(0, Math.min(duration, t)); },
      chapterAt: (t = v.currentTime) => chapterOf(chapters, t),
      addEventListener: (type, fn) => v.addEventListener(type, fn),
      removeEventListener: (type, fn) => v.removeEventListener(type, fn),
    };
    ready.current?.(film);
    return () => v.pause();
  }, []);

  return (
    <video ref={ref} className="if-video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1}
      poster={poster ? FILM_VIDEO.poster : undefined}>
      {FILM_VIDEO.sources.map((s) => <source key={s.src} src={s.src} type={s.type} media={"media" in s ? s.media : undefined} />)}
    </video>
  );
}
