// Where the reader was on the landing page (Oct 20, Yulun): coming back to it, by "Fovea" at the top of a page, any
// link home or the browser's Back, puts them where they left it rather than on the first screen: as far down the page,
// the first screen's scene at the moment it had reached, the film where it was (playing on, paused by them, or
// ended). A fresh visit or a reload starts at the top as before. Kept in sessionStorage, for the tab's life.
// The landing page keeps it (heroes/Desktop.tsx); components/book/ReturnWatch.tsx says when a return is coming.

/** The film as it was left: playing, paused by the viewer, or ended (paused only because the reader had scrolled away
 *  or left isn't kept: arriving at it again starts it from the beginning, Yulun's rule of Oct 17). */
export type FilmPlace = { t: number; state: "playing" | "held" | "ended" };
export type Place = { y: number; hero: number; film?: FilmPlace };

const PLACE = "fovea:place";
const BACK = "fovea:back";
/** How long a return said by a link or Back waits for the landing page to open (ms). */
const FRESH = 10_000;

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* storage off: nothing is kept */ } },
  del: (k: string) => { try { sessionStorage.removeItem(k); } catch { /* storage off */ } },
};

/** The reader's place now. The landing page's parts keep it up to date; it is kept when they leave. */
export const here: Place = { y: 0, hero: 0 };

/** Keep the place as it is now (on leaving the landing page). */
export const keep = () => store.set(PLACE, JSON.stringify(here));

/** Say the landing page is about to be come back to (a link home clicked, or Back or Forward arriving at it). */
export const comingBack = () => store.set(BACK, String(Date.now()));

// the document itself was opened by Back or Forward (the landing page left by a full navigation, then come back to)
let backDoc = typeof window !== "undefined" &&
  (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "back_forward";

/** The place kept for the landing page, if it is being come back to now; null for a fresh visit or a reload, or when
 *  nothing was kept. Asking doesn't use the return up (`settle` does), so it can be asked twice. */
export function returning(): Place | null {
  if (typeof window === "undefined" || location.hash) return null;
  const said = Number(store.get(BACK));
  if (!(said && Date.now() - said < FRESH) && !backDoc) return null;
  try {
    const p = JSON.parse(store.get(PLACE) ?? "null") as Place | null;
    return p && Number.isFinite(p.y) && Number.isFinite(p.hero) ? p : null;
  } catch { return null; }
}

/** The return has been made: the next arrival is a fresh one unless a link or Back says otherwise. */
export function settle() {
  store.del(BACK);
  backDoc = false;
}
