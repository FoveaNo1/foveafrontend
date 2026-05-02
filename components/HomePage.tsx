'use client';

import {
  ArrowRight,
  ClipboardCopy,
  Image as ImageIcon,
  Layers,
  Mic2,
  Send,
  Sparkles,
  TextCursorInput,
} from 'lucide-react';
import Hero from './Hero';
import SiteFooter from './SiteFooter';

const MARQUEE_ITEMS = [
  'ChatGPT', 'Slack', 'Notion', 'Cursor', 'Apple Notes', 'Claude', 'Linear',
  'Gmail', 'Obsidian', 'Discord', 'Gemini', 'iMessage', 'Bear', 'Figma',
  'Perplexity', 'VS Code', 'DeepSeek',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F8F4] text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315]">
      <Hero downloadHref="/download" />

      {/* ── Marquee: destination pills ── */}
      <section className="border-y border-[#DDE4DC] bg-white py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#7A857D]">
          Drops into wherever you type — AI, notes, IM, browsers
        </p>
        <div className="relative mt-6 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-3 whitespace-nowrap pl-4">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={`${item}-${i}`} className="rounded-full border border-[#D8E1DA] bg-[#F8FAF7] px-4 py-2 text-sm font-medium text-[#3F4944]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#F7F8F4] px-5 py-24 sm:px-6 lg:px-8" id="guide">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[0.78fr_1.22fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
                Speak and capture happen together. Deliver finishes it once.
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-[#5A665F]">
              After the hotkey starts a session, voice, selected text, and screenshots can enter the same input in parallel. Fovea then assembles and delivers the result with one action.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[#DDE4DC] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <Mic2 className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-[#111315]">1. Speak your intent</h3>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                Hold the hotkey and say what you need — no need to switch windows or open a chat box.
              </p>
            </div>
            <div className="rounded-[22px] border border-[#DDE4DC] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <Layers className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-[#111315]">2. Capture in parallel</h3>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                Add multiple text selections and screenshots while you keep speaking. They land in the same task.
              </p>
            </div>
            <div className="rounded-[22px] border border-[#111315] bg-[#111315] p-6 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#8CE8CB]">
                <Send className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">3. Deliver in one action</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Fovea structures the package and sends it to ChatGPT, Claude, Cursor, Codex, or your chosen target.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features / Capabilities ── */}
      <section className="bg-white px-5 py-24 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">Capabilities</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
                One shortcut into every app you work in.
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-[#5A665F]">
              Fovea doesn&apos;t replace the apps you use — it gets your thoughts into them faster. Capture what&apos;s on your screen, package it cleanly, and hand it off to any text field.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#DDE4DC] bg-[#F8FAF7] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <Mic2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#111315]">Voice task flow</h3>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                Press a hotkey and speak while selecting text or screenshots. Materials-only mode lets you skip voice and just move the materials.
              </p>
            </div>
            <div className="rounded-2xl border border-[#DDE4DC] bg-[#F8FAF7] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <TextCursorInput className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#111315]">Quick Q&amp;A</h3>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                Ask a lightweight question about the current screen, selected text, or captured area without switching windows.
              </p>
            </div>
            <div className="rounded-2xl border border-[#DDE4DC] bg-[#F8FAF7] p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#111315]">Prompt builder</h3>
              <p className="mt-3 text-sm leading-6 text-[#5F6A63]">
                Combine voice, materials, OCR, and current work context into an editable instruction before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="bg-[#F7F8F4] px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">What changes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
              From six manual steps to one handoff.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5A665F]">
              The bottleneck isn&apos;t one slow prompt. It&apos;s repeating screenshots, copying, switching windows, pasting, explaining, and submitting — every single time.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAF7] text-[#7A857D]">
                  <ClipboardCopy className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold text-[#111315]">Before Fovea</h3>
              </div>
              <ol className="space-y-2 text-sm leading-6 text-[#526058]">
                {['Take screenshot', 'Copy selected text', 'Switch to ChatGPT/Claude', 'Paste each piece separately', 'Type explanation', 'Submit'].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono text-[#A4ADA7]">{String(i + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DDE4DC] bg-white text-[#0D8F69] shadow-[0_10px_24px_rgba(37,48,41,0.06)]">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
            <div className="rounded-[24px] border border-[#BFE3D4] bg-[#E9F8F2] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D8F69] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold text-[#111315]">With Fovea</h3>
              </div>
              <ol className="space-y-2 text-sm leading-6 text-[#3F4944]">
                <li className="flex gap-3"><span className="font-mono text-[#0D8F69]">01</span><span>Press hotkey, speak, capture</span></li>
                <li className="flex gap-3"><span className="font-mono text-[#0D8F69]">02</span><span>Deliver</span></li>
              </ol>
              <p className="mt-6 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-[#3F4944]">
                Fovea assembles the package in the background — voice transcription, material organization, and instruction assembly all happen automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        text="© 2026 FOVEA AI. ALL RIGHTS RESERVED."
        variant="light"
        pricingHref="/pricing"
        feedbackHref="/feedback"
        pricingLabel="Pricing"
        feedbackLabel="Feedback"
        privacyLabel="Privacy Policy"
        termsLabel="Terms of Service"
      />
    </main>
  );
}
