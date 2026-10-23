// The page's pictures: soft fields of colour, pulled into stretched, wavering columns where they're
// strongest, as in the reference Yulun picked (Oct 10). Drawn live by a small shader
// (components/landing/media/GradientCanvas.tsx); these are its looks. Colours are sRGB hex; the
// yellow is the app icon's macula.

export type Preset = {
  /** Cream ground, the cool haze, the warm foot (two), and the icon's yellow. */
  colors: readonly [string, string, string, string, string];
  /** 0…1: how strongly the middle is pulled into columns. */
  stripes: number;
  /** Where the columns are, across the picture (0…1). */
  band: number;
  /** How wide the band of columns is. */
  bandWidth: number;
  speed: number;
  seed: number;
};

const WARM = ["#E9DCC8", "#5E8FDE", "#FF5A0D", "#FF4596", "#FCDE3D"] as const;

export const Presets = {
  /** The hero: the full effect, the columns in the middle. */
  hero: { colors: WARM, stripes: 1, band: 0.5, bandWidth: 0.14, speed: 1, seed: 0.3 },
  /** A small card beside the words: the same light, calmer. */
  card: { colors: WARM, stripes: 0.8, band: 0.38, bandWidth: 0.18, speed: 0.8, seed: 2.1 },
  /** The last page, under its words: soft, the columns faint, off to the side. */
  closing: {
    colors: ["#ECE3D6", "#8FB0E0", "#FF7A2E", "#FF6FB0", "#FCDE3D"],
    stripes: 0.45,
    band: 0.82,
    bandWidth: 0.16,
    speed: 0.6,
    seed: 4.4,
  },
} satisfies Record<string, Preset>;

export type PresetName = keyof typeof Presets;

/** "#RRGGBB" → [r, g, b] in 0…1. */
export function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** The still picture for when there's no WebGL: the same colours, as soft CSS light. */
export function fallbackBackground(p: Preset): string {
  const [cream, cool, warmA, warmB, yellow] = p.colors;
  return [
    `radial-gradient(60% 50% at 20% 85%, ${yellow}99, transparent 70%)`,
    `radial-gradient(70% 55% at 35% 100%, ${warmA}, transparent 70%)`,
    `radial-gradient(70% 60% at 85% 100%, ${warmB}, transparent 70%)`,
    `radial-gradient(90% 35% at 50% 52%, ${cool}cc, transparent 75%)`,
    cream,
  ].join(", ");
}
