import Link from "next/link";
import { Pictures, sized } from "../../lib/landing/book";
import { BookCopy as c } from "../../lib/landing/bookCopy";
import InterestLine from "./InterestLine";

// The book (Oct 13), in its reading column, numbered in the margin: where Fovea starts, where it goes, and why; then
// the last line and the way in. Oct 17: all of it is Fovea Vision (/vision), its own page, linked beside "Download
// for Mac" under the film (Oct 18: no longer in the foot), set exactly as it was on the front page; Oct 18: with the dancer back
// where she was, under "Fovea starts in your workspace." (a stand-in, lib/landing/book.ts). Oct 21: "Hear about it
// first" under part 2, the earlier site's waitlist for the hardware (InterestLine).

export function VisionBody() {
  return (
    <div className="lp-page lp-vision">
      <h1 className="if-sr">{c.foot.vision}</h1>

      <p className="lp-num">1</p>
      <div className="lp-main">
        <h2 className="lead">{c.s1.lead}</h2>
        <p>{c.s1.body}</p>
        <p>{c.s1.body2}</p>
        <p className="lp-note">{c.eyes}</p>
        <figure className="lp-fig">
          {/* eslint-disable-next-line @next/next/no-img-element -- a stand-in hotlinked picture (lib/landing/book.ts) */}
          <img src={sized(Pictures.dancer.src, 800)} alt={Pictures.dancer.alt} loading="lazy" />
        </figure>
      </div>

      <p className="lp-num">2</p>
      <div className="lp-main">
        <h2 className="lead">{c.s2.lead}</h2>
        <p className="lp-para">
          {c.s2.items.map(([name, text]) => (
            <span className="run" key={name}><b>{name}</b> {text}</span>
          ))}
        </p>
        <InterestLine />
      </div>

      <p className="lp-num">3</p>
      <div className="lp-main lp-why">
        <h2 className="ttl">{c.s3.title}</h2>
        <p>
          {c.s3.before} <span className="ctx">{c.s3.context}</span> {c.s3.after}{" "}
          <span className="steps">
            {c.s3.steps.map((s) => <span key={s}>{s}</span>)}
          </span>
        </p>
        <p className="coda">{c.s3.coda}</p>
      </div>

      <div className="lp-main lp-last">
        <h2 className="display">{c.last}</h2>
        <p className="lp-dl">
          <Link href="/download" data-download="closing">{c.download}</Link>
          <span>{c.requirements}</span>
        </p>
      </div>
    </div>
  );
}
