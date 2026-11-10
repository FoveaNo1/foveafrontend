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
// Made small for the page from its 4K master by webcut (landing/README.md): HEVC at 1440p for a wide screen and at 720p for a phone, and H.264 at
// 1080p for a browser without HEVC; all at the film's 60 fps, the index first so it plays before the rest has come.
// Its sound is Scott Buckley's "Petrichor" (CC BY 4.0), credited under the film. Pure.

const DIR = "/landing/film";

export const FILM_VIDEO = {
  duration: 91.0,
  /** The film's parts: what your hand does today, what your eyes do (beta), what's coming. */
  chapters: [{ at: 0, title: "Your hand" }, { at: 42.8, title: "Your eyes" }, { at: 78.4, title: "Coming" }],
  /** In the order a browser tries them: the first whose `media` matches and whose `type` it can play. Each `type`
   *  is the file's own (tests/landing/video.test.mjs reads it from the file). */
  sources: [
    { src: `${DIR}/fovea-film-a-1440.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L150.B0, mp4a.40.2"', media: "(min-width: 900px)" },
    { src: `${DIR}/fovea-film-a-720.mp4`, type: 'video/mp4; codecs="hvc1.1.6.L120.B0, mp4a.40.2"', media: "(max-width: 899px)" },
    { src: `${DIR}/fovea-film-a-1080.mp4`, type: 'video/mp4; codecs="avc1.64002A, mp4a.40.2"' },
  ],
  /** The title card, for where nothing plays until it is asked to (Reduce Motion). */
  poster: `${DIR}/fovea-film-a-poster.jpg`,
  music: {
    title: "Petrichor", by: "Scott Buckley", href: "https://www.scottbuckley.com.au",
    license: "CC BY 4.0", licenseHref: "https://creativecommons.org/licenses/by/4.0/",
  },
} as const;

/** The film in words, for screen readers: its cards, what is said, and what happens between. */
export const FILM_VIDEO_TRANSCRIPT = [
  "An animation of Fovea for Mac, at real speed except where marked.",
  "In Safari, a shop's checkout has a small pay button that doesn't match the spec beside it. Someone presses fn and control, and the notch widens into a black bar that says Listening. They say “Make this match this.”, taking the button with ⌘ and a drag, then the spec's lines; each lands in the bar. fn and control again, and Choose chat opens on the chat they last sent to. They press control twice and the notch drops down to every chat: suggested ones, a new chat with Fovea, Claude Code or Codex, and the rest by today, this week and earlier. They pick Checkout polish in Claude Code; enter sends it there. The board shows the sessions that are running. Claude Code works, sped up, and the page reloads with the button as the spec has it. “Stay in your window. Talk to any agent from the notch.”",
  "Then the whole screen, with ⌘ twice, and a question, “What's wrong with this chart?”. Control twice again, and they pick Signups dashboard in Codex. Back in seconds, the answer opens in the notch: “The axis starts at 2,270, so Thursday's 3% dip looks like a crash. The dip is real, though: sign-ups fell right after Thursday's deploy.”",
  "Claude Code asks to run its tests; 1 allows it. Dictated into Messages: “Fix is live. Can you check it on your phone?” Claude Code is done: “All 42 tests pass.”",
  "“Your hand points. So do your eyes.” Eye tracking, in beta: they look at the chart and then at a merged change, saying “Why did this chart drop? Was it this change?”, and Fovea takes what they were looking at, with the pointer never moving. “Today, you pick the chat. Coming: Fovea picks the chat and the model for you.” “Your eyes never click. They only say what “this” means.”",
  "With Mail in front, they look at Messages and say “Running five minutes late.”; the words go where they look. “Paste where you look.” The Gaze Collector: “Fitted to your eyes in ten minutes. In beta.”",
  "Coming: Fovea Bar. Then, something you wear.",
  "Fovea, its app icon. 1 month free trial. Fovea is not affiliated with the companies named.",
  `Music: “${FILM_VIDEO.music.title}” by ${FILM_VIDEO.music.by}.`,
].join(" ");
