import { _electron as electron } from "playwright";
import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import rimraf from "rimraf";

type TestFixtures = {
  userdata: String;
  env: Object;
  page: any;
};

const test = base.extend<TestFixtures>({
  userdata: null,
  env: null,
  page: async ({ userdata, env }, use) => {
    // create userdata path
    const userDataPathKey = Math.random()
      .toString(36)
      .substring(2, 5);
    const userDataPath = path.join(__dirname, "../tmp", userDataPathKey);
    fs.mkdirSync(userDataPath, { recursive: true });

    if (userdata) {
      const userDataFile = path.resolve("playwright/userdata/", `${userdata}.json`);
      fs.copyFileSync(userDataFile, `${userDataPath}/app.json`);
    }

    env = Object.assign(
      {
        MOCK: true,
        // DISABLE_MOCK_POINTER_EVENTS: true,
        // HIDE_DEBUG_MOCK: true,
        DISABLE_DEV_TOOLS: true,
        SPECTRON_RUN: true,
        CI: process.env.CI || "",
        SYNC_ALL_INTERVAL: 86400000,
        SYNC_BOOT_DELAY: 16,
      },
      env,
    );

    // launch app
    const electronApp = await electron.launch({
      args: ["./.webpack/main.bundle.js", `--user-data-dir=${userDataPath}`, "--lang=en"],
      env: env,
    });

    // app is ready
    const page = await electronApp.firstWindow();
    expect(await page.title()).toBe("Ledger Live");
    await page.waitForSelector("#__app__ready__", { state: "attached" });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("#loading-logo", { state: "hidden" });

    // use page in the test
    await use(page);

    // close app
    await electronApp.close();

    // cleanup userdata
    if (fs.existsSync(`${userDataPath}`)) {
      rimraf.sync(userDataPath);
    }
  },
});

export default test;
