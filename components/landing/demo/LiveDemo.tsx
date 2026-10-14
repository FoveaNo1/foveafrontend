"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { requestParts } from "../../../lib/landing/engine/binding";
import { feedKey, flushMeta, initialGesture, resetGesture } from "../../../lib/landing/engine/gestures";
import { instruction } from "../../../lib/landing/engine/instruction";
import type { KeyName } from "../../../lib/landing/engine/player";
import type { DemoEngine, Flight } from "../../../lib/landing/engine/runtime";
import type { DemoEvent, Point, Rect, ScenarioId } from "../../../lib/landing/engine/types";
import { nextScenario } from "../../../lib/landing/scenarios";
import { Display } from "../../../lib/landing/tokens";
import { track } from "../../../lib/landing/analytics";
import LiveIsland from "../island/LiveIsland";
import ChooseChat from "../island/content/ChooseChat";
import { AnswerCard, BadgesBoard, TranscribingBar, VoiceBar } from "../island/content/Live";
import InstructionBar from "./InstructionBar";
import MacStage from "./MacStage";
import ScreenPicture from "./ScreenPicture";
import Thumb from "./Thumb";
import { useDemoEngine } from "./useDemoEngine";
import styles from "./demo.module.css";
import live from "./live.module.css";

// The Mac you can use. It plays a scenario by itself (Watch); a click on it, a key while it has
// focus, or "Try it yourself" hands it over at whatever step is showing (Try). Both drive the same
// reducer; only who presses the keys differs. It plays only while it is on screen, and never by
// itself under Reduce Motion (it shows the request ready to send, and waits to be tried).

/** Where captures land: the stack at the Dispatch bar's left (the bar is 212 wide, 6 pt ears). */
const STACK_AT: Rect = { x: Display.width / 2 - 106 + 6 + 8, y: 40, width: 40, height: 28 };

const KEY_EVENTS: Record<KeyName, DemoEvent> = {
  request: { type: "KEY_REQUEST" },
  region: { type: "ARM_REGION" },
  screen: { type: "WHOLE_SCREEN" },
  send: { type: "SEND" },
  esc: { type: "ESC" },
};

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PHONE = "(max-width: 767px), (pointer: coarse)";
function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getPhone = () => window.matchMedia(PHONE).matches;

/** Where each of the scenario's targets is on the screen, in points. */
function measure(engine: DemoEngine, screen: HTMLElement | null) {
  if (!screen) return;
  const box = screen.getBoundingClientRect();
  const s = box.width / Display.width;
  engine.targets.clear();
  screen.querySelectorAll<HTMLElement>("[data-target]").forEach((el) => {
    if (el.closest("[data-picture]")) return;
    const r = el.getBoundingClientRect();
    engine.targets.set(el.dataset.target!, { x: (r.left - box.left) / s, y: (r.top - box.top) / s, width: r.width / s, height: r.height / s });
  });
}

/** Watch a scenario; when its run ends, the next one (or the same again). */
function play(engine: DemoEngine, id: ScenarioId, onAdvance: (id: ScenarioId) => void) {
  engine.watch(id, () => {
    const next = nextScenario(id);
    if (next === id) play(engine, id, onAdvance);
    else onAdvance(next);
  });
}

type Props = {
  scenario: ScenarioId;
  label: string;
  /** A Watch run ended: the page moves the picker on to this scenario. */
  onAdvance: (id: ScenarioId) => void;
};

