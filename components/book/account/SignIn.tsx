"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { safeNext } from "../../../lib/account";
import { getSupabaseBrowserClient } from "../../../lib/supabase-browser";
import { useQueryParam } from "./useQueryParam";

// /login, in the landing page's type (Oct 21): the sign-in the site has had since the summer (Supabase: a link by
// email, or Google, or Apple; an account is made on first sign-in), set as /feedback is: a line to write on, the
// action a line of type. Signed in already, it goes straight on to `next` (/account if none).

const UNAVAILABLE = "Signing in is unavailable just now. Please try again shortly.";

export default function SignIn() {
  const next = safeNext(useQueryParam("next"));
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const ready = /\S+@\S+\.\S+/.test(email.trim());

  // already signed in (or once signed in, in another tab), go on to where it was asked to
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => { if (data.session) location.replace(next); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { if (session) location.replace(next); });
    return () => subscription.unsubscribe();
  }, [next]);

  const back = () => `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const sendLink = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError(UNAVAILABLE); return; }
    setState("sending");
    const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: back(), shouldCreateUser: true } });
    if (err) { setError(err.message); setState("idle"); return; }
    setState("sent");
  };

  const withProvider = async (provider: Provider) => {
    setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError(UNAVAILABLE); return; }
    const { error: err } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: back() } });
    if (err) setError(err.message);
  };

  const paying = next.startsWith("/checkout");
  return (
    <main className="text-page acct">
      <h1 className="rise">Sign in to Fovea</h1>
      <p className="rise" style={{ ["--i" as string]: 1 }}>
        {paying ? "Sign in, then go on to pay for Pro." : "Sign in to manage your subscription."} Use the same account as in Fovea on your Mac.
      </p>

      {state === "sent" ? (
        <div className="fb-sent" role="status">
          <h2>Check your email.</h2>
          <p>We sent a sign-in link to {email.trim()}. Open it on this device to carry on.</p>
          <p className="back-line"><button className="quiet-link" type="button" onClick={() => setState("idle")}>Use another email</button></p>
        </div>
      ) : (
        <form className="fb" onSubmit={sendLink} noValidate>
          <label className="fb-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" inputMode="email" placeholder="you@example.com" />
          </label>
          {error && <p className="fb-error" role="alert">{error}</p>}
          <p className="fb-go">
            <button className="act-line" type="submit" disabled={!ready || state === "sending"}>
              <span className="swap" key={state}>
                {state === "sending" ? <>Sending</> : <>Email me a sign-in link <span className="ar" aria-hidden="true">→</span></>}
              </span>
            </button>
          </p>
        </form>
      )}

      <div className="acct-or">
        <p className="acct-label">Or</p>
        <p className="acct-alt">
          <button className="act-line small" type="button" onClick={() => withProvider("google")}>Continue with Google <span className="ar" aria-hidden="true">→</span></button>
          <button className="act-line small" type="button" onClick={() => withProvider("apple")}>Continue with Apple <span className="ar" aria-hidden="true">→</span></button>
        </p>
      </div>

      <p className="acct-fine">By continuing you agree to the <Link href="/terms">Terms</Link> and the <Link href="/privacy">Privacy Policy</Link>.</p>
    </main>
  );
}
