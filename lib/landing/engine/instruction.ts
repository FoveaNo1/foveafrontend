// What Try mode asks for next, worked out from the state alone (after onboarding's
// Copy.instruction(beat, step, armed, tab)), so a visitor can take over at any step and be told
// what comes next. One short line, the keys it needs, and, when it's time to speak, lines to say.

import type { KeyName } from "./player";
import type { DemoState, Scenario } from "./types";

export type Instruction = {
  text: string;
  keys: KeyName[];
  /** Lines the visitor can say by choosing one. */
  lines?: string[];
  /** Nothing to do: the system is working. */
  waiting?: boolean;
  /** The run is over: offer to go again. */
  finished?: boolean;
  /** A target to take without dragging (keyboard, touch): its id and label. */
  take?: { id: string; label: string };
  /** A tab to open first: its index and name. */
  openTab?: { index: number; title: string };
};

export function instruction(state: DemoState, scenario: Scenario): Instruction {
  const required = scenario.targets.filter((t) => t.required);
  const taken = new Set(state.referents.map((r) => r.targetId));
  const missing = required.find((t) => !taken.has(t.id));

  switch (state.phase) {
    case "silent":
      if (state.session?.state === "complete") {
        return { text: "Done. Point at something else, or try it again.", keys: ["request"], finished: true };
      }
      if (state.session) return { text: "It's working on it. Point at the notch to see how far it has got.", keys: [], waiting: true };
      return { text: "Press fn ⌃ to ask, and start pointing.", keys: ["request"] };

    case "voice":
      if (missing && missing.tab !== undefined && missing.tab !== state.tab) {
        return {
          text: `Open the “${missing.tabTitle}” tab.`,
          keys: [],
          openTab: { index: missing.tab, title: missing.tabTitle ?? "next" },
        };
      }
      if (state.armed) {
        return {
          text: `Drag over ${missing?.label ?? "what you mean"}.`,
          keys: [],
          take: missing ? { id: missing.id, label: missing.label } : undefined,
        };
      }
      if (missing) {
        return {
          text: state.referents.length === 0 ? `Press ⌘, then drag over ${missing.label}.` : `Now ⌘ again, and ${missing.label}.`,
          keys: ["region"],
        };
      }
      if (!state.intent.final) {
        return { text: "Now say what you want.", keys: [], lines: scenario.alternatives };
      }
      return { text: "Press fn ⌃ again to finish.", keys: ["request"] };

    case "transcribing":
      return { text: "Transcribing…", keys: [], waiting: true };

    case "choose": {
      const chat = scenario.suggestions[state.pick]?.name ?? scenario.title;
      return { text: `Press return to send it to “${chat}.”`, keys: ["send"] };
    }

    case "board":
      return state.session?.state === "complete"
        ? { text: "Ready to review. Click it to open the answer.", keys: [] }
        : { text: "It's on it. The answer opens here.", keys: [], waiting: true };

    case "chat":
      return { text: "Done, without leaving the window.", keys: [], finished: true };
  }
}
