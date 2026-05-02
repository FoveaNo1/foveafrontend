"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { useEffect, useState } from "react";

const FOVEA_SUCCESS_DEEPLINK = "fovea://billing/success";

export default function CheckoutSuccessActions() {
  const [hasTriedOpen, setHasTriedOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasTriedOpen(true);
      window.location.href = FOVEA_SUCCESS_DEEPLINK;
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={FOVEA_SUCCESS_DEEPLINK}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111315] px-5 text-sm font-semibold text-white transition hover:bg-[#222]"
        >
          Open Fovea
          <ArrowRight className="h-4 w-4" />
        </a>
        <Link
          href="/download"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D8E1DA] bg-white px-5 text-sm font-semibold text-[#111315] transition hover:border-[#AFC2B5]"
        >
          <Download className="h-4 w-4" />
          Download app
        </Link>
      </div>
      <p className="mt-4 text-xs leading-5 text-[#758079]">
        {hasTriedOpen
          ? "If Fovea did not open, download the app and sign in with the same account."
          : "Opening Fovea in a moment."}
      </p>
    </>
  );
}
