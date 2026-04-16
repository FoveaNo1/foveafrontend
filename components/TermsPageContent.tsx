"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function TermsPageContent() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-[#00FFC2] selection:text-[#050505] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#888888] hover:text-[#EDEDED] transition-colors mb-12 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-[#EDEDED] mb-3">Terms of Service</h1>
          <p className="text-[#555] text-sm mb-12">Last updated: April 2026</p>

          <div className="space-y-10 text-[#BBBBBB] text-sm leading-relaxed">
            <Section title="Acceptance of Terms">
              <p>
                By downloading, installing, or using Fovea for Mac (&quot;the Software&quot;), you agree
                to be bound by these Terms of Service. If you do not agree to these terms, do not use
                the Software.
              </p>
            </Section>

            <Section title="Description of Service">
              <p>
                Fovea is a macOS application that captures context from your active workspace —
                including text selections, screenshots, files, and voice input — and assembles them
                into prompts for AI tools such as ChatGPT, Claude, and Gemini. The Software operates
                primarily on your local device, with certain features requiring network connectivity.
              </p>
            </Section>

            <Section title="Account and Access">
              <ul className="list-disc list-inside space-y-2 text-[#999999]">
                <li>
                  You must create an account to use Fovea. You are responsible for maintaining the
                  security of your account credentials.
                </li>
                <li>
                  Fovea is currently in beta. Access may be limited, and features may change without
                  prior notice.
                </li>
                <li>
                  Free trial and subscription terms are displayed within the application. Usage quotas
                  apply based on your plan.
                </li>
              </ul>
            </Section>

            <Section title="Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#999999] mt-2">
                <li>Reverse-engineer, decompile, or disassemble any part of the Software.</li>
                <li>Use the Software to violate any applicable laws or regulations.</li>
                <li>Attempt to circumvent usage quotas or access controls.</li>
                <li>Redistribute, sublicense, or resell the Software without authorization.</li>
              </ul>
            </Section>

            <Section title="Intellectual Property">
              <p>
                Fovea and all related trademarks, logos, and content are the property of Fovea AI.
                You are granted a limited, non-exclusive, non-transferable license to use the Software
                for personal or professional purposes in accordance with these terms.
              </p>
            </Section>

            <Section title="Data and Privacy">
              <p>
                Your use of Fovea is also governed by our{" "}
                <Link href="/privacy" className="text-[#00FFC2] hover:underline">
                  Privacy Policy
                </Link>
                . By using the Software, you consent to the data practices described therein. Local
                data such as screen context and voice input is processed on your device and is not
                stored on our servers unless explicitly required for AI processing.
              </p>
            </Section>

            <Section title="Third-Party Services">
              <p>
                Fovea integrates with third-party AI providers (OpenAI, Anthropic, Google, DeepSeek,
                and others). When you send prompts through Fovea, the content is transmitted to the
                selected provider. Your use of these services is subject to their respective terms and
                privacy policies. Fovea is not responsible for how third-party providers handle your
                data.
              </p>
            </Section>

            <Section title="Disclaimer of Warranties">
              <p>
                The Software is provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind, either express or implied. We do not guarantee that the
                Software will be uninterrupted, error-free, or free of harmful components. During
                the beta period, you may encounter bugs or incomplete features.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Fovea AI shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising out of
                your use of the Software, including but not limited to loss of data, loss of profits,
                or business interruption.
              </p>
            </Section>

            <Section title="Changes to These Terms">
              <p>
                We may update these Terms of Service from time to time. When we do, we will revise
                the &quot;Last updated&quot; date at the top of this page. Continued use of the
                Software after changes constitutes acceptance of the updated terms.
              </p>
            </Section>

            <Section title="Termination">
              <p>
                We reserve the right to suspend or terminate your access to the Software at any time,
                with or without cause. You may stop using the Software at any time by uninstalling it
                from your device.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                If you have questions about these terms, please reach out through our{" "}
                <Link href="/feedback" className="text-[#00FFC2] hover:underline">
                  feedback page
                </Link>
                .
              </p>
            </Section>
          </div>
        </motion.div>

        <footer className="mt-20 text-center">
          <p className="text-[#333] font-mono text-xs tracking-widest">
            &copy; 2026 FOVEA AI. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#EDEDED] mb-4">{title}</h2>
      {children}
    </div>
  );
}
