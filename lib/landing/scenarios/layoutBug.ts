import type { Scenario } from "../engine/types";

// A layout bug, sent to Claude Code: on a trail site at localhost, the middle card's button sits
// 7 pt low and is padded wider than the other two. Take the bad one, then the good one, and say
// "Make this one line up with that one." The beats follow V2Requests.code's shape (read the
// request, edit, test), with web file names; the change lands on the page when the edit is done.
export const layoutBug: Scenario = {
  id: "layoutBug",
  screen: "fieldNotes",
  agent: "claude-code",
  project: "field-notes",
  title: "Trail cards line up",
  suggestions: [
    { name: "Trail cards line up", agent: "claude-code", reason: "Last sent here, 4m ago" },
    { name: "Field Notes site", agent: "codex", reason: "Same files" },
    { name: "New chat", agent: "claude-code" },
  ],
  targets: [
    { id: "button-lake", label: "the middle card's button", required: true },
    { id: "button-ridge", label: "the first card's button", required: true },
  ],
  line: "Make this one line up with that one.",
  alternatives: ["Make this one line up with that one.", "Give this button the same padding as that one."],
  beats: [
    { line: "Reading your request · 2 screenshots", pace: 1.2 },
    { line: "Editing FeatureCard.tsx", diff: "+3 −1", pace: 2.2, lands: true },
    { line: "Running npm test", pace: 1.6 },
  ],
  answer: {
    outcome: "The middle button lines up with the other two now.",
    points: [
      { title: "Position.", body: "The Lake basin card's button sat 7 pt low; it now sits on the cards' shared baseline in FeatureCard.tsx." },
      { title: "Padding.", body: "Its padding matches the first card's, 8 by 14, as in your second screenshot." },
      { title: "Checked.", body: "npm test passes." },
    ],
    openFile: "FeatureCard.tsx",
    edited: "Edited 1 file",
  },
  board: [
    { title: "Weekly update", line: "Reading the merged PRs", agent: "codex", state: "working", time: "4m" },
    { title: "Map tiles cache", line: "The tiles now expire after a day.", agent: "claude-code", state: "complete", time: "12m" },
  ],
};
