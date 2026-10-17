import { expect, test } from "@playwright/test";
import { paths } from "./sitemap";

for (const path of paths) {
  test(`${path} logs no errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));

    await page.goto(path);
    await page.waitForLoadState("networkidle");

    expect(errors).toEqual([]);
  });
}
