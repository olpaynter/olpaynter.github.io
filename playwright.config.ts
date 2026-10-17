import { defineConfig } from "@playwright/test";

const port = 3200;
// CI points this at a build of the base branch to record the screenshots the pull request is compared with.
export const siteDir = process.env.SITE_DIR ?? "out";

export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: ".screenshots/{projectName}/{arg}{ext}",
  // With GPU rasterisation off, repeated runs match exactly, so the default tolerance of 0.2 only
  // hides real changes, such as a link colour under the fade at the bottom of the screen.
  expect: { toHaveScreenshot: { threshold: 0.05 } },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: "chrome",
    // GPU rasterisation scales large images slightly differently from run to run.
    launchOptions: { args: ["--disable-gpu"] },
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "390", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "1024", use: { viewport: { width: 1024, height: 768 } } },
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "1920", use: { viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: {
    command: `npx serve ${siteDir} --listen ${port} --no-port-switching --no-request-logging`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
