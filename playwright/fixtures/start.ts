import { _electron as electron } from "playwright";
import { test as base, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import rimraf from "rimraf";

type TestFixtures = {
  userdata: any;
  userdatafile: any;
  page: any;
};

const test = base.extend<TestFixtures>({
  userdata: null,
  page: async ({ userdata }, use) => {
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

    // launch app
    const electronApp = await electron.launch({
      args: [
        "./.webpack/main.bundle.js",
        `--user-data-dir=${userDataPath}`,
        "--window-size=800,600",
        "--force-device-scale-factor=1",
        "--high-dpi-support=1",
      ],
    });

    // app is ready
    const page = await electronApp.firstWindow();
    expect(await page.title()).toBe("Ledger Live");
    await page.waitForSelector("#__app__ready__", { state: "attached" });
    await page.waitForLoadState("domcontentloaded");

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
