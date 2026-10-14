// Every word on the landing page. House rules (app-ui-v1/Prototypes/OnboardingCore/Copy.swift and
// AGENTS.md): sentence case; no exclamation marks; no speed claims or metrics; nothing Fovea can't
// show (eye tracking is in beta, so eyes are "soon"; sending to agents is simulated in Fovea 1.0,
// docs/v1/V1.md, so it is "in preview"); the product's own nouns.
//
// Oct 10. The page says what Fovea wants to become, the way Sesame's and Instinct's do, not what
// today's app does step by step: the input every agent goes through, starting with work. So there
// is no demo (the onboarding shows the app, once). The words are Yulun's; the design (landing/README.md,
// landing/REFERENCES.md) adds no sentences, only the nav's page names and the buttons.

export type Block =
  /** A short line under the title, said on its own ("Just for now."). */
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: readonly { term: string; text: string }[] }
  | { kind: "note"; text: string }
  | { kind: "download" };

export type Page = {
  id: string;
  /** The page's name in the nav. */
  label: string;
  title: string;
  blocks: readonly Block[];
};

export const LandingCopy = {
  meta: {
    title: "Fovea · Talk to your agents from the notch. Just for now.",
    description:
      "Fovea is the way in for every agent: your voice and, soon, your eyes. It starts in your workspace.",
  },
  markLabel: "Fovea",
  download: "Download for Mac",
  /** The pill nav at the top: the pages it links to (by id), and its button. */
  nav: {
    label: "Pages",
    pages: ["today", "next", "context"],
    download: "Download",
  },
  /** The hero's second button, beside Download. */
  secondary: "What leaves your Mac",
  /** What the notch on the hero's picture says when a request lands. */
  sent: "Sent",
  toTop: "Back to top",
  toHome: "Back to Fovea",
  pages: [
    {
      id: "what",
      label: "Fovea",
      title: "Talk to your agents from the notch.",
      blocks: [{ kind: "lead", text: "Just for now." }, { kind: "download" }],
    },
    {
      id: "today",
      label: "Today",
      title: "Fovea starts in your workspace.",
      blocks: [
        {
          kind: "p",
          text: "Just your voice, and soon, your eyes, and tasks automatically assigned to the chat it belongs to. Look at it, say it, and get it done.",
        },
        { kind: "p", text: "No tab switching. No manual re-explaining, copying, and pasting." },
        { kind: "note", text: "Fovea for Mac works with Claude Code and Codex, in preview. More are coming." },
      ],
    },
    {
      id: "next",
      label: "Next",
      title: "Then any device. Then anywhere.",
      blocks: [
        {
          kind: "list",
          items: [
            {
              term: "Fovea Bar.",
              text: "A small bar that attaches to any computer, a laptop, a desktop or a tablet. All your gaze tracking data stay local.",
            },
            {
              term: "Then, something you wear.",
              text: "Small and light enough to sit on whatever you already wear. We're not making another pair of glasses, a necklace or a ring: whatever you choose, Fovea attaches to it, almost unnoticed.",
            },
            {
              term: "Input, not another screen.",
              text: "Others are building better displays. Fovea builds the way in: where you look, what you say, and what's worth keeping.",
            },
            {
              term: "From anywhere.",
              text: "Your agents, and the devices around you, a sentence away wherever you are.",
            },
          ],
        },
      ],
    },
    {
      id: "context",
      label: "Why",
      title: "What personal agents are missing is you.",
      blocks: [
        {
          kind: "p",
          text: "What stands between us and agents that are truly personal isn't how smart they are. It's context. An agent can't know you until it has been through the day with you: what you saw, what you heard, what you said, how you actually felt, and what you actually liked.",
        },
        {
          kind: "p",
          text: "Fovea starts at your desk, and truly personal agents come closer with everything we build next.",
        },
      ],
    },
    {
      id: "start",
      label: "Start",
      title: "Today, the notch. Next, everything you look at.",
      blocks: [
        { kind: "download" },
      ],
    },
  ] satisfies readonly Page[],
  /** Not on the main page: its own page (app/(landing)/what-leaves-your-mac), linked from the foot. */
  leaves: {
    href: "/what-leaves-your-mac",
    title: "What leaves your Mac",
    body: "Your captures, recordings and screenshots stay on this Mac. Fovea turns your voice into words on the Mac itself where your language allows; otherwise Apple's speech recognition does it. When you send a request, it goes to Claude Code or Codex, the copy already signed in on your Mac, and from there to that agent's own service. Fovea's servers hold your account and nothing else. The Gaze Collector keeps every recording on your Mac until you review it and choose to send it.",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    contactHref: "mailto:hello@hellofovea.com",
    copyright: "© 2026 Fovea",
  },
} as const;

export type PageId = (typeof LandingCopy.pages)[number]["id"];

/** A page by its id, for the section that draws it. */
export function page(id: PageId): Page {
  const found = LandingCopy.pages.find((p) => p.id === id);
  if (!found) throw new Error(`No page ${id}`);
  return found;
}

/** A page's blocks of one kind, in order. */
export function blocks<K extends Block["kind"]>(p: Page, kind: K): Extract<Block, { kind: K }>[] {
  return p.blocks.filter((b): b is Extract<Block, { kind: K }> => b.kind === kind);
}
