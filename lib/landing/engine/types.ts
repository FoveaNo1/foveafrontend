// The demo's state machine: Dispatch Version 2 as the Notch Workbench plays it
// (app-ui-v1/FoveaV1/Sources/FoveaIsland/WorkbenchModel+DispatchV2.swift), reduced to what the
// page shows. Pure data; the reducer is in reducer.ts. Coordinates are screen points on the mock
// 1470 × 956 display.

export type Rect = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };

export type AgentId = "claude-code" | "codex" | "fovea";
export type ScenarioId = "layoutBug" | "weeklyUpdate" | "formula";

/** NotchState, as far as the page goes: silent → voice → transcribing → choose → board → chat. */
export type Phase = "silent" | "voice" | "transcribing" | "choose" | "board" | "chat";

export type Mode = "watch" | "try";

export type Referent = {
  id: string;
  /** 1-based, in the order taken. */
  index: number;
  kind: "region" | "screen";
  rect: Rect;
  /** The scenario target it snapped to, if any. */
  targetId?: string;
  label: string;
  /** The browser tab showing when it was taken (its picture is drawn from that tab). */
  tab: number;
};

/** A deictic phrase in the request and the referent it means. Offsets are in `intent.text`. */
export type Binding = { start: number; end: number; referent: number };

export type Session = {
  id: string;
  agent: AgentId;
  title: string;
  project: string;
  /** How many of the scenario's beats have played. */
  beat: number;
  state: "working" | "complete";
  sentAt: number;
  finishedAt?: number;
};

export type DemoState = {
  phase: Phase;
  mode: Mode;
  scenario: ScenarioId;
  /** ⌘ pressed once: the next drag takes a region. */
  armed: boolean;
  selection: { start: Point; rect: Rect } | null;
  referents: Referent[];
  intent: { text: string; final: boolean };
  bindings: Binding[];
  /** The chat chosen on Choose chat (an index into the scenario's suggestions). */
  pick: number;
  session: Session | null;
  /** The agent's change has landed on the mock screen. */
  landed: boolean;
  /** The pointer rests on the notch. */
  hover: boolean;
  /** The browser tab showing on the mock screen. */
  tab: number;
};

export type DemoEvent =
  | { type: "KEY_REQUEST" }
  | { type: "ARM_REGION" }
  | { type: "WHOLE_SCREEN" }
  | { type: "SEND" }
  | { type: "ESC" }
  | { type: "SEL_START"; at: Point }
  | { type: "SEL_MOVE"; at: Point }
  | { type: "SEL_END"; at: Point }
  | { type: "REFERENT_REMOVE"; id: string }
  | { type: "SAY"; text: string; final: boolean }
  | { type: "PICK"; index: number }
  | { type: "TRANSCRIBED" }
  | { type: "AGENT_BEAT" }
  | { type: "BOARD_HOLD_END" }
  | { type: "CHAT_HOLD_END" }
  | { type: "HOVER"; on: boolean }
  | { type: "OPEN" }
  | { type: "TAB"; index: number }
  | { type: "MODE"; mode: Mode }
  | { type: "RESET"; scenario?: ScenarioId };

export type Effect =
  | { type: "schedule"; id: string; ms: number; event: DemoEvent }
  | { type: "cancel"; id: string }
  | { type: "flash" }
  | { type: "flight"; referent: Referent }
  | { type: "announce"; text: string }
  | { type: "track"; name: string; props?: Record<string, string | number | boolean> };

export type Target = {
  id: string;
  /** Measured from the page at run time when omitted. */
  rect?: Rect;
  label: string;
  /** Try mode asks for these, in order. */
  required?: boolean;
  /** The browser tab it lives in, when the screen has tabs. */
  tab?: number;
  /** That tab's name, for "Open the … tab". */
  tabTitle?: string;
};

export type Beat = {
  /** The verb and its object, as the board's one line says it ("Editing FeatureCard.tsx"). */
  line: string;
  diff?: string;
  /** Seconds this beat takes. */
  pace: number;
  /** The change lands on the mock screen when this beat ends. */
  lands?: boolean;
};

export type Suggestion = { name: string; agent: AgentId; reason?: string };

export type BoardSample = {
  title: string;
  line: string;
  agent: AgentId;
  state: "working" | "complete" | "needsYou";
  time: string;
};

export type Answer = {
  outcome: string;
  points: { title: string; body: string }[];
  openFile?: string;
  edited?: string;
};

export type Scenario = {
  id: ScenarioId;
  /** What the mock screen shows. */
  screen: "fieldNotes" | "weekly" | "paper";
  agent: AgentId;
  project: string;
  /** The session's title, named from the request. */
  title: string;
  suggestions: Suggestion[];
  targets: Target[];
  /** The line to say, and others the visitor may pick in Try mode. */
  line: string;
  alternatives: string[];
  beats: Beat[];
  answer: Answer;
  board: BoardSample[];
  /** A Quick answer (Fovea's own model): no provider's icon, no "Open in". */
  quick?: boolean;
};
