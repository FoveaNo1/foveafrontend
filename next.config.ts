import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is in app/(landing), whose root layout sits inside the route group, so there is no
  // top-level layout for an unmatched URL: the 404 is app/global-not-found.tsx. The earlier static
  // site is archived in landing/legacy-point-and-tell.
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