export default function LiveDemo({ scenario: scenarioId, label, onAdvance }: Props) {
  const { engine, view, scenario } = useDemoEngine(scenarioId);
  const state = view.state;
  const screenRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gesture = useRef(initialGesture);
  const dragging = useRef(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const phone = useSyncExternalStore(subscribePhone, getPhone, () => false);

  // First start: play the script ahead to the request ready to send (the picture the server drew),
  // so the poster hands over without a jump; from there it plays in real time. Under Reduce Motion
  // it stays on that frame, handed to the visitor.
  useLayoutEffect(() => {
    measure(engine, screenRef.current);
    engine.dispatch({ type: "RESET", scenario: scenarioId });
    play(engine, scenarioId, onAdvance);
    engine.fastForward((s) => s.phase === "choose");
    engine.clock.advance(400);
    if (getReduced()) engine.takeOver();
    track("demo_started", { scenario: scenarioId });
    return () => engine.stop();
    // Only on mount: a scenario chosen later starts from rest (below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  // A different scenario chosen, or the next one after a run: start it from rest.
  useEffect(() => {
    if (engine.state.scenario === scenarioId) return;
    engine.stop();
    engine.dispatch({ type: "RESET", scenario: scenarioId });
    if (engine.state.mode === "watch") play(engine, scenarioId, onAdvance);
  }, [engine, scenarioId, onAdvance]);

  // A tab switched (or another scenario's screen): measure the targets again.
  useLayoutEffect(() => {
    measure(engine, screenRef.current);
  }, [engine, state.tab, state.scenario]);

  // Play only while on screen and the tab is showing (and, under Reduce Motion, only when tried).
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    let visible = false;
    const sync = () => {
      const allowed = !paused && (!reduced || engine.state.mode === "try");
      if (visible && !document.hidden && allowed) engine.clock.start();
      else engine.clock.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.35;
        if (visible) measure(engine, screenRef.current);
        sync();
      },
      { threshold: [0, 0.35, 0.7, 1] },
    );
    io.observe(el);
    const onResize = () => measure(engine, screenRef.current);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", onResize);
    const unsubscribe = engine.subscribe(sync);
    return () => {
      io.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
      engine.clock.pause();
    };
  }, [engine, paused, reduced]);

  const focusStage = () => screenRef.current?.closest<HTMLElement>("[tabindex='0']")?.focus({ preventScroll: true });

  const takeOver = () => {
    engine.takeOver();
    setPaused(false);
    focusStage();
  };

  const toScreen = (e: { clientX: number; clientY: number }): Point => {
    const box = screenRef.current!.getBoundingClientRect();
    const s = box.width / Display.width;
    return { x: (e.clientX - box.left) / s, y: (e.clientY - box.top) / s };
  };

  // Keys, while the stage has focus. A modifier or return in Watch mode takes over first.
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>, kind: "down" | "up") => {
    if (engine.state.mode !== "try") {
      if (kind === "down" && ["Control", "Meta", "Enter"].includes(e.key)) takeOver();
      else return;
    }
    const { state: next, events, flushAt } = feedKey(gesture.current, { kind, key: e.key, at: performance.now(), repeat: e.repeat });
    gesture.current = next;
    if (events.length && (e.key === "Enter" || e.key === "Escape")) e.preventDefault();
    events.forEach(engine.dispatch);
    if (flushAt) {
      window.setTimeout(() => {
        const flushed = flushMeta(gesture.current, performance.now());
        gesture.current = flushed.state;
        flushed.events.forEach(engine.dispatch);
      }, flushAt - performance.now() + 5);
    }
  };

  // The pointer: a press takes over; with ⌘ pressed, a drag takes a region.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (engine.state.mode === "watch") {
      // On a phone it stays a picture to watch; the keys it needs are a Mac's.
      if (!phone) takeOver();
      return;
    }
    if (!engine.state.armed) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // A pointer the browser no longer tracks; the drag still works while it stays on the screen.
    }
    dragging.current = true;
    engine.dispatch({ type: "SEL_START", at: toScreen(e) });
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) engine.dispatch({ type: "SEL_MOVE", at: toScreen(e) });
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    engine.dispatch({ type: "SEL_END", at: toScreen(e) });
  };

  const tip = instruction(state, scenario);
  const parts = requestParts(state.intent.text, state.bindings);
  const session = state.session;
  const worked = session?.finishedAt ? Math.max(1, Math.round((session.finishedAt - session.sentAt) / 1000)) : 0;
  const chosen = scenario.suggestions[state.pick] ?? scenario.suggestions[0];
  const tryMode = state.mode === "try";

  return (
    <MacStage
      label={label}
      screenRef={screenRef}
      stageProps={{
        "data-live": "true",
        "data-zoom": phone && ["choose", "board", "chat"].includes(state.phase) ? "true" : undefined,
        "data-phone": phone ? "true" : undefined,
        tabIndex: 0,
        role: "application",
        "aria-roledescription": "demo",
        "aria-label": tryMode ? `${label} You have it: the keys to press are under it.` : label,
        onKeyDown: (e) => onKey(e, "down"),
        onKeyUp: (e) => onKey(e, "up"),
        onBlur: () => (gesture.current = resetGesture()),
        className: live.focusable,
      }}
      screenProps={{
        onPointerDown,
        onPointerMove,
        onPointerUp,
        "data-armed": state.armed ? "true" : undefined,
        "data-mode": state.mode,
        "data-phase": state.phase,
        "data-landed": state.landed ? "true" : undefined,
        className: live.screen,
      }}
      overlay={
        <div ref={overlayRef} className={live.overlay}>
          <InstructionBar
            mode={state.mode}
            tip={tip}
            keys={view.keys}
            words={view.words}
            paused={paused}
            reduced={reduced}
            onTry={takeOver}
            onPause={() => setPaused((p) => !p)}
            onWatch={() => {
              engine.stop();
              engine.dispatch({ type: "RESET" });
              engine.dispatch({ type: "MODE", mode: "watch" });
              play(engine, state.scenario, onAdvance);
              setPaused(false);
            }}
            onKey={(key) => {
              engine.dispatch(KEY_EVENTS[key]);
              focusStage();
            }}
            onSay={(line) => engine.say(line)}
            onAgain={() => {
              engine.dispatch({ type: "RESET" });
              focusStage();
            }}
            onTake={(id) => {
              // The same capture a careful drag makes, for a keyboard or a finger.
              const r = engine.targets.get(id);
              if (!r) return;
              engine.dispatch({ type: "SEL_START", at: { x: r.x - 6, y: r.y - 6 } });
              engine.dispatch({ type: "SEL_END", at: { x: r.x + r.width + 6, y: r.y + r.height + 6 } });
              focusStage();
            }}
            phone={phone}
            onOpenTab={(index) => {
              engine.dispatch({ type: "TAB", index });
              focusStage();
            }}
          />
          <p className={live.visuallyHidden} aria-live="polite">
            {view.announcement}
          </p>
        </div>
      }
    >
      <ScreenPicture
        scenario={state.scenario}
        tab={state.tab}
        landed={state.landed}
        onTab={tryMode ? (index) => engine.dispatch({ type: "TAB", index }) : undefined}
      />
      {state.landed && scenario.screen === "fieldNotes" && <span className={live.reload} aria-hidden />}

      {/* The selection, shaded as ⌘⇧4 shades it. */}
      {state.selection && (
        <span
          className={live.selection}
          style={{ left: state.selection.rect.x, top: state.selection.rect.y, width: state.selection.rect.width, height: state.selection.rect.height }}
        />
      )}

      {view.flash > 0 && <span key={view.flash} className={live.flash} aria-hidden />}

      {view.flights.map((f) => (
        <FlightCard key={f.id} flight={f} scenario={state.scenario} />
      ))}

      <div className={styles.islandSlot}>
        <LiveIsland phase={state.phase} onHover={(on) => tryMode && engine.dispatch({ type: "HOVER", on })}>
          {state.phase === "voice" && <VoiceBar referents={state.referents} scenario={state.scenario} speaking={Boolean(view.words)} />}
          {state.phase === "transcribing" && <TranscribingBar referents={state.referents} scenario={state.scenario} />}
          {state.phase === "choose" && (
            <ChooseChat
              request={parts}
              referents={state.referents.map((r) => (
                <Thumb key={r.id} rect={r.rect} width={63} height={44} scenario={state.scenario} tab={r.tab} />
              ))}
              chat={{ name: chosen.name, agent: chosen.agent }}
              suggestions={scenario.suggestions.map((s, i) => ({ name: s.name, agent: s.agent, chosen: i === state.pick }))}
              onPick={tryMode ? (index) => engine.dispatch({ type: "PICK", index }) : undefined}
              onSend={tryMode ? () => engine.dispatch({ type: "SEND" }) : undefined}
            />
          )}
          {state.phase === "board" && session && (
            <BadgesBoard
              session={session}
              beats={scenario.beats}
              answer={scenario.answer}
              samples={scenario.board}
              onOpen={tryMode && session.state === "complete" ? () => engine.dispatch({ type: "OPEN" }) : undefined}
            />
          )}
          {state.phase === "chat" && session && (
            <AnswerCard
              session={session}
              request={state.intent.text}
              answer={scenario.answer}
              workedSeconds={worked}
              quick={scenario.quick}
              onClose={tryMode ? () => engine.dispatch({ type: "ESC" }) : undefined}
            />
          )}
        </LiveIsland>
      </div>

      {!tryMode && view.pointer.visible && (
        <GhostPointer at={view.pointer.at} ms={view.pointer.ms} crosshair={state.armed || Boolean(state.selection)} />
      )}
    </MacStage>
  );
}

