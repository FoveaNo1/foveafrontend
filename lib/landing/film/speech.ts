// What the person says: each line's words and when each is spoken, and the voice's loudness over time, which drives
// the waveform so the bars move with the subtitles. In a line, [square brackets] mark words that point at
// a capture (underlined grey) and {braces} words that point where the eyes are (underlined in the ring's blue). Pure.

import { clamp } from "./ease";
import { noise } from "./noise";
import { SPEECH } from "./tokens";

export type Mark = "" | "capture" | "gaze";
export type Word = { text: string; mark: Mark; at: number };
export type Line = { id: string; start: number; words: Word[]; end: number; plain: string };

/** A line from its first word's time, a word every SPEECH.word. `cues` holds a word back until a moment (film seconds,
 *  by the word's index): a person says "this" as they point, and the rest of the line follows from there. */
export function speak(id: string, start: number, text: string, cues: Record<number, number> = {}): Line {
  const words: Word[] = [];
  let at = start, mark: Mark = "";
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let w = raw;
    if (w.startsWith("[")) { mark = "capture"; w = w.slice(1); }
    if (w.startsWith("{")) { mark = "gaze"; w = w.slice(1); }
    const closes = /[\]}]/.test(w);
    w = w.replace(/[\]}]/g, "");
    at = Math.max(at, cues[words.length] ?? at);
    words.push({ text: w, mark, at });
    if (closes) mark = "";
    at += SPEECH.word + (/[,;:]$/.test(w) ? SPEECH.comma : 0) + (/[.?!]$/.test(w) ? SPEECH.comma : 0);
  }
  const end = words[words.length - 1].at + SPEECH.word;
  return { id, start, words, end, plain: words.map((w) => w.text).join(" ") };
}

/** How many of the line's words have been said by t. */
export const shown = (line: Line, t: number) => line.words.filter((w) => w.at <= t).length;

/** The line's own opacity: it comes in with its first word and leaves SPEECH.hold after its last. */
export function lineOpacity(line: Line, t: number) {
  if (t < line.start || t > line.end + SPEECH.hold + 0.3) return 0;
  return Math.min(clamp((t - line.start) / 0.15), clamp((line.end + SPEECH.hold + 0.3 - t) / 0.3));
}

/** The voice's level 0…1: a swell under each word, a little roughness, silence between lines. */
export function level(lines: Line[], t: number): number {
  let v = 0;
  for (const line of lines) {
    if (t < line.start - 0.1 || t > line.end + 0.2) continue;
    for (const w of line.words) {
      const d = t - w.at;
      if (d < -0.05 || d > SPEECH.word + 0.08) continue;
      const p = clamp((d + 0.05) / (SPEECH.word + 0.13));
      v = Math.max(v, Math.sin(p * Math.PI) * (0.78 + 0.22 * noise(w.at * 100, t, 14)));
    }
  }
  return clamp(v);
}
