"use client";

import { useSyncExternalStore } from "react";
import type { ScenarioId } from "../../../lib/landing/engine/types";
import { SCENARIOS } from "../../../lib/landing/scenarios";

// Which scenario the demo plays, shared by the phrases in the words that pick one ("fix a layout
// bug", "draft this week's update", "explain a formula") and the demo itself, which moves on to
// the next after a Watch run.

let current: ScenarioId = "layoutBug";
const listeners = new Set<() => void>();

export const scenarioStore = {
  get: () => current,
  set(id: ScenarioId) {
    if (!SCENARIOS[id] || id === current) return;
    current = id;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useScenario(): ScenarioId {
  return useSyncExternalStore(scenarioStore.subscribe, scenarioStore.get, () => "layoutBug" as ScenarioId);
}
