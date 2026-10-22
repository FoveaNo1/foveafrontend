"use client";

import Link from "next/link";
import { useState } from "react";
import { startCheckout } from "../../../lib/account";
import type { BillingCycle } from "../../../lib/billing-client";
import { Prices } from "../../../lib/landing/book";

// /checkout, in the landing page's type (Oct 21): Pro, yearly or monthly, what it costs, and on to pay. Paying is on
// Stripe's own page: the backend makes the Stripe Checkout session (lib/account.ts startCheckout). Signed out, it
// asks for sign-in first and comes back here. Stripe sends a canceled payment back here too (?canceled=1).

const CANCELED = "Payment was canceled. You can choose a billing cycle and continue whenever you’re ready.";

export default function Checkout({ initialCycle, canceled }: { initialCycle: BillingCycle; canceled: boolean }) {
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [state, setState] = useState<"idle" | "going">("idle");
  const [error, setError] = useState("");
  const P = Prices[cycle];

  const pay = async () => {
    if (state === "going") return;
    setState("going");
    setError("");
    try {
      await startCheckout(cycle);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create checkout.");
      setState("idle");
    }
  };

  return (
    <main className="text-page acct">
      <h1 className="rise">Fovea Pro</h1>
      <p className="rise" style={{ ["--i" as string]: 1 }}>Founding member. Your founding price is kept for as long as your membership is active.</p>
      {canceled && <p className="acct-note" role="status">{CANCELED}</p>}

      <fieldset className="fb-kind acct-cycle">
        <legend>Billing</legend>
        {(["yearly", "monthly"] as const).map((c) => (
          <label key={c}>
            <input type="radio" name="cycle" value={c} checked={cycle === c} onChange={() => setCycle(c)} />
            <span>{Prices[c].name}</span>
          </label>
        ))}
      </fieldset>

      <div className="sum">
        <div><span>{P.line}</span><span>{P.total}</span></div>
        <div className="total"><span>Total today</span><span>{P.total}<small>USD</small></span></div>
      </div>
      <p className="acct-then">{P.then}</p>

      {error && <p className="fb-error" role="alert">{error}</p>}
      <p className="fb-go">
        <button className="act-line" type="button" onClick={pay} disabled={state === "going"}>
          <span className="swap" key={state}>
            {state === "going" ? <>Opening secure checkout <span className="spin" aria-hidden="true" /></> : <>Continue to payment <span className="ar" aria-hidden="true">→</span></>}
          </span>
        </button>
      </p>
      <p className="acct-fine">
        You pay on Stripe’s secure page. If Fovea isn’t for you, write to us within 14 days and we’ll refund you in full.{" "}
        <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link>
      </p>
    </main>
  );
}
