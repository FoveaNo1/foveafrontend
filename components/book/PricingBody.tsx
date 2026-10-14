"use client";

import { useCallback, useState } from "react";
import type { Cycle } from "../../lib/landing/book";
import CheckoutSheet from "./get/CheckoutSheet";
import Plans from "./get/Plans";
import Welcome from "./get/Welcome";

// /pricing: the same three plans as the download page, then everything side by side as a quiet ledger, then the
// questions people ask (the site's own answers, word for word). Joining opens the same checkout and welcome.

const Rows: [string, string, string][] = [
  ["Captures", "50 a week", "Unlimited"],
  ["Voice, text and images", "✓", "✓"],
  ["History kept on your Mac", "✓", "✓"],
  ["A dictionary of your own words", "✓", "✓"],
  ["Priority model routing", "—", "✓"],
  ["Your own hotkeys and templates", "—", "✓"],
  ["Early access to new places to send to", "—", "✓"],
  ["Your requests heard first", "—", "✓"],
  ["Founding member: your price kept, a numbered card, first to try what comes next", "—", "✓"],
];

const Faq: [string, string][] = [
  ["When does paid billing start?", "Early-bird pricing is available during the beta rollout. Existing beta users will receive advance notice before any plan change affects their account."],
  ["Is there a Free plan?", "Yes. Free includes 50 captures per week with voice, text, and image input. Pro removes the weekly capture limit and adds advanced delivery features."],
  ["How do I cancel?", "From your account on hellofovea.com or inside the Fovea Mac app. You keep Pro until the end of the billing period."],
  ["What counts as a capture?", "One delivery action — including any voice, text selections, and screenshots packaged in that session."],
  ["What payment methods do you accept?", "All major cards via Stripe. Team plans support invoicing."],
  ["Do you offer refunds?", "14-day refund on first paid month, no questions asked."],
];

export default function PricingBody() {
  const [sheet, setSheet] = useState(false);
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [welcome, setWelcome] = useState(false);
  const join = useCallback((c: Cycle) => { setCycle(c); setSheet(true); }, []);
  const closeSheet = useCallback(() => setSheet(false), []);
  const paid = useCallback(() => setWelcome(true), []);
  const closeWelcome = useCallback(() => setWelcome(false), []);

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
      <CheckoutSheet open={sheet} cycle={cycle} onClose={closeSheet} onPaid={paid} />
      <Welcome open={welcome} onClose={closeWelcome} />
    </>
  );
}
