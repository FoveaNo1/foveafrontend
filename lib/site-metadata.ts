import type { Metadata } from "next";
import { getSiteCopy } from "./site-copy";

/** The address the site is served at: hellofovea.com redirects here, and the Mac app links here. Canonical links,
 *  the sitemap and the structured data all use it, so none of them point at a redirect. */
export const SITE_URL = "https://www.hellofovea.com";

type PageKey = "home" | "download" | "feedback" | "pricing" | "privacy";

const canonicalPaths: Record<PageKey, string> = {
  home: "/",
  download: "/download",
  feedback: "/feedback",
  pricing: "/pricing",
  privacy: "/privacy",
};

// No openGraph here (Oct 23): a page's own openGraph replaces the shared one, picture and all, so a link to the page
// showed no picture on LinkedIn. Without it the page's title and description fill in the shared openGraph.
export function buildPageMetadata(page: PageKey): Metadata {
  const copy = getSiteCopy().metadata[page];
  const canonical = canonicalPaths[page];

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
      },
    },
  };
}
