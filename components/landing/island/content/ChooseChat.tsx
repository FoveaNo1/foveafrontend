import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./content.module.css";

// Choose chat, Dispatch Version 2, Spacious, Native light (WorkbenchTokens.V2): the request and what
// was taken; the chat in a pill, the model, Send in the accent; the suggestions as chips under. It
// waits for the person: nothing sends by itself. On the page each "this" and "that one" carries the
// number of the referent it means, so the binding shows.

export type AgentId = "claude-code" | "codex" | "fovea";

export const AGENT_MARKS: Record<AgentId, { src: string; name: string }> = {
  "claude-code": { src: "/landing/agents/claude-code.png", name: "Claude Code" },
  codex: { src: "/landing/agents/codex.png", name: "Codex" },
  fovea: { src: "/landing/agents/fovea.png", name: "Fovea" },
};

export type RequestPart = string | { text: string; referents: number[] };

export type Suggestion = { name: string; agent: AgentId; chosen?: boolean };

type Props = {
  request: RequestPart[];
  referents: ReactNode[];
  chat: { name: string; agent: AgentId };
  model?: string;
  suggestions: Suggestion[];
  /** Try mode: choosing a chip, and Send. */
  onPick?: (index: number) => void;
  onSend?: () => void;
};

export function AgentMark({ agent, size }: { agent: AgentId; size: number }) {
  const mark = AGENT_MARKS[agent];
  return <Image className={styles.mark} src={mark.src} alt="" width={size} height={size} />;
}

export function ReferentTag({ n }: { n: number }) {
  return (
    <span className={styles.tag} aria-label={`referent ${n}`}>
      {n}
    </span>
  );
}

export default function ChooseChat({ request, referents, chat, model = "Auto", suggestions, onPick, onSend }: Props) {
  return (
    <div className={styles.choose}>
      <p className={styles.request}>
        {request.map((part, i) =>
          typeof part === "string" ? (
            <span key={i}>{part}</span>
          ) : (
            <span key={i} className={styles.bound}>
              {part.text}
              {part.referents.map((n) => (
                <ReferentTag key={n} n={n} />
              ))}
            </span>
          ),
        )}
      </p>
      <div className={styles.attachRow}>
        <div className={styles.pile}>
          {referents.map((thumb, i) => (
            <span
              key={i}
              className={styles.thumb}
              style={{
                zIndex: referents.length - i,
                transform: `translateX(${i * 5}px) rotate(${[0, 4, -3][i] ?? 0}deg) scale(${1 - i * 0.08})`,
                opacity: i === 0 ? 1 : 0.6,
              }}
            >
              {thumb}
            </span>
          ))}
        </div>
        <div className={styles.controls}>
          <span className={styles.pill}>
            <AgentMark agent={chat.agent} size={20} />
            <span className={styles.pillText}>{chat.name}</span>
            <Chevron />
          </span>
          <span className={styles.pill}>
            <ModelGlyph />
            <span className={styles.pillText}>{model}</span>
            <Chevron />
          </span>
          {onSend ? (
            <button type="button" className={styles.send} aria-label="Send" onClick={onSend}>
              <SendGlyph />
            </button>
          ) : (
            <span className={styles.send} aria-hidden>
              <SendGlyph />
            </span>
          )}
        </div>
      </div>
      <div className={styles.chips}>
        <span className={styles.chipLabel}>Suggested</span>
        {suggestions.map((s, i) =>
          onPick ? (
            <button
              type="button"
              key={s.name}
              className={`${styles.chip} ${s.chosen ? styles.chosen : ""}`}
              aria-pressed={Boolean(s.chosen)}
              onClick={() => onPick(i)}
            >
              <AgentMark agent={s.agent} size={16} />
              {s.name}
            </button>
          ) : (
            <span key={s.name} className={`${styles.chip} ${s.chosen ? styles.chosen : ""}`}>
              <AgentMark agent={s.agent} size={16} />
              {s.name}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function SendGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
      <path d="M8 13V3.5M3.8 7.5L8 3.3l4.2 4.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 10 10" width="9" height="9" aria-hidden>
      <path d="M2 3.8L5 6.6l3-2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModelGlyph() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden className={styles.modelGlyph}>
      <circle cx="9" cy="9" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 2.4c1.9 1.7 2.9 4 2.9 6.6s-1 4.9-2.9 6.6M9 2.4C7.1 4.1 6.1 6.4 6.1 9s1 4.9 2.9 6.6M2.6 9h12.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
