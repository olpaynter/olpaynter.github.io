import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves static files only, so there is no server to run the default image optimiser.
  images: { unoptimized: true },
  // Another local service can hold 127.0.0.1:3000, leaving the dev server reachable only at [::1].
  // Without this, Next.js treats that address as another site and every link reloads the page.
  allowedDevOrigins: ["[::1]"],
};

export default nextConfig;
