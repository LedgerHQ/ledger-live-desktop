import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "specs/",
  testIgnore: "specs/recorder.spec.ts",
  outputDir: "./artifacts/test-results",
  timeout: 60000,
  globalTimeout: 0,
  globalSetup: require.resolve("./utils/global-setup"),
  globalTeardown: require.resolve("./utils/global-teardown"),
  use: {
    launchOptions: {
      slowMo: 100, // FIXME: slowMo doesn't seem to work
    },
    ignoreHTTPSErrors: true,
    screenshot: process.env.CI ? "on" : "off",
    video: process.env.CI ? "on-first-retry" : "off", // FIXME: "off" doesn't seem to work
    trace: process.env.CI ? "retain-on-failure" : "off", // FIXME: traceview doesn't seem to work
  },
  forbidOnly: !!process.env.CI,
  preserveOutput: process.env.CI ? "failures-only" : "always",
  maxFailures: process.env.CI ? 5 : undefined,
  reportSlowTests: process.env.CI ? { max: 0, threshold: 60000 } : null,
  workers: process.env.CI ? 3 : 1,
  // FIXME: --update-snapshots doesn't work with --retries
  // retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["html", { open: "never", outputFolder: "playwright/artifacts/" }], ["github"]]
    : "list",
};

export default config;
