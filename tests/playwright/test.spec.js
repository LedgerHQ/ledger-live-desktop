const { test, expect } = require("@playwright/test");
const { _electron: electron } = require("playwright");

test.describe("feature foo", () => {
  let electronApp;
  let appIsReady = false;
  let context;

  test.beforeAll(async () => {
    console.log("launching app");
    electronApp = await electron.launch({
      args: ["./tools/main.js"],
      headless: false,
    });
    console.log("launched app");

    // const appPath = await electronApp.evaluate(async ({ app }) => {
    //   // This runs in the main Electron process, parameter here is always
    //   // the result of the require('electron') in the main app script.
    //   return app.getAppPath();
    // });
    // console.log(appPath);

    appIsReady = await electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.isReady();
    });
    console.log(appIsReady);

    // const appName = await electronApp.evaluate(async ({ app }) => {
    //   // This runs in the main Electron process, parameter here is always
    //   // the result of the require('electron') in the main app script.
    //   return app.getName();
    // });
    // console.log(appName);

    // context = electronApp.context();
    console.log("hello 1");
  });

  // eslint-disable-next-line jest/expect-expect
  test("basic test", async () => {
    // Get the first window that the app opens, wait if necessary.
    console.log("hello 2");
    const window = await electronApp.firstWindow();
    console.log("hello 3");
    // Print the title.
    console.log(await window.title());

    await window.waitForSelector('#onboarding-get-started-button');
    await window.click('#onboarding-get-started-button');
    // await page.waitForLoadState('networkidle');
    console.log(await window.title());


    // console.log(electronApp.windows());

    // Playwright has auto wait built in, so if we want to waitUntil something has
    // loaded without performing any action(like a snapshot), we can call 'click'
    // without performing the action, by passing the option {trial: true}
    // await window.click("#onboarding-get-started-button", { trial: true });
    // await window.screenshot({ path: "beforeClicking.png" });

    // // Getting the text from an element is messy, there's no built-in method...
    // console.log(
    //   await window.evaluate(
    //     el => el.innerText.trim(),
    //     await window.$("#onboarding-get-started-button"),
    //   ),
    // );
    // await window.click("#onboarding-get-started-button");
    // await window.screenshot({ path: "afterClicking.png" });
    // // Exit app.
    // await electronApp.close();

    
    // expect(true).toBeTrue();
  });
});
