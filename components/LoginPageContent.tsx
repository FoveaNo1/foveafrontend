"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";
import SiteFooter from "./SiteFooter";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

function readNextPath() {
  if (typeof window === "undefined") {
    return "/account";
  }

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/account";
}

export default function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [nextPath] = useState(readNextPath);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace(nextPath);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.replace(nextPath);
      }
    });

    return () => subscription.unsubscribe();
  }, [nextPath]);

  function getAuthRedirectUrl() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage(
        "Supabase auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setMessage("Magic link sent. Check your email to continue.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuth(provider: Provider) {
    setMessage(null);
    setErrorMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage(
        "Supabase auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Header ── */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <p className="text-sm font-medium text-[#5E6861]">Secure sign-in</p>
        </header>

        {/* ── Auth card ── */}
        <div className="mx-auto max-w-[440px] py-20">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            <Image
              src="/fovea-logo.png"
              alt="Fovea"
              width={48}
              height={48}
              className="rounded-2xl"
            />
            <span className="text-xl font-semibold text-[#111315]">Fovea</span>
          </Link>

          <h1 className="text-center text-2xl font-semibold tracking-tight text-[#111315]">
            Welcome back.
          </h1>
          <p className="mt-2 text-center text-sm leading-6 text-[#5A665F]">
            Sign in to manage your subscription, devices, and capture history.
          </p>

          {/* Card */}
          <div className="mt-8 rounded-[24px] border border-[#DDE4DC] bg-white p-6 shadow-[0_24px_70px_rgba(37,48,41,0.06)]">
            {/* Form */}
            <form
              onSubmit={handleEmailAuth}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-[#111315]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-11 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-sm text-[#111315] placeholder:text-[#A3ADA6] focus:border-[#12B886] focus:outline-none focus:ring-1 focus:ring-[#12B886]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111315] text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Sending..." : "Send magic link"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {message && (
              <p className="mt-4 rounded-xl border border-[#C8EBD9] bg-[#F1FBF6] px-4 py-3 text-sm leading-6 text-[#0D7256]">
                {message}
              </p>
            )}

            {errorMessage && (
              <p className="mt-4 rounded-xl border border-[#F0D6D6] bg-[#FFF8F8] px-4 py-3 text-sm leading-6 text-[#A43B3B]">
                {errorMessage}
              </p>
            )}

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#DDE4DC]" />
              <span className="text-xs font-medium text-[#88938C]">OR</span>
              <div className="h-px flex-1 bg-[#DDE4DC]" />
            </div>

            {/* Social login */}
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#DDE4DC] bg-white text-sm font-semibold text-[#111315] transition hover:bg-[#F8FAF7]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M21.6 12.23c0-.74-.07-1.46-.19-2.15H12v4.06h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.43z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.6A10 10 0 0 0 12 22z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.06a10 10 0 0 0 0 9z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.97c1.47 0 2.78.5 3.81 1.49l2.86-2.86A10 10 0 0 0 12 2 10 10 0 0 0 3.06 7.5l3.34 2.6C7.19 7.73 9.4 5.97 12 5.97z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("apple")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#DDE4DC] bg-white text-sm font-semibold text-[#111315] transition hover:bg-[#F8FAF7]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#111315">
                  <path d="M16.37 1.43c0 1.14-.41 2.21-1.23 3.21-.99 1.21-2.18 1.91-3.49 1.81-.16-1.13.41-2.31 1.23-3.27.83-.99 2.18-1.7 3.49-1.75zM20.32 17.4c-.55 1.27-1.21 2.42-1.97 3.46-1.03 1.4-2.5 3.14-4.32 3.14-1.66 0-2.07-1.07-4.31-1.07-2.23 0-2.7 1.04-4.32 1.07-1.83.03-3.22-1.51-4.25-2.91C-.95 17.97-2.42 11 .87 6.55c1.62-2.21 4.07-3.6 6.43-3.6 2.06 0 3.36 1.13 5.06 1.13 1.66 0 2.66-1.13 5.04-1.13 1.79 0 3.69.97 5.04 2.65-4.43 2.43-3.7 8.78-2.12 11.8z" />
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs leading-5 text-[#88938C]">
            By continuing you agree to our{" "}
            <Link
              href="/terms"
              className="text-[#0D8F69] underline underline-offset-2 transition hover:text-[#0A7356]"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#0D8F69] underline underline-offset-2 transition hover:text-[#0A7356]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
