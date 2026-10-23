// The demo's reducer: Dispatch Version 2's transitions (WorkbenchModel+DispatchV2.swift:
// startV2Voice, finishV2Voice, showV2Send, sendV2Now, showBoardAfterSend, runV2, v2Finished,
// showV2Chat), pure. Watch mode and Try mode feed it the same events; only who presses the keys
// differs. Timers come back as effects for the clock to run.

import { bindReferences } from "./binding";
import { Display } from "../tokens";
import type { DemoEvent, DemoState, Effect, Mode, Point, Rect, Referent, Scenario, ScenarioId, Target } from "./types";

export const Timing = {
  /** fn ⌃ again: what was said is transcribed this long (the aura filling as a progress bar). */
  transcribe: 1400,
  /** Just sent, the board shows this long. */
  boardHold: 3000,
  /** An answer that came this quickly opens by itself; slower ones wait on the board. */
  quickLimit: 8000,
  /** Opened by itself, the answer holds this long. */
  chatHold: 12000,
  /** A drag shorter than this is a click; smaller regions are ignored. */
  minimumSide: 12,
} as const;

export type Context = {
  now: number;
  scenario: Scenario;
  /** The scenario's targets with their rects measured on the mock screen. */
  targets: (Target & { rect: Rect })[];
};

export function initialState(scenario: ScenarioId, mode: Mode = "watch"): DemoState {
  return {
    phase: "silent",
    mode,
    scenario,
    armed: false,
    selection: null,
    referents: [],
    intent: { text: "", final: false },
    bindings: [],
    pick: 0,
    session: null,
    landed: false,
    hover: false,
    tab: 0,
  };
}

const rectFrom = (a: Point, b: Point): Rect => ({
  x: Math.min(a.x, b.x),
  y: Math.min(a.y, b.y),
  width: Math.abs(a.x - b.x),
  height: Math.abs(a.y - b.y),
});

function area(r: Rect) {
  return Math.max(0, r.width) * Math.max(0, r.height);
}

