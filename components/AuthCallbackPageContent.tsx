"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import SiteFooter from "./SiteFooter";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "../lib/supabase-browser";

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

function readAuthError() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isSupabaseBrowserConfigured()) {
    return "Supabase auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";
  }

  const params = new URLSearchParams(window.location.search);
  const error = params.get("error_description") || params.get("error");

  return error ? error.replace(/\+/g, " ") : null;
}

export default function AuthCallbackPageContent() {
  const [nextPath] = useState(readNextPath);
  const [initialError] = useState(readAuthError);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  useEffect(() => {
    if (initialError) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;
    const redirectIfSignedIn = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (data.session) {
        window.location.replace(nextPath);
        return;
      }

      if (error) {
        setErrorMessage(error.message);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.replace(nextPath);
      }
    });

    const timeoutId = window.setTimeout(() => {
      redirectIfSignedIn();
    }, 300);

    const fallbackId = window.setTimeout(() => {
      if (isMounted) {
        setErrorMessage("We could not finish sign-in. Please return to the login page and try again.");
      }
    }, 5000);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      window.clearTimeout(fallbackId);
      subscription.unsubscribe();
    };
  }, [initialError, nextPath]);

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign in
          </Link>
          <p className="text-sm font-medium text-[#5E6861]">Secure sign-in</p>
        </header>

        <div className="mx-auto flex max-w-[440px] flex-col items-center py-24 text-center">
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

          <div className="w-full rounded-[24px] border border-[#DDE4DC] bg-white p-8 shadow-[0_24px_70px_rgba(37,48,41,0.06)]">
            {errorMessage ? (
              <>
                <h1 className="text-2xl font-semibold tracking-tight text-[#111315]">
                  Sign-in needs another try.
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#5A665F]">{errorMessage}</p>
                <Link
                  href={`/login?next=${encodeURIComponent(nextPath)}`}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#111315] text-sm font-semibold text-white transition hover:bg-[#222]"
                >
                  Return to sign in
                </Link>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F8F2] text-[#0D8F69]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#111315]">
                  Finishing sign-in.
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#5A665F]">
                  We are connecting your Fovea account and returning you to checkout.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
