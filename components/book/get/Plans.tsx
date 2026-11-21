"use client";

import type { Cycle } from "../../../lib/landing/book";

// The Free and Pro plans, with yearly Pro selected when the checkout sheet opens.
type Props = {
  onJoin: (cycle: Cycle) => void;
  /** The pricing page makes this its page heading. */
  headingLevel?: "h1" | "h2";
  /** Where "Download for Mac" goes: up the page on /download, to /download elsewhere. */
  downloadHref?: string;
};

export default function Plans({ onJoin, headingLevel = "h2", downloadHref = "#top" }: Props) {
  const join = (cycle: Cycle) => (e: React.MouseEvent) => { e.preventDefault(); onJoin(cycle); };
  const Heading = headingLevel;
  return (
    <section className="gp-plans" id="plans" aria-labelledby="plans-title">
      <Heading id="plans-title" className={headingLevel === "h1" ? "rise" : undefined}>Fovea is free to start.</Heading>
      <p className="trial-note">Every new account starts with 14 days of Pro, no card required.</p>
      <div className="plans">
        <div className="plan">
          <p className="k">Free</p>
          <p className="bigp">$0</p>
          <ul className="sl" role="list">
            <li>2,000 words a week, resetting weekly.</li>
            <li>10 answers a week from Fovea&apos;s own model, on the standard model.</li>
            <li>Eye tracking and taking the screen within the word limit.</li>
            <li>The dictionary, the notch board, and capture history.</li>
          </ul>
          <p className="go"><a className={`act-line small ${downloadHref.startsWith("#") ? "up" : ""}`} href={downloadHref}>Download for Mac <span className="ar" aria-hidden="true">{downloadHref.startsWith("#") ? "↑" : "→"}</span></a></p>
        </div>
        <div className="plan">
          <p className="k">Pro</p>
          <p className="bigp">$99/year</p>
          <p className="cond">$8.25/month, billed yearly. Or $12/month.</p>
          <ul className="sl" role="list">
            <li>Unlimited words, eye tracking, and taking the screen.</li>
            <li>100 answers a month from Fovea&apos;s own model on the best model, then the standard model, up to 500 a month.</li>
            <li>Memory on for every capture, never counted.</li>
            <li>Priority email support.</li>
          </ul>
          <p className="go">
            <a className="act-line small" href="/checkout?cycle=yearly" onClick={join("yearly")}>Join yearly, $99 <span className="ar" aria-hidden="true">→</span></a>
            <a className="act-line small" href="/checkout?cycle=monthly" onClick={join("monthly")}>Join monthly, $12 <span className="ar" aria-hidden="true">→</span></a>
          </p>
        </div>
      </div>
      <p className="founding-note">The first 500 yearly members keep $99 a year for life.</p>
    </section>
  );
}
