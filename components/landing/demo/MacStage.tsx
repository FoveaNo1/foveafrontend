"use client";

import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Display } from "../../../lib/landing/tokens";
import styles from "./demo.module.css";

// The MacBook the demo plays on: a 12 pt black bezel round a 1470 × 956 pt screen, drawn at its own
// size and scaled to fit the page as one picture (never above 1:1). A one-line script sets the
// scale before the first paint, so the server's picture lands at the right size; after that a
// ResizeObserver keeps it.

export const STAGE_WIDTH = Display.width + 2 * Display.bezel;
export const STAGE_HEIGHT = Display.height + 2 * Display.bezel;

const fitScript = `(function(){var s=document.currentScript,e=s&&s.previousElementSibling;if(e){e.style.setProperty('--s',Math.min(1,e.clientWidth/${STAGE_WIDTH}));e.setAttribute('data-fit','')}})()`;

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
  /** The screen itself, for measuring what's on it and mapping the pointer. */
  screenRef?: Ref<HTMLDivElement>;
  /** Drawn over the stage at the page's own size (not scaled): the demo's instruction bar. */
  overlay?: ReactNode;
  /** The live demo makes the stage interactive; the poster leaves it a picture. */
  stageProps?: HTMLAttributes<HTMLDivElement> & { [data: `data-${string}`]: string | undefined };
  screenProps?: HTMLAttributes<HTMLDivElement> & { [data: `data-${string}`]: string | undefined };
};

export default function MacStage({ children, label, className, screenRef, overlay, stageProps, screenProps }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.setProperty("--s", String(Math.min(1, el.clientWidth / STAGE_WIDTH)));
      el.setAttribute("data-fit", "");
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* The fit script sets --s before hydration, so the style attribute differs by design. */}
      <div
        role={stageProps ? undefined : "img"}
        aria-label={label}
        {...stageProps}
        ref={ref}
        className={[styles.stage, className, stageProps?.className].filter(Boolean).join(" ")}
        suppressHydrationWarning
      >
        <div className={styles.clip}>
          <div className={styles.scaler}>
            <div className={styles.lid}>
              <div {...screenProps} ref={screenRef} className={[styles.screen, screenProps?.className].filter(Boolean).join(" ")}>
                {children}
              </div>
            </div>
          </div>
        </div>
        {overlay}
      </div>
      <script dangerouslySetInnerHTML={{ __html: fitScript }} />
    </>
  );
}
