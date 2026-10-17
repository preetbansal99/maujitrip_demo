import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blogs/:slug", destination: "/blog/:slug", permanent: true },
      { source: "/packages/:slug", destination: "/holidays/packages/:slug", permanent: true },
      { source: "/search/holiday", destination: "/holidays/search", permanent: false },
      { source: "/hotels/search", destination: "/hotels/results", permanent: false },
      { source: "/hotels/map", destination: "/hotels/results", permanent: false },
    ];
  },
};

export default nextConfig;
