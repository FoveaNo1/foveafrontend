import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata } from "../../lib/site-metadata";
import Landing from "../../components/book/Landing";

// Fovea's landing page, "the book" (Oct 13). The design and its research: landing/research/drafts.

const home = buildPageMetadata("home");
export const metadata: Metadata = { ...home, alternates: { canonical: "/" } };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Fovea",
  operatingSystem: "macOS 14 or later",
  applicationCategory: "DeveloperApplication",
  description:
    "Fovea is the way in for every agent: your voice and, soon, your eyes. It starts in your workspace, from the Mac's notch.",
  url: SITE_URL,
};

export default function LandingPage() {
  return (
    <>
      <Landing />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
