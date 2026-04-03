"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import LocaleSwitcher from "./LocaleSwitcher";
import SiteFooter from "./SiteFooter";
import { getSiteCopy } from "../lib/site-copy";
import { localizedPath, type Locale } from "../lib/site-locale";

type DownloadPageContentProps = {
  locale: Locale;
};

export default function DownloadPageContent({ locale }: DownloadPageContentProps) {
  const copy = getSiteCopy(locale);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const showAnnouncement = (message: string) => {
    setAnnouncement(message);
  };

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-[#EDEDED] selection:bg-[#00FFC2] selection:text-[#050505]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="space-y-4 text-center">
          <p className="inline-flex rounded-full border border-[#00FFC2]/30 bg-[#00FFC2]/5 px-3 py-1 font-mono text-xs tracking-[0.3em] text-[#00FFC2]">
            {copy.download.badge}
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {copy.download.title}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#8D8D8D] md:text-lg">
            {copy.download.intro}
          </p>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#666]">
            {copy.download.statusNote}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="flex h-full flex-col rounded-3xl border border-[#333] bg-[#1A1A1A]/60 p-8">
            <div className="flex-1">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00FFC2]">
                {copy.download.macLabel}
              </p>
              <h2 className="mt-4 text-2xl font-semibold">{copy.download.macTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[#8D8D8D]">{copy.download.macBody}</p>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => showAnnouncement(copy.download.macAnnouncement)}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#00FFC2] px-5 py-4 text-base font-semibold text-[#050505] transition hover:shadow-[0_0_25px_rgba(0,255,194,0.35)]"
              >
                {copy.download.macButton}
              </button>
              <p className="mt-4 min-h-[3rem] text-xs leading-6 text-[#666]">
                {copy.download.macFootnote}
              </p>
            </div>
          </section>

          <section className="flex h-full flex-col rounded-3xl border border-[#333] bg-[#1A1A1A]/60 p-8">
            <div className="flex-1">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00FFC2]">
                {copy.download.extLabel}
              </p>
              <h2 className="mt-4 text-2xl font-semibold">{copy.download.extTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[#8D8D8D]">{copy.download.extBody}</p>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => showAnnouncement(copy.download.extAnnouncement)}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#444] px-5 py-4 text-base font-semibold text-[#EDEDED] transition hover:border-[#00FFC2]/60 hover:text-[#00FFC2]"
              >
                {copy.download.extButton}
              </button>
              <p className="mt-4 min-h-[3rem] text-xs leading-6 text-[#666]">
                {copy.download.extFootnote}
              </p>
            </div>
          </section>
        </div>

        {announcement && (
          <section className="rounded-3xl border border-[#00FFC2]/20 bg-[#00FFC2]/5 p-5 text-center">
            <p className="text-sm leading-7 text-[#BDEFE0]">{announcement}</p>
          </section>
        )}

        <section className="rounded-3xl border border-[#222] bg-[#0D0D0D] p-8">
          <h2 className="text-xl font-semibold">{copy.download.expectationsTitle}</h2>
          <div className="mt-5 grid gap-4 text-sm leading-7 text-[#8D8D8D] md:grid-cols-3">
            {copy.download.expectations.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <p>
              {copy.download.waitlistPrompt}{" "}
              <Link
                href={localizedPath("/", locale)}
                className="text-[#EDEDED] underline decoration-[#00FFC2]/50 underline-offset-4"
              >
                {copy.download.waitlistLink}
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
      <SiteFooter text={copy.common.footer} />
    </main>
  );
}
