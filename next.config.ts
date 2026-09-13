import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The landing page is the static site in public/ (index.html, style.css, script.js, demos.*,
      // assets/): "/" serves public/index.html before the app router's home page is considered.
      // Every other route (download, pricing, privacy, api, …) is untouched. See landing/README.md.
      beforeFiles: [{ source: "/", destination: "/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
