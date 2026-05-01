"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import SiteFooter from "./SiteFooter";

const SECTIONS = [
  { id: "s1",  num: "1",  title: "Acceptance of Terms" },
  { id: "s2",  num: "2",  title: "Your Account" },
  { id: "s3",  num: "3",  title: "Your Content" },
  { id: "s4",  num: "4",  title: "Our Services" },
  { id: "s5",  num: "5",  title: "Restrictions" },
  { id: "s6",  num: "6",  title: "Privacy" },
  { id: "s7",  num: "7",  title: "Third-Party Services" },
  { id: "s8",  num: "8",  title: "Paid Services" },
  { id: "s9",  num: "9",  title: "Intellectual Property" },
  { id: "s10", num: "10", title: "Warranty Disclaimers" },
  { id: "s11", num: "11", title: "Limitation of Liability" },
  { id: "s12", num: "12", title: "Termination" },
  { id: "s13", num: "13", title: "Changes to These Terms" },
  { id: "s14", num: "14", title: "Governing Law" },
  { id: "s15", num: "15", title: "Contact" },
];

const HIGHLIGHTS = [
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Your content stays yours",
    body: "You own everything you capture and the AI output it produces.",
  },
  {
    icon: <LockKeyhole className="h-5 w-5" />,
    title: "Beta means change",
    body: "Features may shift; we'll tell you before anything reduces your rights.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Cancel any time",
    body: "Uninstall stops the service. Subscriptions cancel from inside the app.",
  },
];

