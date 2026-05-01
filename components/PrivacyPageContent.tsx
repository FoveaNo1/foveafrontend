"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  EyeOff,
  LockKeyhole,
  Mic2,
  MonitorUp,
  ShieldCheck,
} from "lucide-react";
import SiteFooter from "./SiteFooter";

const principles = [
  {
    title: "User-triggered capture",
    body: "Fovea works with the voice, selected text, screenshots, and visible screen details you choose to include in the current capture action.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "No memory lookup today",
    body: "The current product does not pull from long-term memory, background history, or an automatic knowledge base.",
    icon: <EyeOff className="h-5 w-5" />,
  },
  {
    title: "Portable output",
    body: "Fovea structures the captured material so you can move it into the next tool or workflow without locking it inside Fovea.",
    icon: <Database className="h-5 w-5" />,
  },
];

export default function PrivacyPageContent() {
  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8D6CE] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#4E5A53]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#12B886]" />
              Privacy Policy
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#111315] sm:text-6xl">
              Clear capture. Clear control.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#5A665F]">
              Fovea is a multimodal input tool. It handles the material you
              actively capture for the current action: voice, text, images, and
              visible screen details.
            </p>
            <p className="mt-4 text-sm text-[#6A756E]">Last updated: April 2026</p>
          </div>

          <div className="grid gap-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#DDE4DC] bg-white p-5 shadow-[0_12px_40px_rgba(37,48,41,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                    {item.icon}
                  </span>
                  <div>
                    <h2 className="font-semibold text-[#111315]">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[#5F6A63]">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="grid gap-4 lg:grid-cols-[0.74fr_1.26fr]">
          <aside className="rounded-[24px] border border-[#DDE4DC] bg-white p-6 lg:sticky lg:top-5 lg:self-start">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[#5F6A63]">
              <p>We process captured material to provide Fovea features.</p>
              <p>We do not sell your data or use customer content to train Fovea-owned models.</p>
              <p>Local session history may remain on your device until you delete it.</p>
            </div>
          </aside>

          <div className="space-y-4">
            <PolicySection title="Information We Collect">
              <PolicySubsection title="Captured material">
                Voice input, selected text, screenshots, copied material, and visible screen details
                may be processed when you trigger a capture. Fovea does not automatically search
                long-term memory or background history in the current product.
              </PolicySubsection>
              <PolicySubsection title="Account and usage information">
                We collect account information such as email address, authentication identifiers,
                app version, plan status, and usage metrics needed to operate the service.
              </PolicySubsection>
              <PolicySubsection title="Diagnostics">
                If you submit diagnostics or feedback, we may receive logs, system information, and
                the information you choose to include in the report.
              </PolicySubsection>
            </PolicySection>

            <PolicySection title="How We Use Information">
              <ul className="space-y-3 text-sm leading-6 text-[#526058]">
                <PolicyItem>Provide multimodal capture, structuring, and delivery features.</PolicyItem>
                <PolicyItem>Manage accounts, quotas, beta access, and future billing.</PolicyItem>
                <PolicyItem>Respond to support requests and product feedback.</PolicyItem>
                <PolicyItem>Improve reliability, performance, and product quality.</PolicyItem>
                <PolicyItem>Meet legal, security, and compliance obligations.</PolicyItem>
              </ul>
            </PolicySection>

            <PolicySection title="Third-Party Providers">
              <p>
                Fovea may send captured material to infrastructure providers and AI providers when
                needed to perform the feature you requested. Those providers process data under
                their own terms, privacy policies, account settings, and retention controls.
              </p>
            </PolicySection>

            <PolicySection title="Retention">
              <ul className="space-y-3 text-sm leading-6 text-[#526058]">
                <PolicyItem>Captured material is processed for the requested action and not retained by Fovea longer than needed to operate that request.</PolicyItem>
                <PolicyItem>Local session history may remain on your device until you delete it.</PolicyItem>
                <PolicyItem>Account, billing, and operational records are retained as needed to provide the service and meet legal obligations.</PolicyItem>
                <PolicyItem>Feedback and diagnostic reports are retained as needed to investigate and improve the product.</PolicyItem>
              </ul>
            </PolicySection>

            <PolicySection title="Permissions We Request">
              <div className="grid gap-3 sm:grid-cols-3">
                <Permission icon={<Mic2 className="h-4 w-4" />} title="Microphone" body="For voice input." />
                <Permission icon={<MonitorUp className="h-4 w-4" />} title="Screen Recording" body="For screenshots and visible details." />
                <Permission icon={<LockKeyhole className="h-4 w-4" />} title="Accessibility" body="For selected material and delivery actions." />
              </div>
            </PolicySection>

            <PolicySection title="Data We Do Not Sell">
              <p>
                We do not sell your data, share it for third-party advertising, or use your captured
                material to train Fovea-owned models. We also do not track your full browsing history.
              </p>
            </PolicySection>

            <PolicySection title="Contact">
              <p>
                If you have questions about privacy or want to request a data-related action, reach
                out through the{" "}
                <Link href="/feedback" className="font-semibold text-[#0D8F69] hover:underline">
                  feedback page
                </Link>
                .
              </p>
            </PolicySection>
          </div>
        </section>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-[#DDE4DC] bg-white p-6 shadow-[0_12px_40px_rgba(37,48,41,0.04)]">
      <h2 className="text-xl font-semibold text-[#111315]">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[#526058]">{children}</div>
    </section>
  );
}

function PolicySubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="font-semibold text-[#111315]">{title}</h3>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function PolicyItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0D8F69]" />
      <span>{children}</span>
    </li>
  );
}

function Permission({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#DDE4DC] bg-[#F8FAF7] p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold text-[#111315]">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#5F6A63]">{body}</p>
    </div>
  );
}
