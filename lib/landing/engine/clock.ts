// A clock the demo can stop: it pauses when the demo is off screen, the tab is hidden, or Reduce
// Motion is on, and its timers wait with it. Real time drives it in the page; tests and still
// frames advance it by hand, so a run plays the same every time.

type Timer = { id: string; due: number; fn: () => void; seq: number };

export class Clock {
  private time = 0;
  private timers: Timer[] = [];
  private seq = 0;
  private running = false;
  private last = 0;
  private handle: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly realTime = true) {}

  /** Milliseconds of demo time so far. */
  now(): number {
    if (this.running) return this.time + (performance.now() - this.last);
    return this.time;
  }

  schedule(id: string, ms: number, fn: () => void) {
    this.cancel(id);
    this.timers.push({ id, due: this.now() + Math.max(0, ms), fn, seq: this.seq++ });
    this.arm();
  }

  cancel(id: string) {
    this.timers = this.timers.filter((t) => t.id !== id);
  }

  cancelAll() {
    this.timers = [];
    this.arm();
  }

  get isRunning() {
    return this.running;
  }

  start() {
    if (this.running || !this.realTime) return;
    this.running = true;
    this.last = performance.now();
    this.arm();
  }

  pause() {
    if (!this.running) return;
    this.time = this.now();
    this.running = false;
    if (this.handle) clearTimeout(this.handle);
    this.handle = null;
  }

  /** Move time forward by hand (tests, still frames), firing what falls due, in order. */
  advance(ms: number) {
    const end = this.now() + ms;
    for (;;) {
      const next = this.nextDue();
      if (!next || next.due > end) break;
      this.time = next.due;
      this.fire(next);
    }
    this.time = end;
  }

  private nextDue(): Timer | undefined {
    return [...this.timers].sort((a, b) => a.due - b.due || a.seq - b.seq)[0];
  }

  private fire(timer: Timer) {
    this.timers = this.timers.filter((t) => t !== timer);
    timer.fn();
  }

  private arm() {
    if (!this.running) return;
    if (this.handle) clearTimeout(this.handle);
    const next = this.nextDue();
    if (!next) {
      this.handle = null;
      return;
    }
    this.handle = setTimeout(() => {
      this.handle = null;
      const now = this.now();
      for (;;) {
        const due = this.nextDue();
        if (!due || due.due > now) break;
        this.fire(due);
      }
      this.arm();
    }, Math.max(0, next.due - this.now()));
  }
}
