"use client";

import { useEffect, useRef } from "react";

// A stretch of scroll that holds one screen in place (a sticky stage, the way Apple's and Screen Studio's pages hold
// a picture while it changes) and turns how far through it the reader is into numbers for the stage's CSS: k, from 0
// to 1, and whatever the hero works out from it (`vars`, a pure function of k and the stage's size, like the film is
// of time). Under Reduce Motion nothing is held: the stage shows its end state and the page simply scrolls.

export type Stage = { w: number; h: number; el: HTMLElement };
export type PinVars = (k: number, stage: Stage) => Record<string, string | number>;

type Props = {
  /** How much scroll the hold lasts, as CSS (e.g. "120vh"). */
  length: string;
  vars: PinVars;
  onProgress?: (k: number) => void;
  className?: string;
  label?: string;
  children: React.ReactNode;
};

export default function Pin({ length, vars, onProgress, className = "", label, children }: Props) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cb = useRef({ vars, onProgress });
  useEffect(() => { cb.current = { vars, onProgress }; });

  useEffect(() => {
    const s = section.current, st = stage.current;
    if (!s || !st) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) s.classList.add("still");
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = s.getBoundingClientRect();
      const span = r.height - st.clientHeight;
      const k = reduce ? 1 : span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
      const v = cb.current.vars(k, { w: st.clientWidth, h: st.clientHeight, el: st });
      for (const [name, value] of Object.entries(v)) s.style.setProperty(name, String(value));
      s.style.setProperty("--k", k.toFixed(4));
      s.dataset.open = k > 0.97 ? "1" : "0";
      cb.current.onProgress?.(k);
    };
    const later = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    // fonts and the film settle after the first paint; measure again once they have
    const settle = setTimeout(apply, 400);
    addEventListener("scroll", later, { passive: true });
    addEventListener("resize", later);
    return () => { removeEventListener("scroll", later); removeEventListener("resize", later); cancelAnimationFrame(raf); clearTimeout(settle); };
  }, []);

  return (
    <section ref={section} className={`pin ${className}`} style={{ ["--len" as string]: length }} aria-label={label}>
      <div ref={stage} className="pin-stage">{children}</div>
    </section>
  );
}
