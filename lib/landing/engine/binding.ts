// Binding: connecting "this one", "that one", "the second one" in what was said to the referents
// taken, in the order they were taken. The page shows each binding as the referent's number beside
// the words, the same number its card carries in the stack.
//
// Rules, in order:
//   • an ordinal ("the first one", "the second", "the 3rd screenshot") binds to that referent;
//   • "these" / "those" / "them" bind to every referent;
//   • "this" / "that" (alone or with "one" or a noun) bind, in order, to the referents not yet bound;
//   • time phrases are not deictic: "this week", "this afternoon", "that day"…

import type { Binding } from "./types";

const ORDINALS: Record<string, number> = {
  first: 1, "1st": 1, second: 2, "2nd": 2, third: 3, "3rd": 3, fourth: 4, "4th": 4, fifth: 5, "5th": 5,
};

const TIME = /^(week|weekend|month|year|morning|afternoon|evening|night|time|day|quarter|sprint|spring|summer|fall|autumn|winter)\b/i;

/** Nouns a deictic word may carry ("this button", "that chart"); they join the bound span. */
const NOUN = /^(one|button|card|chart|photo|picture|screenshot|line|paragraph|formula|file|tab|thread|ticket|list|part|bit|thing|page|section|error|row|cell|image|table)\b/i;

export function bindReferences(text: string, referentCount: number): Binding[] {
  if (referentCount === 0) return [];
  const bindings: Binding[] = [];
  const taken = new Set<number>();
  const words = [...text.matchAll(/[A-Za-z0-9']+/g)].map((m) => ({ word: m[0], start: m.index!, end: m.index! + m[0].length }));

  // Ordinals first, so "this one … the second one" leaves 1 for "this one".
  const ordinalSpans: Binding[] = [];
  for (let i = 0; i < words.length; i++) {
    const n = ORDINALS[words[i].word.toLowerCase()];
    if (!n || n > referentCount) continue;
    const before = words[i - 1]?.word.toLowerCase();
    const start = before === "the" ? words[i - 1].start : words[i].start;
    const next = words[i + 1];
    const end = next && NOUN.test(next.word) ? next.end : words[i].end;
    ordinalSpans.push({ start, end, referent: n });
    taken.add(n);
  }

  for (let i = 0; i < words.length; i++) {
    const w = words[i].word.toLowerCase();
    const next = words[i + 1];
    if (w === "these" || w === "those" || w === "them") {
      if (next && TIME.test(next.word)) continue;
      const end = next && NOUN.test(next.word) ? next.end : words[i].end;
      for (let n = 1; n <= referentCount; n++) bindings.push({ start: words[i].start, end, referent: n });
      continue;
    }
    if (w !== "this" && w !== "that") continue;
    if (next && TIME.test(next.word)) continue;
    // "that" as a conjunction ("says that we…") is not deictic: it needs a noun or "one" after it,
    // or to end the clause.
    const carriesNoun = next && NOUN.test(next.word);
    const endsClause = !next || /[.,;:?!]/.test(text.slice(words[i].end, next.start));
    if (w === "that" && !carriesNoun && !endsClause) continue;
    let n = 1;
    while (taken.has(n) && n <= referentCount) n++;
    if (n > referentCount) continue;
    taken.add(n);
    bindings.push({ start: words[i].start, end: carriesNoun ? next.end : words[i].end, referent: n });
  }

  return [...ordinalSpans, ...bindings].sort((a, b) => a.start - b.start || a.referent - b.referent);
}

/** The request as parts for drawing: plain runs, and bound runs carrying their referent numbers. */
export function requestParts(text: string, bindings: Binding[]): (string | { text: string; referents: number[] })[] {
  const parts: (string | { text: string; referents: number[] })[] = [];
  let at = 0;
  const spans = new Map<string, { start: number; end: number; referents: number[] }>();
  for (const b of bindings) {
    const key = `${b.start}:${b.end}`;
    const span = spans.get(key) ?? { start: b.start, end: b.end, referents: [] };
    span.referents.push(b.referent);
    spans.set(key, span);
  }
  for (const span of [...spans.values()].sort((a, b) => a.start - b.start)) {
    if (span.start < at) continue;
    if (span.start > at) parts.push(text.slice(at, span.start));
    parts.push({ text: text.slice(span.start, span.end), referents: span.referents });
    at = span.end;
  }
  if (at < text.length) parts.push(text.slice(at));
  return parts;
}
