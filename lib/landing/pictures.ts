// Pictures for the first screen, under review (Oct 17): stand-ins found on Cosmos (cosmos.so), hotlinked from its image
// host while Yulun picks. None may ship as they are: each belongs to its maker; replace the chosen one with a licensed or
// commissioned picture (with leave to put the product over it) before launch.
//
// Two kinds:
// - laptops: a laptop in a room, its screen measured as four corners (fractions of the picture: top left, top right,
//   bottom right, bottom left), so the film can sit on that screen and the camera can move into it (Mercury's way);
// - scenes: a painting or photograph to be a Mac's desktop, with the detail the hand points at (x, y, w, h as
//   fractions of the picture as a 16:10 screen shows it, centred) and whether words over it read in ink or in white
//   (Perplexity's way). Details keep clear of the island at the top and the line at the bottom left. `tone` is the
//   menu bar's colour (over the picture's top); `foot` the line's (over its foot, often darker), ink unless said.

export type Corner = [number, number];
export type Laptop = { kind: "laptop"; id: string; name: string; src: string; w: number; h: number; screen: [Corner, Corner, Corner, Corner]; cosmos: string };
export type Scene = { kind: "scene"; id: string; name: string; src: string; w: number; h: number; detail: [number, number, number, number]; tone: "ink" | "white"; foot?: "ink" | "white"; pos?: string; cosmos: string };
export type Picture = Laptop | Scene;

const cdn = (u: string) => `https://cdn.cosmos.so/${u}`;
const el = (id: number) => `https://www.cosmos.so/e/${id}`;

export const LAPTOPS: Laptop[] = [
  { kind: "laptop", id: "blinds", name: "A laptop on a round table, the blinds’ light on a pink wall", src: cdn("f5ae8479-1096-42ff-8411-81eab843468b"), w: 2560, h: 1440,
    screen: [[0.2662, 0.2067], [0.6131, 0.2122], [0.6406, 0.6167], [0.2881, 0.6333]], cosmos: el(1166157144) },
  { kind: "laptop", id: "concrete", name: "A laptop on oak, a window’s light on concrete", src: cdn("18744dbd-efdf-4407-be02-3c4e54bef7a6"), w: 2560, h: 1792,
    screen: [[0.2475, 0.4027], [0.6056, 0.3973], [0.6194, 0.7509], [0.2687, 0.7857]], cosmos: el(719895219) },
  { kind: "laptop", id: "shelf", name: "A laptop on a white shelf, a plant and a cup", src: cdn("a75087e6-697a-48fd-8bb6-0e89543ec738"), w: 2560, h: 1440,
    screen: [[0.2775, 0.2767], [0.7244, 0.2789], [0.725, 0.7556], [0.2769, 0.7578]], cosmos: el(196871032) },
  { kind: "laptop", id: "studio", name: "A MacBook on white, the notch on its screen", src: cdn("953d2006-a078-4290-adda-5623af5561a3"), w: 2560, h: 1919,
    screen: [[0.1969, 0.2435], [0.6556, 0.241], [0.6756, 0.6447], [0.2119, 0.6647]], cosmos: el(58194289) },
  { kind: "laptop", id: "window", name: "A laptop by a window, the blinds drawn, in black and white", src: cdn("31ec5408-07b6-40ce-8f4e-ace650e07ca0"), w: 2560, h: 1756,
    screen: [[0.5125, 0.4026], [0.8575, 0.4026], [0.8688, 0.7341], [0.5094, 0.7377]], cosmos: el(1026710366) },
];

