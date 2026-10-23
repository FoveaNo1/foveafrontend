// The film's label on the page: how long it runs. The film itself is drawn live in the browser (components/book/film,
// lib/landing/film), and its length comes from the film.

import { DURATION } from "./film/content";

// floored, as the player's clock is, so the end of the film reads the same on both
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const Demo = {
  /** The film's length, as the page names it ("A film · 1:24"). */
  length: mmss(DURATION),
};
