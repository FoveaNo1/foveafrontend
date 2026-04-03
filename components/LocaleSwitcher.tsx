"use client";

import type { Locale } from "../lib/site-locale";

type LocaleSwitcherProps = {
  currentLocale: Locale;
  englishHref: string;
  chineseHref: string;
  englishLabel: string;
  chineseLabel: string;
  label: string;
  className?: string;
};

function persistLocale(locale: Locale) {
  document.cookie = `fovea_locale=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function switchLocale(locale: Locale, href: string) {
  persistLocale(locale);
  window.location.assign(href);
}

export default function LocaleSwitcher({
  currentLocale,
  englishHref,
  chineseHref,
  englishLabel,
  chineseLabel,
  label,
  className = "",
}: LocaleSwitcherProps) {
  const baseClasses =
    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span className="text-[11px] uppercase tracking-[0.2em] text-[#666]">{label}</span>
      <div className="inline-flex rounded-full border border-[#333] bg-[#0E0E0E]/90 p-1 backdrop-blur">
        <button
          type="button"
          onClick={() => switchLocale("en", englishHref)}
          className={`${baseClasses} ${
            currentLocale === "en"
              ? "border-[#00FFC2]/40 bg-[#00FFC2]/10 text-[#EDEDED]"
              : "border-transparent text-[#888] hover:text-[#EDEDED]"
          }`}
        >
          {englishLabel}
        </button>
        <button
          type="button"
          onClick={() => switchLocale("zh", chineseHref)}
          className={`${baseClasses} ${
            currentLocale === "zh"
              ? "border-[#00FFC2]/40 bg-[#00FFC2]/10 text-[#EDEDED]"
              : "border-transparent text-[#888] hover:text-[#EDEDED]"
          }`}
        >
          {chineseLabel}
        </button>
      </div>
    </div>
  );
}