export const SCENES: Scene[] = [
  { kind: "scene", id: "green-hills", name: "Green hills under pink clouds, painted", src: cdn("03990665-4cbc-4301-8c05-7a5ff1da4eeb"), w: 2560, h: 2060, detail: [0.62, 0.08, 0.33, 0.25], tone: "ink", foot: "white", cosmos: el(576753398) },
  { kind: "scene", id: "big-sky", name: "Hills and a big sky of clouds, painted", src: cdn("0975f6b3-7399-4ab6-8dfb-2f3c409f4725"), w: 2560, h: 1923, detail: [0.55, 0.08, 0.3, 0.24], tone: "ink", foot: "white", cosmos: el(559885742) },
  { kind: "scene", id: "horses", name: "Horses on a plain under a towering cloud, painted", src: cdn("cbef9e65-da83-414c-aec5-7246783170d4"), w: 2560, h: 1530, detail: [0.57, 0.6, 0.27, 0.16], tone: "ink", cosmos: el(2024963218) },
  { kind: "scene", id: "oak", name: "An oak by the water, painted", src: cdn("30980728-45ca-4fc2-8c2e-0c561281bcc8"), w: 2560, h: 1638, detail: [0.66, 0.08, 0.3, 0.3], tone: "ink", foot: "white", cosmos: el(36144809) },
  { kind: "scene", id: "misty-hills", name: "A hill in morning mist", src: cdn("e64b1a5e-0a1f-42d1-9d3b-0d7450d4e1e6"), w: 2560, h: 2048, detail: [0.2, 0.46, 0.6, 0.2], tone: "ink", foot: "white", cosmos: el(2124691790) },
  { kind: "scene", id: "ridges", name: "Blue ridges in mist", src: cdn("787d8109-28ee-47b9-8b33-73901a19bf8d"), w: 2560, h: 1446, detail: [0.1, 0.28, 0.5, 0.26], tone: "ink", foot: "white", cosmos: el(403279729) },
  { kind: "scene", id: "sea", name: "A pale sea at the horizon", src: cdn("bed2c5a3-b354-4bf9-83de-37f968da7861"), w: 2560, h: 1706, detail: [0.22, 0.42, 0.4, 0.18], tone: "ink", foot: "white", cosmos: el(223053459) },
  { kind: "scene", id: "peaks", name: "Green peaks in soft light", src: cdn("images/b8c456ba-c4ba-43bb-8a21-3d72f2f5fb6d"), w: 2560, h: 1706, detail: [0.4, 0.22, 0.36, 0.38], tone: "ink", foot: "white", cosmos: el(9577890) },
  { kind: "scene", id: "sunbeam", name: "A beam of sun across a wall", src: cdn("9340c124-f16e-4a58-941e-b3dde0a81706"), w: 2560, h: 1447, detail: [0.42, 0.3, 0.5, 0.5], tone: "ink", cosmos: el(1481982873) },
  { kind: "scene", id: "leaf-shadows", name: "Leaf shadows on a white wall", src: cdn("f82dbe73-ee58-49d9-a6da-4f2314ad156a"), w: 2560, h: 1787, detail: [0.5, 0.24, 0.3, 0.5], tone: "ink", cosmos: el(1596972693) },
  { kind: "scene", id: "yellow-leaves", name: "Leaves in yellow light", src: cdn("62b4f54e-4bf3-4049-9af5-980b07439845"), w: 2560, h: 1702, detail: [0.04, 0.24, 0.36, 0.36], tone: "ink", cosmos: el(1687173892) },
  { kind: "scene", id: "gold-mist", name: "Hills in golden mist", src: cdn("01a131e9-f01f-7ddd-9de1-0ee95e2c948e"), w: 2560, h: 1636, detail: [0.5, 0.3, 0.46, 0.28], tone: "white", foot: "white", cosmos: el(1802584609) },
  { kind: "scene", id: "sunset-trees", name: "Trees at sunset over a marsh, painted", src: cdn("8be90cdb-3ce2-4ff6-94d7-64841a3f72ad"), w: 2560, h: 1440, detail: [0.62, 0.08, 0.34, 0.5], tone: "white", foot: "white", cosmos: el(1707030405) },
  { kind: "scene", id: "cumulus", name: "A cumulus over a dark plain, painted", src: cdn("d38f2c41-cf99-47bf-b680-3c9e3ef9733f"), w: 2560, h: 1705, detail: [0.36, 0.24, 0.3, 0.36], tone: "white", foot: "white", cosmos: el(2020122780) },
  { kind: "scene", id: "poppies", name: "A field of poppies under clouds, in watercolour", src: cdn("30508b0a-92e1-4eed-9748-d251247552cb"), w: 2560, h: 1899, detail: [0.5, 0.8, 0.4, 0.15], tone: "ink", foot: "white", cosmos: el(1569627125) },
  { kind: "scene", id: "dusk", name: "Hills at dusk in pastel, painted", src: cdn("9bc9fbeb-83dd-4701-bed9-77e7a9b04d85"), w: 2560, h: 2048, detail: [0.0, 0.3, 0.6, 0.3], tone: "ink", cosmos: el(2110489283) },
];

export const PICTURES: Picture[] = [...LAPTOPS, ...SCENES];
export const picture = (id?: string | null) => PICTURES.find((p) => p.id === id);
