"use client";

import { useEffect, useState, type RefObject } from "react";
import { Reveal } from "../../../lib/landing/tokens";

/** Whether the element has come into view (at `threshold` of it showing), once and for good. */
export function useInView(ref: RefObject<Element | null>, threshold: number = Reveal.threshold): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      // A tall block can never show 35 % of itself on a short screen: count it once its top is well in.
      { threshold: [0, threshold], rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}
