import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Preserves link equity from the old WordPress URLs — see SEO-MIGRATION.md.
    return [
      { source: "/about-us-2", destination: "/about", permanent: true },
      { source: "/about-us-2/", destination: "/about", permanent: true },
      { source: "/rooms-2", destination: "/rooms", permanent: true },
      { source: "/rooms-2/", destination: "/rooms", permanent: true },
      { source: "/amenities", destination: "/facilities", permanent: true },
      { source: "/amenities/", destination: "/facilities", permanent: true },
      { source: "/resto", destination: "/dining", permanent: true },
      { source: "/resto/", destination: "/dining", permanent: true },
    ];
  },
};

export default nextConfig;
