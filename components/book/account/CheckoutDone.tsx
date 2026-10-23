"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { appHref, signInHref } from "../../../lib/account";
import { getCheckoutStatus, type CheckoutStatus } from "../../../lib/billing-client";
import { getSupabaseBrowserClient } from "../../../lib/supabase-browser";
import Welcome from "../get/Welcome";

// /checkout/success, in the landing page's type (Oct 21): where Stripe sends a payment back
// (?session_id=cs_…). It asks the backend whether that checkout is paid and Pro is on, checking again while it
// syncs (up to 10 times, 2–8 s apart); it never takes the address's word for it (Sep 5, unchanged). Once Pro is on,
// the founding card and its letter (Welcome) open, as the download page designed them.

export default function CheckoutDone({ sessionId }: { sessionId: string | null }) {
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(Boolean(sessionId));
  const [attempt, setAttempt] = useState(0);
  const [welcome, setWelcome] = useState(false);
  const here = sessionId ? `/checkout/success?session_id=${encodeURIComponent(sessionId)}` : "/account";

  useEffect(() => {
    if (!sessionId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let checks = 0;
    async function check() {
      try {
        const client = getSupabaseBrowserClient();
        if (!client) throw new Error("Signing in is unavailable just now. Open Fovea to check your subscription.");
        const { data: { session }, error: authError } = await client.auth.getSession();
        if (controller.signal.aborted) return;
        if (authError) throw new Error("Please sign in again to verify this checkout.");
        if (!session) { setNeedsLogin(true); setChecking(false); return; }
        const result = await getCheckoutStatus(session.access_token, sessionId!, controller.signal);
        if (controller.signal.aborted) return;
        setStatus(result);
        checks++;
        if ((result.state === "syncing" || result.state === "processing") && checks < 10) timer = setTimeout(check, Math.min(2000 + checks * 1000, 8000));
        else setChecking(false);
        if (result.state === "active" && result.entitlement_active && result.payment_confirmed) setWelcome(true);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unable to verify your subscription.");
          setChecking(false);
        }
      }
    }
    void check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [sessionId, attempt]);

  const retry = () => { setError(null); setChecking(true); setAttempt((n) => n + 1); };
  const closeWelcome = useCallback(() => setWelcome(false), []);

  const active = status?.state === "active" && status.entitlement_active && status.payment_confirmed;
  let title = sessionId ? "Checking your subscription" : "Check your subscription";
  let message = sessionId ? "We’re verifying your checkout and Pro access." : "There is no checkout to verify on this page. View your account for your current plan.";
  if (needsLogin) { title = "Verify your subscription"; message = "Sign in with the account used at checkout, or open Fovea to check your plan there."; }
  if (active) { title = "Your Pro subscription is ready"; message = "Checkout is complete and Pro is active on your account."; }
  else if (status?.state === "syncing") { title = "Checkout complete"; message = checking ? "Your Pro access is still syncing. This page will check again automatically." : "Pro access has not synced yet. Check again in a moment; you do not need to purchase again."; }
  else if (status?.state === "processing") { title = "Payment is processing"; message = "We have not confirmed payment yet. Check again shortly before trying another payment."; }
  else if (status?.state === "open") { title = "Checkout is not complete"; message = "Payment has not been completed for this checkout. Return to checkout to continue."; }
  else if (status?.state === "expired") { title = "This checkout has expired"; message = "Return to checkout to choose a plan and start again."; }
  else if (status?.state === "inactive") { title = "Check your current plan"; message = "This checkout completed previously. Its subscription is not currently active; view your account to manage billing."; }
  if (error) { title = "Unable to verify your subscription"; message = error; }
  const canRetry = sessionId && !needsLogin && !checking && !active && status?.state !== "expired" && status?.state !== "open" && status?.state !== "inactive";
  const toCheckout = status?.state === "open" || status?.state === "expired";

  return (
    <>
      <main className="text-page acct" aria-live="polite">
        <h1>{title}</h1>
        <p className="acct-wait">{checking && <span className="spin" aria-hidden="true" />}{message}</p>
        <div className="acct-actions">
          <a className="act-line" href={appHref(sessionId)}>Open Fovea <span className="ar" aria-hidden="true">→</span></a>
          <Link className="act-line small" href={needsLogin ? signInHref(here) : "/account"}>{needsLogin ? "Sign in to verify" : "View account"} <span className="ar" aria-hidden="true">→</span></Link>
          {canRetry && <button className="act-line small" type="button" onClick={retry}>Check again <span className="ar" aria-hidden="true">↻</span></button>}
          {toCheckout && <Link className="act-line small" href="/checkout">Return to checkout <span className="ar" aria-hidden="true">→</span></Link>}
        </div>
        <p className="acct-fine">Use the same account in Fovea and on the website. <Link href="/download">Download Fovea</Link></p>
      </main>
      <Welcome open={welcome} onClose={closeWelcome} appLink={appHref(sessionId)} />
    </>
  );
}
