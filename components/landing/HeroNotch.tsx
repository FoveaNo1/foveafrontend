"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { LandingCopy } from "../../lib/landing/copy";
import { reducedMotion } from "../../lib/landing/motion";
import styles from "./page.module.css";

// The notch on the hero's picture: the picture is a screen, and Fovea lives at its top. Now and then
// it listens (its level bars move) and says "Sent", growing sideways on the island's spring, as the
// app's notch does. Only while on screen; with reduced motion it stays at rest.

type Phase = "rest" | "listening" | "sent";
const NEXT: Record<Phase, { to: Phase; after: number }> = {
  rest: { to: "listening", after: 2600 },
  listening: { to: "sent", after: 2400 },
  sent: { to: "rest", after: 1500 },
};

export default function HeroNotch() {
  const [phase, setPhase] = useState<Phase>("rest");
  useEffect(() => {
    if (reducedMotion()) return;
    const t = window.setTimeout(() => setPhase(NEXT[phase].to), NEXT[phase].after);
    return () => window.clearTimeout(t);
  }, [phase]);
  return (
    <div className={styles.notch} data-phase={phase} aria-hidden>
      <span className={styles.notchBody}>
        {phase === "listening" && (
          <span key="bars" className={styles.bars}>
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} style={{ "--b": i } as CSSProperties} />
            ))}
          </span>
        )}
        {phase === "sent" && (
          <span key="sent" className={styles.sent}>
            <svg viewBox="0 0 12 12" width="10" height="10">
              <path d="M2 6.4l2.6 2.5L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {LandingCopy.sent}
          </span>
        )}
      </span>
    </div>
  );
}
