// The launch film as the landing page plays it (Oct 25, Yulun: "change the original launch video to this"): the demo
// film, recorded (landing/research/launch-film, its README), in place of the film drawn live in the page (film.ts,
// Film.tsx: on no page any more). v6 (Oct 27, Yulun's notes): a keyboard under the old way's typing, its keys lit as
// they're typed; FoveaOS right after Next (Spotify opened, a jazz playlist found and played, by voice); and the
// hardware card's line that Fovea isn't making glasses, rings or necklaces (gone since v9). v7 (Oct 28, Yulun: "i have
// changed the look of our app ui. update our website and launch video accordingly"): the same film with the notch as
// FoveaV1 draws it now: Wings (a black bar at the menu bar's height, "Listening", five small bars and a little light in
// its corner; Transcribing and its ring), the drop zone under it, Choose chat as one sentence, the board and the
// sessions in dark glass blended into the notch, and Claude Code's answer popping up by itself when it's done. Every
// key that sends reads "enter". v8 (Nov 8, Yulun: "our app's ui has changed fundamentally ... update the film as
// well"): the notch as the app draws it now (lib/landing/film/notch.ts): everything under it black, six bars, Ask your
// agent lit in Sea Glass and dictation plain, what's taken going to the notch in one move with the pile's count,
// Choose chat at its usual size and every chat a size up, the board as Focus, marks in one ink. v9 (Nov 9, Yulun: "we
// are actually thinking of making glasses, so remove not making glasses"): v8 with the hardware card's one line alone.
// Film A (Nov 9, Yulun: "change this onto the landing page"), "Another Way to Point": an animation of Fovea for Mac in
// the Native look, on Yulun's wallpaper only (landing/research/launch-film/comp/filmA.js). What Fovea does today (the
// notch, ⌘ and ⌘⌘, choosing the chat with ⌃⌃ on the app's every-chat page, the board as the app has it, dictation), then
// eye tracking in beta (routing marked Coming), then what's coming (Fovea Bar, something you wear), then the app's icon
// and "1 month free trial".
// Film S (Nov 15, Yulun: "i need the film to be under 1 min … pick the most iconic ones … not show the part of choosing
// chat … these goes to the user's own coding agents"): 56 s, cut from film A (comp/filmS.js). The marketing lines carry
// it: "The last layer between you and your agents."; normal use (two ⌘ captures, "Make this match this.", sent straight
// to the person's own Claude Code, the notch its chat at once, at work then its answer; no board); "Gaze isn’t your cursor. It’s your attention."; eye tracking
// in beta (the app's ring, each "this" a picture of the screen with the ring on the picture only, sent to Codex, its
// answer at the notch); "Then, something you wear."; the app's icon and "Just look, speak, and let agents work with you."
// Made small for the page from its 4K master by webcut (landing/README.md): HEVC at 1440p for a wide screen and at 720p for a phone, and H.264 at
// 1080p for a browser without HEVC; all at the film's 60 fps, the index first so it plays before the rest has come.
// Its sound is Scott Buckley's "Petrichor" (CC BY 4.0), credited under the film. Pure.

const DIR = "/landing/film";

export const FILM_VIDEO = {
  duration: 56.0,
  /** The film's parts: what your hand does today, what your eyes do (beta), what's coming. */
  chapters: [{ at: 0, title: "Your hand" }, { at: 24, title: "Your eyes" }, { at: 46, title: "Coming" }],
  /** In the order a browser tries them: the first whose `media` matches and whose `type` it can play. Each `type`
   *  is the file's own (tests/landing/video.test.mjs reads it from the file). */
  sources: [
    { src: `${DIR}/fovea-film-s-1440.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L150.B0, mp4a.40.2"', media: "(min-width: 900px)" },
    { src: `${DIR}/fovea-film-s-720.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L120.B0, mp4a.40.2"', media: "(max-width: 899px)" },
    { src: `${DIR}/fovea-film-s-1080.mp4`, type: 'video/mp4; codecs="avc1.64002A, mp4a.40.2"' },
  ],
  /** A still for where nothing plays until it is asked to (Reduce Motion): the fixed checkout, Claude Code's answer at
   *  the notch, "Your own Claude Code and Codex, from the notch." */
  poster: `${DIR}/fovea-film-s-poster.jpg`,
  music: {
    title: "Petrichor", by: "Scott Buckley", href: "https://www.scottbuckley.com.au",
    license: "CC BY 4.0", licenseHref: "https://creativecommons.org/licenses/by/4.0/",
  },
} as const;

/** The film in words, for screen readers: its cards, what is said, and what happens between. */
export const FILM_VIDEO_TRANSCRIPT = [
  "“The last layer between you and your agents.”",
  "An animation of Fovea for Mac, at real speed except where marked. In Safari, a shop's checkout has a small pay button that doesn't match the spec beside it. Someone presses fn and control, and the notch widens into a black bar that says Listening. They say “Make this match this.”, taking the button with ⌘ and a drag, then the spec's lines; each lands in the bar. fn and control again sends it to their own Claude Code, and the notch opens as its chat at once: the request, what was taken, and Claude Code at work, sped up. The page reloads with the button as the spec has it, and Claude Code's answer comes in there: “Done. The pay button is full width, 48 pt tall, in ink, with the lock before the label, as the spec has it.” “Your own Claude Code and Codex, from the notch.”",
  "“Gaze isn’t your cursor. It’s your attention.”",
  "Eye tracking, in beta. A signups chart and this week's merged changes. fn and control; a blue ring follows the person's eyes. They look at the chart's dip and say “Why did this chart drop?”, then at the captcha change, “Was it this change?”. Each time a picture of the screen goes to the notch with the spot they looked at marked on it; the pointer never moves. fn and control again sends it to their own Codex, and the notch opens as its chat at once: under the request, a note for each picture says the phrase said with it and that the blue outline marks where the person was looking. Codex's answer comes in there: “Yes. Sign-ups fell right after Thursday's captcha change: the form got a step longer, and phones dropped the most.” “Your eyes never click. They only say what “this” means.”",
  "Coming: then, something you wear.",
  "Fovea, its app icon. “Just look, speak, and let agents work with you.” Fovea is not affiliated with the companies named.",
  `Music: “${FILM_VIDEO.music.title}” by ${FILM_VIDEO.music.by}.`,
].join(" ");
