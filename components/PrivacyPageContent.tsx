"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "./SiteFooter";

export default function PrivacyPageContent() {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[#6A756E]">Last updated: June 2026</p>

          <div className="mt-10 space-y-8 text-[15px] leading-7">
            <LegalSection title="Introduction">
              <p className="mt-3">
                This Privacy Policy describes how Fovea (&quot;Fovea&quot; or
                &quot;Company&quot;) collects, uses, and handles your personal
                data when you use our macOS application and related services
                (collectively, the &quot;Services&quot;). By using the Services,
                you agree to the practices described in this policy.
              </p>
            </LegalSection>

            <LegalSection title="Information We Collect">
              <h3 className="mt-4 font-semibold text-[#111315]">Customer Content You Provide</h3>
              <p className="mt-2">
                Your voice inputs, text selections, screenshots, and other
                contextual information are processed in real time by Fovea
                and/or third-party AI providers to provide the requested result,
                and are immediately discarded once the result is returned to your
                device. No voice recordings, prompt content, or screen context
                data are stored on our servers after processing.
              </p>
              <p className="mt-2">
                Your device may store a local session history and an on-device
                Memory — including audio, screenshots, and generated prompts —
                until you choose to delete it. The full Memory database and its
                media (your audio, screenshots, and files) stay on your device; we
                do not upload or retain them on our servers unless you explicitly
                re-submit a previous request.
              </p>
              <p className="mt-2">
                To organize and index your Memory so it can be searched, short
                text and metadata excerpts derived from it — such as your
                question, the answer summary, the source app, website, or title
                you were viewing, on-screen selections, and gaze signals — may be
                sent in real time to our processing relay and third-party AI
                providers, then immediately discarded; the resulting search index
                is written back to your device. This can happen automatically —
                for example when a memory is created or when you open the Memory
                view — not only when you re-submit a request. We do not retain
                this content on our servers. See &quot;On-Device Memory&quot; below.
              </p>

              <h3 className="mt-4 font-semibold text-[#111315]">Account Information</h3>
              <p className="mt-2">
                When you create an account, we collect your email address for
                authentication and usage tracking. We also collect usage metrics
                such as prompt count and quota usage to manage your subscription.
              </p>

              <h3 className="mt-4 font-semibold text-[#111315]">Diagnostic Information</h3>
              <p className="mt-2">
                If you voluntarily submit a diagnostic report, we collect
                application logs, system information, and an anonymous identifier
                to help resolve issues. Diagnostic data is only uploaded when you
                manually trigger it. It does not include your voice recordings,
                screenshots, prompt content, or any personally identifiable
                information beyond the anonymous identifier.
              </p>

              <h3 className="mt-4 font-semibold text-[#111315]">Usage Data</h3>
              <p className="mt-2">
                We may collect information related to how you interact with the
                Services, including device type, app version, and performance
                metrics. This data is used to improve the Services and is not
                linked to your prompt content.
              </p>
            </LegalSection>

            <LegalSection title="On-Device Memory">
              <p className="mt-3">
                To help your AI tools recall earlier context, Fovea can keep a
                Memory of your past interactions. The Memory database and its
                media are stored on your device and are not retained on
                Fovea&apos;s servers. It may include your questions, answer
                summaries, the source app, website URL, and title of the context
                you were viewing, on-screen selections, gaze signals, screenshots,
                automatically generated tags, and locally computed search
                embeddings. As described above, short text and metadata excerpts
                may be relayed in real time to organize and index your Memory, but
                are not stored on our servers.
              </p>
              <p className="mt-2">
                Memory is on by default, and the app explains it when you first
                set up Fovea. Because this data lives on your device, you control
                it directly: you can pause it, hide or delete individual items,
                block specific apps or websites, or clear all of it at any time
                from within the app.
              </p>
              <p className="mt-2">
                Memory Connector — Fovea offers an optional connector that runs
                locally on your Mac and lets an AI client you choose read the
                memories you have not hidden. If you install this connector and
                connect your own AI client, that client can read those memories —
                including their screenshots and source pages — and will send them
                to its own AI provider under that provider&apos;s terms. This
                happens only because you set it up; Fovea&apos;s servers are not
                involved in this transfer. The connector runs locally, exposes
                the memories currently visible to it (those you have not hidden or
                deleted), can perform local actions such as soft-deleting a memory
                when your AI client asks it to, and keeps a local log of its own
                access on your device.
              </p>
            </LegalSection>

            <LegalSection title="Use of Data">
              <p className="mt-3">Fovea uses the information we collect for the following purposes:</p>
              <p className="mt-2">
                Service operation — Your voice data and contextual information
                are processed in real time and are not retained after delivering
                results to your device.
              </p>
              <p className="mt-2">Account management — Managing your subscription, authentication, and usage quotas.</p>
              <p className="mt-2">Communication — Responding to support requests and sending service-related notifications.</p>
              <p className="mt-2">Improvement — Analyzing usage patterns and diagnostic reports to improve the Services.</p>
              <p className="mt-2">Compliance — Meeting applicable legal obligations.</p>
            </LegalSection>

            <LegalSection title="Data We Do NOT Collect">
              <p className="mt-3">
                Fovea does not retain your voice recordings, screenshots, or
                prompt content on its servers after processing.
              </p>
              <p className="mt-2">Fovea does not use your content to train its own models.</p>
              <p className="mt-2">We do not track your browsing history.</p>
              <p className="mt-2">We do not sell your data or share it with third parties for advertising.</p>
            </LegalSection>

            <LegalSection title="Sharing With Others">
              <p className="mt-3">We may share your information with the following parties:</p>
              <p className="mt-2">
                AI service providers — When you use Fovea&apos;s features, your
                prompt content may be sent to third-party AI providers to
                generate responses. These providers process your data under their
                own terms, privacy policies, and retention settings. Where
                provider features intended to limit data retention are available,
                Fovea enables them where applicable.
              </p>
              <p className="mt-2">
                Infrastructure providers — We use third-party services for
                authentication, data storage, and error tracking. These providers
                have access to your data only to perform tasks on our behalf and
                are obligated not to use it for any other purpose.
              </p>
              <p className="mt-2">Legal compliance — We may disclose information when required by law or to protect our rights.</p>
            </LegalSection>

            <LegalSection title="Retention of Data">
              <p className="mt-3">
                Voice and context data — Processed in real time and immediately
                discarded once the result is returned to your device.
              </p>
              <p className="mt-2">Local session history — Stored on your device until you choose to delete it.</p>
              <p className="mt-2">
                Account and billing information — Retained as necessary to
                provide Services, comply with legal obligations, and resolve
                disputes.
              </p>
              <p className="mt-2">Diagnostic reports — Retained only as needed to resolve the reported issue.</p>
            </LegalSection>

            <LegalSection title="Permissions We Request">
              <p className="mt-3">Microphone — Required for voice input.</p>
              <p className="mt-2">Accessibility — Required to read content from your active applications and deliver results to AI tools.</p>
              <p className="mt-2">Screen Recording — Required to capture screen context for your prompts.</p>
            </LegalSection>

            <LegalSection title="Your Rights and Choices">
              <p className="mt-3">
                Your Memory and controls — Your Memory is stored on your device,
                so you control it directly: you can pause capture, hide individual
                items, block specific apps or websites, and permanently delete all
                of it from within the app. Fovea does not hold a server-side copy
                of your Memory content to retrieve or delete on your behalf.
              </p>
              <p className="mt-2">
                Your account information — For the limited information we do hold
                on our servers — your email address and usage metrics — you may
                request access to it, request its deletion, or ask us to stop
                processing it, subject to legal and billing retention
                requirements.
              </p>
              <p className="mt-2">
                Depending on where you live, you may have additional rights under
                laws such as the GDPR (EU, EEA, and UK) or the CCPA/CPRA
                (California), including the right to access and delete your
                personal information. Fovea does not sell your personal data. To
                exercise any of these rights, contact us through our{" "}
                <Link href="/feedback" className="font-semibold text-[#0D8F69] hover:underline">
                  feedback page
                </Link>
                .
              </p>
            </LegalSection>

            <LegalSection title="How We Secure Your Information">
              <p className="mt-3">
                We implement technical and organizational safeguards to protect
                the information we collect from loss, misuse, and unauthorized
                access. All data in transit is encrypted via HTTPS. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </LegalSection>

            <LegalSection title="Changes to This Privacy Policy">
              <p className="mt-3">
                We may update this Privacy Policy from time to time. When we do,
                we will revise the &quot;Last updated&quot; date at the top of
                this page. We will notify you of any significant changes that
                reduce your rights. Changes do not apply retroactively.
              </p>
            </LegalSection>

            <LegalSection title="Contact">
              <p className="mt-3">
                If you have questions about this Privacy Policy or your data,
                please reach out through our{" "}
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
