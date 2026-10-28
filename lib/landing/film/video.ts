// The launch film as the landing page plays it (Oct 25, Yulun: "change the original launch video to this"): the demo
// film, recorded (landing/research/launch-film, its README), in place of the film drawn live in the page (film.ts,
// Film.tsx: on no page any more). v6 (Oct 27, Yulun's notes): a keyboard under the old way's typing, its keys lit as
// they're typed; FoveaOS right after Next (Spotify opened, a jazz playlist found and played, by voice); and the
// hardware card's "Fovea is not making another pair of glasses, rings, or necklaces." Every key that sends reads
// "enter". Made small for the page from
// its 4K master by webcut (landing/README.md): HEVC at 1440p for a wide screen and at 720p for a phone, and H.264 at
// 1080p for a browser without HEVC; all at the film's 60 fps, the index first so it plays before the rest has come.
// Its sound is Scott Buckley's "Petrichor" (CC BY 4.0), credited under the film. Pure.

const DIR = "/landing/film";

export const FILM_VIDEO = {
  duration: 121.0,
  /** The film's parts, named as its own cards name them: today's way ("Today, it takes all this."), Fovea, Next. */
  chapters: [{ at: 0, title: "Today" }, { at: 14.5, title: "Fovea" }, { at: 69.9, title: "Next" }],
  /** In the order a browser tries them: the first whose `media` matches and whose `type` it can play. Each `type`
   *  is the file's own (tests/landing/video.test.mjs reads it from the file). */
  sources: [
    { src: `${DIR}/fovea-film-v6-1440.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L150.B0, mp4a.40.2"', media: "(min-width: 900px)" },
    { src: `${DIR}/fovea-film-v6-720.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L120.B0, mp4a.40.2"', media: "(max-width: 899px)" },
    { src: `${DIR}/fovea-film-v6-1080.mp4`, type: 'video/mp4; codecs="avc1.64002A, mp4a.40.2"' },
  ],
  /** The title card, for where nothing plays until it is asked to (Reduce Motion). The film itself opens on black,
   *  as the notch it grows from is. */
  poster: `${DIR}/fovea-film-v6-poster.jpg`,
  music: {
    title: "Petrichor", by: "Scott Buckley", href: "https://www.scottbuckley.com.au",
    license: "CC BY 4.0", licenseHref: "https://creativecommons.org/licenses/by/4.0/",
  },
} as const;

/** The film in words, for screen readers: its cards, what is said, and what happens between. */
export const FILM_VIDEO_TRANSCRIPT = [
  "“Imagine interacting with agents, effortlessly.”",
  "A shop's checkout, its pay button running off its card. “Today, it takes all this.”: a screenshot, finding it in Finder, switching through every agent's window, typing it all out, key after key lighting up on the keyboard, slowly and then faster and faster. “Your agents only know what you tell them.”",
  "Fovea. “Stay in your window, dispatch any agent from the notch.”",
  "In Safari, someone presses fn and control and says “The pay button looks like this. Make it match this, and use this icon.”, taking the broken button with ⌘, selecting the spec's lines and dragging the lock icon onto the notch; fn and control again, and Choose chat has picked Checkout polish in Claude Code; enter sends it there. Claude Code works, sped up; the page reloads with the button as the spec has it, and the answer waits in the notch: “Done. The pay button is full width, 48 pt tall, in ink, with the lock before the label, as the spec has it.” No screenshots. No switching. No explaining.",
  "Then the whole screen, with ⌘ twice, and a question, moved with a click to Codex's Signups dashboard: “What's wrong with this chart?” Back in seconds, the answer opens in the notch: “Nothing's wrong with signups. The axis starts at 2,270, so a 3% dip on Thursday looks like a crash. Start it at zero and the week is flat.”",
  "Wherever you type: dictated into Slack, “Fix is live. Can you check it on your phone?”",
  "“It works with the agents you already use.” “Stay in the window you are in.”",
  "Next. FoveaOS. “Say it, and your Mac does it.” In Safari, someone presses fn and control and says “Open Spotify, find a jazz playlist, and play it.”; the notch ticks off the three as FoveaOS does them: Spotify opens, finds Late Night Jazz and plays Miles Davis's So What, with nothing clicked or typed.",
  "“All your agents, as one.” One sentence, “Fix the bug Dana found, and book dinner for Friday.”, finds its own chats while you watch: Checkout polish in Claude Code, on Opus 5.5, and Dinner plans in Manus. “And soon, your eyes. Not a cursor but a brand new way of capturing attention.”: “Add this, and these, to the update for Maya.”, where the eyes rested. “There's only so much hardware one can wear. Fovea is not making another pair of glasses, rings, or necklaces.” “Talk to your agents from anywhere.”: “Did Dana like the render?” “She loved it. She wants a blue one too.” “It lives the day with you. Fovea knows the rest.”",
  "Fovea. The last layer between you and your agents. Stay tuned for the update: hellofovea.com. Everything after Next is in development.",
  `Music: “${FILM_VIDEO.music.title}” by ${FILM_VIDEO.music.by}.`,
].join(" ");
