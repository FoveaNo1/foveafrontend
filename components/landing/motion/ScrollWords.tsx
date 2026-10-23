"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { splitWords } from "../../../lib/landing/reveal";
import { reducedMotion } from "../../../lib/landing/motion";
import styles from "./motion.module.css";

// A statement whose words are grey until you read down to them, then black, one after another as you
// scroll (the reference's statement). One number per paragraph changes (--p, 0…1 through the
// reading band); each word works out its own shade from it in CSS, so a scroll costs one style write.

type Props = { text: string; className?: string };

/** The reading band: lighting starts when the paragraph's top is this far down the screen… */
const START = 0.88;
/** …and ends when its bottom is this far down. */
const END = 0.55;

export default function ScrollWords({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = splitWords(text);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      el.style.setProperty("--p", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      const from = h * START;
      const to = h * END - r.height;
      const p = Math.min(1, Math.max(0, (from - r.top) / (from - to)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <p ref={ref} className={`${styles.scrollWords} ${className ?? ""}`} style={{ "--n": words.length } as CSSProperties}>
      {words.map((w, i) => [
        i > 0 ? " " : null,
        <span key={i} style={{ "--i": i } as CSSProperties}>
          {w}
        </span>,
      ])}
    </p>
  );
}
