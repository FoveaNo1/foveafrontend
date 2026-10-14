import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "/" is the landing page in app/(landing); every other page lives in app/(site) under its own
  // root layout. With two root layouts there is no top-level layout for an unmatched URL, so the
  // 404 is app/global-not-found.tsx. The earlier static site is archived in landing/legacy-point-and-tell.
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
