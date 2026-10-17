import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { siteDir } from "../playwright.config";
import { paths } from "./sitemap";

// An animated WebP declares an ANIM chunk in its header.
const isAnimated = (src: string) => readFileSync(join(siteDir, src)).subarray(0, 100).includes("ANIM");

for (const path of paths) {
  test(path, async ({ page }) => {
    await page.goto(path);
    // A full-page screenshot does not scroll, so lazy images below the first screen would never load.
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = "eager";
      await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    });
    // Animated images and looping videos never hold still, and the PDF previews finish rendering at
    // varying times, so all three are covered rather than compared.
    const sources = await page.locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? ""));
    const mask = sources
      .filter((src) => src.startsWith("/") && isAnimated(src))
      .map((src) => page.locator(`img[src="${src}"]`))
      .concat(page.locator("video"), page.locator("iframe"));
    const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "_");
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, mask });
  });
}
