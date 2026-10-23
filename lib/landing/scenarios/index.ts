import type { Scenario, ScenarioId } from "../engine/types";
import { formula } from "./formula";
import { layoutBug } from "./layoutBug";
import { weeklyUpdate } from "./weeklyUpdate";

export const SCENARIOS: Partial<Record<ScenarioId, Scenario>> = {
  layoutBug,
  weeklyUpdate,
  formula,
};

/** The order Watch mode plays them in, and the picker lists them. */
export const ORDER: ScenarioId[] = ["layoutBug", "weeklyUpdate", "formula"];

export function scenario(id: ScenarioId): Scenario {
  return SCENARIOS[id] ?? layoutBug;
}

/** The scenario after this one that exists (itself, if it's the only one). */
export function nextScenario(id: ScenarioId): ScenarioId {
  const available = ORDER.filter((s) => SCENARIOS[s]);
  const i = available.indexOf(id);
  return available[(i + 1) % available.length] ?? id;
}
