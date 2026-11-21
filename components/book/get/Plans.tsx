"use client";

import type { Cycle } from "../../../lib/landing/book";

// The plans, quiet (research/readable-plans.md, option 1): one idea per line, the informative word first, numerals,
// the price as the one larger line. Three columns, so all of it is on one screen. Every action is a line of type.
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
      <div className="plans">
        <div className="plan">
          <p className="k">Free</p>
          <ul className="sl" role="list">
            <li><b>50 captures a week,</b> with your voice, text and images.</li>
            <li>Your history stays on your Mac.</li>
            <li>A dictionary of your own words.</li>
            <li>Free for good.</li>
          </ul>
          <p className="go"><a className={`act-line small ${downloadHref.startsWith("#") ? "up" : ""}`} href={downloadHref}>Download for Mac <span className="ar" aria-hidden="true">{downloadHref.startsWith("#") ? "↑" : "→"}</span></a></p>
        </div>
        <div className="plan">
          <p className="k">Pro</p>
          <p className="bigp">$9 a month</p>
          <p className="cond">billed yearly at $108, the founding price. Or $20 month to month.</p>
          <ul className="sl" role="list">
            <li>Unlimited captures.</li>
            <li>Priority model routing.</li>
            <li>Your own hotkeys and templates.</li>
            <li>Early access to new places to send to.</li>
            <li>Your requests heard first.</li>
          </ul>
          <p className="go">
            <a className="act-line small" href="/checkout?cycle=yearly" onClick={join("yearly")}>Join yearly, $108 <span className="ar" aria-hidden="true">→</span></a>
            <a className="act-line small" href="/checkout?cycle=monthly" onClick={join("monthly")}>Join monthly, $20 <span className="ar" aria-hidden="true">→</span></a>
          </p>
        </div>
        <div className="plan">
          <p className="k">Founding members</p>
          <ul className="sl" role="list">
            <li><b>Take Pro now and you are a founding member.</b></li>
            <li>Your price is kept for as long as you stay.</li>
            <li>A numbered card with the hall in it.</li>
            <li>First to try eye tracking, and first in line for the Fovea Bar.</li>
            <li>A letter from us.</li>
          </ul>
          {/* "N of 1,000 places left" waits for real numbers from the server (Oct 21: the placeholder isn't shown) */}
        </div>
      </div>
    </section>
  );
}
