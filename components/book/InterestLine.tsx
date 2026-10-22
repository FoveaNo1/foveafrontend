"use client";

import { type FormEvent, useState } from "react";

// "Hear about it first" (Oct 21, after the earlier site's hardware waitlist, in Max's version): under "Then any
// device. Then anywhere.", an email for news of the Fovea Bar and what comes next. It posts to /api/interest
// (interest "next", into public.lead_interests: supabase/migrations/20261010000000_lead_interests.sql must have been
// run on the live database). A repeat sign-up succeeds quietly. `company` is a honeypot people never see.

export default function InterestLine() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const ready = /\S+@\S+\.\S+/.test(email.trim());

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), interest: "next", company }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "That didn’t go through. Try again in a moment.");
      }
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn’t go through. Try again in a moment.");
      setState("idle");
    }
  };

  if (state === "sent") return <p className="lp-interest-done" role="status">Thank you. We’ll write when there’s something to see.</p>;
  return (
    <form className="lp-interest" onSubmit={send} noValidate>
      <label className="lp-interest-field">
        <span className="if-sr">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="Your email" required />
      </label>
      <label className="hp" aria-hidden="true">
        <span>Company</span>
        <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <button className="act-line small" type="submit" disabled={!ready || state === "sending"}>
        <span className="swap" key={state}>{state === "sending" ? <>Sending</> : <>Hear about it first <span className="ar" aria-hidden="true">→</span></>}</span>
      </button>
      {error && <p className="fb-error" role="alert">{error}</p>}
    </form>
  );
}
