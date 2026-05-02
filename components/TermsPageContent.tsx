"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "./SiteFooter";

export default function TermsPageContent() {
  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </header>

        <article className="mx-auto max-w-3xl py-14 text-[#3F4944]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111315] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-[#6A756E]">Last updated: April 2026</p>

          <div className="mt-10 space-y-8 text-[15px] leading-7">
            <LegalSection title="1. Acceptance of Terms">
              <p className="mt-3">
                By downloading, installing, or using Fovea for Mac (&quot;the
                Software&quot;), you agree to be bound by these Terms of Service
                and our Privacy Policy. If you do not agree to these terms, do
                not use the Software.
              </p>
            </LegalSection>

            <LegalSection title="2. Your Account">
              <p className="mt-3">
                You must create an account to use Fovea. You are responsible for
                maintaining the security of your account credentials and for all
                activity that occurs under your account. You must notify us
                immediately if you suspect unauthorized access.
              </p>
            </LegalSection>

            <LegalSection title="3. Your Content">
              <p className="mt-3">
                You retain ownership of all content you provide to the Software,
                including voice input, text selections, screenshots, and files.
                By using the Software, you grant Fovea a limited license to
                process this content solely for the purpose of providing the
                Services.
              </p>
              <p className="mt-2">
                AI-generated output belongs to you. Fovea makes no
                representations or warranties regarding the accuracy,
                completeness, or fitness of any AI-generated output.
              </p>
            </LegalSection>

            <LegalSection title="4. Our Services">
              <p className="mt-3">
                Fovea is a macOS application that captures context from your
                active workspace and assembles it into prompts for AI tools. The
                Software is currently in beta. Features may change, and the
                service may be interrupted without prior notice.
              </p>
              <p className="mt-2">
                We grant you a revocable, non-exclusive, non-transferable,
                limited right to access and use the Services in accordance with
                these Terms.
              </p>
            </LegalSection>

            <LegalSection title="5. Restrictions">
              <p className="mt-3">You agree not to:</p>
              <p className="mt-2">Reverse-engineer, decompile, or disassemble any part of the Software.</p>
              <p className="mt-2">Use the Software to violate any applicable laws or regulations.</p>
              <p className="mt-2">Attempt to circumvent usage quotas or access controls.</p>
              <p className="mt-2">Redistribute, sublicense, or resell the Software without authorization.</p>
              <p className="mt-2">Record or transcribe others&apos; speech without their consent.</p>
              <p className="mt-2">Use the Software to generate content that promotes violence, hatred, or discrimination.</p>
            </LegalSection>

            <LegalSection title="6. Privacy">
              <p className="mt-3">
                Your use of the Services is governed by our{" "}
                <Link href="/privacy" className="font-semibold text-[#0D8F69] hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and handle your personal
                data. By using the Software, you acknowledge that you have read
                and understood our Privacy Policy.
              </p>
            </LegalSection>

            <LegalSection title="7. Third-Party Services">
              <p className="mt-3">
                Fovea integrates with third-party AI providers to process your
                prompts. When you use these services through Fovea, your content
                is sent to the respective provider. When available and
                applicable, Fovea may use provider settings intended to limit
                data retention. Third-party providers may still handle your data
                according to their own terms, privacy policies, and account
                settings. Fovea is not responsible for the availability or
                practices of third-party services.
              </p>
            </LegalSection>

            <LegalSection title="8. Paid Services">
              <p className="mt-3">
                Free trial and subscription terms are displayed within the
                application. Usage quotas apply based on your plan. You may
                cancel your subscription at any time. Fee changes take effect at
                the next renewal period with reasonable notice.
              </p>
            </LegalSection>

            <LegalSection title="9. Intellectual Property">
              <p className="mt-3">
                Fovea and all related trademarks, logos, and content are the
                property of Fovea AI. These Terms grant no rights to our
                intellectual property beyond the limited license to use the
                Software.
              </p>
            </LegalSection>

            <LegalSection title="10. Warranty Disclaimers">
              <p className="mt-3">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SOFTWARE
                IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
                WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO
                NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED, ERROR-FREE,
                OR FREE OF HARMFUL COMPONENTS.
              </p>
            </LegalSection>

            <LegalSection title="11. Limitation of Liability">
              <p className="mt-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOVEA SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SOFTWARE,
                INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR
                BUSINESS INTERRUPTION.
              </p>
            </LegalSection>

            <LegalSection title="12. Termination">
              <p className="mt-3">
                We may suspend or terminate your access to the Software at any
                time if you violate these Terms or create risk for Fovea. You
                may stop using the Software at any time by uninstalling it from
                your device.
              </p>
            </LegalSection>

            <LegalSection title="13. Changes to These Terms">
              <p className="mt-3">
                We may update these Terms from time to time. We will notify you
                of significant changes that reduce your rights. Changes do not
                apply retroactively. Continued use of the Software after changes
                constitutes acceptance of the updated terms.
              </p>
            </LegalSection>

            <LegalSection title="14. Governing Law">
              <p className="mt-3">
                These Terms are governed by the laws of the State of California,
                excluding conflict of law principles.
              </p>
            </LegalSection>

            <LegalSection title="15. Contact">
              <p className="mt-3">
                If you have questions about these Terms, please reach out through
                our{" "}
                <Link href="/feedback" className="font-semibold text-[#0D8F69] hover:underline">
                  feedback page
                </Link>
                .
              </p>
            </LegalSection>
          </div>
        </article>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#111315]">{title}</h2>
      {children}
    </section>
  );
}
