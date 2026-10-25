// The film's handle, shaped like a <video> for the page that plays it (components/book/InlineFilm.tsx): play, pause,
// currentTime, duration, paused, ended, and the same events. Its clock is passed in, so tests can move time by hand.
// Pure: no timers or window here.

export type FilmEvent = "play" | "pause" | "ended" | "timeupdate" | "seeked" | "loadedmetadata";
type Clock = { now: () => number; raf: (cb: () => void) => number; caf: (id: number) => void };
type Chapters = readonly { at: number; title: string }[];

/** What the page that plays a film needs of it: this drawn film's player and the recorded film's
 *  (components/book/film/FilmVideo.tsx) alike. `muted` only where the film has sound to turn on. */
export interface FilmHandle {
  readonly duration: number;
  readonly chapters: Chapters;
  readonly currentTime: number;
  readonly paused: boolean;
  readonly ended: boolean;
  muted?: boolean;
  play(): Promise<void>;
  pause(): void;
  seek(v: number): void;
  chapterAt(t?: number): number;
  addEventListener(type: FilmEvent, fn: () => void): void;
  removeEventListener(type: FilmEvent, fn: () => void): void;
}

/** The chapter t is in. */
export function chapterOf(chapters: Chapters, t: number) {
  let i = 0;
  while (i + 1 < chapters.length && chapters[i + 1].at <= t + 1e-6) i++;
  return i;
}

export class FilmPlayer implements FilmHandle {
  readonly duration: number;
  readonly chapters: readonly { at: number; title: string }[];
  paused = true;
  ended = false;
  private t = 0;
  private raf = 0;
  private last = 0;
  private lastEmit = -1;
  private listeners = new Map<FilmEvent, Set<() => void>>();

  constructor(private opts: { duration: number; chapters: readonly { at: number; title: string }[]; render: (t: number) => void; clock: Clock }) {
    this.duration = opts.duration;
    this.chapters = opts.chapters;
  }

  get currentTime() { return this.t; }
  set currentTime(v: number) { this.seek(v); }

  addEventListener(type: FilmEvent, fn: () => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
  }
  removeEventListener(type: FilmEvent, fn: () => void) { this.listeners.get(type)?.delete(fn); }
  private emit(type: FilmEvent) { this.listeners.get(type)?.forEach((fn) => fn()); }

  /** Draw the first frame and say how long the film is. */
  start() { this.opts.render(this.t); this.emit("loadedmetadata"); }

  play(): Promise<void> {
    if (!this.paused) return Promise.resolve();
    if (this.ended || this.t >= this.duration) { this.t = 0; this.ended = false; }
    this.paused = false;
    this.last = this.opts.clock.now();
    this.emit("play");
    this.tick();
    return Promise.resolve();
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    this.opts.clock.caf(this.raf);
    this.emit("pause");
    this.emit("timeupdate");
  }

  seek(v: number) {
    this.t = Math.max(0, Math.min(this.duration, v));
    if (this.t < this.duration) this.ended = false;
    this.last = this.opts.clock.now();
    this.opts.render(this.t);
    this.emit("seeked");
    this.emit("timeupdate");
  }

  /** The chapter t is in. */
  chapterAt(t = this.t) { return chapterOf(this.chapters, t); }

  private tick = () => {
    if (this.paused) return;
    const now = this.opts.clock.now();
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.t = Math.min(this.duration, this.t + dt);
    this.opts.render(this.t);
    if (this.t - this.lastEmit >= 0.1 || this.t < this.lastEmit) { this.lastEmit = this.t; this.emit("timeupdate"); }
    if (this.t >= this.duration) {
      this.paused = true;
      this.ended = true;
      this.emit("timeupdate");
      this.emit("pause");
      this.emit("ended");
      return;
    }
    this.raf = this.opts.clock.raf(this.tick);
  };

  destroy() { this.opts.clock.caf(this.raf); this.paused = true; this.listeners.clear(); }
}
