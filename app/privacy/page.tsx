'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-[#EDEDED] mb-3">Privacy Policy</h1>
          <p className="text-[#555] text-sm mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-[#BBBBBB] text-sm leading-relaxed">
            <Section title="Overview">
              <p>
                Fovea is a macOS voice assistant that captures context from your active workspace
                to generate AI prompts. We are committed to protecting your privacy and being
                transparent about what data we collect and how we use it.
              </p>
            </Section>

            <Section title="Data We Collect">
              <SubSection title="On Your Device (Local Only)">
                <ul className="list-disc list-inside space-y-2 text-[#999999]">
                  <li>
                    <strong className="text-[#BBBBBB]">Microphone audio</strong> — used for real-time
                    speech transcription. Audio is processed locally or sent to a transcription service,
                    and is not stored after processing.
                  </li>
                  <li>
                    <strong className="text-[#BBBBBB]">Active window content</strong> — screen context
                    from your focused application, used to generate relevant AI prompts. This data stays
                    on your device and is not uploaded to our servers.
                  </li>
                  <li>
                    <strong className="text-[#BBBBBB]">Browser tab information</strong> — when using the
                    companion extension, page content may be captured for context. This data is processed
                    locally.
                  </li>
                </ul>
              </SubSection>

              <SubSection title="Sent to Our Servers">
                <ul className="list-disc list-inside space-y-2 text-[#999999]">
                  <li>
                    <strong className="text-[#BBBBBB]">Account information</strong> — email address for
                    authentication and usage tracking.
                  </li>
                  <li>
                    <strong className="text-[#BBBBBB]">Usage metrics</strong> — prompt count and quota
                    usage to manage your subscription.
                  </li>
                  <li>
                    <strong className="text-[#BBBBBB]">Feedback submissions</strong> — if you choose to
                    submit feedback through our feedback form.
                  </li>
                </ul>
              </SubSection>
            </Section>

            <Section title="Data We Do NOT Collect">
              <ul className="list-disc list-inside space-y-2 text-[#999999]">
                <li>We do not collect or store your screen recordings or screenshots.</li>
                <li>We do not track your browsing history.</li>
                <li>We do not sell or share your personal data with third parties.</li>
                <li>We do not store your voice recordings after transcription.</li>
              </ul>
            </Section>

            <Section title="Third-Party Services">
              <p>
                Fovea integrates with third-party AI services (such as OpenAI, Anthropic, Google,
                and DeepSeek) to process prompts. When you use these services through Fovea, your
                prompt content is sent to the respective provider according to their privacy policies.
                We recommend reviewing their policies for details on how they handle your data.
              </p>
            </Section>

            <Section title="Permissions We Request">
              <ul className="list-disc list-inside space-y-2 text-[#999999]">
                <li>
                  <strong className="text-[#BBBBBB]">Microphone</strong> — required for voice
                  transcription.
                </li>
                <li>
                  <strong className="text-[#BBBBBB]">Accessibility / Apple Events</strong> — required to
                  read content from your active applications and deliver prompts to AI tools.
                </li>
                <li>
                  <strong className="text-[#BBBBBB]">Local Network</strong> — used for communication
                  between Fovea components during development and testing.
                </li>
              </ul>
            </Section>

            <Section title="Data Security">
              <p>
                We use Supabase for authentication and data storage, which provides encryption at rest
                and in transit. Your local data remains on your device and is not transmitted unless
                explicitly required for AI processing.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                If you have questions about this privacy policy or your data, please reach out
                through our{' '}
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-[#EDEDED] mb-2">{title}</h3>
      {children}
    </div>
  );
}
