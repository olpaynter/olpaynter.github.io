import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves static files only, so there is no server to run the default image optimiser.
  images: { unoptimized: true },
};

export default nextConfig;
