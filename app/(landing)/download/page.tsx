import type { Metadata } from "next";
import GetFovea from "../../../components/book/get/GetFovea";

// Where "Download for Mac" leads: the download, the plans, and paying (a demo for now; lib/landing/book.ts,
// CHECKOUT_MODE). It replaces the earlier /download page (now in landing/backups/2026-10-13-before-book-landing.tgz);
// the invite-only beta downloads stay at /download/beta.

export const metadata: Metadata = {
  title: "Download Fovea for Mac",
  description: "Talk to your agents from the notch. Fovea for Mac works with Claude Code and Codex, in preview. Free to start.",
  alternates: { canonical: "/download" },
  openGraph: { title: "Download Fovea for Mac", url: "/download" },
};

export default function DownloadPage() {
  return <GetFovea />;
}
