import type { Scenario } from "../engine/types";

// This week's update, sent to Codex: the onboarding's first real task (docs/onboarding/
// ONBOARDING.md, "the weekly update gathered from a chat and three tabs"). Take the whole screen
// (Maya's ask and her signups chart), the merged pull requests, and the support tickets, and say
// "Draft this week's update from these." The draft lands on the desktop as weekly-update.md.
export const weeklyUpdate: Scenario = {
  id: "weeklyUpdate",
  screen: "weekly",
  agent: "codex",
  project: "field-notes",
  title: "This week's update",
  suggestions: [
    { name: "This week's update", agent: "codex", reason: "Every Friday" },
    { name: "Release notes", agent: "claude-code", reason: "Same project" },
    { name: "New chat", agent: "codex" },
  ],
  targets: [
    { id: "pr-list", label: "the merged pull requests", required: true, tab: 1, tabTitle: "Merged pull requests" },
    { id: "ticket-list", label: "this week's tickets", required: true, tab: 2, tabTitle: "Support" },
  ],
  line: "Draft this week's update from these.",
  alternatives: ["Draft this week's update from these.", "Turn these into a short update for Maya."],
  beats: [
    { line: "Reading your request · 3 screenshots", pace: 1.2 },
    { line: "Writing weekly-update.md", diff: "+24", pace: 2.4, lands: true },
    { line: "Checking the numbers against the chart", pace: 1.4 },
  ],
  answer: {
    outcome: "Drafted weekly-update.md from the three, ready for Maya.",
    points: [
      { title: "Signups.", body: "Up 18 % on last week, from her chart." },
      { title: "Shipped.", body: "Four pull requests: trail cards, the map tiles cache, offline maps, the sign-in fix." },
      { title: "Support.", body: "Six tickets, two still open, both about offline maps." },
    ],
    openFile: "weekly-update.md",
    edited: "Wrote 1 file",
  },
  board: [
    { title: "Trail cards line up", line: "The middle button lines up with the other two now.", agent: "claude-code", state: "complete", time: "9m" },
    { title: "Offline maps", line: "Choose a cache size", agent: "claude-code", state: "needsYou", time: "2m" },
  ],
};
