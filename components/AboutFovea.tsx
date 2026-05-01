'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  LockKeyhole,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { SiteCopy } from '../lib/site-copy';

type AboutFoveaProps = {
  copy: SiteCopy["home"]["about"];
};

const AboutFovea = ({ copy }: AboutFoveaProps) => {
  return (
    <section className="bg-white px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-24">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">{copy.beforeAfter.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
              {copy.beforeAfter.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5A665F]">{copy.beforeAfter.subtitle}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-4 md:grid-cols-[1fr_auto_1fr]"
          >
            <ProcessColumn
              title={copy.beforeAfter.beforeTitle}
              items={copy.beforeAfter.beforeItems}
              tone="muted"
            />
            <div className="hidden items-center justify-center md:flex">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DDE4DC] bg-[#F8FAF7] text-[#0D8F69]">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
            <ProcessColumn
              title={copy.beforeAfter.afterTitle}
              items={copy.beforeAfter.afterItems}
              tone="active"
            />
          </motion.div>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-[#DDE4DC] bg-[#F8FAF7] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-[#DDE4DC] p-8 md:p-10 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111315] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D8F69]">{copy.trust.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#111315] sm:text-4xl">
              {copy.trust.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5A665F]">{copy.trust.body}</p>
          </div>

          <div className="grid gap-3 p-8 md:p-10">
            {copy.trust.items.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#DDE4DC] bg-white p-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9F8F2] text-[#0D8F69]">
                  {index === 0 ? <MousePointerClick className="h-3.5 w-3.5" /> : index === 1 ? <LockKeyhole className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                </span>
                <p className="text-sm leading-6 text-[#526058]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function ProcessColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "muted" | "active";
}) {
  const Icon = tone === "active" ? Sparkles : ClipboardCopy;

  return (
    <div className={`rounded-2xl border p-5 ${tone === "active" ? "border-[#BFE3D4] bg-[#E9F8F2]" : "border-[#DDE4DC] bg-[#F8FAF7]"}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "active" ? "bg-[#0D8F69] text-white" : "bg-white text-[#7A857D]"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-[#111315]">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-xl bg-white/75 px-3 py-2 text-sm leading-6 text-[#526058]">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default AboutFovea;
