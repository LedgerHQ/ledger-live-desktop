import { _electron as electron } from "playwright";
import { test as base, expect, Page, ElectronApplication } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export function generateUUID(): string {
  return crypto.randomBytes(16).toString("hex");
}

type TestFixtures = {
  lang: string;
  theme: "light" | "dark" | "no-preference" | undefined;
  userdata: string;
  env: Record<string, any>;
  page: Page;
};

const test = base.extend<TestFixtures>({
  userdata: undefined,
  env: undefined,
  lang: "en-US",
  theme: "light",
  page: async ({ lang, theme, userdata, env }: TestFixtures, use: (page: Page) => void) => {
    // create userdata path
    const userDataPathKey = generateUUID();
    const userDataPath = path.join(__dirname, "../artifacts/userdata", userDataPathKey);
    fs.mkdirSync(userDataPath, { recursive: true });

    if (userdata) {
      const userDataFile = path.resolve("playwright/userdata/", `${userdata}.json`);
      fs.copyFileSync(userDataFile, `${userDataPath}/app.json`);
    }

    // default environment variables
    env = Object.assign(
      {
        ...process.env,
        MOCK: true,
        HIDE_DEBUG_MOCK: true,
        CI: process.env.CI || undefined,
        SPECTRON_RUN: true,
        // SYNC_ALL_INTERVAL: 86400000,
        // SYNC_BOOT_DELAY: 16,
      },
      env,
    );

    // launch app
    const window = { width: 1024, height: 768 };

    const electronApp: ElectronApplication = await electron.launch({
      args: [
        "./.webpack/main.bundle.js",
        `--user-data-dir=${userDataPath}`,
        // `--window-size=${window.width},${window.height}`, // FIXME: Doesn't work, window size can't be forced?
        "--force-device-scale-factor=1",
        "--disable-dev-shm-usage",
        // "--use-gl=swiftshader"
        "--no-sandbox",
        "--enable-logging",
      ],
      recordVideo: {
        dir: "playwright/artifacts/videos/",
        size: window, // FIXME: no default value, it could come from viewport property in conf file but it's not the case
      },
      env,
      colorScheme: theme,
      locale: lang,
    });

    // app is ready
    const page = await electronApp.firstWindow();

    // start coverage
    const istanbulCLIOutput = path.join("playwright/artifacts/.nyc_output");

    await page.addInitScript(() =>
      window.addEventListener("beforeunload", () =>
        (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)),
      ),
    );
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await page.exposeFunction("collectIstanbulCoverage", (coverageJSON: string) => {
      if (coverageJSON)
        fs.writeFileSync(
          path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`),
          coverageJSON,
        );
    });

    // app is loaded
    expect(await page.title()).toBe("Ledger Live");
    await page.waitForSelector("#__app__ready__", { state: "attached" });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector("#loading-logo", { state: "hidden" });

    // use page in the test
    await use(page);

    // stop coverage
    await page.evaluate(() =>
      (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)),
    );

    // close app
    await electronApp.close();
  },
});

export default test;
