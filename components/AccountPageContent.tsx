"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck, Monitor } from "lucide-react";
import SiteFooter from "./SiteFooter";

export default function AccountPageContent() {
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

          <Link
            href="/login"
            className="text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            Sign out
          </Link>
        </header>

        {/* ── User header ── */}
        <section className="flex flex-wrap items-center gap-4 py-12">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#0D8F69]">
            <span className="text-lg font-semibold text-white">A</span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#111315]">Alex Chen</h1>
            <p className="text-sm text-[#5A665F]">alex@hellofovea.com</p>
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
                  You&apos;re on the macOS beta. Paid plans will be introduced
                  with advance notice.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#111315] px-4 text-sm font-semibold text-white transition hover:bg-[#222]"
              >
                See plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

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
                <span className="font-medium text-[#111315]">Alex Chen</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#EFF1ED] py-3 text-sm">
                <span className="text-[#5A665F]">Email</span>
                <span className="font-medium text-[#111315]">
                  alex@hellofovea.com
                </span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-[#5A665F]">Password</span>
                <Link
                  href="/login"
                  className="font-medium text-[#0D8F69] transition hover:text-[#0A7356]"
                >
                  Change
                </Link>
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
