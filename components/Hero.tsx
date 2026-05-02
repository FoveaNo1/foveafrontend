'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  Mic,
  Sparkles,
  TextCursorInput,
} from 'lucide-react';

type HeroProps = {
  downloadHref: string;
};

const voiceTranscript = 'Explain this error, fold in my notes, draft a fix.';

const selections = [
  {
    label: 'Code snippet',
    content: 'async (req) => {',
  },
  {
    label: 'Error log',
    content: 'Error: token refresh failed after callback returns.',
  },
];

const screenshots = [
  {
    label: 'Error dialog',
    index: '01',
  },
  {
    label: 'Console trace',
    index: '02',
  },
];

export default function Hero({ downloadHref }: HeroProps) {
  return (
    <section className="bg-[#F7F8F4] px-5 pt-5 text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Nav */}
        <header className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image src="/fovea-logo.png" alt="Fovea" width={36} height={36} className="h-9 w-9 rounded-xl" />
              <span className="text-sm font-semibold tracking-tight">Fovea</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-[#5E6861] md:flex">
              <a href="#guide" className="transition hover:text-[#111315]">How it works</a>
              <a href="#features" className="transition hover:text-[#111315]">Features</a>
              <Link href="/pricing" className="transition hover:text-[#111315]">Pricing</Link>
            </nav>
            <Link
              href={downloadHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#111315] px-4 text-sm font-semibold text-white transition hover:bg-[#1F2421]"
            >
              <Download className="h-4 w-4" />
              <span>Download for macOS</span>
            </Link>
          </div>

          <Link
            href="/login"
            className="hidden h-12 shrink-0 items-center rounded-2xl border border-[#DDE4DC] bg-white/85 px-5 text-sm font-medium text-[#5E6861] shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur transition hover:text-[#111315] lg:inline-flex"
          >
            Sign in
          </Link>
        </header>

        {/* Centered hero */}
        <div className="mx-auto max-w-5xl py-24 text-center md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C8D6CE] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#4E5A53]">
            <Sparkles className="h-3.5 w-3.5 text-[#12B886]" />
            BETA FOR MACOS
          </span>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight text-[#111315] sm:text-6xl lg:text-7xl">
            <span className="whitespace-nowrap">Speak. Capture. <span className="text-[#12A77D]">Deliver.</span></span>
            <br />
            <span className="text-[#4F5B54]">All in one.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#4F5B54] sm:text-xl">
            Press a hotkey. Speak your intent, grab text, snap a screenshot — Fovea packages it all and drops it into wherever you&apos;re working.
          </p>

          {/* Demo: same capture → structured deliver */}
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="rounded-[22px] border border-[#DDE4DC] bg-white p-5 text-left shadow-[0_16px_50px_rgba(37,48,41,0.06)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">Parallel capture</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E9F8F2] px-3 py-1 text-[11px] font-semibold text-[#0D8F69]">
                  <span className="h-2 w-2 rounded-full bg-[#12B886]" />
                  All at once
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold leading-7 text-[#111315]">
                Speak, select text, and snap regions in the same task.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-[#E3EBE5] bg-[#F8FAF7] p-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5F6A63]">
                    <Mic className="h-4 w-4 text-[#0D8F69]" />
                    Voice · live
                  </p>
                  <div className="mt-4 flex h-12 items-end gap-1.5" aria-label="Voice waveform">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i} className="wbar w-1 rounded-full bg-[#12B886]" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#3F4944]">&ldquo;{voiceTranscript}&rdquo;</p>
                </div>

                <div className="rounded-xl border border-[#E3EBE5] bg-white p-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5F6A63]">
                    <TextCursorInput className="h-4 w-4 text-[#0D8F69]" />
                    Selections · 2
                  </p>
                  <div className="mt-3 space-y-2">
                    {selections.map((selection, index) => (
                      <div
                        key={selection.label}
                        className={`capture-block capture-chip capture-chip-${index + 1} selection-card selection-card-${index + 1} relative overflow-hidden rounded-lg border border-[#DDE4DC] bg-[#F8FAF7] px-3 py-2 shadow-[0_8px_18px_rgba(37,48,41,0.04)]`}
                      >
                        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A857D]">
                          <span className="h-2 w-2 rounded-full bg-[#12B886]" />
                          {selection.label}
                        </p>
                        <div className="mt-2 font-mono text-sm leading-6 text-[#3F4944]">
                          {index === 0 ? (
                            <p>
                              const handler = <span className="sel-target relative">{selection.content}</span>
                            </p>
                          ) : (
                            <p>
                              <span className="sel-target relative">{selection.content}</span>
                            </p>
                          )}
                        </div>
                        <svg className="sel-cursor sel-cursor-arrow" viewBox="0 0 16 20" aria-hidden="true">
                          <path d="M1 1 L1 14 L4.5 11 L7 16.5 L9 15.5 L6.5 10 L11 10 Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
                        </svg>
                        <svg className="sel-cursor sel-cursor-ibeam" viewBox="0 0 10 16" aria-hidden="true">
                          <path d="M2 1 H8 M5 1 V15 M2 15 H8" stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E3EBE5] bg-[#F1F6F2] p-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5F6A63]">
                    <ImageIcon className="h-4 w-4 text-[#0D8F69]" />
                    Screenshots · 2
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {screenshots.map((screenshot, index) => (
                      <div
                        key={screenshot.label}
                        className={`capture-block capture-thumb capture-thumb-${index + 1} snap-demo snap-demo-${index + 1} relative overflow-hidden rounded-lg border border-[#DDE4DC] bg-white p-2 shadow-[0_8px_18px_rgba(37,48,41,0.05)]`}
                      >
                        <div className="flex items-center gap-1 border-b border-[#EFF2EE] pb-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
                        </div>
                        <div className="space-y-1.5 py-3">
                          <div className="h-1.5 w-4/5 rounded bg-[#DDE4DC]" />
                          <div className="h-1.5 w-3/5 rounded bg-[#DDE4DC]" />
                          <div className="h-7 rounded-lg bg-[#E9F8F2]" />
                        </div>
                        <div className="snap-rect" />
                        <svg className="snap-crosshair" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 1 V23 M1 12 H23" stroke="#fff" strokeWidth="4" strokeLinecap="square" />
                          <path d="M12 1 V23 M1 12 H23" stroke="#000" strokeWidth="2" strokeLinecap="square" />
                          <circle cx="12" cy="12" r="1.2" fill="#fff" />
                        </svg>
                        <div className="snap-flash" />
                        <div className="absolute bottom-2 right-2 text-[10px] font-semibold text-[#7A857D]">{screenshot.index}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDE4DC] bg-white text-[#0D8F69] shadow-[0_8px_24px_rgba(37,48,41,0.08)]">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>

            <div className="rounded-[22px] border border-[#1F2421] bg-[#101413] p-5 text-left text-white shadow-[0_18px_60px_rgba(16,20,19,0.18)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8CE8CB]">Deliver</p>
              <p className="mt-4 text-xl font-semibold leading-7 text-white">Structured result from the same capture.</p>

              <div className="mt-5 rounded-2xl bg-[#F8FAF7] p-4 text-[#111315]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">Fovea output</p>
                  <span className="rounded-full bg-[#E9F8F2] px-3 py-1 text-[11px] font-semibold text-[#0D8F69]">Tidied</span>
                </div>

                <div className="mt-4 space-y-3">
                  <section className="rounded-xl border border-[#DDE4DC] bg-[#EFF7F2] p-4">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0D8F69]">
                      <Mic className="h-4 w-4" />
                      Voice transcript
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#3F4944]">&ldquo;{voiceTranscript}&rdquo;</p>
                  </section>

                  <section className="rounded-xl border border-[#DDE4DC] bg-[#EFF7F2] p-4">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0D8F69]">
                      <TextCursorInput className="h-4 w-4" />
                      Selections · 2
                    </p>
                    <div className="mt-3 space-y-2">
                      {selections.map((selection) => (
                        <div key={selection.label} className="rounded-lg border border-[#DDE4DC] bg-white px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A857D]">{selection.label}</p>
                          <p className="mt-1 truncate font-mono text-sm text-[#3F4944]">{selection.content}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-xl border border-[#DDE4DC] bg-[#EFF7F2] p-4">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0D8F69]">
                      <ImageIcon className="h-4 w-4" />
                      Screenshots · 2
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {screenshots.map((screenshot) => (
                        <div key={screenshot.label} className="overflow-hidden rounded-lg border border-[#DDE4DC] bg-white p-2">
                          <div className="flex items-center gap-1 border-b border-[#EFF2EE] pb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
                          </div>
                          <div className="space-y-1.5 py-3">
                            <div className="h-1.5 w-4/5 rounded bg-[#DDE4DC]" />
                            <div className="h-1.5 w-3/5 rounded bg-[#DDE4DC]" />
                            <div className="h-8 rounded-lg bg-[#E9F8F2]" />
                          </div>
                          <p className="text-[10px] font-semibold text-[#7A857D]">{screenshot.label} {screenshot.index}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
