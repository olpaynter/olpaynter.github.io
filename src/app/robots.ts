import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// A static export has no server, so robots.txt is written to a file at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
