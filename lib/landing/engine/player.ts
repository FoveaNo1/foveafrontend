// Watch mode: a script of the same inputs a person makes (a pointer moving, keys pressed, a drag,
// words said), played on the demo's clock into the same reducer Try mode uses. Because the state
// is the reducer's, a visitor can take over at any moment and carry on from there.

import type { Clock } from "./clock";
import type { DemoEvent, DemoState, Point, Rect } from "./types";

export type KeyName = "request" | "region" | "screen" | "send" | "esc";

export type Cue =
  | { do: "wait"; ms: number }
  | { do: "move"; to: Point | { target: string; at?: "center" | "start" }; ms: number }
  | { do: "key"; key: KeyName }
  | { do: "drag"; target: string; ms: number; pad?: number }
  | { do: "say"; text: string; msPerWord?: number }
  | { do: "until"; phase: DemoState["phase"] }
  | { do: "hover"; on: boolean }
  | { do: "tab"; index: number }
  | { do: "reset" };

export type PlayerHooks = {
  dispatch: (event: DemoEvent) => void;
  state: () => DemoState;
  targetRect: (id: string) => Rect | undefined;
  /** Move the drawn pointer; `ms` 0 jumps. */
  pointer: (to: Point, ms: number) => void;
  /** Show which keys the pointer's hand is pressing. */
  keys: (key: KeyName | null) => void;
  /** Words being said, for the subtitle. */
  words: (text: string | null) => void;
  /** The script ran to its end. */
  done: () => void;
};

const KEY_EVENTS: Record<KeyName, DemoEvent> = {
  request: { type: "KEY_REQUEST" },
  region: { type: "ARM_REGION" },
  screen: { type: "WHOLE_SCREEN" },
  send: { type: "SEND" },
  esc: { type: "ESC" },
};

export class Player {
  private index = 0;
  private stopped = false;
  private at: Point = { x: 735, y: 600 };

  constructor(
    private readonly clock: Clock,
    private readonly script: Cue[],
    private readonly hooks: PlayerHooks,
  ) {}

  play() {
    this.stopped = false;
    this.next(0);
  }

  /** Take-over: drop what's left of the script; the state stays as it is. */
  stop() {
    this.stopped = true;
    for (const id of ["cue", "drag", "say", "sayOff", "keysOff"]) this.clock.cancel(`player-${id}`);
    this.hooks.keys(null);
    this.hooks.words(null);
  }

  private next(delay: number) {
    if (this.stopped) return;
    this.clock.schedule("player-cue", delay, () => this.run());
  }

  private press(key: KeyName) {
    this.hooks.keys(key);
    this.clock.schedule("player-keysOff", 650, () => this.hooks.keys(null));
    this.hooks.dispatch(KEY_EVENTS[key]);
  }

  private resolve(to: Point | { target: string; at?: "center" | "start" }): Point {
    if ("x" in to) return to;
    const r = this.hooks.targetRect(to.target);
    if (!r) return this.at;
    return to.at === "start" ? { x: r.x, y: r.y } : { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }

  private run() {
    if (this.stopped) return;
    const cue = this.script[this.index++];
    if (!cue) {
      this.hooks.done();
      return;
    }
    switch (cue.do) {
      case "wait":
        return this.next(cue.ms);
      case "move": {
        this.at = this.resolve(cue.to);
        this.hooks.pointer(this.at, cue.ms);
        return this.next(cue.ms);
      }
      case "key":
        this.press(cue.key);
        return this.next(120);
      case "hover":
        this.hooks.dispatch({ type: "HOVER", on: cue.on });
        return this.next(0);
      case "tab":
        this.hooks.dispatch({ type: "TAB", index: cue.index });
        return this.next(0);
      case "reset":
        this.hooks.dispatch({ type: "RESET" });
        return this.next(0);
      case "until": {
        const check = () => {
          if (this.stopped) return;
          if (this.hooks.state().phase === cue.phase) this.next(0);
          else this.clock.schedule("player-cue", 100, check);
        };
        return check();
      }
      case "drag": {
        const r = this.hooks.targetRect(cue.target);
        if (!r) return this.next(0);
        const pad = cue.pad ?? 10;
        const from = { x: r.x - pad, y: r.y - pad };
        const to = { x: r.x + r.width + pad, y: r.y + r.height + pad };
        this.at = from;
        this.hooks.pointer(from, 0);
        this.hooks.dispatch({ type: "SEL_START", at: from });
        const steps = Math.max(4, Math.round(cue.ms / 32));
        let i = 0;
        const step = () => {
          if (this.stopped) return;
          i++;
          // Ease out: the hand slows as it reaches the corner.
          const t = 1 - Math.pow(1 - i / steps, 3);
          const p = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
          this.at = p;
          this.hooks.pointer(p, 32);
          if (i < steps) {
            this.hooks.dispatch({ type: "SEL_MOVE", at: p });
            this.clock.schedule("player-drag", cue.ms / steps, step);
          } else {
            this.hooks.dispatch({ type: "SEL_END", at: p });
            this.next(0);
          }
        };
        this.clock.schedule("player-drag", cue.ms / steps, step);
        return;
      }
      case "say": {
        const words = cue.text.split(" ");
        const per = cue.msPerWord ?? 230;
        let i = 0;
        const step = () => {
          if (this.stopped) return;
          i++;
          const text = words.slice(0, i).join(" ");
          const final = i === words.length;
          this.hooks.words(text);
          this.hooks.dispatch({ type: "SAY", text, final });
          if (!final) {
            this.clock.schedule("player-say", per, step);
          } else {
            this.clock.schedule("player-sayOff", 1400, () => this.hooks.words(null));
            this.next(per);
          }
        };
        this.clock.schedule("player-say", per, step);
        return;
      }
    }
  }
}
