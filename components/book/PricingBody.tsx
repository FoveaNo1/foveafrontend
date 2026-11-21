"use client";

import { useCallback, useState } from "react";
import type { Cycle } from "../../lib/landing/book";
import CheckoutSheet from "./get/CheckoutSheet";
import Plans from "./get/Plans";

// /pricing: Free and Pro, compared against the current offer. Joining opens checkout; the Mac app links here.

const Rows: [string, string, string][] = [
  ["Price", "$0", "$12/month, or $99/year ($8.25/month)"],
  ["Words — dictation with Fn, and Fn+Ctrl requests sent to your own Claude Code or Codex", "2,000 words a week", "Unlimited"],
  ["Fovea's own model — Fn+Ctrl requests that Fovea answers itself", "10 a week, on the standard model", "100 a month on the best model, then the standard model, up to 500 a month"],
  ["Eye tracking — look at something and say “this”; the eye model runs on the Mac", "Yes, within the word limit", "Unlimited"],
  ["Memory — Fovea learns from every capture, and you can search what it remembers", "Off; what it already has is kept and resumes on upgrade", "On for every capture, never counted"],
  ["Taking the screen — part of the screen (⌘ drag), the whole screen (⌘ twice), the highlighter (⌥)", "Yes, within the word limit", "Unlimited"],
  ["Everything else — the dictionary, the notch board, capture history", "Yes", "Yes"],
  ["Support", "Help docs", "Priority email"],
];

const Faq: [string, string][] = [
  ["How does the trial work?", "Every new account starts with 14 days of Pro, no card required."],
  ["What happens to Memory on Free?", "It is off; what it already has is kept and resumes on upgrade."],
  ["Who keeps the yearly price?", "The first 500 yearly members keep $99 a year for life."],
];

export default function PricingBody() {
  const [sheet, setSheet] = useState(false);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const join = useCallback((c: Cycle) => { setCycle(c); setSheet(true); }, []);
  const closeSheet = useCallback(() => setSheet(false), []);

  return (
    <>
      <main className="pricing">
        <Plans onJoin={join} headingLevel="h1" downloadHref="/download" />

        <section className="compare" aria-labelledby="compare-title">
          <h2 id="compare-title">Side by side</h2>
          <table>
            <thead><tr><th scope="col"><span className="sr">What you get</span></th><th scope="col">Free</th><th scope="col">Pro</th></tr></thead>
            <tbody>
              {Rows.map(([what, free, pro]) => (
                <tr key={what}>
                  <th scope="row">{what}</th>
                  <td className={free === "—" ? "no" : undefined} aria-label={free === "✓" ? "Included" : free === "—" ? "Not included" : undefined}>{free}</td>
                  <td className={pro === "—" ? "no" : undefined} aria-label={pro === "✓" ? "Included" : pro === "—" ? "Not included" : undefined}>{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          {Faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <CheckoutSheet open={sheet} cycle={cycle} onClose={closeSheet} />
    </>
  );
}
