import type { MetadataRoute } from "next";

const base = "https://hellofovea.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/what-leaves-your-mac", "/download", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
