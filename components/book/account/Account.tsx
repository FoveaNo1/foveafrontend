"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentSession, openBillingPortal, signInHref, signOut } from "../../../lib/account";
import { getBillingStatus, type BillingStatus } from "../../../lib/billing-client";
import { billingPresentation, billingUsage } from "../../../lib/billing-presentation";

// /account, in the landing page's type (Oct 21): who is signed in, the plan and what it says about billing, the
// week's use, and what to do: pay for Pro, or Stripe's Customer Portal (the card, cancelling, invoices), help, signing
// out. The same calls and words as the earlier AccountPageContent (Sep 5); signed out, it goes to sign-in first.

export default function Account() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portal, setPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await currentSession();
        if (!session?.user.email) { location.replace(signInHref("/account")); return; }
        if (cancelled) return;
        setEmail(session.user.email);
        const full = session.user.user_metadata?.full_name;
        setName(typeof full === "string" && full.trim() ? full : null);
        const s = await getBillingStatus(session.access_token);
        if (!cancelled) setStatus(s);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load subscription status.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const billing = billingPresentation(status);
  const usage = billingUsage(status);
  const isPro = status?.plan === "pro" || status?.is_pro;

  const manage = async () => {
    setBillingError(null);
    setPortal(true);
    try {
      await openBillingPortal();
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "Unable to open billing portal.");
      setPortal(false);
    }
  };

  return (
    <main className="text-page acct">
      <h1 className="rise">Your account</h1>
      <p className="rise" style={{ ["--i" as string]: 1 }}>{email ? (name ? `${name} · ${email}` : email) : "Loading"}</p>
      {error && <p className="fb-error" role="alert">{error}</p>}

      <section className="acct-plan" aria-labelledby="plan-title">
        <p className="acct-label">Plan</p>
        <h2 id="plan-title">{loading ? "Checking your plan" : billing.plan}</h2>
        <p className={billing.paymentFailed ? "acct-warn" : undefined}>{loading ? "Loading your subscription." : billing.description}</p>
        {!loading && (billing.buy || billing.manage) && (
          <div className="acct-actions">
            {billing.buy && (
              <Link className="act-line" href="/checkout">{status?.manual_entitlement ? "Subscribe to Pro" : "Upgrade to Pro"} <span className="ar" aria-hidden="true">→</span></Link>
            )}
            {billing.manage && (
              <button className="act-line small" type="button" onClick={manage} disabled={portal}>
                <span className="swap" key={String(portal)}>
                  {portal ? <>Opening <span className="spin" aria-hidden="true" /></> : <>{billing.paymentFailed ? "Update payment method" : "Manage billing"} <span className="ar" aria-hidden="true">→</span></>}
                </span>
              </button>
            )}
          </div>
        )}
        {billingError && <p className="fb-error" role="alert">{billingError}</p>}
      </section>

      <dl className="acct-rows">
        <div>
          <dt>Usage</dt>
          <dd>
            {loading ? "Loading" : usage.summary}
            {usage.percent !== null && <span className="acct-bar" aria-hidden="true"><i style={{ width: `${usage.percent}%` }} /></span>}
            {usage.detail && <small>{usage.detail}</small>}
          </dd>
        </div>
        <div>
          <dt>Billing</dt>
          <dd>{loading ? "Loading" : status?.manage_billing_available ? "Managed in Stripe" : isPro ? "No paid billing attached" : "No active subscription"}</dd>
        </div>
        <div><dt>Mac app</dt><dd><Link href="/download">Download</Link></dd></div>
        <div><dt>Refunds or billing help</dt><dd><Link href="/feedback">Contact support</Link></dd></div>
        <div><dt>Delete account</dt><dd><Link href="/feedback">Request</Link></dd></div>
      </dl>

      <p className="back-line"><button className="quiet-link" type="button" onClick={() => void signOut()}>Sign out</button></p>
    </main>
  );
}
