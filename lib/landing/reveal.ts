import { Reveal } from "./tokens";

// Lines rise in a word at a time. Splitting is pure so it can be tested: the words keep the text
// exactly, in order.

/** The text's words, split at single spaces. */
export function splitWords(text: string): string[] {
  return text.split(" ").filter((w) => w.length > 0);
}

/** When word i of n starts, in seconds: the stagger, squeezed so the last starts by maxSpread. */
export function wordDelay(i: number, n: number, stagger: number = Reveal.wordStagger): number {
  if (n <= 1) return 0;
  const step = Math.min(stagger, Reveal.maxSpread / (n - 1));
  return Math.round(i * step * 1000) / 1000;
}
