import { readFileSync } from "node:fs";

/** Every page of the built site, as listed in its sitemap, so a new page is covered without a change here. */
export const paths = [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
