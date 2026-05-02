"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles, Info } from "lucide-react";
import SiteFooter from "./SiteFooter";
import { createBillingCheckout, type BillingCycle } from "../lib/billing-client";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

type CheckoutPageContentProps = {
  initialCycle: BillingCycle;
  initialNotice: string | null;
};

const cycleOptions: {
  id: BillingCycle;
  label: string;
  badge?: string;
  badgeClass?: string;
  regularPricePerMonth: string;
  pricePerMonth: string;
  billedNote?: string;
  regularTotal: string;
  total: string;
}[] = [
  {
    id: "yearly",
    label: "Yearly",
    badge: "Save 40%",
    badgeClass: "bg-[#E9F8F2] text-[#0D8F69]",
    regularPricePerMonth: "$15",
    pricePerMonth: "$9",
    billedNote: "Billed as one payment of $108 USD",
    regularTotal: "$180",
    total: "$108",
  },
  {
    id: "monthly",
    label: "Monthly",
    badge: "Save 33%",
    badgeClass: "bg-[#F1F4EE] text-[#5F6A63]",
    regularPricePerMonth: "$30",
    pricePerMonth: "$20",
    regularTotal: "$30",
    total: "$20",
  },
];

function cycleDescription(cycle: BillingCycle): string {
  switch (cycle) {
    case "yearly":
      return "Yearly";
    case "monthly":
      return "Monthly";
  }
}

function cycleSavings(cycle: BillingCycle): string | null {
  switch (cycle) {
    case "yearly":
      return "Save 40%";
    case "monthly":
      return "Save 33%";
  }
}

export default function CheckoutPageContent({
  initialCycle,
  initialNotice,
}: CheckoutPageContentProps) {
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(initialNotice);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selected = cycleOptions.find((o) => o.id === cycle)!;

  async function handleCheckout() {
    setNoticeMessage(null);
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage(
        "Supabase auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (!session?.access_token) {
      window.location.href = `/login?next=${encodeURIComponent(`/checkout?cycle=${cycle}`)}`;
      return;
    }

    setIsRedirecting(true);
    try {
      const url = await createBillingCheckout(session.access_token, {
        billingCycle: cycle,
      });
      window.location.assign(url);
    } catch (err) {
      setIsRedirecting(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to create checkout.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Link>
          <div className="inline-flex items-center gap-2 text-sm text-[#5E6861]">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </header>

        {/* Step indicator */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-0">
          {/* Step 1 - Plan (completed) */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E1DA] bg-white">
              <Check className="h-4 w-4 text-[#0D8F69]" />
            </div>
            <span className="text-xs font-medium text-[#5E6861]">Plan</span>
          </div>

          {/* Connector */}
          <div className="mb-6 h-px w-10 bg-[#D8E1DA]" />

          {/* Step 2 - Billing cycle (active) */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D8F69] text-sm font-semibold text-white">
              2
            </div>
            <span className="text-xs font-medium text-[#111315]">Billing cycle</span>
          </div>

          {/* Connector */}
          <div className="mb-6 h-px w-10 bg-[#D8E1DA]" />

          {/* Step 3 - Payment (future) */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E1DA] bg-white text-sm font-medium text-[#A4AEA7]">
              3
            </div>
            <span className="text-xs font-medium text-[#A4AEA7]">Payment</span>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          {/* Left: cycle picker */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#111315] sm:text-3xl">
              Choose your billing cycle
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5A665F]">
              Early-bird pricing: $15/month becomes $9 with annual billing; $30/month becomes $20 monthly.
            </p>

            <div className="mt-8 space-y-4">
              {cycleOptions.map((option) => {
                const isSelected = cycle === option.id;
                return (
                  <label
                    key={option.id}
                    className={`relative block cursor-pointer rounded-2xl border-2 p-5 transition ${
                      isSelected
                        ? "border-[#0D8F69] bg-[#F1FBF6]"
                        : "border-[#E3E9E5] bg-white hover:border-[#C8D6CE]"
                    }`}
                  >
                    {option.id === "yearly" && (
                      <span className="absolute -top-3 left-5 rounded-full bg-[#0D8F69] px-3 py-1 text-xs font-semibold text-white">
                        Early bird
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="billing-cycle"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setCycle(option.id)}
                          className="h-4 w-4 accent-[#0D8F69]"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-[#111315]">
                            {option.label}
                          </span>
                          {option.badge && (
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${option.badgeClass}`}
                            >
                              {option.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-semibold text-[#111315]">
                          <span className="mr-2 text-sm font-medium text-[#8A958E] line-through">
                            {option.regularPricePerMonth}
                          </span>
                          {option.pricePerMonth}{" "}
                          <span className="text-sm font-normal text-[#6A756E]">USD / month</span>
                        </div>
                        {option.billedNote && (
                          <p className="mt-0.5 text-xs text-[#6A756E]">{option.billedNote}</p>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D8F69] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0B7A5A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRedirecting ? "Opening checkout..." : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {errorMessage && (
              <p className="mt-4 rounded-xl border border-[#F0D6D6] bg-[#FFF8F8] px-4 py-3 text-sm leading-6 text-[#A43B3B]">
                {errorMessage}
              </p>
            )}

            {noticeMessage && (
              <p className="mt-4 rounded-xl border border-[#DDE4DC] bg-white px-4 py-3 text-sm leading-6 text-[#5A665F]">
                {noticeMessage}
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-[#A4AEA7]">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#6A756E]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-[#6A756E]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Right: order summary */}
          <aside className="rounded-2xl border border-[#DDE4DC] bg-white p-6 lg:sticky lg:top-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5F6A63]">
              Your order summary
            </h2>

            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F8F2]">
                <Sparkles className="h-5 w-5 text-[#0D8F69]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#111315]">Fovea Pro</p>
                <p className="text-sm text-[#6A756E]">1 member</p>
                <p className="mt-0.5 text-sm text-[#6A756E]">{cycleDescription(cycle)}</p>
              </div>
            </div>

            <div className="my-5 h-px bg-[#E3E9E5]" />

            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-[#3A4A40]">Total for today</span>
              <div className="text-right">
                <span className="mr-2 text-sm font-medium text-[#8A958E] line-through">
                  {selected.regularTotal}
                </span>
                <span className="text-xl font-semibold text-[#111315]">
                  {selected.total}{" "}
                  <span className="text-sm font-normal text-[#6A756E]">USD</span>
                </span>
              </div>
            </div>

            {cycleSavings(cycle) && (
              <div className="mt-2 flex justify-end">
                <span className="rounded-full bg-[#E9F8F2] px-2.5 py-0.5 text-xs font-semibold text-[#0D8F69]">
                  Early bird · {cycleSavings(cycle)}
                </span>
              </div>
            )}

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F8FAF7] p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A4AEA7]" />
              <p className="text-xs leading-5 text-[#6A756E]">
                14-day money-back guarantee
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#A4AEA7]">
              <Lock className="h-3.5 w-3.5" />
              Secure payment
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
