"use client";

import Link from "next/link";
import { BookCopy as c } from "../../../lib/landing/bookCopy";
import type { FilmPlayer } from "../../../lib/landing/film/player";
import type { FilmPlace } from "../../../lib/landing/place";
import InlineFilm from "../InlineFilm";

// What the first screens share (the notch on the page, and the others under review at /hero): the line, the top
// bar, the film as they show it, what follows it, and the small sums their hand-overs are made of.

/** The line, a sentence a line. */
export const LINE = c.hero.split(/(?<=\.) /);
export const n = (v: number, d = 3) => v.toFixed(d);
export const px = (v: number) => `${v.toFixed(1)}px`;

/** An element's own layout box within the stage, before any transform (what it settles into). */
export function box(el: Element | null | undefined, stage: HTMLElement) {
  let x = 0, y = 0;
  let e = el as HTMLElement | null;
  while (e && e !== stage) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null; }
  const h = el as HTMLElement | null;
  return { x, y, w: h?.offsetWidth ?? 0, h: h?.offsetHeight ?? 0 };
}

/** Open once the hand-over is done; closed again only well back up, so a small scroll never stops it. */
export const opening = (set: (f: (o: boolean) => boolean) => void) => (k: number) => set((o) => (k > 0.97 ? true : k < 0.6 ? false : o));

export function Top({ className = "" }: { className?: string }) {
  return (
    <header className={`lp-top hx-top ${className}`}>
      <p className="name">Fovea</p>
      <Link className="lp-top-dl" href="/download" data-download="top">{c.download}</Link>
    </header>
  );
}

/** Under the film, only the way in (Oct 17: no sentence, no button), and beside it the way to Fovea Vision (Oct 18),
 *  both set as the download page's "Download for Mac" is: EB Garamond on a hairline that inks in on hover. */
export function After({ className = "" }: { className?: string }) {
  return (
    <section id="download" className={`hx-after ${className}`} aria-label="Download and Fovea Vision">
      <p className="hx-dl">
        <Link className="act-line" href="/download" data-download="hero">{c.download}</Link>
        <Link className="act-line" href="/vision">{c.visionLink}</Link>
      </p>
    </section>
  );
}

/** Where the film begins: its very first screen, every time (Oct 17). */
export const START = 0;

type HeroFilmProps = {
  play?: boolean; onPlayer?: (p: FilmPlayer) => void; start?: number;
  /** As the reader left it, when they come back to the page; and who is told how it is (lib/landing/place.ts). */
  resume?: FilmPlace; onPlace?: (p: FilmPlace | undefined) => void;
};

export const HeroFilm = ({ play, onPlayer, start = START, resume, onPlace }: HeroFilmProps) => (
  <InlineFilm className="hx-film" controls label="The Fovea film" play={play} start={start} onPlayer={onPlayer} resume={resume} onPlace={onPlace} />
);
