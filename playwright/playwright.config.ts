import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "specs",
  testIgnore: "specs/recorder.spec.ts",
  globalSetup: require.resolve("./utils/global-setup"),
  globalTeardown: require.resolve("./utils/global-teardown"),
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: "on",
    video: "retain-on-failure",
    // trace: "retain-on-failure",
  },
  // workers: 2,
  // retries: 2,
  reporter: [["line"], ["allure-playwright"]],
};

export default config;
