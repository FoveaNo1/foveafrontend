import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Island as I } from "../../../lib/landing/tokens";
import { islandPath, restingOutline } from "../../../lib/landing/engine/islandPath";
import styles from "./island.module.css";

// The island in Native's light design (app-ui-v1/docs/island/NATIVE.md, Attached panels): one glass
// shape hanging from the top edge with concave ears, the hardware notch drawn black on it. At rest
// only the notch shows; the glass comes in over its first 12 pt of growth past the notch.
//
// Drawn with CSS rather than a clip path so it lays out from its content before any script runs:
// the body (straight sides, rounded foot) holds the content; an ear at each top corner is the
// concave fillet that fuses it into the edge it hangs from. Its rim runs down the sides and round
// the foot, never along the top (the glass has no top edge, NativeSurface.swift).

export type IslandProps = {
  /** Outer width, ears included. */
  width: number;
  /** Fixed height (the voice bar's 76); omitted, the content sets it. */
  height?: number;
  topRadius: number;
  bottomRadius: number;
  /** 0…1: how much glass shows (0 at rest, only the notch). */
  glass?: number;
  /** Over paper there is nothing for glass to blur: draw it as a solid of its tone. */
  surface?: "glass" | "solid";
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Pointer handlers and the like for the island's outline (the live demo's hover). */
  rootProps?: HTMLAttributes<HTMLDivElement>;
};

export default function Island({
  width,
  height,
  topRadius,
  bottomRadius,
  glass = 1,
  surface = "glass",
  children,
  className,
  style,
  rootProps,
}: IslandProps) {
  const tr = Math.max(0, Math.min(topRadius, width / 2));
  const vars = {
    "--island-w": `${width}px`,
    "--island-tr": `${tr}px`,
    "--island-br": `${bottomRadius}px`,
    "--island-glass": glass,
    ...(height !== undefined ? { "--island-h": `${height}px` } : {}),
    ...style,
  } as CSSProperties;
  return (
    <div
      {...rootProps}
      className={[styles.island, surface === "solid" ? styles.solid : "", className ?? ""].join(" ")}
      style={vars}
      data-fixed-height={height !== undefined ? "true" : undefined}
    >
      <span className={`${styles.ear} ${styles.earLeft}`} aria-hidden />
      <span className={`${styles.ear} ${styles.earRight}`} aria-hidden />
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>
      </div>
      <svg
        className={styles.notch}
        width={restingOutline.width}
        height={restingOutline.height}
        viewBox={`0 0 ${restingOutline.width} ${restingOutline.height}`}
        aria-hidden
      >
        <path d={islandPath(restingOutline)} />
      </svg>
    </div>
  );
}

/** The resting island alone: the notch with its ears, nothing else. */
export function RestingNotch({ className }: { className?: string }) {
  return (
    <Island
      width={restingOutline.width}
      height={restingOutline.height}
      topRadius={I.restTopRadius}
      bottomRadius={I.restBottomRadius}
      glass={0}
      className={className}
    />
  );
}
