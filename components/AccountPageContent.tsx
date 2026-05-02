"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, Monitor } from "lucide-react";
import SiteFooter from "./SiteFooter";
import { createBillingPortal } from "../lib/billing-client";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase-browser";

export default function AccountPageContent() {
  const [email, setEmail] = useState(() =>
    isSupabaseBrowserConfigured() ? "Loading..." : "Supabase auth is not configured",
  );
  const [initial, setInitial] = useState("F");
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const userEmail = data.session?.user.email;
      if (!data.session || !userEmail) {
        window.location.replace("/login?next=/account");
        return;
      }

      setEmail(userEmail);
      setInitial(userEmail.slice(0, 1).toUpperCase());
    });
  }, []);

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
        {/* ── Header ── */}
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

        {/* ── User header ── */}
        <section className="flex flex-wrap items-center gap-4 py-12">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#0D8F69]">
            <span className="text-lg font-semibold text-white">{initial}</span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#111315]">Fovea account</h1>
            <p className="text-sm text-[#5A665F]">{email}</p>
          </div>

          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#C8D6CE] bg-white px-3 py-1.5">
            <CircleCheck className="h-4 w-4 text-[#0D8F69]" />
            <span className="text-xs font-medium text-[#111315]">
              Beta access
            </span>
          </div>
        </section>

        {/* ── Plan + Devices ── */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Plan card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-7 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                  Plan
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#111315]">
                  Beta &mdash; open access
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5A665F]">
                  Your subscription state is synced from Stripe through the Fovea backend.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#111315] px-4 text-sm font-semibold text-white transition hover:bg-[#222]"
                >
                  See plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleBillingPortal}
                  disabled={isPortalLoading}
                  className="inline-flex h-10 items-center rounded-xl border border-[#D8E1DA] bg-white px-4 text-sm font-semibold text-[#111315] transition hover:border-[#AFC2B5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPortalLoading ? "Opening..." : "Manage billing"}
                </button>
              </div>
            </div>

            {billingError && (
              <p className="mt-4 rounded-xl border border-[#F0D6D6] bg-[#FFF8F8] px-4 py-3 text-sm leading-6 text-[#A43B3B]">
                {billingError}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                  Status
                </p>
                <p className="mt-1 font-semibold text-[#111315]">Active</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                  Captures this month
                </p>
                <p className="mt-1 font-semibold text-[#111315]">142</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                  Member since
                </p>
                <p className="mt-1 font-semibold text-[#111315]">Jan 2026</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                  Next billing
                </p>
                <p className="mt-1 font-semibold text-[#111315]">&mdash;</p>
              </div>
            </div>
          </div>

          {/* Devices card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-[#88938C]">
                Devices
              </p>
              <Link
                href="/download"
                className="text-sm font-medium text-[#0D8F69] transition hover:text-[#0A7356]"
              >
                Get the app
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#DDE4DC] bg-[#F8FAF7] p-3">
              <Monitor className="h-5 w-5 shrink-0 text-[#0D8F69]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111315]">
                  Alex&apos;s MacBook Pro
                </p>
                <p className="text-xs text-[#88938C]">macOS &middot; Active 2h ago</p>
              </div>
              <button
                type="button"
                className="shrink-0 text-xs font-medium text-[#88938C] transition hover:text-[#C53D3D]"
              >
                Remove
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#88938C]">
              Up to 3 devices on Pro. 1 device on Free.
            </p>
          </div>
        </div>

        {/* ── Profile + Billing ── */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Profile card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
            <h3 className="text-lg font-semibold text-[#111315]">Profile</h3>

            <div className="mt-5 space-y-0">
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Display name</span>
                <span className="font-medium text-[#111315]">Fovea user</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Email</span>
                <span className="font-medium text-[#111315]">
                  {email}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-[#5A665F]">Sign-in method</span>
                <span className="font-medium text-[#111315]">Magic link / OAuth</span>
              </div>
            </div>
          </div>

          {/* Billing & usage card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-7">
            <h3 className="text-lg font-semibold text-[#111315]">
              Billing &amp; usage
            </h3>

            <div className="mt-5 space-y-0">
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Payment method</span>
                <span className="font-medium text-[#111315]">Not added</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Invoices</span>
                <span className="font-medium text-[#111315]">&mdash;</span>
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
          </div>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
