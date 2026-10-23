"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { safeNext, signInHref } from "../../../lib/account";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../../../lib/supabase-browser";
import { useQueryParam } from "./useQueryParam";

// /auth/callback, in the landing page's type (Oct 21): where the email link, Google and Apple come back to. Supabase
// reads the sign-in from the address; once there is a session it goes on to `next`. It waits 5 s before saying it
// couldn't (the logic of the earlier AuthCallbackPageContent, unchanged).

export default function AuthCallback() {
  const next = safeNext(useQueryParam("next"));
  const described = useQueryParam("error_description");
  const code = useQueryParam("error");
  const said = described ?? code;
  const configured = isSupabaseBrowserConfigured();
  const [late, setLate] = useState<string | null>(null);
  const error = !configured ? "Signing in is unavailable just now. Please try again shortly." : said ? said.replace(/\+/g, " ") : late;

  useEffect(() => {
    if (!configured || said) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let live = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { if (session) location.replace(next); });
    const check = window.setTimeout(async () => {
      const { data, error: err } = await supabase.auth.getSession();
      if (!live) return;
      if (data.session) location.replace(next);
      else if (err) setLate(err.message);
    }, 300);
    const giveUp = window.setTimeout(() => { if (live) setLate("We could not finish signing you in. Please try again."); }, 5000);
    return () => { live = false; clearTimeout(check); clearTimeout(giveUp); subscription.unsubscribe(); };
  }, [configured, said, next]);

  return (
    <main className="text-page acct" aria-live="polite">
      {error ? (
        <>
          <h1>Signing in needs another try.</h1>
          <p>{error}</p>
          <p className="back-line"><Link className="act-line" href={signInHref(next)}>Back to sign in <span className="ar" aria-hidden="true">→</span></Link></p>
        </>
      ) : (
        <>
          <h1>Signing you in</h1>
          <p className="acct-wait"><span className="spin" aria-hidden="true" />One moment.</p>
        </>
      )}
    </main>
  );
}
