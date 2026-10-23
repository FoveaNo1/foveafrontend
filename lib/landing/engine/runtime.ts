// The demo's engine outside React: the reducer's state, the clock its timers run on, the Watch
// script's player, and what isn't state (the hand's position and the keys it presses, words being
// said, a flash, captures flying into the stack, a line for assistive technology). The page
// subscribes to it (useSyncExternalStore); tests and still frames drive it with a hand-moved clock.

import { Clock } from "./clock";
import { Player, type KeyName } from "./player";
import { initialState, reduce } from "./reducer";
import type { DemoEvent, DemoState, Effect, Mode, Point, Rect, Referent, ScenarioId } from "./types";
import { scenario as scenarioFor } from "../scenarios";
import { SCRIPTS } from "../scenarios/scripts";

export type Flight = { id: string; referent: Referent };

export type View = {
  state: DemoState;
  pointer: { at: Point; ms: number; visible: boolean };
  keys: KeyName | null;
  words: string | null;
  flights: Flight[];
  flash: number;
  announcement: string;
};

type Track = (name: string, props?: Record<string, string | number | boolean>) => void;

export class DemoEngine {
  readonly clock: Clock;
  readonly targets = new Map<string, Rect>();
  private view: View;
  private listeners = new Set<() => void>();
  private player: Player | null = null;

  constructor(
    scenario: ScenarioId,
    private readonly track: Track = () => {},
    realTime = true,
  ) {
    this.clock = new Clock(realTime);
    this.view = {
      state: initialState(scenario, "watch"),
      pointer: { at: { x: 760, y: 470 }, ms: 0, visible: true },
      keys: null,
      words: null,
      flights: [],
      flash: 0,
      announcement: "",
    };
  }

  // useSyncExternalStore.
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getSnapshot = () => this.view;

  get state(): DemoState {
    return this.view.state;
  }

  private set(patch: Partial<View>) {
    this.view = { ...this.view, ...patch };
    this.listeners.forEach((l) => l());
  }

  dispatch = (event: DemoEvent) => {
    const current = this.view.state;
    const sc = scenarioFor(event.type === "RESET" && event.scenario ? event.scenario : current.scenario);
    const targets = sc.targets
      .map((t) => ({ ...t, rect: t.rect ?? this.targets.get(t.id) }))
      .filter((t): t is typeof t & { rect: Rect } => Boolean(t.rect));
    const { state, effects } = reduce(current, event, { now: this.clock.now(), scenario: sc, targets });
    this.set({ state });
    this.apply(effects);
  };

  private apply(effects: Effect[]) {
    for (const effect of effects) {
      switch (effect.type) {
        case "schedule":
          this.clock.schedule(effect.id, effect.ms, () => this.dispatch(effect.event));
          break;
        case "cancel":
          this.clock.cancel(effect.id);
          break;
        case "flash":
          this.set({ flash: this.view.flash + 1 });
          break;
        case "flight": {
          const flight = { id: `${effect.referent.id}-flight`, referent: effect.referent };
          this.set({ flights: [...this.view.flights, flight] });
          this.clock.schedule(`flight-${effect.referent.id}`, 520, () =>
            this.set({ flights: this.view.flights.filter((f) => f.id !== flight.id) }),
          );
          break;
        }
        case "announce":
          this.set({ announcement: effect.text });
          break;
        case "track":
          this.track(effect.name, effect.props);
          break;
      }
    }
  }

  setWords = (words: string | null) => this.set({ words });

  /** Play a scenario's Watch script from where the state is now; `onDone` when it ends. */
  watch(id: ScenarioId, onDone?: () => void) {
    this.player?.stop();
    const player = new Player(this.clock, SCRIPTS[id] ?? [], {
      dispatch: this.dispatch,
      state: () => this.view.state,
      targetRect: (target) => this.targets.get(target),
      pointer: (at, ms) => this.set({ pointer: { at, ms, visible: true } }),
      keys: (keys) => this.set({ keys }),
      words: (words) => this.set({ words }),
      done: () => onDone?.(),
    });
    this.player = player;
    player.play();
  }

  /** Move a hand-driven clock on until the state matches (still frames, the poster's hand-over). */
  fastForward(until: (s: DemoState) => boolean, limitMs = 30000) {
    for (let t = 0; t < limitMs && !until(this.view.state); t += 50) this.clock.advance(50);
  }

  /** A person takes over: the script stops; the state carries on. */
  takeOver() {
    if (this.view.state.mode === "try") return;
    this.player?.stop();
    this.player = null;
    this.set({ pointer: { ...this.view.pointer, visible: false }, keys: null });
    this.dispatch({ type: "MODE", mode: "try" });
    this.track("demo_takeover", { scenario: this.view.state.scenario, phase: this.view.state.phase });
  }

  setMode(mode: Mode) {
    this.dispatch({ type: "MODE", mode });
  }

  /** Words said one at a time, at a talking pace (Try mode's chosen or typed line). */
  say(line: string) {
    const words = line.split(" ");
    words.forEach((_, i) =>
      this.clock.schedule(`say-${i}`, 120 + i * 200, () => {
        const text = words.slice(0, i + 1).join(" ");
        this.set({ words: text });
        this.dispatch({ type: "SAY", text, final: i === words.length - 1 });
        if (i === words.length - 1) this.clock.schedule("say-off", 1400, () => this.set({ words: null }));
      }),
    );
  }

  /** Stop everything that's playing and waiting (the demo left the page, or starts over). */
  stop() {
    this.player?.stop();
    this.player = null;
    this.clock.pause();
    this.clock.cancelAll();
  }
}
