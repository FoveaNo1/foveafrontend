"use client";

import { useState } from "react";
import type { Instruction } from "../../../lib/landing/engine/instruction";
import type { KeyName } from "../../../lib/landing/engine/player";
import type { Mode } from "../../../lib/landing/engine/types";
import { track } from "../../../lib/landing/analytics";
import styles from "./live.module.css";

// The glass bar under the demo, after the onboarding's: in Watch mode, the keys the hand is
// pressing and the words it says, with "Try it yourself"; in Try mode, one step at a time, with
// the keys it needs (each a button too) and lines to say.

const KEY_LABELS: Record<KeyName, string[]> = {
  request: ["fn", "⌃"],
  region: ["⌘"],
  screen: ["⌘", "⌘"],
  send: ["return"],
  esc: ["esc"],
};

const KEY_NAMES: Record<KeyName, string> = {
  request: "fn control: ask",
  region: "command: take a region",
  screen: "command twice: the whole screen",
  send: "return: send",
  esc: "escape",
};

type Props = {
  mode: Mode;
  tip: Instruction;
  keys: KeyName | null;
  words: string | null;
  paused: boolean;
  reduced: boolean;
  onTry: () => void;
  onPause: () => void;
  onWatch: () => void;
  onKey: (key: KeyName) => void;
  onSay: (line: string) => void;
  onAgain: () => void;
  onTake: (targetId: string) => void;
  onOpenTab: (index: number) => void;
  /** A phone or a touch screen: Watch only; the way to try it is on a Mac. */
  phone: boolean;
};

function Keycaps({ name, lit }: { name: KeyName; lit?: boolean }) {
  return (
    <span className={styles.keycaps} data-lit={lit ? "true" : undefined}>
      {KEY_LABELS[name].map((label, i) => (
        <kbd key={i} className={`${styles.key} ${label.length > 1 ? styles.keyWide : ""}`}>
          {label}
        </kbd>
      ))}
    </span>
  );
}

/** Send this page to a Mac: the share sheet where there is one, the clipboard otherwise. */
async function shareToMac(setNote: (note: string) => void) {
  const url = window.location.origin + "/";
  track("share_link");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Fovea", text: "Try Fovea on your Mac", url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setNote("Link copied");
  } catch {
    // The share sheet was dismissed.
  }
}

export default function InstructionBar(p: Props) {
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");

  if (p.mode === "watch" && p.phone) {
    return (
      <div className={styles.bar} data-mode="watch" data-phone="true">
        <span className={styles.said} aria-hidden>
          {p.words ? <>“{p.words}”</> : "Point at it. Say it."}
        </span>
        <button type="button" className={styles.primary} onClick={() => shareToMac(setNote)}>
          {note || "Try it on your Mac"}
        </button>
      </div>
    );
  }

  if (p.mode === "watch") {
    return (
      <div className={styles.bar} data-mode="watch">
        <span className={styles.hud} aria-hidden>
          {(["request", "region", "send"] as const).map((k) => (
            <Keycaps key={k} name={k} lit={p.keys === k || (k === "region" && p.keys === "screen")} />
          ))}
        </span>
        <span className={styles.said} aria-hidden>
          {p.words ? <>“{p.words}”</> : p.reduced ? "Ready to send. Try it yourself." : null}
        </span>
        <span className={styles.actions}>
          {!p.reduced && (
            <button type="button" className={styles.iconButton} onClick={p.onPause} aria-label={p.paused ? "Play the demo" : "Pause the demo"}>
              {p.paused ? (
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
                  <path d="M3 1.8v8.4l7-4.2z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
                  <path d="M3 2v8M9 2v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
          <button type="button" className={styles.primary} onClick={p.onTry}>
            Try it yourself
          </button>
        </span>
      </div>
    );
  }

  const tip = p.tip;
  return (
    <div className={styles.bar} data-mode="try">
      <span className={styles.tip}>
        <span className={styles.tipText}>{tip.text}</span>
        {tip.keys.map((k) => (
          <button key={k} type="button" className={styles.keyButton} onClick={() => p.onKey(k)} aria-label={KEY_NAMES[k]}>
            <Keycaps name={k} />
          </button>
        ))}
        {tip.openTab && (
          <button type="button" className={styles.primary} onClick={() => p.onOpenTab(tip.openTab!.index)}>
            Open it
          </button>
        )}
        {tip.take && (
          <button type="button" className={styles.link} onClick={() => p.onTake(tip.take!.id)}>
            Take it for me
          </button>
        )}
      </span>

      {tip.lines && !typing && (
        <span className={styles.lines}>
          {tip.lines.map((line) => (
            <button key={line} type="button" className={styles.line} onClick={() => p.onSay(line)}>
              “{line}”
            </button>
          ))}
          <button type="button" className={styles.link} onClick={() => setTyping(true)}>
            Type it instead
          </button>
        </span>
      )}

      {tip.lines && typing && (
        <form
          className={styles.typeForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) p.onSay(draft.trim());
            setTyping(false);
            setDraft("");
          }}
        >
          <input
            className={styles.typeInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Say what you want, in words"
            autoFocus
            aria-label="What you'd say"
          />
          <button type="submit" className={styles.primary}>
            Say it
          </button>
        </form>
      )}

      {p.words && <span className={styles.said}>“{p.words}”</span>}

      <span className={styles.actions}>
        {tip.finished && (
          <button type="button" className={styles.primary} onClick={p.onAgain}>
            Try it again
          </button>
        )}
        <button type="button" className={styles.link} onClick={p.onWatch}>
          Watch it instead
        </button>
      </span>
    </div>
  );
}