/** A capture flying from where it was taken into the stack at the bar's left. */
function FlightCard({ flight, scenario }: { flight: Flight; scenario: ScenarioId }) {
  const ref = useRef<HTMLSpanElement>(null);
  const r = flight.referent.rect;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { transform: "translate(0px, 0px) scale(1, 1)", borderRadius: "4px", opacity: 1 },
        {
          transform: `translate(${STACK_AT.x - r.x}px, ${STACK_AT.y - r.y}px) scale(${STACK_AT.width / r.width}, ${STACK_AT.height / r.height})`,
          borderRadius: "40px",
          opacity: 0.9,
        },
      ],
      { duration: 450, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
    );
  }, [r]);
  return (
    <span ref={ref} className={live.flight} style={{ left: r.x, top: r.y, width: r.width, height: r.height }}>
      <Thumb rect={r} width={r.width} height={r.height} scenario={scenario} tab={flight.referent.tab} />
    </span>
  );
}

/** The hand, in Watch mode: an arrow, or a crosshair while a region is being taken. */
function GhostPointer({ at, ms, crosshair }: { at: Point; ms: number; crosshair: boolean }) {
  return (
    <span className={live.pointer} style={{ transform: `translate(${at.x}px, ${at.y}px)`, transitionDuration: `${ms}ms` }} aria-hidden>
      {crosshair ? (
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ translate: "-13px -13px" }}>
          <path d="M13 2v9M13 15v9M2 13h9M15 13h9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M13 2v9M13 15v9M2 13h9M15 13h9" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="22" height="28" viewBox="0 0 22 28" style={{ translate: "-3px -2px" }}>
          <path d="M3 2.5v19.2l4.7-4.4 3 7.1 3.4-1.4-3-7h6.5z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
