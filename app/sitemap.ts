import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site-metadata";

// The pages people should find. Signing in, checkout, the account and the beta downloads are left out (noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/vision", "/download", "/pricing", "/feedback", "/what-leaves-your-mac", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
