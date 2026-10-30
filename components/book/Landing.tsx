import { OnDesktop } from "./heroes/Desktop";
import { After } from "./heroes/shared";
import Showcase from "./showcase/Showcase";
import Ending from "./Ending";
import { picture, type Scene } from "../../lib/landing/pictures";

// Fovea's landing page (Oct 18): the sea (P7, Yulun's pick) fills the first screen as a Mac's desktop, "Fovea" and
// "Download for Mac" in its menu bar, the line at its foot; Fovea takes the whole screen and "The future of human
// agent interaction is here." is said and sent, once, as the app does it (heroes/HeroDesk.tsx). Scrolling, the notch
// grows into the film's frame and the film plays from its very first screen, once. Oct 24 (Yulun): after the film,
// what Fovea does today, one thing at a time, as Dia's site shows its features (showcase/Showcase.tsx); then
// "Download for Mac" and "Learn about Fovea's vision" (heroes/shared.tsx). Oct 30 (Yulun): the page ends there as a
// sheet with rounded corners over the first screen's picture, its foot on the picture (Ending.tsx). The book
// (where Fovea starts, where it goes, why) is Fovea Vision (/vision). The other first screens: /hero.

const SEA = picture("sea") as Scene;

export default function Landing() {
  return (
    <main className="hx hv-desktop">
      <OnDesktop pic={SEA} />
      <Showcase />
      <After className="sheet-end" />
      <Ending pic={SEA} />
    </main>
  );
}
