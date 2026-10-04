import type { MetadataRoute } from "next";
import { knownPaths } from "@/lib/nav/siteMap";
import { SITE_URL } from "@/lib/site";

// A static export has no server, so the sitemap is written to a file at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return knownPaths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
