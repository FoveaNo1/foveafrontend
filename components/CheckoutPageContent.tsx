"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles, Info } from "lucide-react";
import SiteFooter from "./SiteFooter";

type BillingCycle = "yearly" | "quarterly" | "monthly";

const cycleOptions: {
  id: BillingCycle;
  label: string;
  badge?: string;
  badgeClass?: string;
  pricePerMonth: string;
  billedNote?: string;
  total: string;
}[] = [
  {
    id: "yearly",
    label: "Yearly",
    badge: "Save 60%",
    badgeClass: "bg-[#E9F8F2] text-[#0D8F69]",
    pricePerMonth: "$9.9",
    billedNote: "Billed as one payment of $118.8 USD",
    total: "$118.8",
  },
  {
    id: "quarterly",
    label: "Quarterly",
    badge: "Save 33%",
    badgeClass: "bg-[#F1F4EE] text-[#5F6A63]",
    pricePerMonth: "$16",
    billedNote: "Billed as one payment of $48 USD",
    total: "$48",
  },
  {
    id: "monthly",
    label: "Monthly",
    pricePerMonth: "$24",
    total: "$24",
  },
];

function cycleDescription(cycle: BillingCycle): string {
  switch (cycle) {
    case "yearly":
      return "Yearly";
    case "quarterly":
      return "Quarterly";
    case "monthly":
      return "Monthly";
  }
}

function cycleSavings(cycle: BillingCycle): string | null {
  switch (cycle) {
    case "yearly":
      return "Save 60%";
    case "quarterly":
      return "Save 33%";
    case "monthly":
      return null;
  }
}

export default function CheckoutPageContent() {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  const selected = cycleOptions.find((o) => o.id === cycle)!;

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
            <span className="hidden sm:inline">Secure checkout via Stripe</span>
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
                        Most popular
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
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D8F69] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0B7A5A]"
            >
              Next: Payment details
              <ArrowRight className="h-4 w-4" />
            </button>

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
              <span className="text-xl font-semibold text-[#111315]">
                {selected.total}{" "}
                <span className="text-sm font-normal text-[#6A756E]">USD</span>
              </span>
            </div>

            {cycleSavings(cycle) && (
              <div className="mt-2 flex justify-end">
                <span className="rounded-full bg-[#E9F8F2] px-2.5 py-0.5 text-xs font-semibold text-[#0D8F69]">
                  {cycleSavings(cycle)}
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
              Payments secured by Stripe
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
