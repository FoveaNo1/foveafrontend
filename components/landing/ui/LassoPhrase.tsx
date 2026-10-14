"use client";

import type { ReactNode } from "react";
import { lassoPath } from "../../../lib/landing/engine/lasso";
import styles from "./ui.module.css";

// A phrase Fovea's hand loop draws round, instead of an underline (as Instinct's tasks reveal a
// doodle): on hover, on focus, and while it is the one chosen. The loop is drawn in a 100 × 100 box
// stretched over the words, its stroke kept even by vector-effect.

const LOOP = lassoPath({ cx: 50, cy: 50, rx: 53, ry: 66, seed: 0.8 });

type Props = {
  children: ReactNode;
  /** Chosen: the loop stays drawn. */
  active?: boolean;
  onActivate?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
  label?: string;
};

export default function LassoPhrase({ children, active = false, onActivate, onHoverChange, className, label }: Props) {
  return (
    <button
      type="button"
      className={`${styles.lasso} ${className ?? ""}`}
      data-active={active ? "true" : undefined}
      aria-pressed={onActivate ? active : undefined}
      aria-label={label}
      onClick={onActivate}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
    >
      <span className={styles.lassoText}>{children}</span>
      <svg className={styles.lassoLoop} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d={LOOP} pathLength={1} />
      </svg>
    </button>
  );
}
