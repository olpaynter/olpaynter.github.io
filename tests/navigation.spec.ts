import { expect, test } from "@playwright/test";

test.describe("back and forward", () => {
  // The bug only appears when the page transition runs, which reduced motion turns off.
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("restore the scroll position", async ({ page }) => {
    await page.goto("/blog");
    await page.locator('main a[href="/blog/advanced-computer-graphics"]').first().click();
    await page.waitForURL("/blog/advanced-computer-graphics");
    await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "instant" }));
    await page.evaluate(() => new Promise((frame) => requestAnimationFrame(() => requestAnimationFrame(frame))));

    await page.goBack();
    await expect(page.locator("main h1")).toHaveText("Blog");
    await page.goForward();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(5000);
  });
});

test.describe("on a short phone screen", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "phone", "a phone width"));
  test.use({ viewport: { width: 390, height: 600 } });

  test("the nav highlight moves forward through the chapters", async ({ page }) => {
    await page.goto("/");
    const chapters = await page.locator("#journey li[id]").evaluateAll((items) => items.map((item) => `#${item.id}`));
    await page.evaluate(() => {
      const visited: string[] = [];
      Object.assign(window, { visited });
      new MutationObserver(() => {
        const current = document
          .querySelector('nav [aria-current="location"][href^="#journey/"]')
          ?.getAttribute("href");
        if (current && visited.at(-1) !== current) visited.push(current);
      }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["aria-current"] });
    });

    const [start, end] = await page.evaluate(() => [
      document.getElementById("journey")!.offsetTop,
      document.getElementById("blog")!.offsetTop,
    ]);
    // Steps smaller than the gap between two chapters, so the band lands inside each gap on the way.
    for (let y = start; y < end; y += 20) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(500);

    expect(await page.evaluate(() => (window as unknown as { visited: string[] }).visited)).toEqual(chapters);
  });
});
