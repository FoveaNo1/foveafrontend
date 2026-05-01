"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import SiteFooter from "./SiteFooter";
import { getSiteCopy } from "../lib/site-copy";

type FeedbackType = "bug" | "feature" | "general";

export default function FeedbackPageContent() {
  const copy = getSiteCopy();
  const [type, setType] = useState<FeedbackType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          contact: contact.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || copy.feedback.errorFallback);
      }

      setStatus("success");
      setTitle("");
      setDescription("");
      setContact("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : copy.feedback.errorFallback);
      setStatus("error");
    }
  };

  const typeSymbols: Record<FeedbackType, string> = {
    bug: "!",
    feature: "+",
    general: "…",
  };

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* ── Header ── */}
        <header className="flex items-center justify-between gap-4 px-1 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.nav.backHome}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </header>

        {/* ── Title ── */}
        <div className="pt-10">
          <h1 className="text-4xl font-semibold tracking-tight text-[#111315] sm:text-5xl">
            {copy.feedback.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#5A665F]">{copy.feedback.intro}</p>
        </div>

        {/* ── Form ── */}
        <div className="mt-10">
          {status === "success" ? (
            <div className="rounded-[24px] border border-[#DDE4DC] bg-white p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#0D8F69]" />
              <h2 className="mt-4 text-xl font-semibold text-[#111315]">{copy.feedback.successTitle}</h2>
              <p className="mt-2 text-sm text-[#5F6A63]">{copy.feedback.successBody}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-xl border border-[#D8E1DA] bg-[#F8FAF7] px-5 py-3 text-sm font-semibold text-[#111315] transition hover:border-[#AFC2B5]"
              >
                {copy.feedback.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type selector */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#111315]">{copy.feedback.typeLabel}</label>
                <div className="grid grid-cols-3 gap-3">
                  {copy.feedback.typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-sm font-semibold transition ${
                        type === opt.value
                          ? "border-2 border-[#0D8F69] bg-[#E9F8F2] text-[#0D8F69]"
                          : "border border-[#DDE4DC] bg-white text-[#5F6A63] hover:border-[#AFC2B5]"
                      }`}
                    >
                      <span className="text-lg">{typeSymbols[opt.value]}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#111315]">
                  {copy.feedback.titleLabel} <span className="text-[#D04A3D]">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={copy.feedback.titlePlaceholder}
                  required
                  className="w-full rounded-xl border border-[#D8E1DA] bg-white px-4 py-3.5 text-sm text-[#111315] placeholder-[#8B968F] outline-none transition focus:border-[#0D8F69]"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#111315]">
                  {copy.feedback.descriptionLabel} <span className="text-[#D04A3D]">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={copy.feedback.descriptionPlaceholders[type]}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-[#D8E1DA] bg-white px-4 py-3.5 text-sm text-[#111315] placeholder-[#8B968F] outline-none transition focus:border-[#0D8F69]"
                />
              </div>

              {/* Contact */}
              <div>
                <label htmlFor="contact" className="mb-2 block text-sm font-semibold text-[#111315]">
                  {copy.feedback.contactLabel}{" "}
                  <span className="font-normal text-[#7A857D]">{copy.feedback.optionalLabel}</span>
                </label>
                <input
                  id="contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={copy.feedback.contactPlaceholder}
                  className="w-full rounded-xl border border-[#D8E1DA] bg-white px-4 py-3.5 text-sm text-[#111315] placeholder-[#8B968F] outline-none transition focus:border-[#0D8F69]"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] px-4 py-3 text-sm text-[#D04A3D]">
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "submitting" || !title.trim() || !description.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0D8F69] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#0B7D5C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "submitting" ? (
                  copy.feedback.submitLoading
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {copy.feedback.submitIdle}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <SiteFooter
        text="© 2026 FOVEA AI. ALL RIGHTS RESERVED."
        variant="light"
        pricingHref="/pricing"
        feedbackHref="/feedback"
        pricingLabel={copy.common.pricingLinkLabel}
        feedbackLabel={copy.common.feedbackLinkLabel}
        privacyLabel={copy.common.privacyLinkLabel}
        termsLabel={copy.common.termsLinkLabel}
      />
    </main>
  );
}
