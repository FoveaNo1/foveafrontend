"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Download,
  Loader2,
} from "lucide-react";
import SiteFooter from "./SiteFooter";
import { billingPresentation } from "../lib/billing-presentation";
import {
  createBillingPortal,
  getBillingStatus,
  type BillingStatus,
} from "../lib/billing-client";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "../lib/supabase-browser";

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0m";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${Math.max(1, minutes)}m`;
}

export default function AccountPageContent() {
  const [email, setEmail] = useState(() =>
    isSupabaseBrowserConfigured() ? "Loading..." : "Supabase auth is not configured",
  );
  const [displayName, setDisplayName] = useState("Fovea user");
  const [initial, setInitial] = useState("F");
  const [quota, setQuota] = useState<BillingStatus | null>(null);
  const [isQuotaLoading, setIsQuotaLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsQuotaLoading(false);
      return;
    }

    const client = supabase;
    let cancelled = false;

    async function loadAccount() {
      const {
        data: { session },
      } = await client.auth.getSession();

      const userEmail = session?.user.email;
      if (!session || !userEmail) {
        window.location.replace("/login?next=/account");
        return;
      }

      if (cancelled) {
        return;
      }

      const name =
        typeof session.user.user_metadata?.full_name === "string"
          ? session.user.user_metadata.full_name
          : "Fovea user";

      setEmail(userEmail);
      setDisplayName(name);
      setInitial((name || userEmail).slice(0, 1).toUpperCase());

      try {
        const nextQuota = await getBillingStatus(session.access_token);
        if (!cancelled) {
          setQuota(nextQuota);
        }
      } catch (err) {
        if (!cancelled) {
          setAccountError(
            err instanceof Error ? err.message : "Unable to load subscription status.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsQuotaLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  const isPro = quota?.plan === "pro" || quota?.is_pro;
  const billing = billingPresentation(quota);
  const isPaymentFailed = billing.paymentFailed;
  const usagePercent = useMemo(() => {
    if (!quota?.limit) {
      return 0;
    }
    return Math.min(100, Math.max(0, (quota.used / quota.limit) * 100));
  }, [quota]);

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      window.location.href = "/login";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function handleBillingPortal() {
    setBillingError(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setBillingError("Supabase auth is not configured yet.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      window.location.href = "/login?next=/account";
      return;
    }

    setIsPortalLoading(true);
    try {
      const url = await createBillingPortal(session.access_token);
      window.location.assign(url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "Unable to open billing portal.");
      setIsPortalLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            Sign out
          </button>
        </header>

        <section className="flex flex-wrap items-center gap-4 py-12">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#0D8F69]">
            <span className="text-lg font-semibold text-white">{initial}</span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#111315]">Fovea account</h1>
            <p className="text-sm text-[#5A665F]">{email}</p>
          </div>

          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#C8D6CE] bg-white px-3 py-1.5">
            {isQuotaLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#88938C]" />
            ) : isPaymentFailed ? (
              <AlertCircle className="h-4 w-4 text-[#B54747]" />
            ) : (
              <CircleCheck className="h-4 w-4 text-[#0D8F69]" />
            )}
            <span className="text-xs font-medium text-[#111315]">
              {isQuotaLoading ? "Loading" : billing.plan}
            </span>
          </div>
        </section>

        {accountError && (
          <p className="mb-5 rounded-2xl border border-[#F0D6D6] bg-[#FFF8F8] px-5 py-4 text-sm leading-6 text-[#A43B3B]">
            {accountError}
          </p>
        )}

        <section className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                Subscription
              </p>
              <h2 className="mt-1 text-3xl font-semibold text-[#111315]">
                {isQuotaLoading ? "Checking plan..." : billing.plan}
              </h2>
              <p
                className={`mt-2 text-sm leading-6 ${
                  isPaymentFailed ? "text-[#A43B3B]" : "text-[#5A665F]"
                }`}
              >
                {isQuotaLoading ? "Loading subscription..." : billing.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {billing.buy && (
                <Link href="/checkout" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#111315] px-5 text-sm font-semibold text-white transition hover:bg-[#222]">
                  {quota?.manual_entitlement ? "Subscribe to Pro" : "Upgrade to Pro"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {billing.manage && (
                <button type="button" onClick={handleBillingPortal} disabled={isPortalLoading || isQuotaLoading}
                  className="inline-flex h-11 items-center rounded-xl border border-[#D8E1DA] bg-white px-5 text-sm font-semibold text-[#111315] transition hover:border-[#AFC2B5] disabled:cursor-not-allowed disabled:opacity-60">
                  {isPortalLoading ? "Opening..." : isPaymentFailed ? "Update payment method" : "Manage billing"}
                </button>
              )}
            </div>
          </div>

          {billingError && (
            <p className="mt-4 rounded-xl border border-[#F0D6D6] bg-[#FFF8F8] px-4 py-3 text-sm leading-6 text-[#A43B3B]">
              {billingError}
            </p>
          )}

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#E3E9E5] bg-[#F8FAF7] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                Status
              </p>
              <p className="mt-1 font-semibold text-[#111315]">
                {isQuotaLoading ? "Loading" : billing.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E3E9E5] bg-[#F8FAF7] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                Usage
              </p>
              <p className="mt-1 font-semibold text-[#111315]">
                {quota
                  ? `${formatDuration(quota.used)} used`
                  : isQuotaLoading
                    ? "Loading"
                    : "Unavailable"}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E9E3]">
                <div
                  className="h-full rounded-full bg-[#0D8F69]"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              {quota && (
                <p className="mt-2 text-xs text-[#6A756E]">
                  {formatDuration(quota.remaining)} remaining
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[#E3E9E5] bg-[#F8FAF7] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                Billing
              </p>
              <p className="mt-1 font-semibold text-[#111315]">
                {quota?.manage_billing_available
                  ? "Managed in Stripe"
                  : isPro
                    ? "No paid billing attached"
                    : "No active subscription"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
            <h3 className="text-lg font-semibold text-[#111315]">Profile</h3>

            <div className="mt-5 space-y-0">
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Display name</span>
                <span className="font-medium text-[#111315]">{displayName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Email</span>
                <span className="font-medium text-[#111315]">{email}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-[#5A665F]">Sign-in method</span>
                <span className="font-medium text-[#111315]">Magic link / OAuth</span>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
            <h3 className="text-lg font-semibold text-[#111315]">Account actions</h3>

            <div className="mt-5 space-y-0">
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Mac app</span>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 font-medium text-[#0D8F69] transition hover:text-[#0A7356]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Link>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Refunds or billing help</span>
                <Link
                  href="/feedback"
                  className="font-medium text-[#0D8F69] transition hover:text-[#0A7356]"
                >
                  Contact support
                </Link>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-[#5A665F]">Delete account</span>
                <Link
                  href="/feedback"
                  className="font-medium text-[#C53D3D] transition hover:text-[#A83232]"
                >
                  Request
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
