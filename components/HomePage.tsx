import {
  ArrowRight,
  ClipboardCopy,
  Clock,
  Code2,
  Image as ImageIcon,
  Link2,
  Lock,
  Plug,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
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
          Drops into wherever you type — AI, notes, and IM
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

      {/* ── Memory ── */}
      <section className="bg-[#F7F8F4] px-5 py-24 sm:px-6 lg:px-8" id="memory">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">Memory</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
              Everything you run through Fovea becomes memory.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#5A665F]">
              A private, searchable record of your work — kept local, and yours to control.
            </p>
          </div>

          {/* Callable hero — the differentiator */}
          <div className="mt-12 flex flex-col gap-6 rounded-[24px] border border-[#1F2421] bg-[#101413] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8CE8CB]">
                <Plug className="h-4 w-4" />
                The differentiator
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug text-white">
                Your memory is callable by your AI.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Recall it right where you prompt — through an open local connector you install yourself.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1F2421] px-3.5 py-2 text-sm font-medium text-[#8CE8CB]">
                <Terminal className="h-4 w-4" />
                Claude Code
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1F2421] px-3.5 py-2 text-sm font-medium text-[#8CE8CB]">
                <Code2 className="h-4 w-4" />
                Codex
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1F2421] px-3.5 py-2 text-sm font-medium text-[#8CE8CB]">
                <Sparkles className="h-4 w-4" />
                Claude Desktop
              </span>
              <span className="pl-1 text-xs text-white/50">+ any MCP client</span>
            </div>
          </div>

          {/* Supporting traits */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111315]">Local &amp; private</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F6A63]">On your device. Our servers store nothing.</p>
            </div>
            <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <Link2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111315]">Keeps its source</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F6A63]">The app, page, and screenshots it came from.</p>
            </div>
            <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111315]">Yours to control</h3>
              <p className="mt-2 text-sm leading-6 text-[#5F6A63]">Pause, hide, blacklist, or delete anytime.</p>
            </div>
          </div>

          {/* The loop */}
          <div className="mt-16 border-t border-[#E3EBE5] pt-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">The loop · it compounds</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111315] sm:text-4xl">
                A flywheel, not a one-way trip.
              </h3>
            </div>

            <div className="mx-auto mt-8 w-full max-w-[420px]">
              <svg
                viewBox="0 0 360 280"
                className="w-full"
                role="img"
                aria-label="The loop: capture and deliver becomes memory, which your AI agents call. A dashed roadmap leg shows memory will later sharpen the entry itself."
              >
                <path d="M180 44 A110 110 0 0 1 275.26 209" fill="none" stroke="#0D8F69" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M275.26 209 A110 110 0 0 1 84.74 209" fill="none" stroke="#0D8F69" strokeWidth="2.5" strokeLinecap="round" />
                <path className="mem-dash" d="M84.74 209 A110 110 0 0 1 180 44" fill="none" stroke="#B7C3BB" strokeWidth="2.5" strokeLinecap="round" />
                <g className="mem-orbit">
                  <circle cx="180" cy="44" r="6" fill="#12B886" stroke="#C9F2E3" strokeWidth="3" />
                </g>
                <circle className="mem-spin" cx="180" cy="154" r="17" fill="none" stroke="#DDE4DC" strokeWidth="1.5" strokeDasharray="3 4" />
                <text x="180" y="151" textAnchor="middle" fontSize="9" fontWeight="500" letterSpacing="1.4" fill="#7A857D">THE</text>
                <text x="180" y="162" textAnchor="middle" fontSize="9" fontWeight="500" letterSpacing="1.4" fill="#7A857D">LOOP</text>
                <g>
                  <text x="180" y="22" textAnchor="middle" fontSize="13" fontWeight="500" fill="#111315">Capture &amp; deliver</text>
                  <circle cx="180" cy="44" r="19" fill="#E9F8F2" stroke="#BFE3D4" strokeWidth="1.5" />
                  <text x="180" y="49" textAnchor="middle" fontSize="15" fontWeight="600" fill="#0D8F69">1</text>
                </g>
                <g>
                  <circle cx="275.26" cy="209" r="19" fill="#0D8F69" />
                  <text x="275.26" y="214" textAnchor="middle" fontSize="15" fontWeight="600" fill="#FFFFFF">2</text>
                  <text x="275.26" y="244" textAnchor="middle" fontSize="13" fontWeight="500" fill="#111315">Becomes memory</text>
                </g>
                <g>
                  <circle cx="84.74" cy="209" r="19" fill="#101413" />
                  <text x="84.74" y="214" textAnchor="middle" fontSize="15" fontWeight="600" fill="#8CE8CB">3</text>
                  <text x="84.74" y="244" textAnchor="middle" fontSize="13" fontWeight="500" fill="#111315">Your AI agents</text>
                </g>
              </svg>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-[#6A756E]">Dashed leg — Memory will sharpen the entry itself</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E0D9] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8A958D]">
                <Clock className="h-3 w-3" />
                Roadmap
              </span>
            </div>

            {/* Privacy strip */}
            <div className="mx-auto mt-10 flex max-w-3xl items-center gap-4 rounded-[20px] border border-[#BFE3D4] bg-white p-5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#111315] text-[#8CE8CB]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="text-sm leading-6 text-[#3F4944]">
                <span className="font-semibold text-[#111315]">The whole loop runs locally — our servers store nothing.</span>{' '}
                Memory is on by default and disclosed at setup; recall runs through a local connector you install yourself.
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
          <div className="mt-12 grid gap-4 md:grid-cols-2">
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
