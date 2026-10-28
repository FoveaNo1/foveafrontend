// The landing page's words (Yulun's, unchanged), for components/book/Landing.tsx and the foot of every page in its type.
// `today` (Oct 16) is new: the plain explanation of the product the team asked for, drafted for Yulun's review.
// The Chinese edition (/zh) was taken down on Oct 13: landing/backups/2026-10-13-chinese-edition.tgz.

export const BookCopy = {
  /** The one line a first screen opens on (the film's opening card's words, Oct 17). */
  hero: "Stay in your window. Talk to any agent from the notch.",
  title: "Talk to your agents from the notch.",
  titleSoft: "Just for now.",
  download: "Download for Mac",
  requirements: "macOS 14 or later · Apple silicon",
  dancerAlt: "A dancer on yellow, a red scarf swirling round her.",
  /** The film, first: its label, and one plain sentence under it. */
  film: "A film",
  /** What Fovea does today, plainly (part 1). */
  today: {
    definition: "Fovea lives in your MacBook’s notch. Point at anything on your screen, say what you want, and it reaches the right chat in Claude Code or Codex, with what you pointed at.",
    steps: [
      ["Press a key.", "The notch opens and listens, over whatever you’re working in. Nothing to switch to."],
      // Oct 18, Yulun's keys: ⌘ and a drag, ⌘ twice the whole screen, no key for words or files (a draft line)
      ["Point at it.", "Press ⌘ and drag over anything on your screen, or ⌘ twice for all of it. Words you select, and a file you drag onto the notch, need no key."],
      ["Say it.", "It reaches the right chat in Claude Code or Codex, with what you pointed at, and what comes back shows in the notch."],
    ] as [string, string][],
    note: "Fovea for Mac works with Claude Code and Codex, in preview. More are coming.",
  },
  /** Under part 2's "soon, your eyes": what the eyes will and won't do. */
  eyes: "Soon, your eyes: context, never control. They won’t move the pointer, click or send; they only tell Fovea what you mean by “this”.",
  s1: {
    lead: "Fovea starts in your workspace.",
    body: "Just your voice, and soon, your eyes, and tasks automatically assigned to the chat it belongs to. Look at it, say it, and get it done.",
    body2: "No tab switching. No manual re-explaining, copying, and pasting.",
  },
  s2: {
    lead: "Then any device. Then anywhere.",
    items: [
      ["Fovea Bar.", "A small bar that attaches to any computer, a laptop, a desktop or a tablet. All your gaze tracking data stay local."],
      ["Then, something you wear.", "Small and light enough to sit on whatever you already wear. We’re not making another pair of glasses, a necklace or a ring: whatever you choose, Fovea attaches to it, almost unnoticed."],
      ["Input, not another screen.", "Others are building better displays. Fovea builds the way in: where you look, what you say, and what’s worth keeping."],
      ["From anywhere.", "Your agents, and the devices around you, a sentence away wherever you are."],
    ] as [string, string][],
  },
  s3: {
    title: "What personal agents are missing is you.",
    before: "What stands between us and agents that are truly personal isn’t how smart they are.",
    context: "It’s context.",
    after: "An agent can’t know you until it has been through the day with you:",
    steps: ["what you saw,", "what you heard,", "what you said,", "how you actually felt,", "and what you actually liked."],
    coda: "Fovea starts at your desk, and truly personal agents come closer with everything we build next.",
  },
  /** After the film (Oct 24): what Fovea does today, one thing at a time, each beside a scene of someone doing it on
   *  their Mac (components/book/showcase). Yulun's: item 1's title and words, item 2's words, item 3's title and words
   *  (Oct 27); the rest are drafts for review. `label` says what the scene shows, for screen readers. */
  showcase: {
    title: "Your agents, a sentence away.",
    items: [
      {
        id: "point", title: "Stay in the window.",
        text: "Take any attachments, talk to your Codex or Claude Code through Fovea.",
        label: "A Mac’s screen in dark mode. ⌘ and a drag over a button that sits low, again over one that’s right, and a spec dragged onto the notch; “Line this up with this one, like the spec.” is said and sent to Codex, which lines the button up, all without leaving the browser.",
      },
      {
        id: "notch", title: "Keep every agent moving.",
        text: "Every Claude Code and Codex chat you have running waits in the notch. Approve what it asks, read what it did, and ask a follow-up without leaving your window.",
        label: "A Mac’s screen in dark mode. The board under the notch: Claude Code asks to run npm test and is allowed; Codex’s finished answer opens; a follow-up, “Mention the snow banner too.”, is asked by voice; then the chat is pulled out of the notch into a window of its own, where the new answer comes in.",
      },
      {
        // Oct 24, Yulun's title; Oct 27, Yulun's words
        id: "talk", title: "Talk, and it cleans up for you.",
        text: "Press fn and think out loud: change your mind, come back to a point, and add attachments.",
        label: "A Mac’s screen in dark mode, an email open. fn is pressed and a list is talked through: the pricing page, the demo video, the press kit and the FAQ; then “Actually, drop the video”; the banner cut off on mobile, taken with ⌘; then one more for Friday, the launch email. fn again, and the email reads as a list of four without the video, the late item in it, and the banner’s picture after the words.",
      },
    ],
  },
  last: "Today, the notch. Next, everything you look at.",
  /** Beside "Download for Mac" under the film (Oct 18, Yulun's words): the way to Fovea Vision. */
  visionLink: "Learn about Fovea’s vision",
  foot: { vision: "Fovea Vision", pricing: "Pricing", account: "Account", feedback: "Feedback", leaves: "What leaves your Mac", privacy: "Privacy", terms: "Terms", contact: "Contact" },
};
