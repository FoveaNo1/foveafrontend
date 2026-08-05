"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Loader2, Play } from "lucide-react";

import DemoModal from "./DemoModal";

import {
  WAITLIST_AI_FREQUENCIES,
  WAITLIST_ROLES,
  WAITLIST_TOOLS,
  type WaitlistAiFrequency,
  type WaitlistRole,
} from "../lib/waitlist-options";

type SubscribeResponse = {
  error?: string;
  message?: string;
  profile_token?: string | null;
  profile_available?: boolean;
  development_mode?: boolean;
};

type Step = "closed" | "email" | "questions" | "complete";
type RequestStatus = "idle" | "submitting" | "error";

export default function ProductShowcase() {
  const [step, setStep] = useState<Step>("closed");
  const [demoOpen, setDemoOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [joinStatus, setJoinStatus] = useState<RequestStatus>("idle");
  const [message, setMessage] = useState("");
  const [developmentOnly, setDevelopmentOnly] = useState(false);
  const [profileToken, setProfileToken] = useState("");
  const [role, setRole] = useState<WaitlistRole | "">("");
  const [tools, setTools] = useState<string[]>([]);
  const [aiFrequency, setAiFrequency] = useState<WaitlistAiFrequency | "">("");
  const [profileStatus, setProfileStatus] = useState<RequestStatus>("idle");
  const [profileError, setProfileError] = useState("");
  const questionsHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionStatusRef = useRef<HTMLDivElement>(null);
  const joinRequestRef = useRef<AbortController | null>(null);
  const joinButtonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const lastDemoTriggerRef = useRef<HTMLButtonElement | null>(null);
  const previousStepRef = useRef<Step>(step);

  useEffect(() => {
    const previousStep = previousStepRef.current;
    if (previousStep === step) return;

    if (step === "email") {
      emailInputRef.current?.focus();
    } else if (step === "questions") {
      questionsHeadingRef.current?.focus();
    } else if (step === "complete") {
      completionStatusRef.current?.focus();
    } else if (step === "closed") {
      joinButtonRef.current?.focus();
    }
    previousStepRef.current = step;
  }, [step]);

  useEffect(
    () => () => {
      joinRequestRef.current?.abort();
    },
    [],
  );

  function resetQuestions() {
    setProfileToken("");
    setRole("");
    setTools([]);
    setAiFrequency("");
    setProfileStatus("idle");
    setProfileError("");
  }

  function closeForm() {
    joinRequestRef.current?.abort();
    joinRequestRef.current = null;
    setStep("closed");
    setEmail("");
    setJoinStatus("idle");
    setMessage("");
    setDevelopmentOnly(false);
    resetQuestions();
  }

  function openDemo(event: MouseEvent<HTMLButtonElement>) {
    lastDemoTriggerRef.current = event.currentTarget;
    setDemoOpen(true);
  }

  function closeDemo() {
    setDemoOpen(false);
    window.requestAnimationFrame(() => lastDemoTriggerRef.current?.focus());
  }

  function continueFromDemo() {
    setDemoOpen(false);
    if (step === "email") {
      window.requestAnimationFrame(() => emailInputRef.current?.focus());
      return;
    }
    setStep("email");
  }

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    joinRequestRef.current?.abort();
    const controller = new AbortController();
    joinRequestRef.current = controller;
    setJoinStatus("submitting");
    setMessage("");
    setDevelopmentOnly(false);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          email: email.trim(),
        }),
      });
      const data = (await response.json().catch(() => null)) as SubscribeResponse | null;
      if (joinRequestRef.current !== controller) return;

      if (response.status === 409) {
        setEmail("");
        setJoinStatus("idle");
        setMessage("You are already on the waitlist.");
        setStep("complete");
        return;
      }
      if (!response.ok) {
        throw new Error(data?.error || "Unable to join the waitlist.");
      }

      setEmail("");
      setJoinStatus("idle");
      if (data?.development_mode) {
        setDevelopmentOnly(true);
        setMessage("Form validated locally, but no database is configured.");
        setStep("complete");
        return;
      }
      setMessage("You are on the waitlist.");
      if (data?.profile_token) {
        setProfileToken(data.profile_token);
        setStep("questions");
      } else {
        setStep("complete");
      }
    } catch (error) {
      if (controller.signal.aborted || joinRequestRef.current !== controller) return;
      setJoinStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join the waitlist.");
    } finally {
      if (joinRequestRef.current === controller) {
        joinRequestRef.current = null;
      }
    }
  }

  async function handleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profileStatus === "submitting" || !profileToken || !role) return;

    setProfileStatus("submitting");
    setProfileError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_token: profileToken,
          role,
          tools: tools.length ? tools : undefined,
          ai_frequency: aiFrequency || undefined,
        }),
      });
      const data = (await response.json().catch(() => null)) as SubscribeResponse | null;
      if (!response.ok) {
        throw new Error(data?.error || "Your signup is saved, but we could not save these answers.");
      }

      setProfileStatus("idle");
      setProfileToken("");
      setMessage("Thanks — your answers are saved.");
      setStep("complete");
    } catch (error) {
      setProfileStatus("error");
      setProfileError(
        error instanceof Error
          ? error.message
          : "Your signup is saved, but we could not save these answers.",
      );
    }
  }

  function toggleTool(tool: string) {
    setTools((current) =>
      current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool],
    );
  }

  return (
    <>
      <section
        className="relative left-1/2 isolate mt-8 w-[calc(100vw-2.5rem)] -translate-x-1/2 overflow-hidden text-[#111315] sm:w-[calc(100vw-3rem)] lg:w-[calc(100vw-5rem)]"
        id="waitlist"
      >
      <Image
        src="/product/fovea-hero-with-logo.png"
        alt="Fovea camera mounted on a monitor"
        width={1760}
        height={900}
        priority
        sizes="(min-width: 1024px) 76vw, (min-width: 640px) 90vw, 108vw"
        className="pointer-events-none absolute top-[-8%] right-[-18%] -z-10 h-[116%] w-[108%] object-contain object-right opacity-95 sm:right-[-10%] sm:w-[90%] lg:right-[-3%] lg:w-[76%]"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 76%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 76%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#F7F8F4_0%,rgba(247,248,244,0.96)_28%,rgba(247,248,244,0.36)_46%,rgba(247,248,244,0)_66%)]" />
      <div className="absolute inset-0 -z-10 bg-[#F7F8F4]/36 md:hidden" />

      <div className="flex min-h-[520px] items-center px-6 py-10 sm:min-h-[620px] sm:px-12 lg:min-h-[calc(100vh-132px)] lg:px-28">
        <div className={`w-full ${step === "questions" ? "max-w-[440px]" : "max-w-[360px]"}`}>
          {step === "closed" && (
            <div className="space-y-4">
              <button
                ref={joinButtonRef}
                type="button"
                onClick={() => setStep("email")}
                className="inline-flex h-16 w-full items-center justify-center rounded-full bg-[#111315] px-8 text-lg font-semibold text-white shadow-[0_18px_44px_rgba(17,19,21,0.18)] transition hover:bg-[#253029]"
              >
                Join waitlist
              </button>
              <button
                type="button"
                onClick={openDemo}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#0D7A5C] px-7 text-lg font-semibold text-white shadow-[0_12px_34px_rgba(18,167,125,0.18)] transition hover:bg-[#096F53]"
              >
                Watch demo · 1:40
                <Play className="h-5 w-5 fill-current" />
              </button>
              <Link
                href="/download/beta"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#C9D8CF] bg-white/90 px-5 text-sm font-semibold text-[#30443A] shadow-[0_10px_28px_rgba(37,48,41,0.06)] backdrop-blur transition hover:border-[#9FC4B1] hover:bg-white"
              >
                Already invited? Get Beta apps
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {step === "email" && (
            <>
              <form
                onSubmit={handleJoin}
                aria-busy={joinStatus === "submitting"}
                className="rounded-[24px] border border-[#DDE4DC] bg-white/86 p-2 shadow-[0_18px_50px_rgba(17,19,21,0.08)] backdrop-blur"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (joinStatus === "error") {
                        setJoinStatus("idle");
                        setMessage("");
                      }
                    }}
                    placeholder="you@company.com"
                    aria-label="Email address"
                    autoComplete="email"
                    required
                    disabled={joinStatus === "submitting"}
                    className="min-h-12 min-w-0 flex-1 rounded-2xl border border-[#89948C] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#111315] outline-none transition placeholder:text-[#6A756E] focus:border-[#0D7A5C] focus-visible:ring-2 focus-visible:ring-[#0D7A5C] disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    disabled={joinStatus === "submitting"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#111315] px-5 text-sm font-semibold text-white transition hover:bg-[#253029] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {joinStatus === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Joining
                      </>
                    ) : (
                      <>
                        Join waitlist
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              {message && (
                <p role="alert" className="mt-3 text-sm text-[#B54747]">
                  {message}
                </p>
              )}
              <button
                type="button"
                disabled={joinStatus === "submitting"}
                onClick={openDemo}
                className={`mt-2 inline-flex min-h-11 items-center px-1 text-sm font-medium text-[#5E6861] transition hover:text-[#111315] ${joinStatus === "submitting" ? "pointer-events-none opacity-50" : ""}`}
              >
                Watch demo · 1:40
              </button>
            </>
          )}

          {step === "questions" && (
            <form
              onSubmit={handleProfile}
              aria-busy={profileStatus === "submitting"}
              className="rounded-[26px] border border-[#DDE4DC] bg-white/92 p-5 shadow-[0_18px_50px_rgba(17,19,21,0.1)] backdrop-blur sm:p-6"
            >
              <div role="status" aria-live="polite" className="mb-4 flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D8F69]" />
                <div>
                  <h2
                    ref={questionsHeadingRef}
                    tabIndex={-1}
                    className="rounded-sm text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#0D7A5C]"
                  >
                    You are on the waitlist.
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-[#5E6861]">
                    Optional: tell us a little about how you work.
                  </p>
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="waitlist-role" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6A756E]">
                  Which option best describes you?
                </label>
                <span id="waitlist-role-help" className="shrink-0 text-[11px] text-[#6A756E]">
                  Required to save
                </span>
              </div>
              <select
                id="waitlist-role"
                aria-describedby="waitlist-role-help"
                required
                disabled={profileStatus === "submitting"}
                value={role}
                onChange={(event) => setRole(event.target.value as WaitlistRole | "")}
                className="mt-2 min-h-11 w-full rounded-xl border border-[#89948C] bg-white px-3 text-sm text-[#111315] outline-none transition focus:border-[#0D7A5C] focus-visible:ring-2 focus-visible:ring-[#0D7A5C]"
              >
                <option value="">Select one</option>
                {WAITLIST_ROLES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <fieldset className="mt-4">
                <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6A756E]">
                  How often do you use AI tools?
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {WAITLIST_AI_FREQUENCIES.map((frequency) => (
                    <label key={frequency.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="ai-frequency"
                        value={frequency.value}
                        checked={aiFrequency === frequency.value}
                        onChange={() => setAiFrequency(frequency.value)}
                        disabled={profileStatus === "submitting"}
                        className="peer sr-only"
                      />
                      <span className="flex min-h-11 items-center justify-center rounded-xl border border-[#89948C] bg-white px-2 py-2 text-center text-[11px] font-medium leading-4 text-[#5E6861] transition peer-checked:border-[#12A77D] peer-checked:bg-[#E7F7F1] peer-checked:text-[#0D7A5C] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0D7A5C]">
                        <span
                          aria-hidden="true"
                          className={`mr-1.5 h-2 w-2 shrink-0 rounded-full border ${aiFrequency === frequency.value ? "border-[#0D7A5C] bg-[#0D7A5C]" : "border-[#89948C] bg-white"}`}
                        />
                        {frequency.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <details className="mt-4 rounded-xl border border-[#89948C] bg-white">
                <summary className="min-h-11 cursor-pointer px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6A756E] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D7A5C]">
                  Tools you use most often
                  <span className="float-right ml-3 text-[11px] font-medium normal-case tracking-normal text-[#6A756E]">
                    {tools.length ? `${tools.length} selected` : "Optional"}
                  </span>
                </summary>
                <fieldset className="border-t border-[#E7ECE8] p-3">
                  <legend className="sr-only">Tools you use most often</legend>
                  <div className="grid min-w-0 grid-cols-2 gap-2">
                    {WAITLIST_TOOLS.map((tool) => (
                      <label key={tool} className="min-w-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tools.includes(tool)}
                          onChange={() => toggleTool(tool)}
                          disabled={profileStatus === "submitting"}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-11 min-w-0 items-center rounded-xl border border-[#89948C] bg-white px-3 py-2 text-xs font-medium leading-4 text-[#5E6861] transition peer-checked:border-[#12A77D] peer-checked:bg-[#E7F7F1] peer-checked:text-[#0D7A5C] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0D7A5C]">
                          {tools.includes(tool) && (
                            <Check aria-hidden="true" className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                          )}
                          {tool}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </details>

              {profileError && (
                <p role="alert" className="mt-3 text-sm leading-5 text-[#B54747]">
                  {profileError}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={profileStatus === "submitting"}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#111315] px-4 text-sm font-semibold text-white transition hover:bg-[#253029] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {profileStatus === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save answers"
                  )}
                </button>
                <button
                  type="button"
                  disabled={profileStatus === "submitting"}
                  onClick={() => {
                    setProfileToken("");
                    setMessage("You are on the waitlist.");
                    setStep("complete");
                  }}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-[#6A756E] transition hover:bg-[#F1F4F1] hover:text-[#111315] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Skip
                </button>
              </div>
            </form>
          )}

          {step === "complete" && (
            <div className="rounded-[24px] border border-[#DDE4DC] bg-white/90 p-5 shadow-[0_18px_50px_rgba(17,19,21,0.08)] backdrop-blur">
              <div
                ref={completionStatusRef}
                role="status"
                aria-live="polite"
                tabIndex={-1}
                className="flex items-start gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0D7A5C]"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0D8F69]" />
                <div>
                  <p className="text-sm font-semibold text-[#111315]">{message}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6A756E]">
                    {developmentOnly
                      ? "Add the Supabase environment variables before testing a real signup."
                      : "We will email you when there is something ready to try."}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openDemo}
                  className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-[#0D7A5C] hover:text-[#096F53]"
                >
                  Watch demo · 1:40
                </button>
                <button type="button" onClick={closeForm} className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-[#5E6861] hover:text-[#111315]">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </section>
      <DemoModal
        open={demoOpen}
        onRequestClose={closeDemo}
        ctaLabel={step === "closed" ? "Join waitlist" : step === "email" ? "Continue joining" : undefined}
        onCtaClick={step === "closed" || step === "email" ? continueFromDemo : undefined}
      />
    </>
  );
}
