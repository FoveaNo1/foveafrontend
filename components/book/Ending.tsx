import { sized } from "../../lib/landing/book";
import type { Scene } from "../../lib/landing/pictures";
import SiteFoot from "./SiteFoot";

// Where the landing page ends (Oct 30, Yulun): the page is a sheet with rounded corners lying over a picture, a band
// of the screen rather than all of it, and the foot of the page sits on the picture. The picture is the first screen's
// ("make the pic in the last page same as front page"), at the size the first screen asks for, so it's already loaded.
// The band shows a strip of it, the horizon: POS is where (CSS object-position).

const POS = "50% 50%";

export default function Ending({ pic }: { pic: Scene }) {
  return (
    <section className="end-pic">
      {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in photograph, hotlinked (lib/landing/pictures.ts) */}
      <img src={sized(pic.src, 2560)} alt="" loading="lazy" decoding="async" style={{ objectPosition: POS }} />
      <i className="end-scrim" aria-hidden="true" />
      <div className="end-foot"><SiteFoot /></div>
    </section>
  );
}
