"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Chrome,
  Cpu,
  Download,
  Laptop2,
  Monitor,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import SiteFooter from "./SiteFooter";
import { getSiteCopy } from "../lib/site-copy";

const DMG_URL = "https://updates.hellofovea.com/releases/latest.dmg";
const EXTENSION_URL = "https://updates.hellofovea.com/extensions/Fovea-Companion-2.0.0.zip";

export default function DownloadPageContent() {
  const copy = getSiteCopy();

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.nav.backHome}</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            Sign in
          </Link>
        </header>

        {/* ── Headline ── */}
        <section className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#111315] sm:text-6xl">
            Get Fovea on your Mac.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5A665F]">
            A lightweight menu-bar companion. Press your hotkey, capture anything on screen, route it to the model that fits the job.
          </p>
        </section>

        {/* ── 2-column grid ── */}
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          {/* macOS card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-8 shadow-[0_24px_70px_rgba(37,48,41,0.08)]">
            <h2 className="text-2xl font-semibold tracking-tight text-[#111315]">
              Fovea for macOS
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
              Lives in your menu bar. Stays out of the way until you call it.
            </p>

            <a
              href={DMG_URL}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#111315] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(17,19,21,0.16)] transition hover:-translate-y-0.5 hover:bg-[#202521] sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download for Apple Silicon
            </a>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7E0D9] bg-[#F8FAF7] px-3 py-1.5 text-xs text-[#526058]">
                <Monitor className="h-3.5 w-3.5" />
                macOS 13 Ventura or later
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7E0D9] bg-[#F8FAF7] px-3 py-1.5 text-xs text-[#526058]">
                <Cpu className="h-3.5 w-3.5" />
                Apple Silicon only
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7E0D9] bg-[#F8FAF7] px-3 py-1.5 text-xs text-[#526058]">
                <RefreshCcw className="h-3.5 w-3.5" />
                Auto-updates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7E0D9] bg-[#F8FAF7] px-3 py-1.5 text-xs text-[#526058]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Notarized &amp; signed
              </span>
            </div>
          </div>

          {/* Browser companion card */}
          <div className="rounded-[24px] border border-[#DDE4DC] bg-[#F8FAF7] p-8">
            <h2 className="text-xl font-semibold tracking-tight text-[#111315]">
              Browser companion
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
              Optional. Lets Fovea drop captures straight into your favorite chat tab.
            </p>

            <a
              href={EXTENSION_URL}
              download
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8E1DA] bg-white px-6 py-3.5 text-sm font-semibold text-[#111315] transition hover:-translate-y-0.5 hover:border-[#AFC2B5] sm:w-auto"
            >
              <Chrome className="h-4 w-4" />
              Add to Chrome
            </a>
          </div>
        </section>

        {/* ── Roadmap ── */}
        <section className="mt-16 mb-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A857D]">
            On the roadmap
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-[#D8E1DA] bg-white p-5">
              <div className="flex items-center gap-3">
                <Laptop2 className="h-5 w-5 text-[#7A857D]" />
                <h3 className="font-semibold text-[#111315]">Windows</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                In private alpha. Join the waitlist to try early builds.{" "}
                <Link
                  href="/feedback"
                  className="font-semibold text-[#0D8F69] hover:underline"
                >
                  Join the waitlist
                </Link>
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-[#D8E1DA] bg-white p-5">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-[#7A857D]" />
                <h3 className="font-semibold text-[#111315]">iOS</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                A pocket-sized capture surface for when you&apos;re away from your desk.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter
        text="© 2026 FOVEA AI. ALL RIGHTS RESERVED."
        variant="light"
        pricingHref="/pricing"
        feedbackHref="/feedback"
        pricingLabel={copy.common.pricingLinkLabel}
        feedbackLabel={copy.common.feedbackLinkLabel}
        privacyLabel={copy.common.privacyLinkLabel}
        termsLabel={copy.common.termsLinkLabel}
      />
    </main>
  );
}
