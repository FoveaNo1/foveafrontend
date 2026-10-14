import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/site-metadata";
import Landing from "../../components/book/Landing";

// Fovea's landing page, "the book" (Oct 13). The design and its research: landing/research/drafts.

export const metadata: Metadata = buildPageMetadata("home");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Fovea",
  operatingSystem: "macOS 14 or later",
  applicationCategory: "DeveloperApplication",
  description:
    "Fovea is the way in for every agent: your voice and, soon, your eyes. It starts in your workspace, from the Mac's notch.",
  url: "https://hellofovea.com",
};

export default function LandingPage() {
  return (
    <>
      <Landing />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
