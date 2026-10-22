import type { Metadata } from "next";
import Link from "next/link";
import SiteFoot from "../../../components/book/SiteFoot";
import { HEROES, PICTURED, ROUND3 } from "../../../lib/landing/heroes";
import "./heroes.css";

// The first screens under review (Oct 17): round three (Fovea pointed at a picture, after Mercury and Perplexity), the
// notch with the dancer, and the first six ways to open on the line and hand over to the film. Not linked from the site,
// not indexed. The research behind them: landing/research/hero-transitions-oct17.html, hero-picture-oct17.html and
// hero-round3-oct17.html.

export const metadata: Metadata = { title: "Fovea · first screens", robots: { index: false, follow: false } };

export default function Heroes() {
  return (
    <main className="hx">
      <section className="hx-index">
        <h1>Pointed at, again</h1>
        <p>Round three: Fovea doing its one thing on a picture, after Mercury and Perplexity. Each takes a picture from the shortlist: add ?p= and its name (lib/landing/pictures.ts), and ?t= to hold the gesture at a second.</p>
        <ol>
          {ROUND3.map((h, i) => (
            <li key={h.id}>
              <Link className="act-line" href={`/hero/${h.id}`}>{String.fromCharCode(65 + i)} · {h.name} <span className="ar" aria-hidden="true">→</span></Link>
              <span className="after">After {h.after}</span>
              <p>{h.text}</p>
            </li>
          ))}
        </ol>
        <h1 className="hx-round1">The notch, with a picture</h1>
        <p>Round two: the notch, chosen, opening with the dancer (a stand-in photograph), three ways. Scroll each slowly.</p>
        <ol>
          {PICTURED.map((h, i) => (
            <li key={h.id}>
              <Link className="act-line" href={`/hero/${h.id}`}>{String.fromCharCode(65 + i)} · {h.name} <span className="ar" aria-hidden="true">→</span></Link>
              <span className="after">After {h.after}</span>
              <p>{h.text}</p>
            </li>
          ))}
        </ol>
        <h1 className="hx-round1">Six first screens</h1>
        <p>Each opens on the line, then hands over to the film in its own way; scroll slowly to see it. Under every one, the film keeps only its bar of parts (no button, no times), and the page goes on as it is now, without the part on what Fovea does today.</p>
        <ol>
          {HEROES.map((h, i) => (
            <li key={h.id}>
              <Link className="act-line" href={`/hero/${h.id}`}>{i + 1} · {h.name} <span className="ar" aria-hidden="true">→</span></Link>
              <span className="after">After {h.after}</span>
              <p>{h.text}</p>
            </li>
          ))}
          <li>
            <Link className="act-line" href="/">Now · the page as it is <span className="ar" aria-hidden="true">→</span></Link>
            <p>The film first, its bar under it, the plain sentence; for comparison.</p>
          </li>
        </ol>
      </section>
      <SiteFoot />
    </main>
  );
}
