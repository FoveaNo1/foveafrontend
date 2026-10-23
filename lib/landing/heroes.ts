// The first screens under review (Oct 17, /hero): each opens on the one line, then hands over to the film in its own
// way, learned from a page that does it well (research: landing/research/hero-transitions-oct17.html). Not linked from
// the site, not indexed.

export type HeroId = "notch" | "screening" | "title" | "spec" | "frost" | "desk" | "notch-wallpaper" | "notch-plate" | "notch-pointed" | "screen" | "desktop" | "framed";

/** Round 3 (Oct 17): a picture, and the product on it, after Mercury and Perplexity's Personal Computer. Each takes any
 *  of the pictures in lib/landing/pictures.ts (?p=<id>): the first a laptop's, the other two a desktop's. Oct 18: Yulun
 *  chose On the desktop with the sea (P7) for the page; the desktop's scene is now the app's own notch taking the whole
 *  screen (lib/landing/film/hero.ts). */
export const ROUND3: { id: HeroId; name: string; after: string; text: string; takes: "laptop" | "scene"; pic: string }[] = [
  {
    id: "screen", name: "Into the screen", takes: "laptop", pic: "blinds",
    after: "Mercury (a photograph of a desk, and the camera moving into its laptop, where the product plays)",
    text: "A photograph of a laptop in a calm room. On its screen, the film’s first screen: the line, as the film sets it. Scroll, and the camera moves into the laptop until its screen is the film’s frame; the film plays on from there.",
  },
  {
    id: "desktop", name: "On the desktop", takes: "scene", pic: "green-hills",
    after: "Perplexity’s Personal Computer (a picture as the desktop, the product’s own glass floating on it) and Mercury",
    text: "A painting or photograph fills the screen as a Mac’s desktop, the line over it. On arrival Fovea does what it does, as the app does it: fn ⌃, the notch listens; ⌘ ⌘, the whole screen flies into it; “The future of human agent interaction is here.”; fn ⌃, Transcribing; Choose chat; Return, and the board shows it at work. Scroll, and the notch grows into the film. Chosen for the page (Oct 18), with the sea.",
  },
  {
    id: "framed", name: "In the frame", takes: "scene", pic: "misty-hills",
    after: "Perplexity’s sections (each capability as glass on a picture), Paper and Sesame (the product, framed, under one line)",
    text: "On the paper, the line over a framed Mac desktop where the same scene plays. Scroll, and the film takes the desktop’s place in the same frame, from its first screen.",
  },
];

/** Round 2 (Oct 17): the notch, chosen, with a picture (the dancer, a stand-in), three ways. */
export const PICTURED: { id: HeroId; name: string; after: string; text: string }[] = [
  {
    id: "notch-wallpaper",
    name: "The wallpaper",
    after: "Cursor’s and Dia’s product on a painting; Daylight’s rounded hero panel",
    text: "The screen is a Mac’s: the dancer is its wallpaper, on a rounded panel on the paper, a translucent menu bar and the notch over her, the line in the corner. Scroll, and the notch grows into the film’s frame on top of her; the film plays on the picture, the yellow a mat round it.",
  },
  {
    id: "notch-plate",
    name: "The plate",
    after: "a book’s frontispiece facing its title page; Things and mymind’s quiet first screens",
    text: "Paper. The dancer as a square plate, facing the line like a frontispiece faces a title. Scroll, and the notch’s black grows down over both into the film’s frame.",
  },
  {
    id: "notch-pointed",
    name: "Pointed at",
    after: "Superwhisper’s and Homerow’s heroes that do the product; the film’s own capture",
    text: "The dancer large on the paper. Scroll, and the notch opens to listen, a hand drags round her with ⌘, her picture flies up into the notch, and the notch opens into the film: the product, shown on the picture itself.",
  },
];

export const HEROES: { id: HeroId; name: string; after: string; text: string }[] = [
  {
    id: "notch",
    name: "The notch opens",
    after: "Screen Studio’s recording that shrinks into its place; Apple’s Dynamic Island",
    text: "The first screen is a Mac’s menu bar, its notch in the middle, and the line under it. Scroll, and the notch grows down and out, the island’s colours along its edge, until it is the film’s frame; the film plays.",
  },
  {
    id: "screening",
    name: "The screening",
    after: "Screen Studio’s held recording; a cinema’s lights going down",
    text: "The line, and the film waiting below it, a little small. Scroll, and the lights go down: the paper darkens to ink while the film rises and grows to the middle of the screen, and plays. After it, the lights come back up for the book.",
  },
  {
    id: "title",
    name: "Title page",
    after: "Raycast’s lone title; Daylight’s line that fills with ink; Sesame",
    text: "Only the line, very large, like a book’s title page; its words ink in one by one. Scroll, and the title shrinks into the film’s caption while the film rises from below into place under it.",
  },
  {
    id: "spec",
    name: "Spec sheet",
    after: "Granola, Claude Code and Linear (the product in the first screen); Teenage Engineering’s plainness",
    text: "No hand-over at all: the line, the plain sentence and the keys at the left, the film already playing at the right, ruled like a spec sheet. Utilitarian; the first screen is the demo.",
  },
  {
    id: "frost",
    name: "Frosted",
    after: "Apple Vision Pro’s frosted sheet over its held picture; your quiet grey reference",
    text: "Soft grey. The film fills the screen behind frosted glass, moving softly, the line small and centred over it. Scroll, and the pane shrinks into a card with soft corners and a soft shadow, then clears.",
  },
  {
    id: "desk",
    name: "On the desk",
    after: "Things’ tilted window; the plane that stands up",
    text: "The line over a desk-coloured page, and the film lying back on it like a sheet of paper. Scroll, and it stands up to face you, its shadow tightening, and plays.",
  },
];
