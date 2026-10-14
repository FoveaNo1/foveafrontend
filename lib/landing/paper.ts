// The paper colour of the landing page and every page in its type, and the options the Paper panel offers
// (components/book/PaperPanel.tsx) while it is chosen. The choice lives in this browser only (localStorage);
// the site's own colour is --paper in app/(landing)/book.css until one is settled on.

export const PAPER_KEY = "fovea-paper";
export const DEFAULT_PAPER = "#FAFAFA";

export const Papers: { name: string; hex: string; note: string }[] = [
  { name: "Neutral", hex: "#FAFAFA", note: "Now. LoveFrom's white: no tint at all" },
  { name: "White", hex: "#FFFFFF", note: "Pure white, the brightest" },
  { name: "App window", hex: "#FBFAF7", note: "Fovea's own window canvas, the faintest warmth" },
  { name: "Ivory", hex: "#F8F6EF", note: "The app's Macula canvas: warm, still light" },
  { name: "Warm paper", hex: "#F7F5F0", note: "Like the paper of a book" },
  { name: "Cream", hex: "#F6F1E6", note: "Warmer, goes well with the hall's light" },
  { name: "Bone", hex: "#F2EFE7", note: "A quiet, slightly darker warm" },
  { name: "Sand", hex: "#EFEBE1", note: "Warm and muted, more present" },
  { name: "Soft grey", hex: "#F4F4F2", note: "Neutral, a step down from white" },
  { name: "Warm grey", hex: "#EFEEEB", note: "The old landing page's ground" },
  { name: "Stone", hex: "#EAE9E4", note: "The darkest here; the words gain contrast weight" },
  { name: "Sage", hex: "#F7F8F4", note: "The old site pages' green-grey" },
  { name: "Cool", hex: "#F5F6F8", note: "A touch of blue, crisp" },
];