export default function TermsPageContent() {
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
              <FileText className="h-3.5 w-3.5 text-[#12B886]" />
              Terms of Service
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#111315] sm:text-6xl">
              The agreement, in plain words.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#5A665F]">
              These terms cover how you use Fovea, what stays yours, and how we
              operate the service while it&apos;s in beta.
            </p>
            <p className="mt-4 text-sm text-[#6A756E]">Last updated: April 2026</p>
          </div>

          <div className="grid gap-3">
            {HIGHLIGHTS.map((item) => (
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
            <h2 className="text-lg font-semibold">Contents</h2>
            <ol className="mt-5 space-y-1 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-lg px-3 py-2 text-[#5F6A63] transition hover:bg-[#F8FAF7] hover:text-[#111315]"
                  >
                    {s.num}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="space-y-4">
            <Section id="s1" title="1. Acceptance of Terms">
              <p>
                By downloading, installing, or using Fovea for Mac (the &quot;Software&quot;),
                you agree to be bound by these Terms of Service and our{" "}
                <Link href="/privacy" className="font-semibold text-[#0D8F69] hover:underline">
                  Privacy Policy
                </Link>
                . If you do not agree, do not use the Software.
              </p>
            </Section>

            <Section id="s2" title="2. Your Account">
              <p>
                You must create an account to use Fovea. You are responsible for
                keeping your credentials secure and for all activity under your
                account. Notify us immediately if you suspect unauthorized access.
              </p>
            </Section>

            <Section id="s3" title="3. Your Content">
              <p>
                You retain ownership of all content you provide to the Software,
                including voice input, text selections, screenshots, and files. By
                using the Software, you grant Fovea a limited license to process
                this content solely to provide the Services.
              </p>
              <p className="mt-3">
                AI-generated output belongs to you. Fovea makes no representations
                or warranties regarding the accuracy, completeness, or fitness of
                any AI-generated output.
              </p>
            </Section>

            <Section id="s4" title="4. Our Services">
              <p>
                Fovea is a macOS application that captures user-triggered voice
                input, selected text, screenshots, and visible screen details, then
                structures that material for the next tool or workflow. The
                Software is currently in beta — features may change and the
                service may be interrupted without prior notice.
              </p>
              <p className="mt-3">
                We grant you a revocable, non-exclusive, non-transferable, limited
                right to access and use the Services in accordance with these Terms.
              </p>
            </Section>

            <Section id="s5" title="5. Restrictions">
              <p>You agree not to:</p>
              <ul className="mt-4 space-y-3">
                {[
                  "Reverse-engineer, decompile, or disassemble any part of the Software.",
                  "Use the Software to violate any applicable laws or regulations.",
                  "Attempt to circumvent usage quotas or access controls.",
                  "Redistribute, sublicense, or resell the Software without authorization.",
                  "Record or transcribe others' speech without their consent.",
                  "Use the Software to generate content that promotes violence, hatred, or discrimination.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D8F69]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="s6" title="6. Privacy">
              <p>
                Your use of the Services is governed by our{" "}
                <Link href="/privacy" className="font-semibold text-[#0D8F69] hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and handle your data. By
                using the Software, you acknowledge that you have read and
                understood that policy.
              </p>
            </Section>

            <Section id="s7" title="7. Third-Party Services">
              <p>
                Fovea integrates with third-party AI providers to process your
                prompts. When you use these services through Fovea, your content
                is sent to the respective provider. When available and applicable,
                Fovea may use provider settings intended to limit data retention.
                Third-party providers may still handle your data according to
                their own terms — Fovea is not responsible for their availability
                or practices.
              </p>
            </Section>

            <Section id="s8" title="8. Paid Services">
              <p>
                Free trial and subscription terms are displayed within the
                application. Usage quotas apply based on your plan. You may
                cancel your subscription at any time. Fee changes take effect at
                the next renewal period with reasonable notice.
              </p>
            </Section>

            <Section id="s9" title="9. Intellectual Property">
              <p>
                Fovea and all related trademarks, logos, and content are the
                property of Fovea AI. These Terms grant no rights to our
                intellectual property beyond the limited license to use the
                Software.
              </p>
            </Section>

            <Section id="s10" title="10. Warranty Disclaimers" tone="legal">
              <p>
                To the maximum extent permitted by applicable law, the Software
                is provided &quot;as is&quot; and &quot;as available&quot;
                without warranties of any kind, either express or implied. We do
                not warrant that the Software will be uninterrupted, error-free,
                or free of harmful components.
              </p>
            </Section>

            <Section id="s11" title="11. Limitation of Liability" tone="legal">
              <p>
                To the maximum extent permitted by law, Fovea shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of your use of the Software,
                including loss of data, loss of profits, or business interruption.
              </p>
            </Section>

            <Section id="s12" title="12. Termination">
              <p>
                We may suspend or terminate your access to the Software at any
                time if you violate these Terms or create risk for Fovea. You may
                stop using the Software at any time by uninstalling it.
              </p>
            </Section>

            <Section id="s13" title="13. Changes to These Terms">
              <p>
                We may update these Terms from time to time. We will notify you
                of significant changes that reduce your rights. Changes do not
                apply retroactively. Continued use of the Software after changes
                constitutes acceptance of the updated terms.
              </p>
            </Section>

            <Section id="s14" title="14. Governing Law">
              <p>
                These Terms are governed by the laws of the State of California,
                excluding conflict of law principles.
              </p>
            </Section>

            <Section id="s15" title="15. Contact">
              <p>
                If you have questions about these Terms, reach out through our{" "}
                <Link href="/feedback" className="font-semibold text-[#0D8F69] hover:underline">
                  feedback page
                </Link>
                .
              </p>
            </Section>
          </div>
        </section>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}

function Section({
  id,
  title,
  children,
  tone,
}: {
  id: string;
  title: string;
  children: ReactNode;
  tone?: "legal";
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-[24px] border border-[#DDE4DC] bg-white p-6 shadow-[0_12px_40px_rgba(37,48,41,0.04)]"
    >
      <h2 className="text-xl font-semibold text-[#111315]">{title}</h2>
      {tone === "legal" ? (
        <div className="mt-4 rounded-2xl border border-[#E3E9E5] bg-[#F8FAF7] p-5 text-[13px] uppercase leading-7 tracking-wide text-[#4F5B54]">
          {children}
        </div>
      ) : (
        <div className="mt-4 text-sm leading-7 text-[#526058]">{children}</div>
      )}
    </section>
  );
}
