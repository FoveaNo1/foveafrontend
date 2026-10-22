// The landing page and the download page ("the book", Oct 13): pictures, plans and checkout, in one place.
// The design and its research: landing/research/drafts (README.md, research/*.md).

/**
 * Stand-in pictures, hotlinked from cosmos.so while the real ones are made. None of these may ship:
 * the hall is Olafur Eliasson's The Weather Project, and the others belong to their photographers.
 * Replace each with Fovea's own photograph (or a licensed one) before launch.
 */
export const Pictures = {
  /** The hall with the great round light. The landing page's first screen and the founding card. */
  hall: {
    src: "https://cdn.cosmos.so/63f56469-b189-471f-8aec-0d8a17938f01",
    width: 736,
    height: 1027,
    /** The light's centre (x, y as fractions of the picture) and radius (as a fraction of its width). */
    sun: [0.489, 0.214, 0.254] as const,
    alt: "A vast hall in haze, a great round light high up, people at the rail beneath it.",
  },
  /** Beside "Fovea starts in your workspace". */
  dancer: {
    src: "https://cdn.cosmos.so/025c62fe-2fb0-4d3f-919f-03a42fe90761",
    alt: "A dancer on yellow, a red scarf swirling round her.",
  },
  /**
   * The download page's frame, four photographs in turn. Ordered so neighbours share a hue; each drifts
   * along its own motion (dx, dy) while it is shown. research/rotation.md, design 1.
   */
  rotation: [
    { src: "https://cdn.cosmos.so/a870372e-4bd3-4c50-8312-34bd8b9c0daa", w: 1000, pos: "50% 40%", dx: "-0.8%", dy: "0.8%", origin: "50% 50%", name: "dancer in yellow and violet", alt: "A dancer in yellow and violet, turning on pale green." },
    { src: "https://cdn.cosmos.so/933faca7-b39a-4c5a-9145-b60bf56e5a02", w: 1400, pos: "38% 50%", dx: "0", dy: "0", origin: "40% 60%", name: "flowers swirling", alt: "Flowers swirling under a blue sky." },
    { src: "https://cdn.cosmos.so/b2c16007-09be-4af4-b821-aad3b4f247d2", w: 700, pos: "55% 50%", dx: "1%", dy: "-0.6%", origin: "50% 50%", name: "violinist", alt: "A violinist, the bow a streak of light." },
    { src: "https://cdn.cosmos.so/de7ba441-196c-42b3-87a2-5f69e32e37b4", w: 1100, pos: "42% 50%", dx: "-1.2%", dy: "0", origin: "50% 50%", name: "runner in the grass", alt: "Running through golden grass in the sun." },
  ],
} as const;

/** A sized, compressed copy from the cosmos CDN. */
export const sized = (src: string, w: number) => `${src}?format=webp&w=${w}`;

export type Cycle = "yearly" | "monthly";

/** What each cycle costs, as the checkout shows it. The amount charged is Stripe's (the backend's
 *  STRIPE_PRICE_PRO_YEARLY / _MONTHLY): keep these in step with those prices. */
export const Prices: Record<Cycle, { line: string; total: string; name: string; then: string }> = {
  yearly: { line: "$9 × 12 months", total: "$108", name: "Yearly", then: "$108 today, then yearly. Cancel any time." },
  monthly: { line: "1 month", total: "$20", name: "Monthly", then: "$20 today, then monthly. Cancel any time." },
};

/** A founding number, for the welcome's design preview only (/download?preview=welcome). Real numbers aren't given
 *  out yet: the server doesn't keep them, so a real welcome shows none (Oct 21). */
export const Founding = { sampleNumber: "0412" } as const;
