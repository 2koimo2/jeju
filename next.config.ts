import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB; phone camera photos routinely run 3-8MB, which was
      // hard-crashing mission proof submission with a framework-level 413
      // before it ever reached the app's own 8MB check in missions/actions.ts.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
