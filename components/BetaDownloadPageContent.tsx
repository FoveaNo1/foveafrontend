import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Database,
  Download,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteFooter from "./SiteFooter";

const products = [
  {
    name: "Fovea Beta",
    role: "Main app",
    description:
      "The main Fovea app for voice input, screen capture, Quick Q&A, and Memory.",
    release: "Latest Beta",
    requirement: "macOS 14+ · Apple Silicon",
    button: "Download Fovea Beta",
    href: "https://updates.hellofovea.com/beta/fovea-mac/releases/latest.dmg",
    icon: Sparkles,
    iconClassName: "bg-[#111315] text-white",
  },
  {
    name: "FoveaGaze",
    role: "Eye-tracking companion",
    description:
      "Adds gaze input and calibration to Fovea. Install it with Fovea Beta for Eye Tracking.",
    release: "Latest Beta",
    requirement: "Apple Silicon",
    button: "Download FoveaGaze",
    href: "https://updates.hellofovea.com/beta/fovea-gaze/releases/latest.dmg",
    icon: Eye,
    iconClassName: "bg-[#E9F8F2] text-[#0D8F69]",
  },
  {
    name: "FoveaGazeCollect",
    role: "Data collection",
    description:
      "A separate app for invited participants to record and upload gaze data for model improvement.",
    release: "Latest Beta",
    requirement: "Apple Silicon",
    button: "Download GazeCollect",
    href: "https://updates.hellofovea.com/beta/fovea-gaze-collect/releases/latest.dmg",
    icon: Database,
    iconClassName: "bg-[#F5EEDF] text-[#8A642D]",
  },
];

export default function BetaDownloadPageContent() {
  return (
    <main className="min-h-screen bg-[#F7F8F4] px-5 py-5 text-[#111315] selection:bg-[#12B886]/20 selection:text-[#111315] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDE4DC] bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(17,19,21,0.05)] backdrop-blur">
          <Link
            href="/download"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5E6861] transition hover:text-[#111315]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Regular downloads</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/fovea-logo.png"
              alt="Fovea"
              width={32}
              height={32}
              className="h-8 w-8 rounded-[10px]"
              priority
            />
            <span className="text-sm font-semibold tracking-tight">Fovea</span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#CDE7DA] bg-[#F1FAF6] px-3 py-1.5 text-xs font-semibold text-[#0D775B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12B886]" />
            Invite only
          </span>
        </header>

        <section className="mx-auto max-w-3xl pb-12 pt-16 text-center sm:pb-14 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0D8F69]">
            Beta downloads for macOS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Choose your Fovea app.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#5F6A63] sm:text-lg">
            Currently available to invited users only. When prompted, use the email address that received your invitation.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="Fovea beta downloads">
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <article
                key={product.name}
                className="flex flex-col rounded-[24px] border border-[#DDE4DC] bg-white p-6 shadow-[0_18px_50px_rgba(37,48,41,0.06)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${product.iconClassName}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-[#D8E1DA] bg-[#F8FAF7] px-3 py-1.5 text-xs font-semibold text-[#627068]">
                    {product.role}
                  </span>
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-[-0.025em]">{product.name}</h2>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#5F6A63]">
                  {product.description}
                </p>

                <div className="mt-6 space-y-2 border-t border-[#E8ECE8] pt-5 text-xs text-[#667169]">
                  <p className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#0D8F69]" aria-hidden="true" />
                    {product.release}
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#0D8F69]" aria-hidden="true" />
                    {product.requirement}
                  </p>
                </div>

                <a
                  href={product.href}
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#111315] px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(17,19,21,0.14)] transition hover:-translate-y-0.5 hover:bg-[#252A27]"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {product.button}
                </a>
              </article>
            );
          })}
        </section>

        <section className="mx-auto my-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#CDE4D8] bg-[#EAF8F2] px-5 py-4 text-sm text-[#176F58] sm:flex-row sm:items-center sm:justify-center sm:text-center">
          <Eye className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            <span className="font-semibold">Using Eye Tracking?</span> Install both Fovea Beta and FoveaGaze.
          </p>
        </section>

        <section className="mx-auto mb-16 flex max-w-3xl items-start gap-3 rounded-2xl border border-[#DDE4DC] bg-white px-5 py-4 text-sm leading-6 text-[#667169]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0D8F69]" aria-hidden="true" />
          <p>
            Downloading an installer does not grant access. These apps remain available only to users approved for the current Beta.
          </p>
        </section>
      </div>

      <SiteFooter text="© 2026 FOVEA AI. ALL RIGHTS RESERVED." variant="light" />
    </main>
  );
}
