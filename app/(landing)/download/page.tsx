import type { Metadata } from "next";
import GetFovea from "../../../components/book/get/GetFovea";

// Where "Download for Mac" leads: the download, the plans, and paying (on to Stripe, lib/account.ts). It replaces the
// earlier /download page (now in landing/backups/2026-10-13-before-book-landing.tgz); the invite-only beta downloads
// are at /download/beta. No openGraph of its own: a page's own openGraph replaces the shared one, picture and all, so
// links to it would show no picture (Oct 23); the title and description fill the shared one in.

export const metadata: Metadata = {
  title: "Download Fovea for Mac",
  description: "Talk to your agents from the notch. Fovea for Mac works with Claude Code and Codex, in preview. Free to start.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return <GetFovea />;
}
