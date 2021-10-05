import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./utils/global-setup"),
  globalTeardown: require.resolve("./utils/global-teardown"),
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
  },
};

export default config;
