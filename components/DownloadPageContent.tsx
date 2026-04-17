"use client";

import Link from "next/link";
import { ArrowLeft, Monitor, Puzzle, Apple, ArrowDownToLine } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import SiteFooter from "./SiteFooter";
import { getSiteCopy } from "../lib/site-copy";
import { localizedPath, type Locale } from "../lib/site-locale";

type DownloadPageContentProps = {
  locale: Locale;
};

const DMG_URL = "https://updates.hellofovea.com/releases/latest.dmg";
const EXTENSION_URL = "https://updates.hellofovea.com/extensions/Fovea-Companion-2.0.0.zip";

/** Download window: 73 hours from activation. Set to null to disable. */
const DOWNLOAD_OPENS_AT: string | null = "2026-04-17T03:00:00Z";
const DOWNLOAD_WINDOW_HOURS = 73;

function isDownloadActive(): boolean {
  if (!DOWNLOAD_OPENS_AT) return false;
  const opens = new Date(DOWNLOAD_OPENS_AT).getTime();
  const closes = opens + DOWNLOAD_WINDOW_HOURS * 3600_000;
  const now = Date.now();
  return now >= opens && now < closes;
}

export default function DownloadPageContent({ locale }: DownloadPageContentProps) {
  const copy = getSiteCopy(locale);
  const active = isDownloadActive();

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-[#EDEDED] selection:bg-[#00FFC2] selection:text-[#050505]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        {/* Nav */}
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={localizedPath("/", locale)}
            className="inline-flex items-center gap-2 text-sm text-[#888888] transition-colors hover:text-[#EDEDED]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.nav.backHome}
          </Link>
          <LocaleSwitcher
            currentLocale={locale}
            englishHref="/download"
            chineseHref="/zh/download"
            englishLabel={copy.common.english}
            chineseLabel={copy.common.chinese}
            label={copy.common.localeLabel}
            className="self-start sm:self-auto"
          />
        </div>

        {/* ── Hero: macOS App ── */}
        <section className="relative overflow-hidden rounded-2xl border border-[#00FFC2]/20 bg-gradient-to-b from-[#0A1A14] to-[#0D0D0D] px-8 py-8 text-center md:px-12">
          {/* Glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 h-40 w-[28rem] -translate-x-1/2 rounded-full bg-[#00FFC2]/8 blur-[80px]" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00FFC2]/30 bg-[#00FFC2]/5 px-3 py-1 font-mono text-xs tracking-[0.25em] text-[#00FFC2]">
              <Apple className="h-3 w-3" />
              {copy.download.macLabel}
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              {copy.download.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#8D8D8D] md:text-base">
              {copy.download.intro}
            </p>

            {/* Download Button */}
            <div className="mt-6">
              {active ? (
                <a
                  href={DMG_URL}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#00FFC2] px-8 py-4 text-base font-bold text-[#050505] transition-all hover:shadow-[0_0_30px_rgba(0,255,194,0.4)] active:scale-[0.98]"
                >
                  <ArrowDownToLine className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  {copy.download.macButton}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#333] px-8 py-4 text-base font-bold text-[#888]"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  {copy.download.macButtonInactive}
                </button>
              )}
            </div>

            {/* Requirements */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-[#666]">
              <span>{copy.download.macRequirements}</span>
              <span className="hidden sm:inline">|</span>
              <span>{copy.download.macAutoUpdate}</span>
            </div>
          </div>
        </section>

        {/* ── Extension: secondary ── */}
        <section className="rounded-2xl border border-[#222] bg-[#111]/60 px-8 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#333] bg-[#1A1A1A]">
                <Puzzle className="h-5 w-5 text-[#00FFC2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{copy.download.extTitle}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#8D8D8D]">
                  {copy.download.extBody}
                </p>
              </div>
            </div>
            <a
              href={EXTENSION_URL}
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#444] px-6 py-3 text-sm font-semibold text-[#EDEDED] transition hover:border-[#00FFC2]/60 hover:text-[#00FFC2]"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {copy.download.extButton}
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#666]">
            {copy.download.extInstallNote}
          </p>
        </section>

        {/* ── System Requirements ── */}
        <section className="rounded-2xl border border-[#222] bg-[#0D0D0D] px-8 py-8">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-[#00FFC2]" />
            <h2 className="text-lg font-semibold">{copy.download.requirementsTitle}</h2>
          </div>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-[#8D8D8D] sm:grid-cols-2 md:grid-cols-3">
            {copy.download.requirements.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>

        {/* ── Beta note ── */}
        <section className="rounded-2xl border border-[#222] bg-[#0D0D0D] px-8 py-8">
          <h2 className="text-lg font-semibold">{copy.download.expectationsTitle}</h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-[#8D8D8D] md:grid-cols-2">
            {copy.download.expectations.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#8D8D8D]">
            {copy.download.waitlistPrompt}{" "}
            <Link
              href={localizedPath("/", locale)}
              className="text-[#EDEDED] underline decoration-[#00FFC2]/50 underline-offset-4"
            >
              {copy.download.waitlistLink}
            </Link>
          </p>
        </section>
      </div>
      <SiteFooter text={copy.common.footer} />
    </main>
  );
}
