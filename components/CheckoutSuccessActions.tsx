"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCheckoutStatus, type CheckoutStatus } from "../lib/billing-client";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

export default function CheckoutSuccessActions({ sessionId }: { sessionId: string | null }) {
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(Boolean(sessionId));
  const [attempt, setAttempt] = useState(0);
  const next = sessionId ? "/checkout/success?session_id=" + encodeURIComponent(sessionId) : "/account";
  const deepLink = "fovea://billing/success" + (sessionId ? "?session_id=" + encodeURIComponent(sessionId) : "");

  useEffect(() => {
    if (!sessionId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let checks = 0;
    async function check() {
      try {
        const client = getSupabaseBrowserClient();
        if (!client) throw new Error("Sign-in is temporarily unavailable. Open Fovea to check your subscription.");
        const { data: { session }, error: authError } = await client.auth.getSession();
        if (controller.signal.aborted) return;
        if (authError) throw new Error("Please sign in again to verify this checkout.");
        if (!session) { setNeedsLogin(true); setChecking(false); return; }
        const result = await getCheckoutStatus(session.access_token, sessionId!, controller.signal);
        if (controller.signal.aborted) return;
        setStatus(result);
        checks++;
        if ((result.state === "syncing" || result.state === "processing") && checks < 10) {
          timer = setTimeout(check, Math.min(2000 + checks * 1000, 8000));
        } else {
          setChecking(false);
        }
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

  function retry() { setError(null); setChecking(true); setAttempt(value => value + 1); }

  return (
    <>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F8F2]">
        {active ? <CheckCircle2 className="h-7 w-7 text-[#0D8F69]" /> : checking ? <Loader2 className="h-7 w-7 animate-spin text-[#0D8F69]" /> : <ArrowRight className="h-7 w-7 text-[#0D8F69]" />}
      </div>
      <div aria-live="polite">
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[#111315]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#5A665F]">{message}</p>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href={deepLink} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111315] px-5 text-sm font-semibold text-white transition hover:bg-[#222]">Open Fovea <ArrowRight className="h-4 w-4" /></a>
        <Link href={needsLogin ? "/login?next=" + encodeURIComponent(next) : "/account"} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D8E1DA] bg-white px-5 text-sm font-semibold text-[#111315]">{needsLogin ? "Sign in to verify" : "View account"}</Link>
        {sessionId && !needsLogin && !checking && !active && status?.state !== "expired" && status?.state !== "open" && status?.state !== "inactive" && <button type="button" onClick={retry} className="h-11 rounded-xl border border-[#D8E1DA] px-5 text-sm font-semibold">Check again</button>}
        {(status?.state === "open" || status?.state === "expired") && <Link href="/checkout" className="h-11 rounded-xl border border-[#D8E1DA] px-5 py-3 text-sm font-semibold">Return to checkout</Link>}
      </div>
      <p className="mt-4 text-xs leading-5 text-[#758079]">Use the same account in Fovea and on the website. <Link href="/download" className="underline">Download Fovea</Link></p>
    </>
  );
}
