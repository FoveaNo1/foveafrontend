"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, Image as ImageIcon, Mic2, Send, TextCursorInput } from "lucide-react";
import type { SiteCopy } from "../lib/site-copy";

type UserGuideProps = {
  copy: SiteCopy["home"]["guide"];
};

export default function UserGuide({ copy }: UserGuideProps) {
  return (
    <section className="bg-[#F7F8F4] px-5 py-24 sm:px-6 lg:px-8" id="guide">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">{copy.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-3xl text-lg leading-8 text-[#5A665F]">{copy.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 rounded-[28px] border border-[#D8E2DB] bg-white p-4 shadow-[0_24px_70px_rgba(37,48,41,0.12)]"
        >
          <div className="grid gap-4 lg:grid-cols-[0.95fr_auto_0.82fr] lg:items-stretch">
            <div className="rounded-[22px] border border-[#E3E9E5] bg-[#FBFCFA] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0D8F69]">{copy.capture.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#111315]">{copy.capture.title}</h3>
                </div>
                <span className="rounded-full bg-[#E9F8F2] px-3 py-1 text-xs font-semibold text-[#0D8F69]">
                  {copy.capture.badge}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                      <Mic2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-[#111315]">{copy.speak.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[#5F6A63]">{copy.speak.body}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                      <TextCursorInput className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-[#111315]">{copy.captureText.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[#5F6A63]">{copy.captureText.body}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {copy.captureText.items.map((item) => (
                          <span key={item} className="rounded-full border border-[#D8E1DA] bg-[#F8FAF7] px-3 py-1 text-xs font-medium text-[#526058]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DDE4DC] bg-white p-5 md:col-span-2">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#0D8F69]">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-[#111315]">{copy.captureImages.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[#5F6A63]">{copy.captureImages.body}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {copy.captureImages.items.map((item) => (
                          <div key={item} className="rounded-xl border border-[#DDE4DC] bg-[#F8FAF7] px-3 py-3 text-xs font-medium text-[#526058]">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="flex h-12 w-12 rotate-90 items-center justify-center rounded-full border border-[#DDE4DC] bg-white text-[#0D8F69] shadow-[0_10px_30px_rgba(37,48,41,0.08)] lg:rotate-0">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>

            <DeliverPreview copy={copy.deliver} />
          </div>
        </motion.div>

        <div className="mt-5 flex flex-col gap-2 text-sm text-[#68736B] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-[#111315]">{copy.caption}</p>
          {copy.note ? <p>{copy.note}</p> : null}
        </div>
      </div>
    </section>
  );
}

function DeliverPreview({ copy }: { copy: SiteCopy["home"]["guide"]["deliver"] }) {
  return (
    <div className="rounded-[22px] border border-[#DDE4DC] bg-[#111315] p-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CE8CB]">{copy.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{copy.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{copy.body}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#8CE8CB]">
          <Send className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#F8FAF7] p-4 text-[#111315] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0D8F69]">{copy.previewTitle}</p>
            <p className="mt-1 text-xs text-[#6A756E]">{copy.invisibleTitle}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F8F2] px-2.5 py-1 text-xs font-semibold text-[#0D8F69]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {copy.readyLabel}
          </span>
        </div>

        <OutputSection icon={<Mic2 className="h-3.5 w-3.5" />} label={copy.transcriptLabel}>
          <p className="text-sm leading-6 text-[#26302B]">“{copy.transcript}”</p>
        </OutputSection>

        <OutputSection icon={<TextCursorInput className="h-3.5 w-3.5" />} label={copy.selectionsLabel}>
          <div className="space-y-2">
            {copy.selections.map((selection) => (
              <p key={selection} className="rounded-xl border border-[#DCE5DF] bg-white px-3 py-2 text-xs leading-5 text-[#4F5B54]">
                {selection}
              </p>
            ))}
          </div>
        </OutputSection>

        <OutputSection icon={<ImageIcon className="h-3.5 w-3.5" />} label={copy.imagesLabel}>
          <div className="grid grid-cols-2 gap-2">
            {copy.images.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-xl border border-[#DCE5DF] bg-white">
                <div className={`h-16 ${index === 0 ? "bg-[linear-gradient(135deg,#DDF3EA_0%,#FFFFFF_45%,#B9D9CE_100%)]" : "bg-[linear-gradient(135deg,#E8ECE8_0%,#FFFFFF_48%,#CFE7DE_100%)]"} p-2`}>
                  <div className="h-2 w-10 rounded-full bg-[#0D8F69]/30" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-[#111315]/12" />
                  <div className="mt-2 h-5 rounded-md bg-white/70" />
                </div>
                <p className="px-2.5 py-1.5 text-[11px] font-medium text-[#526058]">{image}</p>
              </div>
            ))}
          </div>
        </OutputSection>

        <div className="mt-3 rounded-xl border border-[#DCE5DF] bg-white px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A857D]">{copy.destinationsLabel}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {copy.destinations.map((destination) => (
              <span key={destination} className="rounded-full bg-[#111315] px-2.5 py-1 text-[11px] font-semibold text-white">
                {destination}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-6 text-white/58">{copy.invisibleBody}</p>
    </div>
  );
}

function OutputSection({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-3 rounded-xl border border-[#DCE5DF] bg-[#EEF5F0] p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#0D8F69]">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[#0D8F69]">
          {icon}
        </span>
        {label}
      </div>
      {children}
    </div>
  );
}
