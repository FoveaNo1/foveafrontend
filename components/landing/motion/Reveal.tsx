"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { splitWords, wordDelay } from "../../../lib/landing/reveal";
import { useInView } from "./useInView";

// A line that rises in a word at a time when it comes into view, at the onboarding's pace
// (app/(landing)/landing.css has the rule). The words are rendered on the server, so the text is
// whole for readers and search, and nothing moves when the script arrives. `after` is a second
// line said in grey, the reference's way ("Talk to your agents from the notch. Just for now.").

type Props = {
  text: string;
  /** Words that follow in the second colour, in the same line. */
  quiet?: string;
  as?: ElementType;
  className?: string;
  quietClassName?: string;
  id?: string;
  /** Seconds after it comes into view before the first word. */
  after?: number;
  /** Shown by the caller (a sequence) rather than by coming into view. */
  shown?: boolean;
};

export default function Reveal({ text, quiet, as: Tag = "p", className, quietClassName, id, after = 0, shown }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const on = shown ?? inView;
  const loud = splitWords(text);
  const soft = quiet ? splitWords(quiet) : [];
  const n = loud.length + soft.length;
  const words = (list: string[], offset: number): ReactNode[] =>
    list.flatMap((w, i) => [
      i > 0 ? " " : null,
      <span key={offset + i} className="w" style={{ "--d": wordDelay(offset + i, n) } as CSSProperties}>
        {w}
      </span>,
    ]);
  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal=""
      data-shown={on ? "" : undefined}
      style={{ "--after": `${after}s` } as CSSProperties}
    >
      {words(loud, 0)}
      {soft.length > 0 && (
        <>
          {" "}
          <span className={quietClassName}>{words(soft, loud.length)}</span>
        </>
      )}
    </Tag>
  );
}
