"use client";

import type { ScenarioId } from "../../../lib/landing/engine/types";
import { scenarioStore, useScenario } from "../demo/scenarioStore";
import LassoPhrase from "./LassoPhrase";

// The phrases in the words that do something, as Instinct's tasks do.

/** "a layout bug", "this week's update", "a formula": plays that scenario in the demo. The one
 *  playing keeps Fovea's hand loop round it. */
export function ScenarioPhrase({ scenario, children }: { scenario: ScenarioId; children: string }) {
  const playing = useScenario();
  return (
    <LassoPhrase active={playing === scenario} onActivate={() => scenarioStore.set(scenario)} label={`Play: ${children}`}>
      {children}
    </LassoPhrase>
  );
}
