import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteDir } from "../playwright.config";

/** Every page of the built site, as listed in its sitemap, so a new page is covered without a change here. */
export const paths = [...readFileSync(join(siteDir, "sitemap.xml"), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