function overlap(a: Rect, b: Rect) {
  const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** A region near a known target becomes that target, padded a little, as a careful hand would take it. */
export function snap(rect: Rect, targets: (Target & { rect: Rect })[]): { rect: Rect; target?: Target } {
  let best: { score: number; target: Target & { rect: Rect } } | null = null;
  for (const target of targets) {
    const inter = overlap(rect, target.rect);
    const iou = inter / (area(rect) + area(target.rect) - inter || 1);
    const cx = target.rect.x + target.rect.width / 2;
    const cy = target.rect.y + target.rect.height / 2;
    const covers = cx >= rect.x && cx <= rect.x + rect.width && cy >= rect.y && cy <= rect.y + rect.height;
    const ratio = area(rect) / (area(target.rect) || 1);
    const score = iou >= 0.4 ? iou : covers && ratio >= 0.5 && ratio <= 3 ? 0.4 : 0;
    if (score > 0 && (!best || score > best.score)) best = { score, target };
  }
  if (!best) return { rect };
  const pad = 6;
  const r = best.target.rect;
  return { rect: { x: r.x - pad, y: r.y - pad, width: r.width + 2 * pad, height: r.height + 2 * pad }, target: best.target };
}

function reindex(referents: Referent[]): Referent[] {
  return referents.map((r, i) => ({ ...r, index: i + 1 }));
}

function cancelAll(): Effect[] {
  return ["transcribe", "boardHold", "chatHold"].map((id) => ({ type: "cancel", id }) as Effect);
}

export function reduce(state: DemoState, event: DemoEvent, ctx: Context): { state: DemoState; effects: Effect[] } {
  const effects: Effect[] = [];
  const s = ctx.scenario;
  const out = (next: DemoState) => ({ state: next, effects });

  switch (event.type) {
    case "RESET": {
      effects.push(...cancelAll(), { type: "cancel", id: "beat" });
      return out(initialState(event.scenario ?? state.scenario, state.mode));
    }

    case "MODE":
      return out({ ...state, mode: event.mode });

    case "KEY_REQUEST": {
      if (state.phase === "voice") {
        // fn ⌃ again: transcribe what was said.
        effects.push({ type: "schedule", id: "transcribe", ms: Timing.transcribe, event: { type: "TRANSCRIBED" } });
        effects.push({ type: "announce", text: "Transcribing" });
        return out({ ...state, phase: "transcribing", armed: false, selection: null });
      }
      if (state.phase === "transcribing" || state.phase === "choose") return out(state);
      // From rest, the board or an answer: a new request.
      effects.push({ type: "cancel", id: "boardHold" }, { type: "cancel", id: "chatHold" });
      effects.push({ type: "announce", text: "Listening" });
      effects.push({ type: "track", name: "demo_request", props: { scenario: state.scenario, mode: state.mode } });
      return out({
        ...state,
        phase: "voice",
        armed: false,
        selection: null,
        referents: [],
        intent: { text: "", final: false },
        bindings: [],
        pick: 0,
        hover: false,
      });
    }

    case "ARM_REGION":
      if (state.phase !== "voice") return out(state);
      return out({ ...state, armed: true });

    case "WHOLE_SCREEN": {
      if (state.phase !== "voice") return out(state);
      const referent: Referent = {
        id: `r${state.referents.length + 1}-${Math.round(ctx.now)}`,
        index: state.referents.length + 1,
        kind: "screen",
        rect: { x: 0, y: 0, width: Display.width, height: Display.height },
        label: "the whole screen",
        tab: state.tab,
      };
      effects.push({ type: "flash" }, { type: "flight", referent }, { type: "announce", text: "Took the whole screen" });
      return out({ ...state, armed: false, selection: null, referents: [...state.referents, referent] });
    }

    case "SEL_START":
      if (state.phase !== "voice" || !state.armed) return out(state);
      return out({ ...state, selection: { start: event.at, rect: rectFrom(event.at, event.at) } });

    case "SEL_MOVE":
      if (!state.selection) return out(state);
      return out({ ...state, selection: { ...state.selection, rect: rectFrom(state.selection.start, event.at) } });

    case "SEL_END": {
      if (!state.selection) return out(state);
      const raw = rectFrom(state.selection.start, event.at);
      if (raw.width < Timing.minimumSide || raw.height < Timing.minimumSide) {
        // A click, not a region: stay armed.
        return out({ ...state, selection: null });
      }
      const snapped = snap(raw, ctx.targets);
      const referent: Referent = {
        id: `r${state.referents.length + 1}-${Math.round(ctx.now)}`,
        index: state.referents.length + 1,
        kind: "region",
        rect: snapped.rect,
        targetId: snapped.target?.id,
        label: snapped.target?.label ?? "a region",
        tab: state.tab,
      };
      effects.push({ type: "flight", referent }, { type: "announce", text: `Took ${referent.label}` });
      return out({ ...state, armed: false, selection: null, referents: [...state.referents, referent] });
    }

    case "REFERENT_REMOVE":
      return out({ ...state, referents: reindex(state.referents.filter((r) => r.id !== event.id)) });

    case "SAY":
      if (state.phase !== "voice") return out(state);
      return out({ ...state, intent: { text: event.text, final: event.final } });

    case "TRANSCRIBED": {
      if (state.phase !== "transcribing") return out(state);
      const text = state.intent.text.trim();
      if (!text && state.referents.length === 0) {
        effects.push({ type: "announce", text: "Didn't catch that." });
        return out({ ...state, phase: "silent" });
      }
      effects.push({ type: "announce", text: `Choose a chat for: ${text}` });
      return out({
        ...state,
        phase: "choose",
        intent: { text, final: true },
        bindings: bindReferences(text, state.referents.length),
        pick: 0,
      });
    }

    case "PICK":
      if (state.phase !== "choose") return out(state);
      return out({ ...state, pick: Math.max(0, Math.min(event.index, s.suggestions.length - 1)) });

    case "SEND": {
      if (state.phase !== "choose") return out(state);
      const chosen = s.suggestions[state.pick] ?? s.suggestions[0];
      const session = {
        id: `s-${Math.round(ctx.now)}`,
        agent: chosen.agent,
        title: s.title,
        project: s.project,
        beat: 0,
        state: "working" as const,
        sentAt: ctx.now,
      };
      effects.push({ type: "schedule", id: "boardHold", ms: Timing.boardHold, event: { type: "BOARD_HOLD_END" } });
      effects.push({ type: "schedule", id: "beat", ms: s.beats[0].pace * 1000, event: { type: "AGENT_BEAT" } });
      effects.push({ type: "announce", text: `Sent to ${chosen.name}` });
      effects.push({ type: "track", name: "demo_sent", props: { scenario: state.scenario, mode: state.mode } });
      return out({ ...state, phase: "board", session, landed: false });
    }

    case "AGENT_BEAT": {
      const session = state.session;
      if (!session || session.state !== "working") return out(state);
      const beat = session.beat + 1;
      const landed = state.landed || Boolean(s.beats[beat - 1]?.lands);
      if (beat < s.beats.length) {
        effects.push({ type: "schedule", id: "beat", ms: s.beats[beat].pace * 1000, event: { type: "AGENT_BEAT" } });
        return out({ ...state, landed, session: { ...session, beat } });
      }
      const done = { ...session, beat, state: "complete" as const, finishedAt: ctx.now };
      effects.push({ type: "announce", text: s.answer.outcome });
      effects.push({ type: "track", name: "demo_completed", props: { scenario: state.scenario, mode: state.mode } });
      // A quick answer opens by itself; a slow one waits on the board, ready for review.
      if (ctx.now - session.sentAt <= Timing.quickLimit && (state.phase === "board" || state.phase === "silent")) {
        effects.push({ type: "cancel", id: "boardHold" });
        effects.push({ type: "schedule", id: "chatHold", ms: Timing.chatHold, event: { type: "CHAT_HOLD_END" } });
        return out({ ...state, landed: true, session: done, phase: "chat" });
      }
      return out({ ...state, landed: true, session: done });
    }

    case "BOARD_HOLD_END":
      if (state.phase !== "board" || state.hover) return out(state);
      return out({ ...state, phase: "silent" });

    case "CHAT_HOLD_END":
      if (state.phase !== "chat" || state.hover) return out(state);
      return out({ ...state, phase: "silent" });

    case "HOVER": {
      if (event.on) {
        // The pointer on the notch opens the board, never empty.
        if (state.phase === "silent" && state.session) return out({ ...state, hover: true, phase: "board" });
        return out({ ...state, hover: true });
      }
      if (state.phase === "board" || state.phase === "chat") {
        effects.push({ type: "cancel", id: "boardHold" }, { type: "cancel", id: "chatHold" });
        return out({ ...state, hover: false, phase: "silent" });
      }
      return out({ ...state, hover: false });
    }

    case "TAB":
      // Switching tabs is the page's, not the island's: allowed in any phase.
      return out({ ...state, tab: event.index });

    case "OPEN": {
      // A session on the board, clicked: its answer, or how far it has got.
      if (!state.session || (state.phase !== "board" && state.phase !== "silent")) return out(state);
      effects.push({ type: "cancel", id: "boardHold" });
      effects.push({ type: "schedule", id: "chatHold", ms: Timing.chatHold, event: { type: "CHAT_HOLD_END" } });
      return out({ ...state, phase: "chat" });
    }

    case "ESC": {
      if (state.phase === "voice" && state.armed) return out({ ...state, armed: false, selection: null });
      if (state.phase === "silent") return out(state);
      effects.push(...cancelAll());
      return out({ ...state, phase: "silent", armed: false, selection: null, hover: false });
    }
  }
}
