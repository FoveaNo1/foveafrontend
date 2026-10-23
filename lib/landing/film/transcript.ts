// The film, in words, for screen readers (the film itself is drawn and silent): its cards, what the person says, and
// what happens between. Pure.

import { CARDS, line } from "./content";

const said = (...ids: string[]) => ids.map((id) => `“${line(id).plain}”`);

export const TRANSCRIPT = [
  CARDS.title.text,
  "In Blender, pointing at a glaze on the reference board, a light in the project's folder and a line of the client's email:", ...said("vase"),
  "Claude Code glazes, lights and frames the vase while you watch. Minutes later, the notch shows it done, and what changed opens from there. Then, taking the whole screen, the client's email on it:", ...said("send"),
  "The reply is written in the Mail that is already open, the render attached, and the draft comes back to the notch. It is never sent for you.",
  `${CARDS.eyes.text} ${CARDS.eyes.small}`, `${CARDS.agents.text} ${CARDS.agents.small}`, ...said("maya"),
  "Nobody picks a chat: a ring circles in the chat's place while Fovea thinks, and the weekly update appears there; then it picks the model. Opened, the attachments are the chart and the merged pull requests the eyes rested on, exactly as they were on screen.",
  CARDS.next.text, `${CARDS.bar.text} ${CARDS.bar.small}`, `${CARDS.wear.text} ${CARDS.wear.small}`, ...said("trail"), CARDS.you.text, CARDS.last.text,
].join(" ");
