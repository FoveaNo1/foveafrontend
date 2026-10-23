import type { CSSProperties, ReactNode } from "react";
import type { Answer, AgentId, Beat, BoardSample, Referent, ScenarioId, Session } from "../../../../lib/landing/engine/types";
import { AgentMark } from "./ChooseChat";
import Thumb from "../../demo/Thumb";
import styles from "./live.module.css";

// The island's live contents in Native light (docs/island/NATIVE.md): the Dispatch bar with its
// aura and what was taken, the bar transcribing, the board (Badges), and the answer.

/** libraries.dev/voice's Colorful palette (WorkbenchTokens.VoiceGlow), centre lobe first. */
const AURA = [
  [255, 70, 120],
  [60, 190, 255],
  [175, 70, 255],
  [60, 220, 130],
  [255, 150, 40],
  [90, 100, 255],
  [40, 200, 190],
];
/** Where each lobe rises along the bar's foot (centre first, then outward). */
const LOBE_X = [50, 32, 68, 16, 84, 41, 59];

export function Aura({ level = 0.4, progress }: { level?: number; progress?: boolean }) {
  return (
    <span
      className={`${styles.aura} ${progress ? styles.auraProgress : ""}`}
      style={{ "--level": level } as CSSProperties}
      aria-hidden
    >
      {AURA.map(([r, g, b], i) => (
        <i
          key={i}
          style={
            {
              left: `${LOBE_X[i]}%`,
              "--c": `${r} ${g} ${b}`,
              "--dur": `${1.7 + (i % 3) * 0.45}s`,
              "--delay": `${-i * 0.37}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}

/** The stack of what was taken, at the bar's left: the newest on top, up to two peeking behind. */
export function Stack({
  referents,
  scenario,
  size = { width: 40, height: 28 },
}: {
  referents: Referent[];
  scenario: ScenarioId;
  size?: { width: number; height: number };
}) {
  const shown = referents.slice(-3).reverse();
  return (
    <span className={styles.stack} style={{ width: size.width + 10, height: size.height }}>
      {shown.map((r, i) => (
        <span
          key={r.id}
          className={styles.card}
          style={{
            width: size.width,
            height: size.height,
            zIndex: 3 - i,
            transform: `translateX(${i * 5}px) rotate(${[0, 4, -3][i]}deg) scale(${1 - i * 0.08})`,
            opacity: i === 0 ? 1 : 0.6,
          }}
        >
          <Thumb rect={r.rect} width={size.width} height={size.height} scenario={scenario} tab={r.tab} />
          <span className={styles.cardNumber}>{r.index}</span>
        </span>
      ))}
    </span>
  );
}

export function VoiceBar({ referents, scenario, speaking }: { referents: Referent[]; scenario: ScenarioId; speaking: boolean }) {
  return (
    <div className={styles.bar}>
      <Aura level={speaking ? 1 : 0.35} />
      {referents.length > 0 && (
        <span className={styles.barStack}>
          <Stack referents={referents} scenario={scenario} />
        </span>
      )}
    </div>
  );
}

export function TranscribingBar({ referents, scenario }: { referents: Referent[]; scenario: ScenarioId }) {
  return (
    <div className={styles.bar}>
      <Aura level={0.6} progress />
      {referents.length > 0 && (
        <span className={styles.barStack}>
          <Stack referents={referents} scenario={scenario} />
        </span>
      )}
      <span className={styles.barLabel}>Transcribing</span>
    </div>
  );
}

function StateBadge({ state }: { state: "working" | "complete" | "needsYou" }) {
  if (state === "complete") {
    return (
      <span className={`${styles.badge} ${styles.badgeDone}`}>
        <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden>
          <path d="M2.3 5.2l1.8 1.8 3.6-3.8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === "needsYou") {
    return (
      <span className={`${styles.badge} ${styles.badgeNeeds}`}>
        <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden>
          <path d="M5 2.4v3.2M5 7.4v.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return <span className={`${styles.badge} ${styles.badgeWorking}`} />;
}

function Row({
  agent,
  title,
  line,
  time,
  state,
  current,
  onOpen,
}: {
  agent: AgentId;
  title: string;
  line: ReactNode;
  time: string;
  state: "working" | "complete" | "needsYou";
  current?: boolean;
  onOpen?: () => void;
}) {
  const body = (
    <>
      <span className={styles.badged}>
        <AgentMark agent={agent} size={30} />
        <StateBadge state={state} />
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{title}</span>
        <span className={`${styles.rowLine} ${state === "complete" ? styles.rowLineDone : ""}`}>{line}</span>
      </span>
      <span className={styles.rowTime}>{time}</span>
    </>
  );
  return onOpen ? (
    <button type="button" className={`${styles.row} ${current ? styles.rowCurrent : ""}`} onClick={onOpen}>
      {body}
    </button>
  ) : (
    <div className={`${styles.row} ${current ? styles.rowCurrent : ""}`}>{body}</div>
  );
}

export function BeatLine({ beat }: { beat: Beat }) {
  return (
    <>
      {beat.line}
      {beat.diff ? <b className={styles.diff}> {beat.diff}</b> : null}
    </>
  );
}

export function BadgesBoard({
  session,
  beats,
  answer,
  samples,
  onOpen,
}: {
  session: Session;
  beats: Beat[];
  answer: Answer;
  samples: BoardSample[];
  onOpen?: () => void;
}) {
  const working = session.state === "working";
  const beat = beats[Math.min(session.beat, beats.length - 1)];
  return (
    <div className={styles.board}>
      <Row
        agent={session.agent}
        title={session.title}
        line={working ? <BeatLine beat={beat} /> : answer.outcome}
        time={working ? "now" : "now"}
        state={working ? "working" : "complete"}
        current
        onOpen={onOpen}
      />
      {samples.map((s) => (
        <Row key={s.title} agent={s.agent} title={s.title} line={s.line} time={s.time} state={s.state} />
      ))}
    </div>
  );
}

export function AnswerCard({
  session,
  request,
  answer,
  workedSeconds,
  quick = false,
  onClose,
}: {
  session: Session;
  request: ReactNode;
  answer: Answer;
  workedSeconds: number;
  /** A Quick answer: Fovea's own model, so nothing to open it in. */
  quick?: boolean;
  onClose?: () => void;
}) {
  const agentName = session.agent === "codex" ? "Codex" : session.agent === "fovea" ? "Fovea" : "Claude Code";
  return (
    <div className={styles.chat}>
      <header className={styles.chatHeader}>
        <AgentMark agent={session.agent} size={24} />
        <span className={styles.chatTitle}>{session.title}</span>
        <span className={styles.project}>{session.project}</span>
        {onClose ? (
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <CloseGlyph />
          </button>
        ) : (
          <span className={styles.close} aria-hidden>
            <CloseGlyph />
          </span>
        )}
      </header>
      <div className={styles.prompt}>
        <span className={styles.promptGlyph} aria-hidden>
          ›
        </span>
        <span>{request}</span>
      </div>
      <p className={styles.worked}>
        Worked for {workedSeconds} s{answer.edited ? ` · ${answer.edited}` : ""} ›
      </p>
      <p className={styles.outcome}>{answer.outcome}</p>
      <ul className={styles.points}>
        {answer.points.map((p) => (
          <li key={p.title}>
            <b>{p.title}</b> {p.body}
          </li>
        ))}
      </ul>
      {answer.openFile && (
        <span className={styles.openFile}>
          <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
            <rect x="1.5" y="1.5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 7l2.5-2.5M5.5 4.5h2v2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Open {answer.openFile}
        </span>
      )}
      <div className={styles.chatBar}>
        {quick ? <span /> : <span className={styles.openIn}>Open in {agentName} ↗</span>}
        <span className={styles.again}>
          <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
            <path d="M9.5 6a3.5 3.5 0 1 1-1-2.5M9.5 2v1.8H7.7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Answer again
        </span>
      </div>
      <div className={styles.followUp}>
        <span>Ask a follow-up</span>
        <span className={styles.followSend} aria-hidden>
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path d="M8 13V3.5M3.8 7.5L8 3.3l4.2 4.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <span className={styles.grab} aria-hidden />
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10">
      <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
