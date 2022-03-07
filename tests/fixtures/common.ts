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
  userdataDestinationPath: string;
  userdataOriginalFile: string;
  userdataFile: any;
  env: Record<string, any>;
  page: Page;
  windowSize: { width: number; height: number };
};

const test = base.extend<TestFixtures>({
  env: undefined,
  lang: "en-US",
  theme: "light",
  userdata: undefined,
  windowSize: undefined,
  userdataDestinationPath: async ({}, use) => {
    use(path.join(__dirname, "../artifacts/userdata", generateUUID()));
  },
  userdataOriginalFile: async ({ userdata }, use) => {
    use(path.resolve("tests/userdata/", `${userdata}.json`));
  },
  userdataFile: async ({ userdataDestinationPath }, use) => {
    const fullFilePath = path.join(userdataDestinationPath, "app.json");
    use(fullFilePath);
  },
  page: async (
    {
      windowSize,
      lang,
      theme,
      userdata,
      userdataDestinationPath,
      userdataOriginalFile,
      env,
    }: TestFixtures,
    use: (page: Page) => void,
  ) => {
    // create userdata path
    fs.mkdirSync(userdataDestinationPath, { recursive: true });

    if (userdata) {
      fs.copyFileSync(userdataOriginalFile, `${userdataDestinationPath}/app.json`);
    }

    // default environment variables
    env = Object.assign(
      {
        ...process.env,
        MOCK: true,
        HIDE_DEBUG_MOCK: true,
        CI: process.env.CI || undefined,
        PLAYWRIGHT_RUN: true,
      },
      env,
    );

    // launch app
    const electronApp: ElectronApplication = await electron.launch({
      args: [
        "./.webpack/main.bundle.js",
        `--user-data-dir=${userdataDestinationPath}`,
        // `--window-size=${windowSize.width},${windowSize.height}`, // FIXME: Doesn't work, window size can't be forced?
        "--force-device-scale-factor=1",
        "--disable-dev-shm-usage",
        // "--use-gl=swiftshader"
        "--no-sandbox",
        "--enable-logging",
      ],
      recordVideo: {
        dir: "tests/artifacts/videos/",
        size: windowSize || { width: 1024, height: 768 }, // FIXME: no default value, it could come from viewport property in conf file but it's not the case
      },
      env,
      colorScheme: theme,
      locale: lang,
    });

    // app is ready
    const page = await electronApp.firstWindow();

    // start coverage
    const istanbulCLIOutput = path.join("tests/artifacts/.nyc_output");

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
    await page.waitForSelector("#loader-container", { state: "hidden" });

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
