// Each phase's island outline (width includes the ears) and the spring it moves on, after
// NotchGeometry and WorkbenchTokens (V2, Board; Spacious, 1.0's default). Heights of the panels
// come from their content; `height: null` means measure it.

import { Board, Island as I, Motion, V2 } from "../tokens";
import type { Phase } from "./types";

export type Outline = { width: number; height: number | null; topRadius: number; bottomRadius: number; glass: number };

export const REST: Outline = { width: 212, height: 32, topRadius: I.restTopRadius, bottomRadius: I.restBottomRadius, glass: 0 };

export function outlineFor(phase: Phase): Outline {
  switch (phase) {
    case "silent":
      return REST;
    case "voice":
    case "transcribing":
      return { width: 212, height: 32 + I.voiceBelow, topRadius: I.restTopRadius, bottomRadius: 16, glass: 1 };
    case "choose":
    case "chat":
      return { width: V2.width, height: null, topRadius: I.openTopRadius, bottomRadius: V2.bottomRadius, glass: 1 };
    case "board":
      return { width: Board.width, height: null, topRadius: I.openTopRadius, bottomRadius: Board.bottomRadius, glass: 1 };
  }
}

/** The spring between two phases (WorkbenchTokens.V2.spring(from:to:) and Motion): seconds. */
export function springDuration(from: Phase, to: Phase): number {
  const bar = (p: Phase) => p === "voice" || p === "transcribing";
  if (to === "silent") return bar(from) ? Motion.voiceClose : Motion.close;
  if (bar(to)) return from === "silent" ? Motion.voiceOpen : Motion.resize;
  if (from === "silent" || bar(from)) return Motion.open;
  return Motion.resize;
}

/**
 * SwiftUI's interpolatingSpring(duration: d, bounce: 0) as a CSS easing: critically damped,
 * x(s) = 1 − (1 + 2πs)·e^(−2πs) over the duration, normalised to end at 1. No overshoot.
 */
export function springEasing(samples = 24): string {
  const end = 1 - (1 + 2 * Math.PI) * Math.exp(-2 * Math.PI);
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const s = i / samples;
    const x = (1 - (1 + 2 * Math.PI * s) * Math.exp(-2 * Math.PI * s)) / end;
    points.push(`${x.toFixed(4)} ${(s * 100).toFixed(1)}%`);
  }
  return `linear(${points.join(", ")})`;
}
