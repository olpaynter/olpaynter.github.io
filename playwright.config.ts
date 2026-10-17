import { defineConfig } from "@playwright/test";

const port = 3200;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: "chrome",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "phone", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npx serve out --listen ${port} --no-port-switching --no-request-logging`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
