import type { Metadata } from "next";
import { getSiteCopy } from "./site-copy";

type PageKey = "home" | "download" | "feedback" | "pricing" | "privacy";

const canonicalPaths: Record<PageKey, string> = {
  home: "/",
  download: "/download",
  feedback: "/feedback",
  pricing: "/pricing",
  privacy: "/privacy",
};

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
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
    },
  };
}
