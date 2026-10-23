"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { outlineFor, springDuration, springEasing } from "../../../lib/landing/engine/geometry";
import type { Phase } from "../../../lib/landing/engine/types";
import Island from "./Island";
import styles from "./island.module.css";

// The island in motion: its outline moves between phases on a critically damped spring (as
// SwiftUI's interpolatingSpring(duration:, bounce: 0) moves it in the app), with the app's
// durations: the bar opens in 0.18 s, a panel in 0.34, one panel to another in 0.30, and it closes
// in 0.24. A panel's height is its content's. The content follows the shape in: opacity, a 4 pt
// blur and a 0.97 scale from the top, a moment behind; on the way out the shape swallows it.

const EASE = springEasing();

type Props = {
  phase: Phase;
  children: ReactNode;
  onHover?: (on: boolean) => void;
};

export default function LiveIsland({ phase, children, onHover }: Props) {
  const outline = outlineFor(phase);
  // The phase it is coming from picks the spring (kept in state, updated as the phase changes).
  const [move, setMove] = useState({ phase, from: phase });
  if (move.phase !== phase) setMove({ phase, from: move.phase });
  const duration = springDuration(move.from, phase);
  const contentRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setMeasured(Math.ceil(el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase]);

  const height = outline.height ?? measured ?? 240;
  const innerWidth = outline.width - 2 * outline.topRadius;
  const panel = phase === "choose" || phase === "board" || phase === "chat";
  const transition = ["--island-w", "--island-h", "--island-tr", "--island-br"]
    .map((p) => `${p} ${duration}s ${EASE}`)
    .concat(`--island-glass ${phase === "silent" ? 0.12 : 0.2}s cubic-bezier(0.23, 1, 0.32, 1)`)
    .join(", ");

  return (
    <Island
      width={outline.width}
      height={height}
      topRadius={outline.topRadius}
      bottomRadius={outline.bottomRadius}
      glass={outline.glass}
      style={{ transition }}
      rootProps={{
        onPointerEnter: () => onHover?.(true),
        onPointerLeave: () => onHover?.(false),
      }}
    >
      <div
        key={phase}
        ref={contentRef}
        className={`${styles.live} ${panel ? styles.livePanel : ""}`}
        style={{ width: innerWidth }}
      >
        {children}
      </div>
    </Island>
  );
}
