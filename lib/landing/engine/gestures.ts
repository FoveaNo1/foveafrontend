// The keys, as onboarding's KeyMap has them (app-ui-v1/Prototypes/OnboardingCore/Steps.swift):
//   fn ⌃      a request to an agent: one press starts, the next ends it;
//   ⌘ once    the next drag takes a region; ⌘ twice, the whole screen;
//   return    sends; esc steps out.
// A browser never sees fn, so a bare ⌃ tap stands in for fn ⌃ (on a Mac a real fn ⌃ arrives as ⌃).
// Only bare taps count: a modifier held with another key is a shortcut and is left alone (⌘W, ⌘R…).
// Pure: feed it key downs and ups with their times; it answers with demo events.

import type { DemoEvent } from "./types";

export const Gesture = {
  /** A press this short is a tap. */
  tap: 300,
  /** Two ⌘ taps this close are a double press. */
  double: 450,
} as const;

type Modifier = "Control" | "Meta";

export type GestureState = {
  down: { key: Modifier; at: number; clean: boolean } | null;
  /** The last ⌘ tap, waiting to see if a second follows. */
  pendingMeta: number | null;
};

export const initialGesture: GestureState = { down: null, pendingMeta: null };

export type KeyInput = { kind: "down" | "up"; key: string; at: number; repeat?: boolean };

/**
 * Feed one key event. Returns the new state, the events it means, and, after a single ⌘ tap,
 * the time at which `flushMeta` should be called if no second tap comes.
 */
export function feedKey(state: GestureState, input: KeyInput): { state: GestureState; events: DemoEvent[]; flushAt?: number } {
  const events: DemoEvent[] = [];
  if (input.repeat) return { state, events };
  const isModifier = input.key === "Control" || input.key === "Meta";

  if (input.kind === "down") {
    if (isModifier) {
      return { state: { ...state, down: { key: input.key as Modifier, at: input.at, clean: true } }, events };
    }
    if (input.key === "Enter") events.push({ type: "SEND" });
    if (input.key === "Escape") events.push({ type: "ESC" });
    // Any other key while a modifier is held makes it a shortcut, not a tap.
    return { state: state.down ? { ...state, down: { ...state.down, clean: false } } : state, events };
  }

  // Key up.
  if (!isModifier || !state.down || state.down.key !== input.key) return { state, events };
  const tapped = state.down.clean && input.at - state.down.at <= Gesture.tap;
  const next: GestureState = { ...state, down: null };
  if (!tapped) return { state: next, events };

  if (input.key === "Control") {
    events.push({ type: "KEY_REQUEST" });
    return { state: next, events };
  }
  // ⌘: a second tap soon after the first is the whole screen.
  if (state.pendingMeta !== null && input.at - state.pendingMeta <= Gesture.double) {
    events.push({ type: "WHOLE_SCREEN" });
    return { state: { ...next, pendingMeta: null }, events };
  }
  return { state: { ...next, pendingMeta: input.at }, events, flushAt: input.at + Gesture.double };
}

/** No second ⌘ came: the single tap arms a region. */
export function flushMeta(state: GestureState, at: number): { state: GestureState; events: DemoEvent[] } {
  if (state.pendingMeta === null || at - state.pendingMeta < Gesture.double) return { state, events: [] };
  return { state: { ...state, pendingMeta: null }, events: [{ type: "ARM_REGION" }] };
}

/** Lose focus or hide the tab: nothing stays held. */
export function resetGesture(): GestureState {
  return initialGesture;
}
