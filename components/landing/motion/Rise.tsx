"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "./useInView";

// A block that rises in whole, as the onboarding's parts do (18 px, blur 6, 0.7 s), when it comes
// into view or when its sequence says so.

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds after it comes into view. */
  after?: number;
  shown?: boolean;
  style?: CSSProperties;
};

export default function Rise({ children, className, after = 0, shown, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const on = shown ?? inView;
  return (
    <div
      ref={ref}
      className={className}
      data-rise=""
      data-shown={on ? "" : undefined}
      style={{ "--after": `${after}s`, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
