import type { Scenario } from "../engine/types";

// A formula you don't follow, as a Quick answer: V2Requests.formula ("What does this formula
// mean?" → "Each word becomes a weighted mix of the other words' values."). Fovea answers with its
// own model, under its own mark, never a provider's icon (AGENTS.md); the answer opens by itself.
export const formula: Scenario = {
  id: "formula",
  screen: "paper",
  agent: "fovea",
  project: "Quick answer",
  title: "What this formula means",
  quick: true,
  suggestions: [
    { name: "Quick answer", agent: "fovea", reason: "A short question" },
    { name: "Reading notes", agent: "claude-code", reason: "Same paper" },
    { name: "New chat", agent: "claude-code" },
  ],
  targets: [{ id: "formula", label: "the formula", required: true }],
  line: "What does this formula mean?",
  alternatives: ["What does this formula mean?", "Explain this like I know a little linear algebra."],
  beats: [{ line: "Reading the formula", pace: 1.6 }],
  answer: {
    outcome: "Each word becomes a weighted mix of the other words' values.",
    points: [
      { title: "QKᵀ", body: "scores how well each word's query matches every other word's key." },
      { title: "÷ √dₖ", body: "keeps those scores from growing with the vectors' size, so the softmax stays smooth." },
      { title: "softmax(…) V", body: "turns the scores into weights that add up to one, and mixes the value vectors by them." },
    ],
  },
  board: [
    { title: "This week's update", line: "Drafted weekly-update.md from the three.", agent: "codex", state: "complete", time: "14m" },
  ],
};
