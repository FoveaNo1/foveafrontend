"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, ChevronDown } from "lucide-react";
import SiteFooter from "./SiteFooter";
import { getSiteCopy } from "../lib/site-copy";

const proFeatures = [
  "Unlimited captures",
  "Browser companion (Cursor, Codex, MCP)",
  "Priority model routing",
  "Custom hotkeys & templates",
  "Early access to new delivery targets",
  "Prioritized feature requests",
];

const freeFeatures = [
  "50 captures / week",
  "Voice + text + image input",
  "On-device session history",
  "Personal dictionary",
];

const captureRows: [string, string, string][] = [
  ["Captures per week", "50", "Unlimited"],
  ["Voice + text + image", "check", "check"],
  ["Browser companion", "—", "check"],
  ["Custom hotkeys", "—", "check"],
  ["Priority model routing", "—", "check"],
  ["Personal dictionary", "check", "check"],
  ["Early access", "—", "check"],
  ["Prioritized requests", "—", "check"],
];

const securityRows: [string, string, string][] = [
  ["Zero cloud retention", "check", "check"],
  ["Never used to train models", "check", "check"],
  ["On-device session history", "check", "check"],
  ["GDPR-aligned data controls", "check", "check"],
];

const faqItems = [
  {
    question: "When does paid billing start?",
    answer:
      "Paid plans will be introduced with advance notice. Until then, the macOS beta is open to use.",
  },
  {
    question: "Is there a free trial of Pro?",
    answer:
      "When billing turns on, every new account starts on a 30-day Pro trial. After that, you switch to Free unless you upgrade.",
  },
  {
    question: "How do I cancel?",
    answer:
      "From the Account page inside the Fovea app. You keep Pro until the end of the billing period.",
  },
  {
    question: "What counts as a capture?",
    answer:
      "One delivery action — including any voice, text selections, and screenshots packaged in that session.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "All major cards via Stripe. Team plans support invoicing.",
  },
  {
    question: "Do you offer refunds?",
    answer: "14-day refund on first paid month, no questions asked.",
  },
];

function ComparisonCell({ value }: { value: string }) {
  if (value === "check") {
    return <Check className="mx-auto h-5 w-5 text-[#0D8F69]" />;
  }
  if (value === "—") {
    return <span className="text-[#A4AEA7]">—</span>;
  }
  return <span className="text-sm text-[#111315]">{value}</span>;
}

export default function PricingPageContent() {
  const copy = getSiteCopy();

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.nav.backHome}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </header>

        {/* Headline */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl py-16 text-center md:py-20"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-[#111315] sm:text-6xl">
            One price. Every modality. Every model.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5A665F]">
            Lock in the early-bird annual price before paid billing turns on.
          </p>
        </motion.section>

        {/* Plans grid */}
        <section className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
          {/* Pro card */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col rounded-[24px] border border-[#0D8F69] bg-gradient-to-br from-[#F1FBF6] to-[#E9F8F2] p-8 shadow-[0_16px_50px_rgba(37,48,41,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-[#111315]">Pro</h2>
                <p className="mt-1 text-sm text-[#5F6A63]">For power users</p>
              </div>
              <span className="rounded-full bg-[#0D8F69] px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            </div>

            <div className="mt-8">
              <span className="text-6xl font-semibold tracking-tight text-[#111315]">$9.9</span>
              <span className="ml-2 text-sm text-[#6A756E]">USD</span>
              <p className="mt-1 text-sm text-[#6A756E]">/ member / month, billed yearly</p>
            </div>

            <p className="mt-3 text-sm text-[#6A756E]">
              <span className="line-through">$24</span>{" "}
              <span>$24 when billed monthly</span>
            </p>

            <Link
              href="/checkout"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#111315] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2d30]"
            >
              Get started
            </Link>

            <div className="mt-8 h-px bg-[#C8D6CE]" />

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#5F6A63]">
              Everything in Free, plus:
            </p>

            <ul className="mt-4 space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D8F69]" />
                  <span className="text-[#3A4A40]">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.article>

          {/* Free card */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col rounded-[24px] border border-[#DDE4DC] bg-white p-8 shadow-[0_16px_50px_rgba(37,48,41,0.06)]"
          >
            <div>
              <h2 className="text-3xl font-semibold text-[#111315]">Free</h2>
              <p className="mt-1 text-sm text-[#5F6A63]">For beginners</p>
            </div>

            <div className="mt-8">
              <span className="text-6xl font-semibold tracking-tight text-[#111315]">$0</span>
              <span className="ml-2 text-sm text-[#6A756E]">USD</span>
              <p className="mt-1 text-sm text-[#6A756E]">/ member / month</p>
            </div>

            <Link
              href="/download"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8E1DA] bg-white px-5 py-3 text-sm font-semibold text-[#111315] transition hover:border-[#AFC2B5]"
            >
              Create account
            </Link>

            <div className="mt-8 h-px bg-[#E3E9E5]" />

            <ul className="mt-6 space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#7A857D]" />
                  <span className="text-[#526058]">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        </section>

        {/* Plans & features comparison table */}
        <section className="mx-auto mt-20 max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#111315]">
              Plans &amp; features
            </h2>
            <p className="mt-3 text-base text-[#5A665F]">
              Full breakdown across plans.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[24px] border border-[#DDE4DC] bg-white">
            {/* Table header */}
            <div className="grid grid-cols-[1.6fr_repeat(2,1fr)] border-b border-[#DDE4DC] px-6 py-4">
              <div />
              <div className="text-center text-sm font-semibold text-[#111315]">Free</div>
              <div className="text-center text-sm font-semibold text-[#111315]">Pro</div>
            </div>

            {/* Capture & delivery */}
            <div className="bg-[#F8FAF7] px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5F6A63]">
                Capture &amp; delivery
              </span>
            </div>
            {captureRows.map(([name, free, pro]) => (
              <div
                key={name}
                className="grid grid-cols-[1.6fr_repeat(2,1fr)] border-t border-[#EEF1EC] px-6 py-3.5"
              >
                <div className="text-sm text-[#3A4A40]">{name}</div>
                <div className="text-center">
                  <ComparisonCell value={free} />
                </div>
                <div className="text-center">
                  <ComparisonCell value={pro} />
                </div>
              </div>
            ))}

            {/* Security & privacy */}
            <div className="border-t border-[#DDE4DC] bg-[#F8FAF7] px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5F6A63]">
                Security &amp; privacy
              </span>
            </div>
            {securityRows.map(([name, free, pro]) => (
              <div
                key={name}
                className="grid grid-cols-[1.6fr_repeat(2,1fr)] border-t border-[#EEF1EC] px-6 py-3.5"
              >
                <div className="text-sm text-[#3A4A40]">{name}</div>
                <div className="text-center">
                  <ComparisonCell value={free} />
                </div>
                <div className="text-center">
                  <ComparisonCell value={pro} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section className="mx-auto max-w-4xl py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#111315]">
            Pricing FAQ
          </h2>
          <div className="mt-8 grid gap-3">
            {faqItems.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#DDE4DC] bg-white p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#111315]">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#A4AEA7] transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#5F6A63]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
