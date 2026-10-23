"use client";

import { useState, useSyncExternalStore } from "react";
import { DemoEngine } from "../../../lib/landing/engine/runtime";
import type { ScenarioId } from "../../../lib/landing/engine/types";
import { scenario as scenarioFor } from "../../../lib/landing/scenarios";
import { track } from "../../../lib/landing/analytics";

// The page's handle on the demo engine (lib/landing/engine/runtime.ts): one engine for the life of
// the demo, its view read with useSyncExternalStore.
export function useDemoEngine(initialScenario: ScenarioId) {
  const [engine] = useState(() => new DemoEngine(initialScenario, track));
  const view = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
  return { engine, view, scenario: scenarioFor(view.state.scenario) };
}
